"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  defaultRecipeCatalog,
  defaultSheet,
  defaultThreat,
  gradeBonus,
  threatBucketByColor,
  getActGrade,
  getAppUrl,
  getCharacterTie,
  getGearLabel,
  getGearSummary,
  makeAccountLinkCode,
  mapRecipeRow,
  normalizeCardList,
  normalizeGear,
  normalizeThreatPool,
  parseTagList,
} from "@/lib/chroma";
import type {
  BreatheChoice,
  Card,
  CampaignBeatRow,
  CampaignCharacterLink,
  CampaignPostRow,
  CampaignRow,
  CampaignSceneRow,
  CardRow,
  CharacterRecipeRow,
  CharacterRow,
  ChromaComponent,
  CoreWord,
  Entry,
  GearItem,
  JoinedCampaignInviteRow,
  LinkCodeRow,
  PostType,
  ProfileRow,
  RecipeRow,
  SceneWord,
  SheetPayload,
  ThreatBucket,
  ThreatPool,
  ViewMode,
} from "@/lib/chroma";

export function useChromaWorkspace() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);
  const [loadBusy, setLoadBusy] = useState(false);
  const [accountBusy, setAccountBusy] = useState(false);
  const [message, setMessage] = useState("Checking session...");
  const [accountNotice, setAccountNotice] = useState("");
  const [discordProfile, setDiscordProfile] = useState<ProfileRow | null>(null);
  const [linkCode, setLinkCode] = useState<LinkCodeRow | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("player");
  const [characters, setCharacters] = useState<CharacterRow[]>([]);
  const [rosterCharacters, setRosterCharacters] = useState<CharacterRow[]>([]);
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [campaignLinks, setCampaignLinks] = useState<CampaignCharacterLink[]>([]);
  const [campaignScenes, setCampaignScenes] = useState<CampaignSceneRow[]>([]);
  const [campaignBeats, setCampaignBeats] = useState<CampaignBeatRow[]>([]);
  const [campaignPosts, setCampaignPosts] = useState<CampaignPostRow[]>([]);
  const [playerQueuedPosts, setPlayerQueuedPosts] = useState<CampaignPostRow[]>([]);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [sceneId, setSceneId] = useState<string | null>(null);
  const [beatId, setBeatId] = useState<string | null>(null);
  const [campaignName, setCampaignName] = useState("New Campaign");
  const [campaignInviteCode, setCampaignInviteCode] = useState("");
  const [beatNumber, setBeatNumber] = useState(1);
  const [campaignDefaultCr, setCampaignDefaultCr] = useState(9);
  const [postingWindow, setPostingWindow] = useState("24-48 hours");
  const [campaignSceneWords, setCampaignSceneWords] = useState<SceneWord[]>([]);
  const [threat, setThreat] = useState<ThreatPool>({ ...defaultThreat });
  const [campaignBusy, setCampaignBusy] = useState(false);
  const [campaignNotice, setCampaignNotice] = useState("");
  const [campaignDraftOpen, setCampaignDraftOpen] = useState(false);
  const [campaignTargetCharacterId, setCampaignTargetCharacterId] = useState<string | null>(null);
  const [campaignTargetMarks, setCampaignTargetMarks] = useState<Entry[]>([]);
  const [campaignTargetWounds, setCampaignTargetWounds] = useState<Entry[]>([]);
  const [playerCampaignNotice, setPlayerCampaignNotice] = useState("");
  const [joinedCampaigns, setJoinedCampaigns] = useState<CampaignRow[]>([]);
  const [joinInviteCode, setJoinInviteCode] = useState("");
  const [sceneName, setSceneName] = useState("New Scene");
  const [sceneSummary, setSceneSummary] = useState("");
  const [beatPrompt, setBeatPrompt] = useState("");
  const [postType, setPostType] = useState<PostType>("act");
  const [selectedCoreWordId, setSelectedCoreWordId] = useState<number | null>(null);
  const [selectedCardWords, setSelectedCardWords] = useState<string[]>([]);
  const [spendThreadWithPost, setSpendThreadWithPost] = useState(false);
  const [breatheChoice, setBreatheChoice] = useState<BreatheChoice>("focus");
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [challengeRating, setChallengeRating] = useState(9);
  const [selectedGearIds, setSelectedGearIds] = useState<number[]>([]);
  const [sceneWord, setSceneWord] = useState("");
  const [sceneWordColor, setSceneWordColor] = useState("Red");
  const [breatheColor, setBreatheColor] = useState("Blue");
  const [setupWord, setSetupWord] = useState("");
  const [ghostIntent, setGhostIntent] = useState("");
  const [mechanicsSummary, setMechanicsSummary] = useState("");
  const [builderNotice, setBuilderNotice] = useState("");
  const [name, setName] = useState(defaultSheet.name);
  const [pronouns, setPronouns] = useState(defaultSheet.pronouns);
  const [concept, setConcept] = useState(defaultSheet.concept);
  const [focus, setFocus] = useState(defaultSheet.focus);
  const [thread, setThread] = useState(defaultSheet.thread);
  const [coreWords, setCoreWords] = useState<CoreWord[]>(defaultSheet.core_words);
  const [marks, setMarks] = useState<Entry[]>(defaultSheet.marks);
  const [wounds, setWounds] = useState<Entry[]>(defaultSheet.wounds);
  const [gear, setGear] = useState<GearItem[]>(defaultSheet.gear);
  const [tie, setTie] = useState(defaultSheet.tie);
  const [hand, setHand] = useState<Card[]>(defaultSheet.hand);
  const [deck, setDeck] = useState<Card[]>(defaultSheet.deck);
  const [discard, setDiscard] = useState<Card[]>(defaultSheet.discard);
  const [allRecipes, setAllRecipes] = useState<RecipeRow[]>([]);
  const [allCards, setAllCards] = useState<CardRow[]>([]);
  const [characterRecipeLinks, setCharacterRecipeLinks] = useState<CharacterRecipeRow[]>([]);
  const [contentNotice, setContentNotice] = useState("");
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeFamily, setNewRecipeFamily] = useState("");
  const [newRecipeCoreTags, setNewRecipeCoreTags] = useState("");
  const [newRecipeChroma, setNewRecipeChroma] = useState("Red, Gold");
  const [newRecipeHit, setNewRecipeHit] = useState("");
  const [newRecipeStrongHit, setNewRecipeStrongHit] = useState("");
  const [newRecipeMiss, setNewRecipeMiss] = useState("");
  const [newCardWord, setNewCardWord] = useState("");
  const [newCardColor, setNewCardColor] = useState("Red");
  const [newCardTags, setNewCardTags] = useState("");

  const sheetJson: SheetPayload = useMemo(
    () => ({
      name,
      pronouns,
      concept,
      focus,
      thread,
      core_words: coreWords,
      marks,
      wounds,
      gear,
      tie,
      hand,
      deck,
      discard,
    }),
    [
      concept,
      coreWords,
      deck,
      discard,
      focus,
      gear,
      hand,
      marks,
      name,
      pronouns,
      tie,
      thread,
      wounds,
    ],
  );

  const availableRecipes = useMemo(() => {
    const recipeById = new Map(allRecipes.map((recipe) => [recipe.id, recipe]));
    return characterRecipeLinks
      .map((link) => recipeById.get(link.recipe_id))
      .filter(Boolean)
      .map((recipe) => mapRecipeRow(recipe as RecipeRow));
  }, [allRecipes, characterRecipeLinks]);

  const selectedRecipe =
    availableRecipes.find((recipe) => recipe.id === selectedRecipeId) ??
    availableRecipes[0] ??
    defaultRecipeCatalog[0];
  const hasAvailableRecipes = availableRecipes.length > 0;

  const selectedCoreWord = coreWords.find(
    (word) => word.id === selectedCoreWordId,
  );

  const selectedCards = hand.filter((card) =>
    selectedCardWords.includes(card.word),
  );

  const selectedGear = gear.filter((entry) => selectedGearIds.includes(entry.id));
  const selectedGearChroma = selectedGear
    .filter((entry) => entry.chroma && !entry.tapped)
    .map((entry) => ({
      word: getGearLabel(entry),
      color: entry.chroma,
      source: "Gear" as const,
    }));

  const selectedChromaComponents: ChromaComponent[] = [
    ...selectedCards.map((card) => ({
      word: card.word,
      color: card.color,
      source: "Card" as const,
    })),
    ...selectedGearChroma,
    ...(sceneWord.trim()
      ? [
          {
            word: sceneWord.trim(),
            color: sceneWordColor,
            source: "Scene" as const,
          },
        ]
      : []),
  ];

  const selectedCoreTags = selectedCoreWord
    ? selectedCoreWord.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
    : [];

  const isCoreEligible =
    !!selectedCoreWord &&
    selectedRecipe.coreTags.some((tag) =>
      selectedCoreTags.includes(tag.toLowerCase()),
    );

  const matchedChromaCount = selectedRecipe.chroma.filter((requiredColor) =>
    selectedChromaComponents.some((component) => component.color === requiredColor),
  ).length;

  const actGrade = getActGrade({
    isCoreEligible,
    matchedChromaCount,
    requiredChromaCount: selectedRecipe.chroma.length,
    spendThreadWithPost,
  });

  const activeCampaignCharacters = rosterCharacters;
  const activeCampaignTargetCharacter =
    rosterCharacters.find((character) => character.id === campaignTargetCharacterId) ??
    rosterCharacters[0] ??
    null;

  const activeScene =
    campaignScenes.find((scene) => scene.id === sceneId) ??
    campaignScenes.find((scene) => scene.is_active) ??
    null;

  const activeBeat =
    campaignBeats.find((beat) => beat.id === beatId) ??
    campaignBeats.find((beat) => beat.is_active) ??
    null;

  useEffect(() => {
    if (!campaignId) {
      setCampaignTargetCharacterId(null);
      setCampaignTargetMarks([]);
      setCampaignTargetWounds([]);
      return;
    }

    const nextTarget =
      rosterCharacters.find((character) => character.id === campaignTargetCharacterId) ??
      rosterCharacters[0] ??
      null;

    if (!nextTarget) {
      setCampaignTargetCharacterId(null);
      setCampaignTargetMarks([]);
      setCampaignTargetWounds([]);
      return;
    }

    if (nextTarget.id !== campaignTargetCharacterId) {
      setCampaignTargetCharacterId(nextTarget.id);
    }

    setCampaignTargetMarks(nextTarget.marks ?? []);
    setCampaignTargetWounds(nextTarget.wounds ?? []);
  }, [campaignId, rosterCharacters, campaignTargetCharacterId]);

  const visibleCampaignPosts = campaignId
    ? campaignPosts.filter(
        (post) => post.campaign_id === campaignId && post.status === "pending",
      )
    : [];

  const activeSheetLabel = characterId ? name || "Unnamed sheet" : "Unsaved draft";
  const activeCampaignLabel = campaignId ? campaignName || "Campaign open" : "No campaign";
  const activeSceneLabel = activeScene?.name || "No scene";
  const activeBeatLabel = activeBeat ? `Beat ${activeBeat.beat_number}` : "No beat";
  const discordStatusLabel = discordProfile?.discord_username || "Discord not linked";
  const characterDeckCards = [...hand, ...deck, ...discard];

  async function loadContentLibrary() {
    const [{ data: recipeData, error: recipeError }, { data: cardData, error: cardError }] =
      await Promise.all([
        supabase.from("recipes").select("*").order("name", { ascending: true }),
        supabase.from("cards").select("*").order("color", { ascending: true }).order("word", {
          ascending: true,
        }),
      ]);

    if (recipeError || cardError) {
      setContentNotice(recipeError?.message ?? cardError?.message ?? "Unable to load content library.");
      setAllRecipes([]);
      setAllCards([]);
      return;
    }

    setAllRecipes((recipeData ?? []) as RecipeRow[]);
    setAllCards((cardData ?? []) as CardRow[]);
    setContentNotice("");
  }

  async function loadCharacterRecipeLinks(nextCharacterId: string) {
    const { data, error } = await supabase
      .from("character_recipes")
      .select("*")
      .eq("character_id", nextCharacterId);

    if (error) {
      setCharacterRecipeLinks([]);
      setContentNotice(error.message);
      return;
    }

    setCharacterRecipeLinks((data ?? []) as CharacterRecipeRow[]);
  }

  async function createRecipe() {
    if (!session || !newRecipeName.trim()) {
      setContentNotice("Give the recipe a name first.");
      return;
    }

    const { data, error } = await supabase
      .from("recipes")
      .insert({
        owner_id: session.user.id,
        name: newRecipeName.trim(),
        family: newRecipeFamily.trim(),
        core_tags: parseTagList(newRecipeCoreTags),
        chroma: parseTagList(newRecipeChroma),
        hit: newRecipeHit.trim(),
        strong_hit: newRecipeStrongHit.trim(),
        miss: newRecipeMiss.trim(),
        source_type: "personal",
      })
      .select("*")
      .single();

    if (error) {
      setContentNotice(error.message);
      return;
    }

    const createdRecipe = data as RecipeRow;
    setAllRecipes((current) => [...current, createdRecipe].sort((a, b) => a.name.localeCompare(b.name)));
    setNewRecipeName("");
    setNewRecipeFamily("");
    setNewRecipeCoreTags("");
    setNewRecipeChroma("Red, Gold");
    setNewRecipeHit("");
    setNewRecipeStrongHit("");
    setNewRecipeMiss("");
    setContentNotice(`Created recipe ${createdRecipe.name}.`);
  }

  async function assignRecipeToCharacter(recipeId: string) {
    if (!session || !characterId) {
      setContentNotice("Open a saved character first.");
      return;
    }

    const { data, error } = await supabase
      .from("character_recipes")
      .upsert(
        {
          character_id: characterId,
          recipe_id: recipeId,
          owner_id: session.user.id,
        },
        { onConflict: "character_id,recipe_id" },
      )
      .select("*")
      .single();

    if (error) {
      setContentNotice(error.message);
      return;
    }

    const createdLink = data as CharacterRecipeRow;
    setCharacterRecipeLinks((current) =>
      current.some((entry) => entry.recipe_id === recipeId) ? current : [...current, createdLink],
    );
    setContentNotice("Recipe assigned to character.");
  }

  async function removeRecipeFromCharacter(recipeId: string) {
    if (!characterId) {
      return;
    }

    const { error } = await supabase
      .from("character_recipes")
      .delete()
      .eq("character_id", characterId)
      .eq("recipe_id", recipeId);

    if (error) {
      setContentNotice(error.message);
      return;
    }

    setCharacterRecipeLinks((current) => current.filter((entry) => entry.recipe_id !== recipeId));
    setContentNotice("Recipe removed from character.");
  }

  async function seedSystemRecipesForCharacter(nextCharacterId: string) {
    if (!session) {
      return;
    }

    const systemRecipes = allRecipes.filter((recipe) => recipe.source_type === "system");
    if (systemRecipes.length === 0) {
      return;
    }

    const { error } = await supabase.from("character_recipes").upsert(
      systemRecipes.map((recipe) => ({
        character_id: nextCharacterId,
        recipe_id: recipe.id,
        owner_id: session.user.id,
      })),
      { onConflict: "character_id,recipe_id" },
    );

    if (!error) {
      await loadCharacterRecipeLinks(nextCharacterId);
    }
  }

  async function createCard() {
    if (!session || !newCardWord.trim()) {
      setContentNotice("Give the card a word first.");
      return;
    }

    const { data, error } = await supabase
      .from("cards")
      .insert({
        owner_id: session.user.id,
        word: newCardWord.trim(),
        color: newCardColor,
        tags: parseTagList(newCardTags),
        source_type: "personal",
      })
      .select("*")
      .single();

    if (error) {
      setContentNotice(error.message);
      return;
    }

    const createdCard = data as CardRow;
    setAllCards((current) =>
      [...current, createdCard].sort((a, b) => `${a.color}:${a.word}`.localeCompare(`${b.color}:${b.word}`)),
    );
    setNewCardWord("");
    setNewCardColor("Red");
    setNewCardTags("");
    setContentNotice(`Created card ${createdCard.word}.`);
  }

  function addCardToDeck(card: CardRow) {
    if (characterDeckCards.some((entry) => entry.word === card.word)) {
      setContentNotice(`${card.word} is already in this deck.`);
      return;
    }

    setDeck((current) => [...current, { word: card.word, color: card.color }]);
    setContentNotice(`Added ${card.word} to the deck.`);
  }

  function removeCardFromDeck(word: string) {
    if (hand.some((entry) => entry.word === word)) {
      setHand((current) => current.filter((entry) => entry.word !== word));
      setContentNotice(`Removed ${word} from the hand.`);
      return;
    }

    if (deck.some((entry) => entry.word === word)) {
      setDeck((current) => current.filter((entry) => entry.word !== word));
      setContentNotice(`Removed ${word} from the deck.`);
      return;
    }

    if (discard.some((entry) => entry.word === word)) {
      setDiscard((current) => current.filter((entry) => entry.word !== word));
      setContentNotice(`Removed ${word} from the discard.`);
    }
  }

  const visiblePlayerPosts = playerQueuedPosts;

  const visibleSceneWords =
    activeScene?.scene_words ?? campaignSceneWords;

  async function loadCampaignPosts(nextCampaignId: string) {
    const { data, error } = await supabase
      .from("campaign_posts")
      .select("*")
      .eq("campaign_id", nextCampaignId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      setCampaignPosts([]);
      return;
    }

    setCampaignPosts((data ?? []) as CampaignPostRow[]);
  }

  async function loadPlayerQueuedPosts(ownerId: string) {
    const { data, error } = await supabase
      .from("campaign_posts")
      .select("*")
      .eq("owner_id", ownerId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      setPlayerQueuedPosts([]);
      return;
    }

    setPlayerQueuedPosts((data ?? []) as CampaignPostRow[]);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setMessage(data.session ? "Signed in." : "Sign in to save this sheet.");
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setMessage(nextSession ? "Signed in." : "Sign in to save this sheet.");
        if (nextSession) {
          void loadPlayerQueuedPosts(nextSession.user.id);
        }
        if (!nextSession) {
          setCharacterId(null);
          setCharacters([]);
          setRosterCharacters([]);
          setCampaignId(null);
          setCampaigns([]);
          setCampaignLinks([]);
          setPlayerQueuedPosts([]);
          setDiscordProfile(null);
          setLinkCode(null);
          setAccountNotice("");
        }
      },
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    let ignore = false;
    const userId = session.user.id;

    async function loadCharacters() {
      setLoadBusy(true);
      setMessage("Loading your sheets...");
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("owner_id", userId)
        .order("updated_at", { ascending: false });

      if (ignore) {
        return;
      }

      setLoadBusy(false);

      if (error) {
        setMessage(error.message);
        return;
      }

      const savedCharacters = (data ?? []) as CharacterRow[];
      setCharacters(savedCharacters);

      if (savedCharacters.length === 0) {
        setMessage("No saved sheet yet. Edit this one, then save.");
        return;
      }

      const firstCharacter = savedCharacters[0];
      setCharacterId(firstCharacter.id);
      setName(firstCharacter.name);
      setPronouns(firstCharacter.pronouns);
      setConcept(firstCharacter.concept);
      setFocus(firstCharacter.focus);
      setThread(firstCharacter.thread);
      setCoreWords(firstCharacter.core_words ?? defaultSheet.core_words);
      setMarks(firstCharacter.marks ?? []);
      setWounds(firstCharacter.wounds ?? []);
      setGear(normalizeGear(firstCharacter.gear));
      setTie(getCharacterTie(firstCharacter));
      setHand(normalizeCardList(firstCharacter.hand));
      setDeck(normalizeCardList(firstCharacter.deck));
      setDiscard(normalizeCardList(firstCharacter.discard));
      setSelectedCoreWordId(null);
      setSelectedCardWords([]);
      setSpendThreadWithPost(false);
      void loadCharacterRecipeLinks(firstCharacter.id);
      setMessage("Loaded saved sheet.");
    }

    loadCharacters();
    loadCampaigns();
    loadDiscordAccountState();
    void loadContent();

    return () => {
      ignore = true;
    };

    async function loadDiscordAccountState() {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (ignore) {
        return;
      }

      if (profileError) {
        setDiscordProfile(null);
      } else {
        setDiscordProfile((profileData ?? null) as ProfileRow | null);
      }

      const { data: linkData, error: linkError } = await supabase
        .from("discord_account_link_codes")
        .select("*")
        .eq("owner_id", userId)
        .maybeSingle();

      if (ignore) {
        return;
      }

      if (linkError) {
        setLinkCode(null);
        return;
      }

      setLinkCode((linkData ?? null) as LinkCodeRow | null);
    }

    async function loadCampaigns() {
      setCampaignBusy(true);
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("owner_id", userId)
        .order("updated_at", { ascending: false });

      if (ignore) {
        return;
      }

      setCampaignBusy(false);

      if (error) {
        setCampaignNotice(
          error.message.includes("campaigns")
            ? "Run supabase/campaigns.sql to enable campaign tools."
            : error.message,
        );
        return;
      }

      const savedCampaigns = (data ?? []) as CampaignRow[];
      setCampaigns(savedCampaigns);
      await loadCampaignLinks();

      if (savedCampaigns.length > 0) {
        const firstCampaign = savedCampaigns[0];
        setCampaignId(firstCampaign.id);
        setCampaignName(firstCampaign.name);
        setCampaignInviteCode(firstCampaign.invite_code);
        setBeatNumber(firstCampaign.beat_number);
        setCampaignDefaultCr(firstCampaign.default_cr);
        setChallengeRating(firstCampaign.default_cr);
        setPostingWindow(firstCampaign.posting_window);
        setCampaignSceneWords(firstCampaign.scene_words ?? []);
        setThreat(normalizeThreatPool(firstCampaign.threat));
        setCampaignNotice(`Loaded ${firstCampaign.name}.`);
        loadScenesAndBeats(firstCampaign.id);
        loadRosterCharacters(firstCampaign.id);
      } else {
        setCampaignNotice("No campaigns yet.");
      }
    }

    async function loadCampaignLinks() {
      const { data, error } = await supabase
        .from("campaign_characters")
        .select("*");

      if (ignore) {
        return;
      }

      if (error) {
        setCampaignLinks([]);
        return;
      }

      const links = (data ?? []) as CampaignCharacterLink[];
      setCampaignLinks(links);
      await loadJoinedCampaigns(links);
    }

    async function loadJoinedCampaigns(links: CampaignCharacterLink[]) {
      const campaignIds = Array.from(
        new Set(links.map((link) => link.campaign_id)),
      );

      if (campaignIds.length === 0) {
        setJoinedCampaigns([]);
        return;
      }

      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .in("id", campaignIds);

      setJoinedCampaigns((data ?? []) as CampaignRow[]);
    }

    async function loadContent() {
      await loadContentLibrary();
    }
  }, [session]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const userId = session.user.id;

    async function refreshQueuedPosts() {
      const { data, error } = await supabase
        .from("campaign_posts")
        .select("*")
        .eq("owner_id", userId)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        setPlayerQueuedPosts([]);
        return;
      }

      setPlayerQueuedPosts((data ?? []) as CampaignPostRow[]);
    }

    void refreshQueuedPosts();
  }, [session]);

  useEffect(() => {
    if (!campaignId) {
      return;
    }

    async function refreshCampaignPosts() {
      const { data, error } = await supabase
        .from("campaign_posts")
        .select("*")
        .eq("campaign_id", campaignId)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        setCampaignPosts([]);
        return;
      }

      setCampaignPosts((data ?? []) as CampaignPostRow[]);
    }

    void refreshCampaignPosts();
  }, [campaignId]);

  function drawCard() {
    const nextCard = drawRandomCards(deck, 1)[0];
    if (!nextCard || hand.length >= 4) {
      setMessage(
        hand.length >= 4 ? "Your hand is already full." : "No cards left to draw.",
      );
      return;
    }
    setDeck(deck.filter((card) => card.word !== nextCard.word));
    setHand([...hand, nextCard]);
    setMessage(`Drew ${nextCard.word}.`);
  }

  function drawRandomCards(cards: Card[], count: number) {
    const pool = [...cards];
    const drawnCards: Card[] = [];

    for (let index = 0; index < count && pool.length > 0; index += 1) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const [drawnCard] = pool.splice(randomIndex, 1);
      drawnCards.push(drawnCard);
    }

    return drawnCards;
  }

  function discardCard(word: string) {
    const card = hand.find((held) => held.word === word);
    if (!card) {
      return;
    }
    setHand(hand.filter((held) => held.word !== word));
    setDiscard([...discard, card]);
    setMessage(`Discarded ${card.word}.`);
  }

  function toggleSelectedCard(word: string) {
    setSelectedCardWords((currentWords) =>
      currentWords.includes(word)
        ? currentWords.filter((currentWord) => currentWord !== word)
        : [...currentWords, word],
    );
  }

  function toggleSelectedGear(id: number) {
    setSelectedGearIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    );
  }

  function changePostType(nextPostType: PostType) {
    setPostType(nextPostType);
    setMechanicsSummary("");
    setBuilderNotice("");

    if (nextPostType !== "act") {
      setSelectedCoreWordId(null);
      setSelectedGearIds([]);
    }

    if (nextPostType === "breathe" || nextPostType === "ghost") {
      setSelectedCardWords([]);
    }
  }

  function clearPostBuilder() {
    setPostType("act");
    setSelectedCoreWordId(null);
    setSelectedCardWords([]);
    setSelectedGearIds([]);
    setSpendThreadWithPost(false);
    setBreatheChoice("focus");
    setBreatheColor("Blue");
    setSceneWord("");
    setSceneWordColor("Red");
    setSetupWord("");
    setGhostIntent("");
    setMechanicsSummary("");
    setBuilderNotice("");
    setMessage("Post builder cleared.");
  }

  function postSummary() {
    const coreWord = selectedCoreWord;
    const cards = selectedCards;

    if (postType === "act") {
      return `Act: ${selectedRecipe.name} at ${actGrade} (+${
        gradeBonus[actGrade]
      }) vs CR ${challengeRating}. Core: ${coreWord?.word ?? "none"}${
        cards.length > 0
          ? ` using ${cards.map((card) => card.word).join(", ")}`
          : ""
      }${
        selectedGear.length > 0
          ? ` with Gear ${selectedGear.map((entry) => getGearSummary(entry)).join(", ")}`
          : ""
      }${
        sceneWord.trim()
          ? ` plus Scene Word ${sceneWord.trim()} (${sceneWordColor})`
          : ""
      }, spend 1 Focus${
        spendThreadWithPost ? ", spend 1 Thread" : ""
      }.`;
    }

    if (postType === "breathe") {
      return `Breathe to ${
        breatheChoice === "focus"
          ? `recover 1 Focus and feed ${threatBucketByColor[breatheColor]}`
          : "draw 1 Card"
      }.`;
    }

    if (postType === "setup") {
      return `Setup${setupWord.trim() ? `: create ${setupWord.trim()}` : ""}${
        cards.length > 0
          ? ` using ${cards.map((card) => card.word).join(", ")}`
          : ""
      }.`;
    }

    return `Ghost this Beat${
      ghostIntent.trim() ? `: ${ghostIntent.trim()}` : ""
    }.`;
  }

  function buildMechanicsBlock(title: string, lines: string[]) {
    return [`**${name} - ${title}**`, ...lines].join("\n");
  }

  async function submitPost() {
    setBuilderNotice("");

    if (!session || !campaignId || !characterId) {
      setBuilderNotice("Open a saved sheet inside a campaign first.");
      return;
    }

    let mechanicsText = "";
    let mechanicsPayload: Record<string, unknown> = {};
    const queuedSummary = postSummary();

    if (postType === "act") {
      if (!hasAvailableRecipes) {
        setBuilderNotice("Assign at least one recipe to this character before posting an Act.");
        return;
      }

      if (!selectedCoreWord) {
        setBuilderNotice("Choose a Core Word for an Act post.");
        return;
      }

      if (!isCoreEligible) {
        setBuilderNotice("Selected Core Word does not match this Recipe's tags.");
        return;
      }

      if (focus === 0) {
        setBuilderNotice("No Focus left to spend.");
        return;
      }

      if (spendThreadWithPost && thread === 0) {
        setBuilderNotice("No Thread left to spend.");
        return;
      }

      if (actGrade === "Incomplete") {
        setBuilderNotice("Add at least one matching Chroma source to complete the post.");
        return;
      }

      mechanicsText = buildMechanicsBlock("Act", [
        `Recipe: ${selectedRecipe.name} (${selectedRecipe.family})`,
        `Core Word: ${selectedCoreWord.word}`,
        `Chroma: ${
          selectedChromaComponents.length > 0
            ? selectedChromaComponents
                .map(
                  (component) =>
                    `${component.word} [${component.color}, ${component.source}]`,
                )
                .join(", ")
            : "none"
        }`,
        `Gear: ${
          selectedGear.length > 0
            ? selectedGear.map((entry) => getGearSummary(entry)).join(", ")
            : "none"
        }`,
        `Grade: ${actGrade} (+${gradeBonus[actGrade]})`,
        `CR: ${challengeRating}`,
        `Pending spend: ${[
          "1 Focus",
          actGrade === "Heightened" ? "1 Thread" : "",
        ]
          .filter(Boolean)
          .join(", ") || "none"}`,
        `Pending discard: ${
          selectedCards.length > 0
            ? selectedCards.map((card) => card.word).join(", ")
            : "none"
        }`,
        "Roll: resolved by Discord after posting",
      ]);
      mechanicsPayload = {
        post_type: postType,
        recipe_id: selectedRecipe.id,
        recipe_name: selectedRecipe.name,
        recipe_family: selectedRecipe.family,
        core_word_id: selectedCoreWord.id,
        core_word: selectedCoreWord.word,
        core_tags: selectedCoreWord.tags,
        selected_cards: selectedCards.map((card) => ({
          word: card.word,
          color: card.color,
        })),
        selected_gear: selectedGear.map((entry) => ({
          id: entry.id,
          name: entry.name,
          tags: entry.tags,
          chroma: entry.chroma,
          guard: entry.guard,
          guard_max: entry.guard_max,
          supply: entry.supply,
          supply_max: entry.supply_max,
          tapped: entry.tapped,
        })),
        scene_word: sceneWord.trim(),
        scene_word_color: sceneWordColor,
        grade: actGrade,
        grade_bonus: gradeBonus[actGrade],
        challenge_rating: challengeRating,
        spend_focus: true,
        spend_thread: actGrade === "Heightened",
      };
    } else if (postType === "breathe") {
      mechanicsText = buildMechanicsBlock("Breathe", [
        `Choice: ${breatheChoice === "focus" ? "recover 1 Focus" : "draw 1 Card"}`,
        breatheChoice === "focus"
          ? `GM Threat: +1 ${threatBucketByColor[breatheColor]} (named color: ${breatheColor})`
          : "Threat: none",
        "Roll: none",
      ]);
      mechanicsPayload = {
        post_type: postType,
        choice: breatheChoice,
        breathe_color: breatheColor,
      };
    } else if (postType === "setup") {
      if (!setupWord.trim()) {
        setBuilderNotice("Name the Setup Word this post creates.");
        return;
      }

      mechanicsText = buildMechanicsBlock("Setup", [
        `Setup Word: ${setupWord.trim()}`,
        `Card Words: ${
          selectedCards.length > 0
            ? selectedCards
                .map((card) => `${card.word} [${card.color}]`)
                .join(", ")
            : "none"
        }`,
        `Gear: ${
          selectedGear.length > 0
            ? selectedGear.map((entry) => getGearSummary(entry)).join(", ")
            : "none"
        }`,
        sceneWord.trim()
          ? `Scene Word: ${sceneWord.trim()} [${sceneWordColor}]`
          : "Scene Word: none",
        "Costs/discards: resolved by Discord after posting",
        "Roll: only if risky / recipe is invoked",
      ]);
      mechanicsPayload = {
        post_type: postType,
        setup_word: setupWord.trim(),
        selected_cards: selectedCards.map((card) => ({
          word: card.word,
          color: card.color,
        })),
        selected_gear: selectedGear.map((entry) => ({
          id: entry.id,
          name: entry.name,
          tags: entry.tags,
          chroma: entry.chroma,
          guard: entry.guard,
          guard_max: entry.guard_max,
          supply: entry.supply,
          supply_max: entry.supply_max,
          tapped: entry.tapped,
        })),
        scene_word: sceneWord.trim(),
        scene_word_color: sceneWordColor,
      };
    } else {
      mechanicsText = buildMechanicsBlock("Ghost", [
        `Intent: ${ghostIntent.trim() || "stays present in the fiction"}`,
        "Resource changes: none",
        "Roll: none",
      ]);
      mechanicsPayload = {
        post_type: postType,
        intent: ghostIntent.trim(),
      };
    }

    setMechanicsSummary(mechanicsText);

    const { data, error } = await supabase
      .from("campaign_posts")
      .insert({
        campaign_id: campaignId,
        scene_id: sceneId,
        beat_id: beatId,
        character_id: characterId,
        owner_id: session.user.id,
        post_type: postType,
        post_summary: queuedSummary,
        mechanics_text: mechanicsText,
        mechanics_payload: mechanicsPayload,
        status: "pending",
        resolution_text: "",
        resolved_by: null,
        resolved_at: null,
      })
      .select("*")
      .single();

    if (error) {
      setBuilderNotice(error.message);
      return;
    }

    setCampaignPosts((currentPosts) => [
      data as CampaignPostRow,
      ...currentPosts.filter((post) => post.id !== (data as CampaignPostRow).id),
    ]);
    setPlayerQueuedPosts((currentPosts) => [
      data as CampaignPostRow,
      ...currentPosts.filter((post) => post.id !== (data as CampaignPostRow).id),
    ]);
    await loadPlayerQueuedPosts(session.user.id);
    setMechanicsSummary("");
    setBuilderNotice("Post queued for Discord resolution.");
    setMessage("Post submitted.");
    setSelectedCoreWordId(null);
    setSelectedCardWords([]);
    setSelectedGearIds([]);
    setSpendThreadWithPost(false);
  }

  async function copyMechanicsSummary() {
    if (!mechanicsSummary) {
      setBuilderNotice("Generate a mechanics block first.");
      return;
    }

    await navigator.clipboard.writeText(mechanicsSummary);
    setBuilderNotice("Mechanics block copied.");
  }

  async function copyDiscordPostSnippet(post: CampaignPostRow) {
    const snippet = [`[post:${post.id}]`, post.mechanics_text].join("\n");
    await navigator.clipboard.writeText(snippet);
    setBuilderNotice("Discord post snippet copied.");
  }

  async function cancelQueuedPost(post: CampaignPostRow) {
    if (!session) {
      setBuilderNotice("Sign in first.");
      return;
    }

    const { data, error } = await supabase
      .from("campaign_posts")
      .update({
        status: "rejected",
        resolution_text: "Cancelled by player before Discord resolution.",
        resolved_by: session.user.id,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", post.id)
      .eq("owner_id", session.user.id)
      .eq("status", "pending")
      .select("*")
      .single();

    if (error) {
      setBuilderNotice(error.message);
      return;
    }

    const cancelledPost = data as CampaignPostRow;
    setCampaignPosts((currentPosts) =>
      currentPosts.map((entry) =>
        entry.id === cancelledPost.id ? cancelledPost : entry,
      ),
    );
    setPlayerQueuedPosts((currentPosts) =>
      currentPosts.filter((entry) => entry.id !== cancelledPost.id),
    );
    await loadPlayerQueuedPosts(session.user.id);
    setBuilderNotice("Queued post cancelled.");
  }

  function editGeneratedPost() {
    setMechanicsSummary("");
    setBuilderNotice("Generated block cleared. You can edit and submit again.");
  }

  function applyCharacter(character: CharacterRow) {
    setCharacterId(character.id);
    setName(character.name);
    setPronouns(character.pronouns);
    setConcept(character.concept);
    setFocus(character.focus);
    setThread(character.thread);
    setCoreWords(character.core_words ?? defaultSheet.core_words);
    setMarks(character.marks ?? []);
    setWounds(character.wounds ?? []);
    setGear(normalizeGear(character.gear));
    setTie(getCharacterTie(character));
    setHand(normalizeCardList(character.hand));
    setDeck(normalizeCardList(character.deck));
    setDiscard(normalizeCardList(character.discard));
    setSelectedCoreWordId(null);
    setSelectedCardWords([]);
    setSpendThreadWithPost(false);
    void loadCharacterRecipeLinks(character.id);
    if (session) {
      void loadPlayerQueuedPosts(session.user.id);
    }
  }

  function applyCampaign(campaign: CampaignRow) {
    setCampaignId(campaign.id);
    setCampaignDraftOpen(false);
    setCampaignTargetCharacterId(null);
    setCampaignTargetMarks([]);
    setCampaignTargetWounds([]);
    setCampaignName(campaign.name);
    setCampaignInviteCode(campaign.invite_code);
    setBeatNumber(campaign.beat_number);
    setCampaignDefaultCr(campaign.default_cr);
    setChallengeRating(campaign.default_cr);
    setPostingWindow(campaign.posting_window);
    setCampaignSceneWords(campaign.scene_words ?? []);
    setThreat(normalizeThreatPool(campaign.threat));
    setCampaignNotice(`Loaded ${campaign.name}.`);
    loadScenesAndBeats(campaign.id);
    loadRosterCharacters(campaign.id);
    loadCampaignPosts(campaign.id);
    if (session) {
      void loadPlayerQueuedPosts(session.user.id);
    }
  }

  function syncSavedCharacterInCollections(savedCharacter: CharacterRow) {
    setCharacters((currentCharacters) => [
      savedCharacter,
      ...currentCharacters.filter((character) => character.id !== savedCharacter.id),
    ]);
    setRosterCharacters((currentCharacters) =>
      currentCharacters.map((character) =>
        character.id === savedCharacter.id ? savedCharacter : character,
      ),
    );
  }

  function getCampaignLabel(id: string) {
    const match = [...campaigns, ...joinedCampaigns].find((campaign) => campaign.id === id);
    return match?.name ?? "Unknown campaign";
  }

  function getCharacterLabel(id: string) {
    const match = [...characters, ...rosterCharacters].find((character) => character.id === id);
    return match?.name ?? "Unknown sheet";
  }

  async function loadRosterCharacters(nextCampaignId: string) {
    const { data: linksData, error: linksError } = await supabase
      .from("campaign_characters")
      .select("*")
      .eq("campaign_id", nextCampaignId);

    if (linksError) {
      setRosterCharacters([]);
      return;
    }

    const links = (linksData ?? []) as CampaignCharacterLink[];
    setCampaignLinks((currentLinks) => [
      ...currentLinks.filter((link) => link.campaign_id !== nextCampaignId),
      ...links,
    ]);

    const characterIds = links.map((link) => link.character_id);
    if (characterIds.length === 0) {
      setRosterCharacters([]);
      return;
    }

    const { data: characterData, error: characterError } = await supabase
      .from("characters")
      .select("*")
      .in("id", characterIds);

    if (characterError) {
      setRosterCharacters([]);
      return;
    }

    setRosterCharacters((characterData ?? []) as CharacterRow[]);
  }

  async function loadScenesAndBeats(nextCampaignId: string) {
    const [{ data: scenesData, error: scenesError }, { data: beatsData }] =
      await Promise.all([
        supabase
          .from("campaign_scenes")
          .select("*")
          .eq("campaign_id", nextCampaignId)
          .order("created_at", { ascending: true }),
        supabase
          .from("campaign_beats")
          .select("*")
          .eq("campaign_id", nextCampaignId)
          .order("beat_number", { ascending: true }),
      ]);

    if (scenesError) {
      setCampaignNotice("Run the updated supabase/campaigns.sql for scenes and beats.");
      setCampaignScenes([]);
      setCampaignBeats([]);
      return;
    }

    const scenes = (scenesData ?? []) as CampaignSceneRow[];
    const beats = (beatsData ?? []) as CampaignBeatRow[];
    setCampaignScenes(scenes);
    setCampaignBeats(beats);

    const nextScene = scenes.find((scene) => scene.is_active) ?? scenes[0];
    if (nextScene) {
      setSceneId(nextScene.id);
      setSceneName(nextScene.name);
      setSceneSummary(nextScene.summary);
      setCampaignSceneWords(nextScene.scene_words ?? []);
      setCampaignDefaultCr(nextScene.default_cr);
      setChallengeRating(nextScene.default_cr);
      const nextBeat =
        beats.find((beat) => beat.scene_id === nextScene.id && beat.is_active) ??
        beats.find((beat) => beat.scene_id === nextScene.id);
      if (nextBeat) {
        setBeatId(nextBeat.id);
        setBeatNumber(nextBeat.beat_number);
        setBeatPrompt(nextBeat.prompt);
      }
    } else {
      setSceneId(null);
      setBeatId(null);
      setSceneName("New Scene");
      setSceneSummary("");
      setBeatPrompt("");
    }
  }

  async function createCampaign() {
    if (!session) {
      setCampaignNotice("Sign in before creating a campaign.");
      return;
    }

    setCampaignBusy(true);
    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        owner_id: session.user.id,
        name: campaignName || "New Campaign",
        beat_number: beatNumber,
        default_cr: campaignDefaultCr,
        posting_window: postingWindow,
        scene_words: campaignSceneWords,
        threat,
      })
      .select("*")
      .single();
    setCampaignBusy(false);

    if (error) {
      setCampaignNotice(error.message);
      return;
    }

    const campaign = data as CampaignRow;
    setCampaigns([campaign, ...campaigns]);
    applyCampaign(campaign);
    setCampaignNotice("Campaign created.");
  }

  async function saveCampaign() {
    if (!campaignId) {
      await createCampaign();
      return;
    }

    setCampaignBusy(true);
    const { data, error } = await supabase
      .from("campaigns")
      .update({
        name: campaignName || "New Campaign",
        beat_number: beatNumber,
        default_cr: campaignDefaultCr,
        posting_window: postingWindow,
        scene_words: campaignSceneWords,
        threat,
      })
      .eq("id", campaignId)
      .select("*")
      .single();
    setCampaignBusy(false);

    if (error) {
      setCampaignNotice(error.message);
      return;
    }

    const campaign = data as CampaignRow;
    setCampaigns((currentCampaigns) => [
      campaign,
      ...currentCampaigns.filter((entry) => entry.id !== campaign.id),
    ]);
    applyCampaign(campaign);
    setCampaignNotice("Campaign saved.");
  }

  function newCampaignDraft() {
    setCampaignId(null);
    setCampaignDraftOpen(true);
    setCampaignTargetCharacterId(null);
    setCampaignTargetMarks([]);
    setCampaignTargetWounds([]);
    setCampaignName("New Campaign");
    setRosterCharacters([]);
    setCampaignPosts([]);
    setCampaignInviteCode("");
    setBeatNumber(1);
    setCampaignDefaultCr(9);
    setChallengeRating(9);
    setPostingWindow("24-48 hours");
    setCampaignSceneWords([]);
    setThreat({ ...defaultThreat });
    setCampaignNotice("Started a new campaign draft.");
  }

  async function deleteCampaign() {
    if (!campaignId) {
      setCampaignNotice("Open a campaign before deleting it.");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${campaignName || "this campaign"}? This removes its scenes, beats, links, and posts.`,
    );

    if (!confirmed) {
      return;
    }

    setCampaignBusy(true);
    const { error } = await supabase.from("campaigns").delete().eq("id", campaignId);
    setCampaignBusy(false);

    if (error) {
      setCampaignNotice(error.message);
      return;
    }

    const remainingCampaigns = campaigns.filter((campaign) => campaign.id !== campaignId);
    setCampaigns(remainingCampaigns);
    setCampaignLinks([]);
    setCampaignPosts([]);
    setCampaignScenes([]);
    setCampaignBeats([]);
    setRosterCharacters([]);
    setCampaignTargetCharacterId(null);
    setCampaignTargetMarks([]);
    setCampaignTargetWounds([]);
    setSceneId(null);
    setBeatId(null);
    setCampaignId(null);
    setCampaignInviteCode("");
    setCampaignDraftOpen(false);
    setSceneName("New Scene");
    setSceneSummary("");
    setBeatPrompt("");

    if (remainingCampaigns.length > 0) {
      applyCampaign(remainingCampaigns[0]);
    } else {
      setCampaignName("New Campaign");
      setBeatNumber(1);
      setCampaignDefaultCr(9);
      setChallengeRating(9);
      setPostingWindow("24-48 hours");
      setCampaignSceneWords([]);
      setThreat({ ...defaultThreat });
      setCampaignNotice("Campaign deleted.");
    }
  }

  function addSceneWord() {
    setCampaignSceneWords([
      ...campaignSceneWords,
      { id: Date.now(), word: "", color: "Red" },
    ]);
  }

  function updateSceneWord(id: number, patch: Partial<SceneWord>) {
    setCampaignSceneWords(
      campaignSceneWords.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    );
  }

  function removeSceneWord(id: number) {
    setCampaignSceneWords(
      campaignSceneWords.filter((entry) => entry.id !== id),
    );
  }

  async function adjustThreat(color: ThreatBucket, delta: number) {
    const nextThreat = {
      ...threat,
      [color]: Math.max(0, (threat[color] ?? 0) + delta),
    };
    setThreat(nextThreat);

    if (campaignId) {
      await supabase
        .from("campaigns")
        .update({ threat: nextThreat })
        .eq("id", campaignId);
    }
  }

  function clampChallengeRating(nextRating: number) {
    return Math.max(7, Math.min(15, nextRating));
  }

  async function saveCampaignChallengeRating(nextRating: number) {
    const clampedRating = clampChallengeRating(nextRating);
    setChallengeRating(clampedRating);

    if (!campaignId) {
      return;
    }

    const { error } = await supabase
      .from("campaigns")
      .update({ default_cr: clampedRating })
      .eq("id", campaignId);

    if (error) {
      setCampaignNotice(error.message);
      return;
    }

    setCampaignDefaultCr(clampedRating);
    setCampaigns((currentCampaigns) =>
      currentCampaigns.map((campaign) =>
        campaign.id === campaignId
          ? { ...campaign, default_cr: clampedRating }
          : campaign,
      ),
    );
    setCampaignNotice(`Campaign default challenge set to ${clampedRating}.`);
  }

  async function saveSceneChallengeRating(nextRating: number) {
    const clampedRating = clampChallengeRating(nextRating);
    setChallengeRating(clampedRating);
    setCampaignDefaultCr(clampedRating);

    if (!campaignId || !sceneId) {
      return;
    }

    const { data, error } = await supabase
      .from("campaign_scenes")
      .update({ default_cr: clampedRating })
      .eq("id", sceneId)
      .select("*")
      .single();

    if (error) {
      setCampaignNotice(error.message);
      return;
    }

    const savedScene = data as CampaignSceneRow;
    setCampaignScenes((currentScenes) =>
      currentScenes.map((scene) =>
        scene.id === savedScene.id ? savedScene : scene,
      ),
    );
    setCampaignNotice(`Scene default challenge set to ${clampedRating}.`);
  }

  async function saveCampaignTargetConditions() {
    if (!campaignTargetCharacterId) {
      setCampaignNotice("Select a roster character first.");
      return;
    }

    const targetCharacter = rosterCharacters.find(
      (character) => character.id === campaignTargetCharacterId,
    );

    if (!targetCharacter) {
      setCampaignNotice("That roster character could not be found.");
      return;
    }

    const { data, error } = await supabase
      .from("characters")
      .update({
        marks: campaignTargetMarks,
        wounds: campaignTargetWounds,
      })
      .eq("id", campaignTargetCharacterId)
      .select("*")
      .single();

    if (error) {
      setCampaignNotice(error.message);
      return;
    }

    const savedCharacter = data as CharacterRow;
    syncSavedCharacterInCollections(savedCharacter);

    if (characterId === savedCharacter.id) {
      applyCharacter(savedCharacter);
    }

    setCampaignTargetMarks(savedCharacter.marks ?? []);
    setCampaignTargetWounds(savedCharacter.wounds ?? []);
    setCampaignNotice(`Updated ${savedCharacter.name}.`);
  }

  async function linkCharacterToCampaign() {
    if (!characterId || !campaignId) {
      setCampaignNotice("Open a saved character and campaign first.");
      return;
    }

    if (!session) {
      setCampaignNotice("Sign in before linking a sheet.");
      return;
    }

    const existingLink = campaignLinks.find(
      (link) => link.campaign_id === campaignId && link.character_id === characterId,
    );

    if (existingLink) {
      setCampaignNotice("Character is already linked to this campaign.");
      return;
    }

    const { data, error } = await supabase
      .from("campaign_characters")
      .upsert({
        campaign_id: campaignId,
        character_id: characterId,
        owner_id: session.user.id,
      }, { onConflict: "campaign_id,character_id" })
      .select("*")
      .single();

    if (error) {
      setCampaignNotice(error.message);
      return;
    }

    setCampaignLinks([...campaignLinks, data as CampaignCharacterLink]);
    await loadRosterCharacters(campaignId);
    setCampaignNotice("Character linked to campaign.");
  }

  async function joinCampaignByInvite() {
    if (!session || !characterId || !joinInviteCode.trim()) {
      setPlayerCampaignNotice("Open a saved sheet and enter an invite code.");
      return;
    }

    const { data, error } = await supabase
      .rpc("join_campaign_by_invite", {
        join_code: joinInviteCode.trim().toUpperCase(),
        join_character_id: characterId,
      })
      .single();

    if (error || !data) {
      setPlayerCampaignNotice(error?.message ?? "Invite code not found.");
      return;
    }

    const joinedInvite = data as JoinedCampaignInviteRow;
    const joinedCampaign: CampaignRow = {
      id: joinedInvite.id,
      owner_id: joinedInvite.owner_id,
      name: joinedInvite.name,
      invite_code: joinedInvite.invite_code,
      beat_number: joinedInvite.beat_number,
      default_cr: joinedInvite.default_cr,
      posting_window: joinedInvite.posting_window,
      scene_words: joinedInvite.scene_words,
      threat: joinedInvite.threat,
      updated_at: joinedInvite.updated_at,
    };
    const nextLink: CampaignCharacterLink = {
      id: joinedInvite.link_id,
      campaign_id: joinedInvite.id,
      character_id: characterId,
      owner_id: session.user.id,
    };

    setCampaignId(joinedCampaign.id);
    setCampaignLinks((currentLinks) => {
      if (currentLinks.some((link) => link.id === nextLink.id)) {
        return currentLinks;
      }
      return [...currentLinks, nextLink];
    });
    setJoinedCampaigns((currentCampaigns) => {
      if (currentCampaigns.some((entry) => entry.id === joinedCampaign.id)) {
        return currentCampaigns;
      }
      return [...currentCampaigns, joinedCampaign];
    });
    applyCampaign(joinedCampaign);
    setPlayerCampaignNotice(`Joined ${joinedCampaign.name}.`);
  }

  async function saveScene() {
    if (!session || !campaignId) {
      setCampaignNotice("Save or load a campaign first.");
      return;
    }

    if (sceneId) {
      const { data, error } = await supabase
        .from("campaign_scenes")
        .update({
          name: sceneName || "New Scene",
          summary: sceneSummary,
          is_active: true,
          scene_words: campaignSceneWords,
          default_cr: campaignDefaultCr,
        })
        .eq("id", sceneId)
        .select("*")
        .single();

      if (error) {
        setCampaignNotice(error.message);
        return;
      }

      const savedScene = data as CampaignSceneRow;
      setCampaignScenes([
        savedScene,
        ...campaignScenes.filter((scene) => scene.id !== savedScene.id),
      ]);
      setCampaignNotice("Scene saved.");
      return;
    }

    const { data, error } = await supabase
      .from("campaign_scenes")
      .insert({
        campaign_id: campaignId,
        owner_id: session.user.id,
        name: sceneName || "New Scene",
        summary: sceneSummary,
        is_active: true,
        scene_words: campaignSceneWords,
        default_cr: campaignDefaultCr,
      })
      .select("*")
      .single();

    if (error) {
      setCampaignNotice(error.message);
      return;
    }

    const savedScene = data as CampaignSceneRow;
    setCampaignScenes([savedScene, ...campaignScenes]);
    setSceneId(savedScene.id);
    setCampaignNotice("Scene created.");
  }

  async function setActiveScene(nextSceneId: string) {
    if (!session || !campaignId) {
      setCampaignNotice("Save or load a campaign first.");
      return;
    }

    const { error } = await supabase
      .from("campaign_scenes")
      .update({ is_active: false })
      .eq("campaign_id", campaignId);

    if (error) {
      setCampaignNotice(error.message);
      return;
    }

    const { data, error: activeError } = await supabase
      .from("campaign_scenes")
      .update({ is_active: true })
      .eq("id", nextSceneId)
      .select("*")
      .single();

    if (activeError) {
      setCampaignNotice(activeError.message);
      return;
    }

    const activeSceneRow = data as CampaignSceneRow;
    setCampaignScenes((currentScenes) =>
      currentScenes.map((scene) =>
        scene.id === activeSceneRow.id
          ? activeSceneRow
          : { ...scene, is_active: false },
      ),
    );
    setSceneId(activeSceneRow.id);
    setSceneName(activeSceneRow.name);
    setSceneSummary(activeSceneRow.summary);
    setCampaignSceneWords(activeSceneRow.scene_words ?? []);
    setCampaignDefaultCr(activeSceneRow.default_cr);
    setChallengeRating(activeSceneRow.default_cr);
    setCampaignNotice(`Active scene set to ${activeSceneRow.name}.`);
    await loadScenesAndBeats(campaignId);
  }

  async function createBeat() {
    if (!session || !campaignId || !sceneId) {
      setCampaignNotice("Save or select a scene first.");
      return;
    }

    const nextBeatNumber =
      Math.max(
        0,
        ...campaignBeats
          .filter((beat) => beat.scene_id === sceneId)
          .map((beat) => beat.beat_number),
      ) + 1;

    const { data, error } = await supabase
      .from("campaign_beats")
      .insert({
        campaign_id: campaignId,
        scene_id: sceneId,
        owner_id: session.user.id,
        beat_number: nextBeatNumber,
        prompt: beatPrompt,
        is_active: true,
      })
      .select("*")
      .single();

    if (error) {
      setCampaignNotice(error.message);
      return;
    }

    const beat = data as CampaignBeatRow;
    setCampaignBeats((currentBeats) => [
      beat,
      ...currentBeats.map((existingBeat) =>
        existingBeat.scene_id === sceneId ? { ...existingBeat, is_active: false } : existingBeat,
      ),
    ]);
    setBeatId(beat.id);
    setBeatNumber(beat.beat_number);
    setCampaignNotice("Beat created.");
  }

  async function saveBeat() {
    if (!session || !campaignId || !sceneId || !beatId) {
      setCampaignNotice("Select an existing beat first.");
      return;
    }

    const { data, error } = await supabase
      .from("campaign_beats")
      .update({
        scene_id: sceneId,
        beat_number: beatNumber,
        prompt: beatPrompt,
      })
      .eq("id", beatId)
      .select("*")
      .single();

    if (error) {
      setCampaignNotice(error.message);
      return;
    }

    const savedBeat = data as CampaignBeatRow;
    setCampaignBeats((currentBeats) =>
      currentBeats.map((beat) => (beat.id === savedBeat.id ? savedBeat : beat)),
    );
    setBeatId(savedBeat.id);
    setBeatNumber(savedBeat.beat_number);
    setBeatPrompt(savedBeat.prompt);
    setCampaignNotice(`Beat ${savedBeat.beat_number} saved.`);
  }

  async function setActiveBeat(nextBeatId: string) {
    if (!session || !campaignId) {
      setCampaignNotice("Save or load a campaign first.");
      return;
    }

    const targetBeat = campaignBeats.find((beat) => beat.id === nextBeatId);
    if (!targetBeat) {
      return;
    }

    const { error: clearError } = await supabase
      .from("campaign_beats")
      .update({ is_active: false })
      .eq("scene_id", targetBeat.scene_id);

    if (clearError) {
      setCampaignNotice(clearError.message);
      return;
    }

    const { data, error } = await supabase
      .from("campaign_beats")
      .update({ is_active: true })
      .eq("id", nextBeatId)
      .select("*")
      .single();

    if (error) {
      setCampaignNotice(error.message);
      return;
    }

    const activeBeatRow = data as CampaignBeatRow;
    setCampaignBeats((currentBeats) =>
      currentBeats.map((beat) =>
        beat.id === activeBeatRow.id
          ? activeBeatRow
          : beat.scene_id === activeBeatRow.scene_id
            ? { ...beat, is_active: false }
            : beat,
      ),
    );
    setBeatId(activeBeatRow.id);
    setBeatNumber(activeBeatRow.beat_number);
    setBeatPrompt(activeBeatRow.prompt);
    setCampaignNotice(`Active beat set to ${activeBeatRow.beat_number}.`);
  }

  async function selectCharacter(nextCharacterId: string) {
    const cachedCharacter = characters.find(
      (character) => character.id === nextCharacterId,
    );

    if (cachedCharacter) {
      applyCharacter(cachedCharacter);
      setMessage(`Loaded ${cachedCharacter.name}.`);
      return;
    }

    setLoadBusy(true);
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("id", nextCharacterId)
      .single();
    setLoadBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    applyCharacter(data as CharacterRow);
    setMessage(`Loaded ${(data as CharacterRow).name}.`);
  }

  async function signIn() {
    if (!email.trim()) {
      setMessage("Enter an email address first.");
      return;
    }

    const appUrl = getAppUrl();

    if (!appUrl) {
      setMessage("Set NEXT_PUBLIC_SITE_URL to your deployed app URL.");
      return;
    }

    setAuthBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: appUrl,
      },
    });
    setAuthBusy(false);

    setMessage(error ? error.message : "Check your email for a sign-in link.");
  }

  async function signOut() {
    setAuthBusy(true);
    const { error } = await supabase.auth.signOut();
    setCharacterId(null);
    setCharacters([]);
    setCampaignId(null);
    setCampaigns([]);
    setPlayerQueuedPosts([]);
    setDiscordProfile(null);
    setLinkCode(null);
    setAuthBusy(false);
    setMessage(error ? error.message : "Signed out.");
  }

  async function createAccountLinkCode() {
    if (!session) {
      setAccountNotice("Sign in first.");
      return;
    }

    const code = makeAccountLinkCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    setAccountBusy(true);
    const { data, error } = await supabase
      .from("discord_account_link_codes")
      .upsert(
        {
          owner_id: session.user.id,
          code,
          expires_at: expiresAt,
          claimed_at: null,
          claimed_discord_user_id: null,
          claimed_discord_username: null,
        },
        { onConflict: "owner_id" },
      )
      .select("*")
      .single();
    setAccountBusy(false);

    if (error) {
      setAccountNotice(error.message);
      return;
    }

    setLinkCode(data as LinkCodeRow);
    setAccountNotice("Link code generated. Use /account link in Discord.");
  }

  async function saveSheet() {
    if (!session) {
      setMessage("Sign in before saving.");
      return;
    }

    const isNewCharacter = !characterId;
    setSaveBusy(true);
    const payload = {
      owner_id: session.user.id,
      ...sheetJson,
    };

    const query = characterId
      ? supabase
          .from("characters")
          .update(payload)
          .eq("id", characterId)
          .select("*")
          .single()
      : supabase.from("characters").insert(payload).select("*").single();

    const { data, error } = await query;
    setSaveBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (isNewCharacter) {
      await seedSystemRecipesForCharacter((data as CharacterRow).id);
    }

    syncSavedCharacterInCollections(data as CharacterRow);
    applyCharacter(data as CharacterRow);
    setMessage("Saved.");
  }

  function resetDraft() {
    setCharacterId(null);
    setName(defaultSheet.name);
    setPronouns(defaultSheet.pronouns);
    setConcept(defaultSheet.concept);
    setFocus(defaultSheet.focus);
    setThread(defaultSheet.thread);
    setCoreWords(defaultSheet.core_words);
    setMarks(defaultSheet.marks);
    setWounds(defaultSheet.wounds);
    setGear(defaultSheet.gear);
    setTie(defaultSheet.tie);
    setHand(defaultSheet.hand);
    setDeck(defaultSheet.deck);
    setDiscard(defaultSheet.discard);
    setCharacterRecipeLinks([]);
    clearPostBuilder();
    setMessage("Started a new unsaved sheet.");
  }
  return {
    session,
    setSession,
    email,
    setEmail,
    authBusy,
    setAuthBusy,
    saveBusy,
    setSaveBusy,
    loadBusy,
    setLoadBusy,
    accountBusy,
    setAccountBusy,
    message,
    setMessage,
    accountNotice,
    setAccountNotice,
    discordProfile,
    setDiscordProfile,
    linkCode,
    setLinkCode,
    viewMode,
    setViewMode,
    characters,
    setCharacters,
    rosterCharacters,
    setRosterCharacters,
    characterId,
    setCharacterId,
    campaigns,
    setCampaigns,
    campaignLinks,
    setCampaignLinks,
    campaignScenes,
    setCampaignScenes,
    campaignBeats,
    setCampaignBeats,
    campaignPosts,
    setCampaignPosts,
    playerQueuedPosts,
    setPlayerQueuedPosts,
    campaignId,
    setCampaignId,
    sceneId,
    setSceneId,
    beatId,
    setBeatId,
    campaignName,
    setCampaignName,
    campaignInviteCode,
    setCampaignInviteCode,
    beatNumber,
    setBeatNumber,
    campaignDefaultCr,
    setCampaignDefaultCr,
    postingWindow,
    setPostingWindow,
    campaignSceneWords,
    setCampaignSceneWords,
    threat,
    setThreat,
    campaignBusy,
    setCampaignBusy,
    campaignNotice,
    setCampaignNotice,
    campaignDraftOpen,
    setCampaignDraftOpen,
    campaignTargetCharacterId,
    setCampaignTargetCharacterId,
    campaignTargetMarks,
    setCampaignTargetMarks,
    campaignTargetWounds,
    setCampaignTargetWounds,
    playerCampaignNotice,
    setPlayerCampaignNotice,
    joinedCampaigns,
    setJoinedCampaigns,
    joinInviteCode,
    setJoinInviteCode,
    sceneName,
    setSceneName,
    sceneSummary,
    setSceneSummary,
    beatPrompt,
    setBeatPrompt,
    postType,
    setPostType,
    selectedCoreWordId,
    setSelectedCoreWordId,
    selectedCardWords,
    setSelectedCardWords,
    spendThreadWithPost,
    setSpendThreadWithPost,
    breatheChoice,
    setBreatheChoice,
    selectedRecipeId,
    setSelectedRecipeId,
    challengeRating,
    setChallengeRating,
    selectedGearIds,
    setSelectedGearIds,
    sceneWord,
    setSceneWord,
    sceneWordColor,
    setSceneWordColor,
    breatheColor,
    setBreatheColor,
    setupWord,
    setSetupWord,
    ghostIntent,
    setGhostIntent,
    mechanicsSummary,
    setMechanicsSummary,
    builderNotice,
    setBuilderNotice,
    name,
    setName,
    pronouns,
    setPronouns,
    concept,
    setConcept,
    focus,
    setFocus,
    thread,
    setThread,
    coreWords,
    setCoreWords,
    marks,
    setMarks,
    wounds,
    setWounds,
    gear,
    setGear,
    tie,
    setTie,
    hand,
    setHand,
    deck,
    setDeck,
    discard,
    setDiscard,
    allRecipes,
    setAllRecipes,
    allCards,
    setAllCards,
    characterRecipeLinks,
    setCharacterRecipeLinks,
    contentNotice,
    setContentNotice,
    newRecipeName,
    setNewRecipeName,
    newRecipeFamily,
    setNewRecipeFamily,
    newRecipeCoreTags,
    setNewRecipeCoreTags,
    newRecipeChroma,
    setNewRecipeChroma,
    newRecipeHit,
    setNewRecipeHit,
    newRecipeStrongHit,
    setNewRecipeStrongHit,
    newRecipeMiss,
    setNewRecipeMiss,
    newCardWord,
    setNewCardWord,
    newCardColor,
    setNewCardColor,
    newCardTags,
    setNewCardTags,
    loadContentLibrary,
    loadCharacterRecipeLinks,
    createRecipe,
    assignRecipeToCharacter,
    removeRecipeFromCharacter,
    seedSystemRecipesForCharacter,
    createCard,
    addCardToDeck,
    removeCardFromDeck,
    loadCampaignPosts,
    loadPlayerQueuedPosts,
    drawCard,
    drawRandomCards,
    discardCard,
    toggleSelectedCard,
    toggleSelectedGear,
    changePostType,
    clearPostBuilder,
    postSummary,
    buildMechanicsBlock,
    submitPost,
    copyMechanicsSummary,
    copyDiscordPostSnippet,
    cancelQueuedPost,
    editGeneratedPost,
    applyCharacter,
    applyCampaign,
    syncSavedCharacterInCollections,
    getCampaignLabel,
    getCharacterLabel,
    loadRosterCharacters,
    loadScenesAndBeats,
    createCampaign,
    saveCampaign,
    newCampaignDraft,
    deleteCampaign,
    addSceneWord,
    updateSceneWord,
    removeSceneWord,
    adjustThreat,
    clampChallengeRating,
    saveCampaignChallengeRating,
    saveSceneChallengeRating,
    saveCampaignTargetConditions,
    linkCharacterToCampaign,
    joinCampaignByInvite,
    saveScene,
    setActiveScene,
    createBeat,
    saveBeat,
    setActiveBeat,
    selectCharacter,
    signIn,
    signOut,
    createAccountLinkCode,
    saveSheet,
    resetDraft,
    availableRecipes,
    selectedRecipe,
    hasAvailableRecipes,
    selectedCoreWord,
    selectedCards,
    selectedGear,
    selectedGearChroma,
    selectedCoreTags,
    isCoreEligible,
    matchedChromaCount,
    actGrade,
    activeCampaignCharacters,
    activeCampaignTargetCharacter,
    activeScene,
    activeBeat,
    visibleCampaignPosts,
    activeSheetLabel,
    activeCampaignLabel,
    activeSceneLabel,
    activeBeatLabel,
    discordStatusLabel,
    characterDeckCards,
    visiblePlayerPosts,
    sheetJson,
    visibleSceneWords,
  };
}

export type ChromaWorkspace = ReturnType<typeof useChromaWorkspace>;
