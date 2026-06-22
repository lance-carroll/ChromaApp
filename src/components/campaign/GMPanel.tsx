"use client";

import type { ChromaWorkspace } from "@/hooks/useChromaWorkspace";
import { CollapsibleSection, TextEntryList } from "@/components/ui";
import { chromaNames, colorStyles, threatBucketByColor, threatBucketStyles } from "@/lib/chroma";
import type { ThreatBucket } from "@/lib/chroma";

export function GMPanel(w: ChromaWorkspace) {
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
          <section className="grid gap-4 surface-shadow rounded-xl border border-border bg-surface p-5 xl:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">Campaign Sheet / GM Tools</h2>
                  <p className="mt-1 text-sm text-foreground/70">
                    {campaignNotice || "Create or load the active campaign scene."}
                  </p>
                </div>
                <span className="text-sm font-semibold text-foreground/80">
                  {campaignBusy ? "Saving..." : campaignId ? "Campaign open" : "Draft"}
                </span>
              </div>

              {campaigns.length > 0 ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {campaigns.map((campaign) => (
                    <button
                      type="button"
                      key={campaign.id}
                      className={`border px-3 py-2 text-left hover:bg-surface-muted ${
                        campaign.id === campaignId
                          ? "border-accent bg-accent/10"
                          : "border-border"
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

              {campaignId ? (
                <div className="mt-4 grid gap-3">
                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-foreground/70">
                      Campaign Name
                    </span>
                    <input
                      className="min-w-0 border border-border px-3 py-2 outline-none focus:border-accent"
                      value={campaignName}
                      onChange={(event) => setCampaignName(event.target.value)}
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-foreground/70">
                      Posting Window
                    </span>
                    <input
                      className="min-w-0 border border-border px-3 py-2 outline-none focus:border-accent"
                      value={postingWindow}
                      onChange={(event) => setPostingWindow(event.target.value)}
                    />
                  </label>
                  <div className="grid gap-2 sm:grid-cols-4">
                    <button
                      type="button"
                      className="h-11 border border-accent bg-accent px-4 font-semibold text-white hover:opacity-90"
                      onClick={saveCampaign}
                      disabled={campaignBusy}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="h-11 border border-border px-4 font-semibold hover:bg-surface-muted disabled:opacity-50"
                      onClick={linkCharacterToCampaign}
                      disabled={!characterId || !campaignId}
                    >
                      Add Open Sheet
                    </button>
                    <button
                      type="button"
                      className="h-11 border border-border px-4 font-semibold hover:bg-surface-muted disabled:opacity-50"
                      onClick={deleteCampaign}
                      disabled={!campaignId || campaignBusy}
                    >
                      Delete
                    </button>
                    <span className="flex h-11 items-center border border-border px-3 text-sm text-foreground/70">
                      {campaignInviteCode ? `Invite ${campaignInviteCode}` : "Save for invite"}
                    </span>
                  </div>
                  <div className="grid gap-3 border border-border p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                          Challenge Management
                        </h3>
                        <p className="mt-1 text-sm text-foreground/70">
                          Tune the active CR for posting and keep scene defaults in sync.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="h-9 w-9 border border-border text-lg font-bold hover:bg-surface-muted disabled:opacity-50"
                          onClick={() => setChallengeRating(clampChallengeRating(challengeRating - 1))}
                          disabled={challengeRating <= 7}
                        >
                          -
                        </button>
                        <span className="min-w-16 border border-border bg-surface px-3 py-2 text-center font-mono text-lg font-bold">
                          {challengeRating}
                        </span>
                        <button
                          type="button"
                          className="h-9 w-9 border border-border text-lg font-bold hover:bg-surface-muted disabled:opacity-50"
                          onClick={() => setChallengeRating(clampChallengeRating(challengeRating + 1))}
                          disabled={challengeRating >= 15}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        className="h-11 border border-border px-4 font-semibold hover:bg-surface-muted disabled:opacity-50"
                        onClick={() => setChallengeRating(campaignDefaultCr)}
                      >
                        Use Campaign Default ({campaignDefaultCr})
                      </button>
                      <button
                        type="button"
                        className="h-11 border border-border px-4 font-semibold hover:bg-surface-muted disabled:opacity-50"
                        onClick={() =>
                          setChallengeRating(activeScene?.default_cr ?? campaignDefaultCr)
                        }
                      >
                        Use Scene Default ({activeScene?.default_cr ?? campaignDefaultCr})
                      </button>
                      <button
                        type="button"
                        className="h-11 border border-accent bg-accent px-4 font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
                        onClick={() => void saveCampaignChallengeRating(challengeRating)}
                      >
                        Save Campaign Default
                      </button>
                      <button
                        type="button"
                        className="h-11 border border-accent bg-accent px-4 font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
                        onClick={() => void saveSceneChallengeRating(challengeRating)}
                        disabled={!sceneId}
                      >
                        Save Scene Default
                      </button>
                    </div>
                  </div>
                  <div className="border border-border p-3">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                      Current Roster
                    </h3>
                    <p className="mt-1 text-sm text-foreground/70">
                      Characters linked to this campaign. Click one to edit marks and wounds.
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {activeCampaignCharacters.length === 0 ? (
                        <span className="text-sm text-foreground/70 sm:col-span-2 xl:col-span-3">
                          No sheets linked yet.
                        </span>
                      ) : (
                        activeCampaignCharacters.map((character) => (
                          <button
                            type="button"
                            key={`linked-${character.id}`}
                            className={`border px-3 py-2 text-left hover:bg-surface-muted ${
                              campaignTargetCharacterId === character.id
                                ? "border-accent bg-accent/10"
                                : "border-border bg-surface-muted"
                            }`}
                            onClick={() => setCampaignTargetCharacterId(character.id)}
                          >
                            <span className="block text-sm font-bold">
                              {character.name}
                            </span>
                            <span className="mt-1 block text-xs text-foreground/70">
                              F{character.focus} T{character.thread} M{character.marks.length} W{character.wounds.length}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                  {activeCampaignTargetCharacter ? (
                    <div className="grid gap-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                            Condition Editor
                          </h3>
                          <p className="mt-1 text-sm text-foreground/70">
                            Editing marks and wounds for {activeCampaignTargetCharacter.name}.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="h-10 border border-border px-3 text-sm font-semibold hover:bg-surface-muted"
                            onClick={() => {
                              setCampaignTargetMarks(activeCampaignTargetCharacter.marks ?? []);
                              setCampaignTargetWounds(activeCampaignTargetCharacter.wounds ?? []);
                            }}
                          >
                            Reset
                          </button>
                          <button
                            type="button"
                            className="h-10 border border-accent bg-accent px-3 text-sm font-semibold text-white hover:opacity-90"
                            onClick={saveCampaignTargetConditions}
                          >
                            Save Conditions
                          </button>
                        </div>
                      </div>
                      <div className="grid gap-4 lg:grid-cols-2">
                        <TextEntryList
                          title="Marks"
                          items={campaignTargetMarks}
                          setItems={setCampaignTargetMarks}
                          placeholder="shaken, watched, off-balance"
                        />
                        <TextEntryList
                          title="Wounds"
                          items={campaignTargetWounds}
                          setItems={setCampaignTargetWounds}
                          placeholder="black ash, red hunger"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-4 grid gap-3 border border-border bg-surface-muted p-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                      No Campaign Open
                    </h3>
                    <p className="mt-1 text-sm text-foreground/70">
                      Select a campaign above, or open a draft when you&apos;re ready to create a new one.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="h-11 border border-accent bg-accent px-4 font-semibold text-white hover:bg-accent/90"
                    onClick={newCampaignDraft}
                  >
                    Open New Campaign Draft
                  </button>
                  <CollapsibleSection
                    title="New Campaign Draft"
                    summary="Keep this tucked away until you actually need it."
                    defaultOpen={campaignDraftOpen}
                  >
                    <div className="grid gap-3">
                      <label className="grid gap-1">
                        <span className="text-sm font-semibold text-foreground/70">
                          Campaign Name
                        </span>
                        <input
                          className="min-w-0 border border-border px-3 py-2 outline-none focus:border-accent"
                          value={campaignName}
                          onChange={(event) => setCampaignName(event.target.value)}
                        />
                      </label>
                      <label className="grid gap-1">
                        <span className="text-sm font-semibold text-foreground/70">
                          Posting Window
                        </span>
                        <input
                          className="min-w-0 border border-border px-3 py-2 outline-none focus:border-accent"
                          value={postingWindow}
                          onChange={(event) => setPostingWindow(event.target.value)}
                        />
                      </label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          className="h-11 border border-accent bg-accent px-4 font-semibold text-white hover:opacity-90"
                          onClick={saveCampaign}
                          disabled={campaignBusy}
                        >
                          Save Draft
                        </button>
                        <button
                          type="button"
                          className="h-11 border border-border px-4 font-semibold hover:bg-surface-muted"
                          onClick={newCampaignDraft}
                        >
                          Reset Draft
                        </button>
                      </div>
                    </div>
                  </CollapsibleSection>
                </div>
              )}
                {campaignId ? (
                  <div className="grid gap-3 border border-border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                        Scenes And Beats
                      </h3>
                      <span className="text-sm text-foreground/70">
                        {campaignScenes.length} scenes
                      </span>
                    </div>
                    {campaignScenes.length > 0 ? (
                      <div className="grid gap-2">
                        {campaignScenes.map((scene) => (
                          <div
                            key={scene.id}
                            className={`grid gap-2 border px-3 py-2 ${
                              scene.id === sceneId
                                ? "border-accent bg-accent/10"
                                : "border-border"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <button
                                type="button"
                                className="text-left"
                                onClick={() => {
                                  setSceneId(scene.id);
                                  setSceneName(scene.name);
                                  setSceneSummary(scene.summary);
                                  setCampaignSceneWords(scene.scene_words ?? []);
                                  setCampaignDefaultCr(scene.default_cr);
                                  setChallengeRating(scene.default_cr);
                                  const nextBeat = campaignBeats.find(
                                    (beat) => beat.scene_id === scene.id && beat.is_active,
                                  );
                                  if (nextBeat) {
                                    setBeatId(nextBeat.id);
                                    setBeatNumber(nextBeat.beat_number);
                                    setBeatPrompt(nextBeat.prompt);
                                  }
                                }}
                              >
                                <span className="block font-bold">{scene.name}</span>
                                <span className="mt-1 block text-xs text-foreground/70">
                                  {campaignBeats.filter((beat) => beat.scene_id === scene.id).length} beats
                                </span>
                              </button>
                              <button
                                type="button"
                                className="h-8 border border-border px-3 text-xs font-semibold hover:bg-surface-muted"
                                onClick={() => setActiveScene(scene.id)}
                              >
                                Set Active
                              </button>
                            </div>
                            {scene.is_active ? (
                              <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                                Active
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <label className="grid gap-1">
                      <span className="text-sm font-semibold text-foreground/70">
                        Scene Name
                      </span>
                      <input
                        className="min-w-0 border border-border px-3 py-2 outline-none focus:border-accent"
                        value={sceneName}
                        onChange={(event) => setSceneName(event.target.value)}
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-sm font-semibold text-foreground/70">
                        Scene Summary
                      </span>
                      <textarea
                        className="min-h-20 resize-y border border-border px-3 py-2 outline-none focus:border-accent"
                        value={sceneSummary}
                        onChange={(event) => setSceneSummary(event.target.value)}
                      />
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        className="h-11 border border-accent bg-accent px-4 font-semibold text-white hover:opacity-90"
                        onClick={saveScene}
                      >
                        Save Scene
                      </button>
                      <button
                        type="button"
                        className="h-11 border border-border px-4 font-semibold hover:bg-surface-muted"
                        onClick={() => {
                          setSceneId(null);
                          setSceneName("New Scene");
                          setSceneSummary("");
                          setCampaignSceneWords([]);
                          setBeatId(null);
                          setBeatPrompt("");
                        }}
                      >
                        New Scene
                      </button>
                    </div>
                    <label className="grid gap-1">
                      <span className="text-sm font-semibold text-foreground/70">
                        Beat Number
                      </span>
                      <input
                        className="min-w-0 border border-border px-3 py-2 outline-none focus:border-accent"
                        type="number"
                        min={1}
                        value={beatNumber}
                        onChange={(event) => setBeatNumber(Number(event.target.value))}
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-sm font-semibold text-foreground/70">
                        Active Beat Prompt
                      </span>
                      <textarea
                        className="min-h-20 resize-y border border-border px-3 py-2 outline-none focus:border-accent"
                        value={beatPrompt}
                        onChange={(event) => setBeatPrompt(event.target.value)}
                      />
                    </label>
                    {campaignBeats.filter((beat) => beat.scene_id === sceneId).length > 0 ? (
                      <div className="grid gap-2">
                        <h4 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                          Beats In Scene
                        </h4>
                        {campaignBeats
                          .filter((beat) => beat.scene_id === sceneId)
                          .map((beat) => (
                            <div
                              key={beat.id}
                              className={`grid gap-2 border px-3 py-2 ${
                                beat.id === beatId
                                  ? "border-accent bg-accent/10"
                                  : "border-border"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <button
                                  type="button"
                                  className="text-left"
                                  onClick={() => {
                                    setBeatId(beat.id);
                                    setBeatNumber(beat.beat_number);
                                    setBeatPrompt(beat.prompt);
                                  }}
                                >
                                  <span className="block font-bold">
                                    Beat {beat.beat_number}
                                  </span>
                                  <span className="mt-1 block text-xs text-foreground/70">
                                    {beat.prompt || "No prompt yet"}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  className="h-8 border border-border px-3 text-xs font-semibold hover:bg-surface-muted"
                                  onClick={() => setActiveBeat(beat.id)}
                                >
                                  Set Active
                                </button>
                              </div>
                              {beat.is_active ? (
                                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                                  Active
                                </span>
                              ) : null}
                            </div>
                          ))}
                      </div>
                    ) : null}
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        className="h-11 border border-accent bg-accent px-4 font-semibold text-white hover:bg-accent/90 disabled:opacity-50"
                        onClick={beatId ? saveBeat : createBeat}
                        disabled={!sceneId}
                      >
                        {beatId ? "Save Beat" : "Create Next Beat"}
                      </button>
                      <button
                        type="button"
                        className="h-11 border border-border px-4 font-semibold hover:bg-surface-muted disabled:opacity-50"
                        onClick={() => {
                          setBeatId(null);
                          setBeatNumber(
                            Math.max(
                              0,
                              ...campaignBeats
                                .filter((beat) => beat.scene_id === sceneId)
                                .map((beat) => beat.beat_number),
                            ) + 1,
                          );
                          setBeatPrompt("");
                        }}
                        disabled={!sceneId}
                      >
                        New Beat
                      </button>
                    </div>
                  </div>
              ) : null}
              </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div className="border border-border p-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                    Scene Words For Active Scene
                  </h3>
                  <button
                    type="button"
                    className="h-9 border border-border px-3 text-sm font-semibold hover:bg-surface-muted"
                    onClick={addSceneWord}
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3 grid gap-2">
                      {campaignSceneWords.length === 0 ? (
                    <p className="text-sm text-foreground/70">No scene words yet.</p>
                  ) : (
                    campaignSceneWords.map((entry) => (
                      <div key={entry.id} className="grid gap-2 sm:grid-cols-[1fr_130px_40px]">
                        <input
                          className="min-w-0 border border-border px-3 py-2 outline-none focus:border-accent"
                          value={entry.word}
                          onChange={(event) =>
                            updateSceneWord(entry.id, { word: event.target.value })
                          }
                          placeholder="gate, crown, rain"
                        />
                        <select
                          className="min-w-0 border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                          value={entry.color}
                          onChange={(event) =>
                            updateSceneWord(entry.id, { color: event.target.value })
                          }
                        >
                          {chromaNames.map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="h-10 border border-border hover:bg-surface-muted"
                          onClick={() => removeSceneWord(entry.id)}
                          aria-label="Remove scene word"
                        >
                          x
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border border-border p-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                  Threat
                </h3>
                <div className="mt-3 grid gap-2">
                  {Object.keys(threatBucketStyles).map((color) => {
                    const bucket = color as ThreatBucket;

                    return (
                    <div
                      key={bucket}
                      className={`grid grid-cols-[1fr_36px_36px_36px] items-center gap-2 border px-2 py-2 ${threatBucketStyles[bucket]}`}
                    >
                      <span className="text-sm font-bold">{bucket}</span>
                      <button
                        type="button"
                        className="h-8 border border-current bg-white/40 font-bold"
                        onClick={() => adjustThreat(bucket, -1)}
                      >
                        -
                      </button>
                      <span className="text-center font-mono font-bold">
                        {threat[bucket] ?? 0}
                      </span>
                      <button
                        type="button"
                        className="h-8 border border-current bg-white/40 font-bold"
                        onClick={() => adjustThreat(bucket, 1)}
                      >
                        +
                      </button>
                    </div>
                    );
                  })}
                </div>
              </div>

              <div className="border border-border p-3 lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                      Post Queue
                    </h3>
                    <p className="mt-1 text-sm text-foreground/70">
                      Pending and resolved posts for the current campaign.
                    </p>
                  </div>
                  <span className="text-sm text-foreground/70">
                    {visibleCampaignPosts.length} posts
                  </span>
                </div>
                <div className="mt-3 grid gap-2">
                  {visibleCampaignPosts.length === 0 ? (
                    <p className="text-sm text-foreground/70">No posts queued yet.</p>
                  ) : (
                    visibleCampaignPosts.map((post) => (
                      <div key={post.id} className="grid gap-2 border border-border bg-surface-muted p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-bold uppercase tracking-wide text-foreground/80">
                            {post.post_type}
                          </span>
                          <span
                            className={`text-xs font-semibold uppercase tracking-wide ${
                              post.status === "pending"
                                ? "text-amber-700"
                                : post.status === "resolved"
                                  ? "text-emerald-700"
                                  : "text-chroma-red-ink"
                            }`}
                          >
                            {post.status}
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{post.post_summary}</p>
                        <pre className="whitespace-pre-wrap border border-border bg-white px-3 py-2 font-mono text-xs text-foreground">
                          {post.mechanics_text}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
  );
}
