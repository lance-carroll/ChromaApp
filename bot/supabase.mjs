import { createClient } from "@supabase/supabase-js";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function createSupabaseAdmin() {
  return createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );
}

export async function getCampaignByInviteCode(supabase, inviteCode) {
  return supabase
    .from("campaigns")
    .select("*")
    .eq("invite_code", inviteCode.trim().toUpperCase())
    .maybeSingle();
}

export async function getProfileByDiscordUserId(supabase, discordUserId) {
  return supabase
    .from("profiles")
    .select("*")
    .eq("discord_user_id", discordUserId)
    .maybeSingle();
}

export async function getLinkCodeByValue(supabase, code) {
  return supabase
    .from("discord_account_link_codes")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();
}

export async function claimDiscordAccountLink(
  supabase,
  { code, discordUserId, discordUsername },
) {
  const normalizedCode = code.trim().toUpperCase();
  const { data: linkCode, error: linkCodeError } = await getLinkCodeByValue(supabase, normalizedCode);

  if (linkCodeError || !linkCode) {
    return { data: null, error: linkCodeError ?? new Error("That link code does not exist.") };
  }

  if (linkCode.claimed_at) {
    return { data: null, error: new Error("That link code has already been claimed.") };
  }

  if (new Date(linkCode.expires_at).getTime() <= Date.now()) {
    return { data: null, error: new Error("That link code has expired.") };
  }

  const { data: existingProfile, error: profileLookupError } = await supabase
    .from("profiles")
    .select("*")
    .eq("discord_user_id", discordUserId)
    .maybeSingle();

  if (profileLookupError) {
    return { data: null, error: profileLookupError };
  }

  if (existingProfile && existingProfile.id !== linkCode.owner_id) {
    return {
      data: null,
      error: new Error("That Discord account is already linked to a different Chroma account."),
    };
  }

  const { data: profile, error: profileUpsertError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: linkCode.owner_id,
        discord_user_id: discordUserId,
        discord_username: discordUsername ?? "",
      },
      { onConflict: "id" },
    )
    .select("*")
    .single();

  if (profileUpsertError) {
    return { data: null, error: profileUpsertError };
  }

  const { data: claimedCode, error: claimError } = await supabase
    .from("discord_account_link_codes")
    .update({
      claimed_at: new Date().toISOString(),
      claimed_discord_user_id: discordUserId,
      claimed_discord_username: discordUsername ?? "",
    })
    .eq("id", linkCode.id)
    .select("*")
    .single();

  if (claimError) {
    return { data: null, error: claimError };
  }

  return { data: { profile, claimedCode }, error: null };
}

export async function getLinkedCampaignForChannel(supabase, guildId, channelId, parentChannelId = null) {
  const lookupIds = [channelId, parentChannelId].filter(Boolean);

  for (const lookupId of lookupIds) {
    const byChannel = await supabase
      .from("campaign_discord_links")
      .select("campaign_id, campaigns(*)")
      .eq("guild_id", guildId)
      .eq("channel_id", lookupId)
      .maybeSingle();

    if (!byChannel.error && byChannel.data) {
      return { data: byChannel.data.campaigns ?? null, error: null };
    }

    const byThread = await supabase
      .from("campaign_discord_links")
      .select("campaign_id, campaigns(*)")
      .eq("guild_id", guildId)
      .eq("thread_id", lookupId)
      .maybeSingle();

    if (!byThread.error && byThread.data) {
      return { data: byThread.data.campaigns ?? null, error: null };
    }
  }

  return { data: null, error: null };
}

export async function linkCampaignToChannel(
  supabase,
  { campaignId, guildId, channelId, threadId, linkedBy },
) {
  return supabase
    .from("campaign_discord_links")
    .upsert(
      {
        campaign_id: campaignId,
        guild_id: guildId,
        channel_id: channelId,
        thread_id: threadId ?? null,
        linked_by: linkedBy,
      },
      { onConflict: "campaign_id" },
    )
    .select("*")
    .single();
}

export async function listPendingPosts(supabase, campaignId) {
  return supabase
    .from("campaign_posts")
    .select("*, characters(name)")
    .eq("campaign_id", campaignId)
    .eq("status", "pending")
    .order("created_at", { ascending: true });
}

export async function getPendingPostById(supabase, postId, campaignId) {
  return supabase
    .from("campaign_posts")
    .select("*, characters(name)")
    .eq("id", postId)
    .eq("campaign_id", campaignId)
    .eq("status", "pending")
    .maybeSingle();
}

export async function listPendingPostsForOwner(supabase, campaignId, ownerId) {
  return supabase
    .from("campaign_posts")
    .select("*, characters(name)")
    .eq("campaign_id", campaignId)
    .eq("owner_id", ownerId)
    .eq("status", "pending")
    .order("created_at", { ascending: true });
}

export async function resolvePendingPost(supabase, postId, resolutionText) {
  return supabase
    .from("campaign_posts")
    .update({
      status: "resolved",
      resolution_text: resolutionText,
      resolved_at: new Date().toISOString(),
      resolved_by: null,
    })
    .eq("id", postId)
    .eq("status", "pending")
    .select("*")
    .single();
}

export async function rejectPendingPost(supabase, postId, resolutionText) {
  return supabase
    .from("campaign_posts")
    .update({
      status: "rejected",
      resolution_text: resolutionText,
      resolved_at: new Date().toISOString(),
      resolved_by: null,
    })
    .eq("id", postId)
    .eq("status", "pending")
    .select("*")
    .single();
}

export async function updateCharacterState(supabase, characterId, patch) {
  return supabase
    .from("characters")
    .update(patch)
    .eq("id", characterId)
    .select("*")
    .single();
}

export async function updateCampaignThreat(supabase, campaignId, threat) {
  return supabase
    .from("campaigns")
    .update({ threat })
    .eq("id", campaignId)
    .select("*")
    .single();
}
