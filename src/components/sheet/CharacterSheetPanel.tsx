"use client";

import type { ChromaWorkspace } from "@/hooks/useChromaWorkspace";
import { GearList } from "@/components/sheet/GearList";
import { CollapsibleSection, Surface } from "@/components/ui";

export function CharacterSheetPanel(w: ChromaWorkspace) {
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
    sheetJson,
    visibleSceneWords,
  } = w;
  return (
    <>
        <Surface as="section">
          <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,180px)]">
            <label className="grid min-w-0 gap-1">
              <span className="text-sm font-semibold text-foreground/70">Name</span>
              <input
                className="min-w-0 border border-border px-3 py-2 text-2xl font-bold outline-none focus:border-accent"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="grid min-w-0 gap-1">
              <span className="text-sm font-semibold text-foreground/70">
                Pronouns
              </span>
              <input
                className="min-w-0 border border-border px-3 py-2 outline-none focus:border-accent"
                value={pronouns}
                onChange={(event) => setPronouns(event.target.value)}
              />
            </label>
          </div>
          <label className="mt-3 grid gap-1">
            <span className="text-sm font-semibold text-foreground/70">Concept</span>
            <textarea
              className="min-h-20 resize-y border border-border px-3 py-2 outline-none focus:border-accent"
              value={concept}
              onChange={(event) => setConcept(event.target.value)}
            />
          </label>
        </Surface>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Surface>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">Core Words</h2>
              <span className="text-sm text-foreground/70">{coreWords.length}/4</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {coreWords.map((coreWord) => (
                <div key={coreWord.id} className="grid gap-2 border border-border p-3">
                  <input
                    className="border border-border px-3 py-2 font-bold outline-none focus:border-accent"
                    value={coreWord.word}
                    onChange={(event) =>
                      setCoreWords(
                        coreWords.map((entry) =>
                          entry.id === coreWord.id
                            ? { ...entry, word: event.target.value }
                            : entry,
                        ),
                      )
                    }
                  />
                  <input
                    className="border border-border px-3 py-2 text-sm outline-none focus:border-accent"
                    value={coreWord.tags}
                    onChange={(event) =>
                      setCoreWords(
                        coreWords.map((entry) =>
                          entry.id === coreWord.id
                            ? { ...entry, tags: event.target.value }
                            : entry,
                        ),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </Surface>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <label className="grid gap-1 surface-shadow rounded-xl border border-border bg-surface p-5">
              <span className="text-lg font-bold">Tie</span>
              <textarea
                className="min-h-24 resize-y border border-border px-3 py-2 outline-none focus:border-accent"
                value={tie}
                onChange={(event) => setTie(event.target.value)}
              />
            </label>
          </div>
        </section>

        <Surface as="section">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Gear</h2>
            <span className="text-sm text-foreground/70">
              {gear.length} listed {gear.length === 1 ? "item" : "items"}
            </span>
          </div>
          <GearList items={gear} setItems={setGear} />
        </Surface>

        <CollapsibleSection title="Current sheet payload" summary="Raw debug data, not needed for play.">
          <pre className="max-h-80 overflow-auto text-xs leading-5">
            {JSON.stringify(sheetJson, null, 2)}
          </pre>
        </CollapsibleSection>
    </>
  );
}
