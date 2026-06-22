import "./env.mjs";
import {
  Client,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import {
  createSupabaseAdmin,
  claimDiscordAccountLink,
  getCampaignByInviteCode,
  getLinkedCampaignForChannel,
  getProfileByDiscordUserId,
  linkCampaignToChannel,
  listPendingPosts,
  listPendingPostsForOwner,
  rejectPendingPost,
  resolvePendingPost,
  updateCampaignThreat,
  updateCharacterState,
} from "./supabase.mjs";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function roll2d6() {
  const first = rollDie();
  const second = rollDie();
  return { first, second, total: first + second };
}

function cloneList(list) {
  return Array.isArray(list) ? [...list] : [];
}

function drawRandomCards(deck, discard, count) {
  let pool = cloneList(deck);
  const nextDiscard = cloneList(discard);
  const drawnCards = [];

  if (pool.length === 0 && nextDiscard.length > 0) {
    pool = cloneList(nextDiscard);
    nextDiscard.length = 0;
  }

  for (let index = 0; index < count && pool.length > 0; index += 1) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    const [drawnCard] = pool.splice(randomIndex, 1);
    drawnCards.push(drawnCard);
  }

  return { drawnCards, remainingDeck: pool, remainingDiscard: nextDiscard };
}

function removeCardsByWord(hand, words) {
  const removed = [];
  const nextHand = [];
  const wordSet = new Set(words);

  for (const card of hand ?? []) {
    if (wordSet.has(card.word)) {
      removed.push(card);
      wordSet.delete(card.word);
    } else {
      nextHand.push(card);
    }
  }

  return { removed, nextHand };
}

function colorLabel(color) {
  return String(color ?? "").trim() || "Unknown";
}

function threatBucketForColor(color) {
  const normalizedColor = colorLabel(color);

  if (normalizedColor === "Red" || normalizedColor === "Black") {
    return "Peril";
  }

  if (
    normalizedColor === "Blue" ||
    normalizedColor === "Gold" ||
    normalizedColor === "White"
  ) {
    return "Intrigue";
  }

  return "Dread";
}

function readPayload(post) {
  return post.mechanics_payload && typeof post.mechanics_payload === "object"
    ? post.mechanics_payload
    : {};
}

function normalizeGear(gear) {
  return Array.isArray(gear) ? [...gear] : [];
}

function tapGearById(gear, gearIds) {
  const idSet = new Set(gearIds.map((id) => Number(id)).filter(Number.isFinite));

  return normalizeGear(gear).map((item) => {
    if (!item || typeof item !== "object") {
      return item;
    }

    const itemId = Number(item.id);
    if (!idSet.has(itemId)) {
      return item;
    }

    const chroma = colorLabel(item.chroma);
    if (!item.chroma || chroma === "Unknown") {
      return item;
    }

    return {
      ...item,
      tapped: true,
    };
  });
}

