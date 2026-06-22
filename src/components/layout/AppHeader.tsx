"use client";

import type { ChromaWorkspace } from "@/hooks/useChromaWorkspace";

export function AppHeader(w: ChromaWorkspace) {
  const {
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
    visibleSceneWords,
  } = w;
  return (
    <>
        <header className="grid gap-4 border border-accent bg-stone-950 px-4 py-5 text-accent-ink lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-ink/80">
              Chroma Word Engine
            </p>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <h1 className="text-2xl font-black sm:text-4xl">
                Play Surface
              </h1>
              <span className="border border-accent bg-accent px-2 py-1 text-xs font-semibold uppercase tracking-wide text-foreground/60">
                {session ? "Saving enabled" : "Local draft mode"}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-foreground/60">
              Keep the active post front and center. Everything else can wait offstage until you need it.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            {session ? (
              <button
                type="button"
                className="h-11 border border-accent bg-accent px-4 font-semibold text-accent-ink hover:bg-accent/80"
                onClick={signOut}
                disabled={authBusy}
              >
                Sign out
              </button>
            ) : (
              <button
                type="button"
                className="h-11 border border-accent bg-accent px-4 font-semibold text-white hover:opacity-90 disabled:opacity-60"
                onClick={signIn}
                disabled={authBusy}
              >
                {authBusy ? "Sending..." : "Send link"}
              </button>
            )}
            <button
              type="button"
              className="h-11 border border-accent bg-accent px-4 font-semibold text-accent-ink hover:bg-accent/80"
              onClick={resetDraft}
            >
              New draft
            </button>
            <button
              type="button"
              className="h-11 border border-accent bg-accent px-4 font-semibold text-white hover:opacity-90 disabled:opacity-60"
              onClick={saveSheet}
              disabled={saveBusy || !session}
            >
              {saveBusy ? "Saving..." : "Save sheet"}
            </button>
          </div>
        </header>

        {!session ? (
          <section className="grid gap-3 surface-shadow rounded-lg border border-border bg-surface p-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="text-base font-bold">Sign In</h2>
              <p className="mt-1 text-sm text-foreground/70">{message}</p>
              <label className="mt-3 grid max-w-md gap-1">
                <span className="text-sm font-semibold text-foreground/70">
                  Email
                </span>
                <input
                  className="border border-border px-3 py-2 outline-none focus:border-accent"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>
            </div>
          </section>
        ) : null}

        {session ? (
          <section className="grid gap-2 border border-border bg-surface p-3 sm:grid-cols-2">
            <button
              type="button"
              className={`h-11 border px-4 font-semibold ${
                viewMode === "player"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border hover:bg-surface-muted"
              }`}
              onClick={() => setViewMode("player")}
            >
              Player View
            </button>
            <button
              type="button"
              className={`h-11 border px-4 font-semibold ${
                viewMode === "gm"
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border hover:bg-surface-muted"
              }`}
              onClick={() => setViewMode("gm")}
            >
              GM View
            </button>
          </section>
        ) : null}

        {session ? (
          <section className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            <div className="border border-border bg-surface px-4 py-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-accent-ink0">
                Active Sheet
              </span>
              <span className="mt-1 block font-semibold text-foreground">
                {activeSheetLabel}
              </span>
            </div>
            <div className="border border-border bg-surface px-4 py-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-accent-ink0">
                Campaign
              </span>
              <span className="mt-1 block font-semibold text-foreground">
                {activeCampaignLabel}
              </span>
            </div>
            <div className="border border-border bg-surface px-4 py-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-accent-ink0">
                Scene / Beat
              </span>
              <span className="mt-1 block font-semibold text-foreground">
                {activeSceneLabel} · {activeBeatLabel}
              </span>
            </div>
            <div className="border border-border bg-surface px-4 py-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-accent-ink0">
                Discord
              </span>
              <span className="mt-1 block font-semibold text-foreground">
                {discordStatusLabel}
              </span>
            </div>
          </section>
        ) : null}
    </>
  );
}
