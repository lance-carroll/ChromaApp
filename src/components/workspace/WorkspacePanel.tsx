"use client";

import type { ChromaWorkspace } from "@/hooks/useChromaWorkspace";
import { CollapsibleSection } from "@/components/ui";
import { chromaNames } from "@/lib/chroma";

export function WorkspacePanel(w: ChromaWorkspace) {
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

  if (!session) {
    return null;
  }

  return (
          <CollapsibleSection
            title="Workspace"
            summary="Sheets, campaign access, and Discord linking live here when you need them."
          >
            <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="grid gap-4">
                <section className="border rounded-lg border border-border bg-surface-muted p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-base font-bold">Saved Sheets</h3>
                      <p className="mt-1 text-sm text-foreground/70">
                        {characters.length === 0
                          ? "No saved characters yet."
                          : `${characters.length} saved ${
                              characters.length === 1 ? "character" : "characters"
                            }`}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground/80">
                      {loadBusy ? "Loading..." : characterId ? "Saved sheet open" : "Draft open"}
                    </span>
                  </div>
                  {characters.length > 0 ? (
                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                      {characters.map((character) => (
                        <button
                          type="button"
                          key={character.id}
                          className={`border px-3 py-3 text-left hover:bg-white ${
                            character.id === characterId
                              ? "border-accent bg-accent/10"
                              : "border-border bg-surface"
                          }`}
                          onClick={() => selectCharacter(character.id)}
                        >
                          <span className="block font-bold">{character.name}</span>
                          <span className="mt-1 block text-sm text-foreground/70">
                            {character.concept || "No concept yet"}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </section>

                <section className="border rounded-lg border border-border bg-surface-muted p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-bold">Campaign Access</h3>
                      <p className="mt-1 text-sm text-foreground/70">
                        Open a saved sheet, enter the GM&apos;s invite code, then join.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="h-11 border border-accent bg-accent px-4 font-semibold text-white hover:opacity-90 disabled:opacity-50"
                      onClick={joinCampaignByInvite}
                      disabled={!characterId}
                    >
                      Join With Open Sheet
                    </button>
                  </div>
                  {playerCampaignNotice ? (
                    <p className="mt-3 border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-950">
                      {playerCampaignNotice}
                    </p>
                  ) : null}
                  <label className="mt-3 grid max-w-sm gap-1">
                    <span className="text-sm font-semibold text-foreground/70">
                      Invite Code
                    </span>
                    <input
                      className="border border-border bg-surface px-3 py-2 uppercase outline-none focus:border-accent"
                      value={joinInviteCode}
                      onChange={(event) => setJoinInviteCode(event.target.value)}
                      placeholder="AB12CD34"
                    />
                  </label>
                  {joinedCampaigns.length > 0 ? (
                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                      {joinedCampaigns.map((campaign) => (
                        <button
                          type="button"
                          key={`joined-workspace-${campaign.id}`}
                          className={`border px-3 py-2 text-left hover:bg-white ${
                            campaign.id === campaignId
                              ? "border-accent bg-accent/10"
                              : "border-border bg-surface"
                          }`}
                          onClick={() => applyCampaign(campaign)}
                        >
                          <span className="block font-bold">{campaign.name}</span>
                          <span className="mt-1 block text-xs text-foreground/70">
                            Invite {campaign.invite_code}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </section>

                <section className="border rounded-lg border border-border bg-surface-muted p-4">
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="text-base font-bold">Recipe Library</h3>
                      <p className="mt-1 text-sm text-foreground/70">
                        Create custom recipes and decide which ones this character can use.
                      </p>
                    </div>
                    {contentNotice ? (
                      <p className="border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-950">
                        {contentNotice}
                      </p>
                    ) : null}
                    <div className="grid gap-2 md:grid-cols-2">
                      <input
                        className="border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                        value={newRecipeName}
                        onChange={(event) => setNewRecipeName(event.target.value)}
                        placeholder="Recipe name"
                      />
                      <input
                        className="border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                        value={newRecipeFamily}
                        onChange={(event) => setNewRecipeFamily(event.target.value)}
                        placeholder="Family"
                      />
                      <input
                        className="border border-border bg-surface px-3 py-2 outline-none focus:border-accent md:col-span-2"
                        value={newRecipeCoreTags}
                        onChange={(event) => setNewRecipeCoreTags(event.target.value)}
                        placeholder="Core tags: violence, oath, passage"
                      />
                      <input
                        className="border border-border bg-surface px-3 py-2 outline-none focus:border-accent md:col-span-2"
                        value={newRecipeChroma}
                        onChange={(event) => setNewRecipeChroma(event.target.value)}
                        placeholder="Chroma: Red, Gold"
                      />
                      <textarea
                        className="min-h-20 border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                        value={newRecipeHit}
                        onChange={(event) => setNewRecipeHit(event.target.value)}
                        placeholder="Hit"
                      />
                      <textarea
                        className="min-h-20 border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                        value={newRecipeStrongHit}
                        onChange={(event) => setNewRecipeStrongHit(event.target.value)}
                        placeholder="Strong hit"
                      />
                      <textarea
                        className="min-h-20 border border-border bg-surface px-3 py-2 outline-none focus:border-accent md:col-span-2"
                        value={newRecipeMiss}
                        onChange={(event) => setNewRecipeMiss(event.target.value)}
                        placeholder="Miss"
                      />
                    </div>
                    <button
                      type="button"
                      className="h-10 border border-accent bg-accent px-4 text-sm font-semibold text-white hover:bg-accent/90"
                      onClick={createRecipe}
                    >
                      Create Recipe
                    </button>
                    <div className="grid gap-2">
                      {allRecipes.map((recipe) => {
                        const assigned = characterRecipeLinks.some((link) => link.recipe_id === recipe.id);

                        return (
                          <div
                            key={`recipe-library-${recipe.id}`}
                            className="grid gap-2 border border-border bg-surface p-3"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <span className="block font-bold">{recipe.name}</span>
                                <span className="mt-1 block text-xs text-foreground/70">
                                  {recipe.family || "Unfiled"} · {(recipe.core_tags ?? []).join(", ")}
                                </span>
                              </div>
                              <button
                                type="button"
                                className={`h-9 border px-3 text-xs font-semibold ${
                                  assigned
                                    ? "border-chroma-red/40 text-chroma-red-ink hover:bg-chroma-red/10"
                                    : "border-border hover:bg-surface-muted"
                                }`}
                                onClick={() =>
                                  assigned
                                    ? removeRecipeFromCharacter(recipe.id)
                                    : assignRecipeToCharacter(recipe.id)
                                }
                                disabled={!characterId}
                              >
                                {assigned ? "Remove From Character" : "Add To Character"}
                              </button>
                            </div>
                            <p className="text-xs text-foreground/80">
                              Chroma: {(recipe.chroma ?? []).join(" + ")}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                <section className="border rounded-lg border border-border bg-surface-muted p-4">
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="text-base font-bold">Card Library</h3>
                      <p className="mt-1 text-sm text-foreground/70">
                        Create custom cards and add them to this character&apos;s deck.
                      </p>
                    </div>
                    <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_140px]">
                      <input
                        className="border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                        value={newCardWord}
                        onChange={(event) => setNewCardWord(event.target.value)}
                        placeholder="Card word"
                      />
                      <select
                        className="border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                        value={newCardColor}
                        onChange={(event) => setNewCardColor(event.target.value)}
                      >
                        {chromaNames.map((color) => (
                          <option key={`content-card-${color}`} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                      <input
                        className="border border-border bg-surface px-3 py-2 outline-none focus:border-accent md:col-span-2"
                        value={newCardTags}
                        onChange={(event) => setNewCardTags(event.target.value)}
                        placeholder="Tags: omen, prophecy, warning"
                      />
                    </div>
                    <button
                      type="button"
                      className="h-10 border border-accent bg-accent px-4 text-sm font-semibold text-white hover:bg-accent/90"
                      onClick={createCard}
                    >
                      Create Card
                    </button>
                    <div className="grid gap-2">
                      {allCards.map((card) => {
                        const inDeck = characterDeckCards.some((entry) => entry.word === card.word);

                        return (
                          <div
                            key={`card-library-${card.id}`}
                            className="flex flex-wrap items-center justify-between gap-2 border border-border bg-surface p-3"
                          >
                            <div>
                              <span className="block font-bold">{card.word}</span>
                              <span className="mt-1 block text-xs text-foreground/70">
                                {card.color} · {(card.tags ?? []).join(", ")}
                              </span>
                            </div>
                            <button
                              type="button"
                              className={`h-9 border px-3 text-xs font-semibold ${
                                inDeck
                                  ? "border-chroma-red/40 text-chroma-red-ink hover:bg-chroma-red/10"
                                  : "border-border hover:bg-surface-muted"
                              }`}
                              onClick={() => (inDeck ? removeCardFromDeck(card.word) : addCardToDeck(card))}
                            >
                              {inDeck ? "Remove From Deck" : "Add To Deck"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              </div>

              <section className="border rounded-lg border border-border bg-surface-muted p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-bold">Discord Link</h3>
                    <p className="mt-1 text-sm text-foreground/70">
                      {discordProfile?.discord_username
                        ? `Linked as ${discordProfile.discord_username}. Generate a fresh code only when you need it.`
                        : "Generate a one-time code here, then run /account link in Discord."}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="h-11 border border-accent bg-accent px-4 font-semibold text-white hover:bg-accent/90 disabled:opacity-60"
                    onClick={createAccountLinkCode}
                    disabled={accountBusy}
                  >
                    {accountBusy ? "Generating..." : "Generate Link Code"}
                  </button>
                </div>
                {accountNotice ? (
                  <p className="mt-3 border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-950">
                    {accountNotice}
                  </p>
                ) : null}
                <div className="mt-4 grid gap-2">
                  <div className="border border-border bg-surface px-3 py-2 text-sm">
                    <span className="block font-semibold text-foreground/70">Discord account</span>
                    <span className="mt-1 block font-semibold text-foreground">
                      {discordProfile?.discord_username || "Not linked yet"}
                    </span>
                  </div>
                  <div className="border border-border bg-surface px-3 py-2 text-sm">
                    <span className="block font-semibold text-foreground/70">Link code</span>
                    <span className="mt-1 block font-mono font-semibold text-foreground">
                      {linkCode
                        ? `${linkCode.code}${linkCode.claimed_at ? " (claimed)" : ""}`
                        : "Generate a code"}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </CollapsibleSection>
  );
}