async function resolvePostForCharacter(supabase, post, character, campaign) {
  const payload = readPayload(post);
  const postType = post.post_type;

  if (postType === "act") {
    const gradeBonus = Number(payload.grade_bonus ?? 0);
    const challengeRating = Number(payload.challenge_rating ?? 9);
    const spentFocus = true;
    const spentThread = Boolean(payload.spend_thread);
    const selectedCards = Array.isArray(payload.selected_cards)
      ? payload.selected_cards
      : [];
    const selectedGear = Array.isArray(payload.selected_gear)
      ? payload.selected_gear
      : [];

    if (Number(character.focus ?? 0) <= 0) {
      throw new Error("Act posts require 1 Focus, and this character has no Focus left.");
    }

    const spentCardWords = selectedCards
      .map((entry) => entry?.word)
      .filter(Boolean);
    const tappedGearIds = selectedGear
      .filter((entry) => entry && typeof entry === "object" && entry.chroma)
      .map((entry) => entry.id);
    const { removed, nextHand } = removeCardsByWord(character.hand ?? [], spentCardWords);
    const nextDiscard = [...(character.discard ?? []), ...removed];

    const roll = roll2d6();
    const total = roll.total + gradeBonus;
    const diff = total - challengeRating;
    const isDouble = roll.first === roll.second;

    const outcome =
      diff >= 6 ? "Breakthrough"
      : diff >= 3 ? "Strong Hit"
      : diff >= 0 ? "Hit"
      : "Miss";
    const nextFocus = Math.min(
      3,
      Math.max(0, character.focus - (spentFocus ? 1 : 0)) + (isDouble ? 1 : 0),
    );
    const nextThread = Math.min(
      3,
      Math.max(0, character.thread - (spentThread ? 1 : 0)) + (outcome === "Breakthrough" ? 1 : 0),
    );
    const gmPrompt =
      outcome === "Miss"
        ? "GM: assign +1 Threat, name the Mark or consequence, and reply with the consequence text."
        : outcome === "Hit"
          ? "GM: assign +1 Threat to a bucket based on the action, then reply with the ripple text."
          : outcome === "Breakthrough"
            ? "GM: reply with the consequence text and optionally turn a post word into a Scene Word for the next Beat."
            : "GM: reply with the consequence text in this channel.";

    const updates = {
      focus: nextFocus,
      thread: nextThread,
      hand: nextHand,
      discard: nextDiscard,
      gear: tapGearById(character.gear ?? [], tappedGearIds),
    };

    await updateCharacterState(supabase, character.id, updates);

    return {
      title: `Resolved: ${character.name} - Act`,
      body: [
        `Roll: ${roll.first} + ${roll.second} + ${gradeBonus} = ${total} vs CR ${challengeRating}`,
        `Outcome: ${outcome}${isDouble ? " (doubles: recovered 1 Focus)" : ""}`,
        `Applied: spent ${spentFocus ? "1 Focus" : "0 Focus"}${spentThread ? ", 1 Thread" : ""}${
          spentCardWords.length > 0 ? `, discarded ${spentCardWords.join(", ")}` : ""
        }${
          tappedGearIds.length > 0 ? `, tapped ${tappedGearIds.length} gear item${tappedGearIds.length === 1 ? "" : "s"}` : ""
        }${outcome === "Breakthrough" ? ", gained 1 Thread" : ""}`,
        gmPrompt,
      ].join("\n"),
    };
  }

  if (postType === "breathe") {
    const choice = String(payload.choice ?? "focus");
    if (choice === "focus") {
      const namedColor = colorLabel(payload.breathe_color ?? "Blue");
      const threatBucket = threatBucketForColor(namedColor);
      const threat = {
        ...(campaign.threat ?? {}),
        [threatBucket]: Math.max(0, Number(campaign.threat?.[threatBucket] ?? 0) + 1),
      };

      await updateCharacterState(supabase, character.id, {
        focus: Math.min(3, character.focus + 1),
      });
      await updateCampaignThreat(supabase, campaign.id, threat);

      return {
        title: `Resolved: ${character.name} - Breathe`,
        body: [
          `Applied: recovered 1 Focus.`,
          `Campaign Threat: +1 ${threatBucket} (named color: ${namedColor})`,
          "GM: reply with the consequence text in this channel.",
        ].join("\n"),
      };
    }

    if ((character.hand ?? []).length >= 4) {
      throw new Error("The hand is already full, so this Breathe cannot draw a card.");
    }

    const drawResult = drawRandomCards(character.deck ?? [], character.discard ?? [], 1);
    const [drawnCard] = drawResult.drawnCards;
    await updateCharacterState(supabase, character.id, {
      hand: drawnCard ? [...(character.hand ?? []), drawnCard] : character.hand ?? [],
      deck: drawResult.remainingDeck,
      discard: drawResult.remainingDiscard,
    });
    return {
      title: `Resolved: ${character.name} - Breathe`,
      body: [
        `Applied: drew ${drawnCard?.word ?? "nothing"}.`,
        "GM: reply with the consequence text in this channel.",
      ].join("\n"),
    };
  }

  if (postType === "setup") {
    const selectedCards = Array.isArray(payload.selected_cards)
      ? payload.selected_cards
      : [];
    const setupWord = String(payload.setup_word ?? "").trim();
    const spentCardWords = selectedCards
      .map((entry) => entry?.word)
      .filter(Boolean);
    const { removed, nextHand } = removeCardsByWord(character.hand ?? [], spentCardWords);

    await updateCharacterState(supabase, character.id, {
      hand: nextHand,
      discard: [...(character.discard ?? []), ...removed],
    });

    return {
      title: `Resolved: ${character.name} - Setup`,
      body: [
        `Applied: created setup "${setupWord || "unnamed"}"${
          spentCardWords.length > 0 ? ` and discarded ${spentCardWords.join(", ")}` : ""
        }.`,
        "GM: reply with the consequence text in this channel.",
      ].join("\n"),
    };
  }

  return {
    title: `Resolved: ${character.name} - Ghost`,
    body: [
      "Applied: no resource changes.",
      "GM: reply with the consequence text in this channel.",
    ].join("\n"),
  };
}

async function main() {
  const token = requireEnv("DISCORD_BOT_TOKEN");
  const supabase = createSupabaseAdmin();
  console.log("Starting Chroma Discord bot...");

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
    ],
    partials: [Partials.Channel],
  });

  client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
  });

  client.on("warn", (warning) => {
    console.warn("[discord warn]", warning);
  });

  client.on("error", (error) => {
    console.error("[discord error]", error);
  });

  client.on("shardReady", (shardId) => {
    console.log(`[discord] shard ${shardId} ready`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    if (interaction.commandName === "account") {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "link") {
        const code = interaction.options.getString("code", true);
        const { data, error } = await claimDiscordAccountLink(supabase, {
          code,
          discordUserId: interaction.user.id,
          discordUsername: interaction.user.username,
        });

        if (error || !data) {
          await interaction.reply({
            content: `I could not link that account: ${error?.message ?? "Unknown error"}`,
            ephemeral: true,
          });
          return;
        }

        await interaction.reply({
          content: "Your Discord account is now linked to your Chroma account.",
          ephemeral: true,
        });
      }
      return;
    }

    if (interaction.commandName !== "campaign") {
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "link") {
      const inviteCode = interaction.options.getString("invite_code", true);
      const { data: campaign, error } = await getCampaignByInviteCode(supabase, inviteCode);

      if (error || !campaign) {
        await interaction.reply({
          content: "I could not find that campaign invite code.",
          ephemeral: true,
        });
        return;
      }

      const { error: linkError } = await linkCampaignToChannel(supabase, {
        campaignId: campaign.id,
        guildId: interaction.guildId,
        channelId: interaction.channelId,
        threadId: interaction.channel?.isThread() ? interaction.channelId : null,
        linkedBy: interaction.user.id,
      });

      if (linkError) {
        await interaction.reply({
          content: `Could not link the channel: ${linkError.message}`,
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: `Linked this channel to **${campaign.name}**.`,
        ephemeral: true,
      });
      return;
    }

    const { data: linkedCampaign, error: linkedError } = await getLinkedCampaignForChannel(
      supabase,
      interaction.guildId,
      interaction.channelId,
      interaction.channel?.isThread?.() ? interaction.channel.parentId : null,
    );

    if (linkedError || !linkedCampaign) {
      await interaction.reply({
        content: "This channel is not linked to a campaign yet. Use `/campaign link` first.",
        ephemeral: true,
      });
      return;
    }

    if (subcommand === "posts") {
      const { data, error } = await listPendingPosts(supabase, linkedCampaign.id);

      if (error) {
        await interaction.reply({
          content: `Could not load pending posts: ${error.message}`,
          ephemeral: true,
        });
        return;
      }

      const lines = (data ?? []).map((post) => {
        const characterName = post.characters?.name ?? "Unknown sheet";
        return `- \`${post.id}\` ${post.post_type.toUpperCase()} - ${characterName}: ${post.post_summary}`;
      });

      await interaction.reply({
        content: lines.length > 0 ? lines.join("\n") : "No pending posts.",
        ephemeral: true,
      });
      return;
    }

    if (subcommand === "resolve") {
      await interaction.deferReply({ ephemeral: false });

      const { data: profile, error: profileError } = await getProfileByDiscordUserId(
        supabase,
        interaction.user.id,
      );

      if (profileError || !profile) {
        await interaction.editReply({
          content: "Link your Discord account in the web app before resolving posts.",
        });
        return;
      }

      const { data: pendingPosts, error: pendingError } = await listPendingPostsForOwner(
        supabase,
        linkedCampaign.id,
        profile.id,
      );

      if (pendingError) {
        await interaction.editReply({
          content: `Could not load your queued posts: ${pendingError.message}`,
        });
        return;
      }

      const post = pendingPosts?.[0];
      if (!post) {
        await interaction.editReply({
          content: "You do not have a queued post in this campaign.",
        });
        return;
      }

      console.log(
        `[discord] resolving queued post ${post.id} for ${interaction.user.id} in ${interaction.channelId}`,
      );

      const { data: character, error: characterError } = await supabase
        .from("characters")
        .select("*")
        .eq("id", post.character_id)
        .single();

      if (characterError || !character) {
        await interaction.editReply({
          content: "I found your queued post, but not the linked character sheet.",
        });
        return;
      }

      try {
        const resolution = await resolvePostForCharacter(supabase, post, character, linkedCampaign);
        const resolutionText = [resolution.title, resolution.body].join("\n");
        const { error: saveResolutionError } = await resolvePendingPost(
          supabase,
          post.id,
          resolutionText,
        );

        if (saveResolutionError) {
          throw saveResolutionError;
        }

        await interaction.editReply({
          content: resolutionText,
        });
      } catch (resolveError) {
        const errorText = `I found your queued post, but could not resolve it: ${resolveError.message}`;
        await rejectPendingPost(supabase, post.id, errorText);
        await interaction.editReply({
          content: errorText,
        });
      }
      return;
    }
  });

  await client.login(token);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
