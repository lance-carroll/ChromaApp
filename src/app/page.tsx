"use client";

import { useChromaWorkspace } from "@/hooks/useChromaWorkspace";
import { GearList } from "@/components/sheet/GearList";
import {
  Button,
  CollapsibleSection,
  Counter,
  TextEntryList,
} from "@/components/ui";
import {
  colorStyles,
  chromaNames,
  threatBucketByColor,
  threatBucketStyles,
  gradeBonus,
  getGearLabel,
  getGearDetailText,
} from "@/lib/chroma";
import type { ThreatBucket, ThreatPool } from "@/lib/chroma";

export default function Home() {
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
  } = useChromaWorkspace();

  return (
    <main className="min-h-screen bg-[#f7f4ed] text-stone-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="grid gap-4 border border-stone-900 bg-stone-950 px-4 py-5 text-stone-50 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">
              Chroma Word Engine
            </p>
            <div className="mt-2 flex flex-wrap items-end gap-3">
              <h1 className="text-2xl font-black sm:text-4xl">
                Play Surface
              </h1>
              <span className="border border-stone-700 bg-stone-900 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-stone-300">
                {session ? "Saving enabled" : "Local draft mode"}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-stone-300">
              Keep the active post front and center. Everything else can wait offstage until you need it.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            {session ? (
              <button
                type="button"
                className="h-11 border border-stone-700 bg-stone-900 px-4 font-semibold text-stone-100 hover:bg-stone-800"
                onClick={signOut}
                disabled={authBusy}
              >
                Sign out
              </button>
            ) : (
              <button
                type="button"
                className="h-11 border border-red-700 bg-red-700 px-4 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                onClick={signIn}
                disabled={authBusy}
              >
                {authBusy ? "Sending..." : "Send link"}
              </button>
            )}
            <button
              type="button"
              className="h-11 border border-stone-700 bg-stone-900 px-4 font-semibold text-stone-100 hover:bg-stone-800"
              onClick={resetDraft}
            >
              New draft
            </button>
            <button
              type="button"
              className="h-11 border border-red-700 bg-red-700 px-4 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              onClick={saveSheet}
              disabled={saveBusy || !session}
            >
              {saveBusy ? "Saving..." : "Save sheet"}
            </button>
          </div>
        </header>

        {!session ? (
          <section className="grid gap-3 border border-stone-300 bg-white p-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="text-base font-bold">Sign In</h2>
              <p className="mt-1 text-sm text-stone-600">{message}</p>
              <label className="mt-3 grid max-w-md gap-1">
                <span className="text-sm font-semibold text-stone-600">
                  Email
                </span>
                <input
                  className="border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
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
          <section className="grid gap-2 border border-stone-300 bg-white p-3 sm:grid-cols-2">
            <button
              type="button"
              className={`h-11 border px-4 font-semibold ${
                viewMode === "player"
                  ? "border-red-900 bg-red-50 text-red-950"
                  : "border-stone-300 hover:bg-stone-50"
              }`}
              onClick={() => setViewMode("player")}
            >
              Player View
            </button>
            <button
              type="button"
              className={`h-11 border px-4 font-semibold ${
                viewMode === "gm"
                  ? "border-red-900 bg-red-50 text-red-950"
                  : "border-stone-300 hover:bg-stone-50"
              }`}
              onClick={() => setViewMode("gm")}
            >
              GM View
            </button>
          </section>
        ) : null}

        {session ? (
          <section className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            <div className="border border-stone-300 bg-white px-4 py-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
                Active Sheet
              </span>
              <span className="mt-1 block font-semibold text-stone-900">
                {activeSheetLabel}
              </span>
            </div>
            <div className="border border-stone-300 bg-white px-4 py-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
                Campaign
              </span>
              <span className="mt-1 block font-semibold text-stone-900">
                {activeCampaignLabel}
              </span>
            </div>
            <div className="border border-stone-300 bg-white px-4 py-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
                Scene / Beat
              </span>
              <span className="mt-1 block font-semibold text-stone-900">
                {activeSceneLabel} · {activeBeatLabel}
              </span>
            </div>
            <div className="border border-stone-300 bg-white px-4 py-3">
              <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
                Discord
              </span>
              <span className="mt-1 block font-semibold text-stone-900">
                {discordStatusLabel}
              </span>
            </div>
          </section>
        ) : null}

        {session && viewMode === "player" && false ? (
          <CollapsibleSection
            title="Saved Sheets"
            summary={
              characters.length === 0
                ? "No saved characters yet."
                : `${characters.length} saved ${
                    characters.length === 1 ? "character" : "characters"
                  }. ${loadBusy ? "Loading..." : characterId ? "Saved sheet open." : "Draft open."}`
            }
          >
            {characters.length > 0 ? (
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {characters.map((character) => (
                  <button
                    type="button"
                    key={character.id}
                    className={`border px-3 py-3 text-left hover:bg-stone-50 ${
                      character.id === characterId
                        ? "border-red-900 bg-red-50"
                        : "border-stone-300"
                    }`}
                    onClick={() => selectCharacter(character.id)}
                  >
                    <span className="block font-bold">{character.name}</span>
                    <span className="mt-1 block text-sm text-stone-600">
                      {character.concept || "No concept yet"}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </CollapsibleSection>
        ) : null}

        {session && viewMode === "player" && false ? (
          <CollapsibleSection
            title="Campaign Access"
            summary={
              joinedCampaigns.length > 0
                ? `${joinedCampaigns.length} joined ${
                    joinedCampaigns.length === 1 ? "campaign" : "campaigns"
                  }. Use this when you need to join another one.`
                : "Open a saved sheet, enter the GM's invite code, then join."
            }
          >
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="text-base font-bold">Join Campaign</h2>
              <p className="mt-1 text-sm text-stone-600">
                Open a saved sheet, enter the GM&apos;s invite code, then join.
              </p>
              {playerCampaignNotice ? (
                <p className="mt-2 border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-950">
                  {playerCampaignNotice}
                </p>
              ) : null}
              {activeScene ? (
                <p className="mt-2 border border-stone-300 bg-stone-50 px-3 py-2 text-sm text-stone-700">
                  Active scene: {activeScene?.name}
                  {activeBeat ? ` · Beat ${activeBeat?.beat_number}` : ""}
                </p>
              ) : null}
              <label className="mt-3 grid max-w-sm gap-1">
                <span className="text-sm font-semibold text-stone-600">
                  Invite Code
                </span>
                <input
                  className="border border-stone-300 px-3 py-2 uppercase outline-none focus:border-stone-700"
                  value={joinInviteCode}
                  onChange={(event) => setJoinInviteCode(event.target.value)}
                  placeholder="AB12CD34"
                />
              </label>
            </div>
            <button
              type="button"
              className="h-11 border border-red-900 bg-red-900 px-4 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
              onClick={joinCampaignByInvite}
              disabled={!characterId}
            >
              Join With Open Sheet
            </button>
            {joinedCampaigns.length > 0 ? (
              <div className="lg:col-span-2">
                <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                  Joined Campaigns
                </h3>
                <div className="mt-2 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {joinedCampaigns.map((campaign) => (
                    <button
                      type="button"
                      key={`joined-${campaign.id}`}
                      className={`border px-3 py-2 text-left hover:bg-stone-50 ${
                        campaign.id === campaignId
                          ? "border-red-900 bg-red-50"
                          : "border-stone-300"
                      }`}
                      onClick={() => applyCampaign(campaign)}
                    >
                      <span className="block font-bold">{campaign.name}</span>
                      <span className="mt-1 block text-xs text-stone-600">
                        Invite {campaign.invite_code}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            </div>
          </CollapsibleSection>
        ) : null}

        {session && viewMode === "gm" ? (
          <section className="grid gap-4 border border-stone-300 bg-white p-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-base font-bold">Campaign Sheet / GM Tools</h2>
                  <p className="mt-1 text-sm text-stone-600">
                    {campaignNotice || "Create or load the active campaign scene."}
                  </p>
                </div>
                <span className="text-sm font-semibold text-stone-700">
                  {campaignBusy ? "Saving..." : campaignId ? "Campaign open" : "Draft"}
                </span>
              </div>

              {campaigns.length > 0 ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {campaigns.map((campaign) => (
                    <button
                      type="button"
                      key={campaign.id}
                      className={`border px-3 py-2 text-left hover:bg-stone-50 ${
                        campaign.id === campaignId
                          ? "border-red-900 bg-red-50"
                          : "border-stone-300"
                      }`}
                      onClick={() => applyCampaign(campaign)}
                    >
                      <span className="block font-bold">{campaign.name}</span>
                      <span className="mt-1 block text-xs text-stone-600">
                        Invite {campaign.invite_code}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}

              {campaignId ? (
                <div className="mt-4 grid gap-3">
                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-stone-600">
                      Campaign Name
                    </span>
                    <input
                      className="min-w-0 border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                      value={campaignName}
                      onChange={(event) => setCampaignName(event.target.value)}
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-stone-600">
                      Posting Window
                    </span>
                    <input
                      className="min-w-0 border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                      value={postingWindow}
                      onChange={(event) => setPostingWindow(event.target.value)}
                    />
                  </label>
                  <div className="grid gap-2 sm:grid-cols-4">
                    <button
                      type="button"
                      className="h-11 border border-red-900 bg-red-900 px-4 font-semibold text-white hover:bg-red-800"
                      onClick={saveCampaign}
                      disabled={campaignBusy}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="h-11 border border-stone-300 px-4 font-semibold hover:bg-stone-50 disabled:opacity-50"
                      onClick={linkCharacterToCampaign}
                      disabled={!characterId || !campaignId}
                    >
                      Add Open Sheet
                    </button>
                    <button
                      type="button"
                      className="h-11 border border-stone-300 px-4 font-semibold hover:bg-stone-50 disabled:opacity-50"
                      onClick={deleteCampaign}
                      disabled={!campaignId || campaignBusy}
                    >
                      Delete
                    </button>
                    <span className="flex h-11 items-center border border-stone-300 px-3 text-sm text-stone-600">
                      {campaignInviteCode ? `Invite ${campaignInviteCode}` : "Save for invite"}
                    </span>
                  </div>
                  <div className="grid gap-3 border border-stone-200 p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                          Challenge Management
                        </h3>
                        <p className="mt-1 text-sm text-stone-600">
                          Tune the active CR for posting and keep scene defaults in sync.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="h-9 w-9 border border-stone-300 text-lg font-bold hover:bg-stone-50 disabled:opacity-50"
                          onClick={() => setChallengeRating(clampChallengeRating(challengeRating - 1))}
                          disabled={challengeRating <= 7}
                        >
                          -
                        </button>
                        <span className="min-w-16 border border-stone-300 bg-white px-3 py-2 text-center font-mono text-lg font-bold">
                          {challengeRating}
                        </span>
                        <button
                          type="button"
                          className="h-9 w-9 border border-stone-300 text-lg font-bold hover:bg-stone-50 disabled:opacity-50"
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
                        className="h-11 border border-stone-300 px-4 font-semibold hover:bg-stone-50 disabled:opacity-50"
                        onClick={() => setChallengeRating(campaignDefaultCr)}
                      >
                        Use Campaign Default ({campaignDefaultCr})
                      </button>
                      <button
                        type="button"
                        className="h-11 border border-stone-300 px-4 font-semibold hover:bg-stone-50 disabled:opacity-50"
                        onClick={() =>
                          setChallengeRating(activeScene?.default_cr ?? campaignDefaultCr)
                        }
                      >
                        Use Scene Default ({activeScene?.default_cr ?? campaignDefaultCr})
                      </button>
                      <button
                        type="button"
                        className="h-11 border border-stone-900 bg-stone-900 px-4 font-semibold text-white hover:bg-stone-700 disabled:opacity-50"
                        onClick={() => void saveCampaignChallengeRating(challengeRating)}
                      >
                        Save Campaign Default
                      </button>
                      <button
                        type="button"
                        className="h-11 border border-stone-900 bg-stone-900 px-4 font-semibold text-white hover:bg-stone-700 disabled:opacity-50"
                        onClick={() => void saveSceneChallengeRating(challengeRating)}
                        disabled={!sceneId}
                      >
                        Save Scene Default
                      </button>
                    </div>
                  </div>
                  <div className="border border-stone-200 p-3">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                      Current Roster
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      Characters linked to this campaign. Click one to edit marks and wounds.
                    </p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {activeCampaignCharacters.length === 0 ? (
                        <span className="text-sm text-stone-600 sm:col-span-2 xl:col-span-3">
                          No sheets linked yet.
                        </span>
                      ) : (
                        activeCampaignCharacters.map((character) => (
                          <button
                            type="button"
                            key={`linked-${character.id}`}
                            className={`border px-3 py-2 text-left hover:bg-stone-50 ${
                              campaignTargetCharacterId === character.id
                                ? "border-red-900 bg-red-50"
                                : "border-stone-300 bg-stone-50"
                            }`}
                            onClick={() => setCampaignTargetCharacterId(character.id)}
                          >
                            <span className="block text-sm font-bold">
                              {character.name}
                            </span>
                            <span className="mt-1 block text-xs text-stone-600">
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
                          <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                            Condition Editor
                          </h3>
                          <p className="mt-1 text-sm text-stone-600">
                            Editing marks and wounds for {activeCampaignTargetCharacter.name}.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="h-10 border border-stone-300 px-3 text-sm font-semibold hover:bg-stone-50"
                            onClick={() => {
                              setCampaignTargetMarks(activeCampaignTargetCharacter.marks ?? []);
                              setCampaignTargetWounds(activeCampaignTargetCharacter.wounds ?? []);
                            }}
                          >
                            Reset
                          </button>
                          <button
                            type="button"
                            className="h-10 border border-red-900 bg-red-900 px-3 text-sm font-semibold text-white hover:bg-red-800"
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
                <div className="mt-4 grid gap-3 border border-stone-200 bg-stone-50 p-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                      No Campaign Open
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      Select a campaign above, or open a draft when you&apos;re ready to create a new one.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="h-11 border border-stone-900 bg-stone-900 px-4 font-semibold text-white hover:bg-stone-700"
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
                        <span className="text-sm font-semibold text-stone-600">
                          Campaign Name
                        </span>
                        <input
                          className="min-w-0 border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                          value={campaignName}
                          onChange={(event) => setCampaignName(event.target.value)}
                        />
                      </label>
                      <label className="grid gap-1">
                        <span className="text-sm font-semibold text-stone-600">
                          Posting Window
                        </span>
                        <input
                          className="min-w-0 border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                          value={postingWindow}
                          onChange={(event) => setPostingWindow(event.target.value)}
                        />
                      </label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <button
                          type="button"
                          className="h-11 border border-red-900 bg-red-900 px-4 font-semibold text-white hover:bg-red-800"
                          onClick={saveCampaign}
                          disabled={campaignBusy}
                        >
                          Save Draft
                        </button>
                        <button
                          type="button"
                          className="h-11 border border-stone-300 px-4 font-semibold hover:bg-stone-50"
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
                  <div className="grid gap-3 border border-stone-200 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                        Scenes And Beats
                      </h3>
                      <span className="text-sm text-stone-600">
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
                                ? "border-red-900 bg-red-50"
                                : "border-stone-300"
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
                                <span className="mt-1 block text-xs text-stone-600">
                                  {campaignBeats.filter((beat) => beat.scene_id === scene.id).length} beats
                                </span>
                              </button>
                              <button
                                type="button"
                                className="h-8 border border-stone-300 px-3 text-xs font-semibold hover:bg-stone-50"
                                onClick={() => setActiveScene(scene.id)}
                              >
                                Set Active
                              </button>
                            </div>
                            {scene.is_active ? (
                              <span className="text-xs font-semibold uppercase tracking-wide text-red-700">
                                Active
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <label className="grid gap-1">
                      <span className="text-sm font-semibold text-stone-600">
                        Scene Name
                      </span>
                      <input
                        className="min-w-0 border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                        value={sceneName}
                        onChange={(event) => setSceneName(event.target.value)}
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-sm font-semibold text-stone-600">
                        Scene Summary
                      </span>
                      <textarea
                        className="min-h-20 resize-y border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                        value={sceneSummary}
                        onChange={(event) => setSceneSummary(event.target.value)}
                      />
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        className="h-11 border border-red-900 bg-red-900 px-4 font-semibold text-white hover:bg-red-800"
                        onClick={saveScene}
                      >
                        Save Scene
                      </button>
                      <button
                        type="button"
                        className="h-11 border border-stone-300 px-4 font-semibold hover:bg-stone-50"
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
                      <span className="text-sm font-semibold text-stone-600">
                        Beat Number
                      </span>
                      <input
                        className="min-w-0 border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                        type="number"
                        min={1}
                        value={beatNumber}
                        onChange={(event) => setBeatNumber(Number(event.target.value))}
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-sm font-semibold text-stone-600">
                        Active Beat Prompt
                      </span>
                      <textarea
                        className="min-h-20 resize-y border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                        value={beatPrompt}
                        onChange={(event) => setBeatPrompt(event.target.value)}
                      />
                    </label>
                    {campaignBeats.filter((beat) => beat.scene_id === sceneId).length > 0 ? (
                      <div className="grid gap-2">
                        <h4 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                          Beats In Scene
                        </h4>
                        {campaignBeats
                          .filter((beat) => beat.scene_id === sceneId)
                          .map((beat) => (
                            <div
                              key={beat.id}
                              className={`grid gap-2 border px-3 py-2 ${
                                beat.id === beatId
                                  ? "border-red-900 bg-red-50"
                                  : "border-stone-300"
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
                                  <span className="mt-1 block text-xs text-stone-600">
                                    {beat.prompt || "No prompt yet"}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  className="h-8 border border-stone-300 px-3 text-xs font-semibold hover:bg-stone-50"
                                  onClick={() => setActiveBeat(beat.id)}
                                >
                                  Set Active
                                </button>
                              </div>
                              {beat.is_active ? (
                                <span className="text-xs font-semibold uppercase tracking-wide text-red-700">
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
                        className="h-11 border border-stone-900 bg-stone-900 px-4 font-semibold text-white hover:bg-stone-700 disabled:opacity-50"
                        onClick={beatId ? saveBeat : createBeat}
                        disabled={!sceneId}
                      >
                        {beatId ? "Save Beat" : "Create Next Beat"}
                      </button>
                      <button
                        type="button"
                        className="h-11 border border-stone-300 px-4 font-semibold hover:bg-stone-50 disabled:opacity-50"
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
              <div className="border border-stone-200 p-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                    Scene Words For Active Scene
                  </h3>
                  <button
                    type="button"
                    className="h-9 border border-stone-300 px-3 text-sm font-semibold hover:bg-stone-50"
                    onClick={addSceneWord}
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3 grid gap-2">
                      {campaignSceneWords.length === 0 ? (
                    <p className="text-sm text-stone-600">No scene words yet.</p>
                  ) : (
                    campaignSceneWords.map((entry) => (
                      <div key={entry.id} className="grid gap-2 sm:grid-cols-[1fr_130px_40px]">
                        <input
                          className="min-w-0 border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                          value={entry.word}
                          onChange={(event) =>
                            updateSceneWord(entry.id, { word: event.target.value })
                          }
                          placeholder="gate, crown, rain"
                        />
                        <select
                          className="min-w-0 border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
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
                          className="h-10 border border-stone-300 hover:bg-stone-50"
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

              <div className="border border-stone-200 p-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
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

              <div className="border border-stone-200 p-3 lg:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                      Post Queue
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      Pending and resolved posts for the current campaign.
                    </p>
                  </div>
                  <span className="text-sm text-stone-600">
                    {visibleCampaignPosts.length} posts
                  </span>
                </div>
                <div className="mt-3 grid gap-2">
                  {visibleCampaignPosts.length === 0 ? (
                    <p className="text-sm text-stone-600">No posts queued yet.</p>
                  ) : (
                    visibleCampaignPosts.map((post) => (
                      <div key={post.id} className="grid gap-2 border border-stone-300 bg-stone-50 p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-bold uppercase tracking-wide text-stone-700">
                            {post.post_type}
                          </span>
                          <span
                            className={`text-xs font-semibold uppercase tracking-wide ${
                              post.status === "pending"
                                ? "text-amber-700"
                                : post.status === "resolved"
                                  ? "text-emerald-700"
                                  : "text-rose-700"
                            }`}
                          >
                            {post.status}
                          </span>
                        </div>
                        <p className="text-sm text-stone-800">{post.post_summary}</p>
                        <pre className="whitespace-pre-wrap border border-stone-200 bg-white px-3 py-2 font-mono text-xs text-stone-800">
                          {post.mechanics_text}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {viewMode === "player" ? (
          <>
        <section className="border border-stone-300 bg-white p-4">
          <div className="flex flex-col gap-3 border-b border-stone-200 pb-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-700">
                  Active Turn
                </p>
                <h2 className="mt-1 text-xl font-black text-stone-950">
                  Compose Post
                </h2>
                <p className="mt-1 text-sm text-stone-600">
                  Build the move, choose the words that fuel it, then queue the finished post.
                </p>
              </div>
              <div className="grid gap-2 text-sm sm:grid-cols-3">
                <div className="border border-stone-300 bg-stone-50 px-3 py-2">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                    Character
                  </span>
                  <span className="mt-1 block font-semibold text-stone-900">
                    {activeSheetLabel}
                  </span>
                </div>
                <div className="border border-stone-300 bg-stone-50 px-3 py-2">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                    Campaign
                  </span>
                  <span className="mt-1 block font-semibold text-stone-900">
                    {activeCampaignLabel}
                  </span>
                </div>
                <div className="border border-stone-300 bg-stone-50 px-3 py-2">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-stone-500">
                    Scene
                  </span>
                  <span className="mt-1 block font-semibold text-stone-900">
                    {activeSceneLabel} · {activeBeatLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-stone-200 bg-[#fcfaf6] p-4">
            <h3 className="text-base font-bold">Build</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Button
                onClick={() => changePostType("act")}
                selected={postType === "act"}
              >
                Act
              </Button>
              <Button
                onClick={() => changePostType("breathe")}
                selected={postType === "breathe"}
              >
                Breathe
              </Button>
              <Button
                onClick={() => changePostType("setup")}
                selected={postType === "setup"}
              >
                Setup
              </Button>
              <Button
                onClick={() => changePostType("ghost")}
                selected={postType === "ghost"}
              >
                Ghost
              </Button>
            </div>

            {postType === "act" || postType === "setup" ? (
              <div className="mt-4 grid gap-3 border border-stone-200 bg-white p-3">
                {postType === "act" ? (
                  <>
                    {!hasAvailableRecipes ? (
                      <p className="border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-950">
                        No recipes are assigned to this character yet. Add one in Workspace.
                      </p>
                    ) : null}
                    <label className="grid gap-1">
                      <span className="text-sm font-semibold text-stone-700">
                        Recipe
                      </span>
                      <select
                        className="min-w-0 border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
                        value={selectedRecipeId || availableRecipes[0]?.id || ""}
                        onChange={(event) => setSelectedRecipeId(event.target.value)}
                        disabled={!hasAvailableRecipes}
                      >
                        {availableRecipes.map((recipe) => (
                          <option key={recipe.id} value={recipe.id}>
                            {recipe.name} - {recipe.family}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                      <div className="border border-stone-300 bg-stone-50 p-3 text-sm text-stone-700">
                        <p className="font-bold">{selectedRecipe.family}</p>
                        <p className="mt-1">
                          Tags: {selectedRecipe.coreTags.join(", ")}
                        </p>
                        <p className="mt-1">
                          Chroma: {selectedRecipe.chroma.join(" + ")}
                        </p>
                      </div>
                      <label className="grid gap-1">
                        <span className="text-sm font-semibold text-stone-700">
                          CR
                        </span>
                        <input
                          className="min-w-0 border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
                          type="number"
                          min={7}
                          max={15}
                          value={challengeRating}
                          onChange={(event) =>
                            setChallengeRating(Number(event.target.value))
                          }
                        />
                      </label>
                    </div>
                    <div className="grid gap-2 text-sm text-stone-700 sm:grid-cols-3">
                      <span className="border border-stone-300 bg-stone-50 px-3 py-2">
                        Core: {isCoreEligible ? "eligible" : "not eligible"}
                      </span>
                      <span className="border border-stone-300 bg-stone-50 px-3 py-2">
                        Chroma: {matchedChromaCount}/{selectedRecipe.chroma.length}
                      </span>
                      <span className="border border-stone-300 bg-stone-50 px-3 py-2">
                        Grade: {actGrade} +{gradeBonus[actGrade]}
                      </span>
                    </div>
                  </>
                ) : null}
                {postType === "setup" ? (
                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-stone-700">
                      Setup Word
                    </span>
                    <input
                      className="min-w-0 border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
                      value={setupWord}
                      onChange={(event) => setSetupWord(event.target.value)}
                      placeholder="marked path, braced door, held chain"
                    />
                  </label>
                ) : null}
                {postType === "act" ? (
                  <>
                    <span className="border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-800">
                      Act spends 1 Focus
                    </span>
                    <label className="flex items-center gap-3 text-sm font-semibold text-stone-800">
                      <input
                        type="checkbox"
                        checked={spendThreadWithPost}
                        onChange={(event) =>
                          setSpendThreadWithPost(event.target.checked)
                        }
                        disabled={
                          thread === 0 ||
                          matchedChromaCount < selectedRecipe.chroma.length
                        }
                      />
                      Spend 1 Thread to Heighten
                    </label>
                  </>
                ) : null}
                {postType === "act" || postType === "setup" ? (
                  <>
                    <div className="grid gap-3 border border-stone-300 bg-stone-50 p-3 sm:grid-cols-[1fr_160px]">
                      <label className="grid gap-1">
                        <span className="text-sm font-semibold text-stone-700">
                          Scene Word
                        </span>
                        <input
                          className="min-w-0 border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                          value={sceneWord}
                          onChange={(event) => setSceneWord(event.target.value)}
                          placeholder="mercy, gate, crown"
                        />
                      </label>
                      <label className="grid gap-1">
                        <span className="text-sm font-semibold text-stone-700">
                          Chroma
                        </span>
                        <select
                          className="min-w-0 border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
                          value={sceneWordColor}
                          onChange={(event) => setSceneWordColor(event.target.value)}
                        >
                          {Object.keys(colorStyles).map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </label>
                      <p className="text-sm text-stone-600 sm:col-span-2">
                        Scene Words can satisfy one Chroma requirement per post and
                        are not consumed.
                      </p>
                      {visibleSceneWords.length > 0 ? (
                        <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
                          {visibleSceneWords
                            .filter((entry) => entry.word.trim())
                            .map((entry) => (
                              <button
                                type="button"
                                key={`scene-select-${entry.id}`}
                                className={`border px-3 py-2 text-left text-sm font-semibold hover:brightness-95 ${colorStyles[entry.color]}`}
                                onClick={() => {
                                  setSceneWord(entry.word);
                                  setSceneWordColor(entry.color);
                                }}
                              >
                                <span className="block">{entry.word}</span>
                                <span className="text-xs uppercase">
                                  {entry.color}
                                </span>
                              </button>
                            ))}
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}

            {postType === "ghost" ? (
              <div className="mt-4 grid gap-3 border border-stone-200 bg-white p-3">
                <label className="grid gap-1">
                  <span className="text-sm font-semibold text-stone-700">
                    Ghost Intent
                  </span>
                  <textarea
                    className="min-h-20 resize-y border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
                    value={ghostIntent}
                    onChange={(event) => setGhostIntent(event.target.value)}
                    placeholder="follows the group and keeps watch"
                  />
                </label>
              </div>
            ) : null}

            {postType === "breathe" ? (
              <div className="mt-4 grid gap-3 border border-stone-200 bg-white p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  onClick={() => setBreatheChoice("focus")}
                  selected={breatheChoice === "focus"}
                >
                  Recover Focus
                </Button>
                <Button
                  onClick={() => setBreatheChoice("draw")}
                  disabled={deck.length === 0 || hand.length >= 4}
                  selected={breatheChoice === "draw"}
                >
                  Draw Card
                </Button>
                </div>
                {breatheChoice === "focus" ? (
                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-stone-700">
                      Threat Bucket Source Color
                    </span>
                    <select
                      className="min-w-0 border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
                      value={breatheColor}
                      onChange={(event) => setBreatheColor(event.target.value)}
                    >
                      {chromaNames.map((color) => (
                        <option key={color} value={color}>
                          {color} {"->"} {threatBucketByColor[color]}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </div>
            ) : null}

          </div>

          <div className="border border-stone-200 bg-[#fcfaf6] p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold">Fuel</h3>
                <p className="mt-1 text-sm text-stone-600">
                  Select the Core Word, Card Words, and Gear Words your post is using.
                </p>
              </div>
              <span className="text-sm font-semibold text-stone-700">
                {hand.length} cards in hand
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                Core Words
              </h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {coreWords.map((coreWord) => (
                  <button
                    type="button"
                    key={`builder-core-${coreWord.id}`}
                    className={`border px-3 py-2 text-left hover:bg-stone-50 ${
                      selectedCoreWordId === coreWord.id
                        ? "border-red-900 bg-red-50"
                        : "border-stone-300 bg-white"
                    }`}
                    onClick={() =>
                      setSelectedCoreWordId(
                        selectedCoreWordId === coreWord.id ? null : coreWord.id,
                      )
                    }
                    disabled={postType !== "act"}
                  >
                    <span className="block font-bold">{coreWord.word}</span>
                    <span className="mt-1 block text-xs text-stone-600">
                      {coreWord.tags}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                Hand
              </h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {hand.length === 0 ? (
                <p className="text-sm text-stone-600">No cards in hand.</p>
              ) : (
                hand.map((card) => (
                  <button
                    type="button"
                    key={`builder-card-${card.word}`}
                    className={`border px-3 py-2 text-left font-semibold hover:brightness-95 ${
                      selectedCardWords.includes(card.word)
                        ? "ring-2 ring-red-900"
                        : ""
                    } ${colorStyles[card.color]}`}
                    onClick={() => toggleSelectedCard(card.word)}
                    disabled={postType === "breathe" || postType === "ghost"}
                  >
                    <span className="block">{card.word}</span>
                    <span className="text-xs uppercase">{card.color}</span>
                  </button>
                ))
              )}
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                Gear
              </h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {gear.length === 0 ? (
                  <p className="text-sm text-stone-600">No gear listed.</p>
                ) : (
                  gear.map((entry) => (
                    <button
                      type="button"
                      key={`builder-gear-${entry.id}`}
                      className={`border px-3 py-2 text-left hover:bg-stone-50 ${
                        selectedGearIds.includes(entry.id)
                          ? "border-red-900 bg-red-50"
                          : "border-stone-300 bg-white"
                      }`}
                      onClick={() => toggleSelectedGear(entry.id)}
                      disabled={postType === "breathe" || postType === "ghost"}
                    >
                      <span className="block text-sm font-semibold">
                        {getGearLabel(entry)}
                      </span>
                      <span className="mt-1 block text-xs text-stone-600">
                        {getGearDetailText(entry) || "No tags or tracked state"}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="border border-stone-900 bg-stone-950 p-4 text-stone-50 xl:col-span-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-bold">Review And Queue</h3>
                <p className="mt-1 text-sm text-stone-300">
                  Confirm the post after you finish selecting words and gear.
                </p>
              </div>
            </div>
            <div className="mt-4 border border-stone-700 bg-stone-900 p-3">
              <p className="text-sm font-semibold text-stone-200">Preview</p>
              <p className="mt-1 text-sm text-stone-100">{postSummary()}</p>
              {builderNotice ? (
                <p className="mt-3 border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm font-semibold text-yellow-950">
                  {builderNotice}
                </p>
              ) : null}
              {mechanicsSummary ? (
                <div className="mt-3 border border-stone-400 bg-white">
                  <div className="flex items-center justify-between gap-3 border-b border-stone-300 px-3 py-2">
                    <p className="text-sm font-bold text-stone-800">
                      Generated Mechanics
                    </p>
                    <button
                      type="button"
                      className="border border-stone-300 px-3 py-1 text-sm font-semibold hover:bg-stone-50"
                      onClick={copyMechanicsSummary}
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap px-3 py-2 font-mono text-sm text-stone-800">
                    {mechanicsSummary}
                  </pre>
                </div>
              ) : null}
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="h-11 border border-stone-600 bg-stone-900 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800"
                  onClick={clearPostBuilder}
                >
                  Clear
                </button>
                {mechanicsSummary ? (
                  <button
                    type="button"
                    className="h-11 border border-stone-600 bg-stone-900 px-4 text-sm font-semibold text-stone-100 hover:bg-stone-800"
                    onClick={editGeneratedPost}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    className="h-11 border border-red-900 bg-red-900 px-4 text-sm font-semibold text-white hover:bg-red-800"
                    onClick={submitPost}
                  >
                    Queue Post
                  </button>
                )}
              </div>
            </div>
          </div>
          </div>
        </section>

        <CollapsibleSection
          title="Submitted Posts"
          summary={`${
            visiblePlayerPosts.length === 0
              ? "No queued posts."
              : `${visiblePlayerPosts.length} queued ${
                  visiblePlayerPosts.length === 1 ? "post" : "posts"
                }`
          } Pending posts queued from this account for Discord resolution.`}
        >
          <div className="grid gap-2">
            {visiblePlayerPosts.length === 0 ? (
              <p className="text-sm text-stone-600">No submitted posts yet.</p>
            ) : (
              visiblePlayerPosts.map((post) => (
                <div key={post.id} className="grid gap-2 border border-stone-300 bg-stone-50 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="grid gap-1">
                      <span className="text-sm font-bold uppercase tracking-wide text-stone-700">
                        {post.post_type}
                      </span>
                      <span className="text-xs text-stone-600">{post.id}</span>
                      <span className="text-xs text-stone-600">
                        {getCharacterLabel(post.character_id)} in {getCampaignLabel(post.campaign_id)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          post.status === "pending"
                            ? "text-amber-700"
                            : post.status === "resolved"
                              ? "text-emerald-700"
                              : "text-rose-700"
                        }`}
                      >
                        {post.status}
                      </span>
                      <button
                        type="button"
                        className="h-8 border border-stone-300 px-3 text-xs font-semibold hover:bg-stone-50"
                        onClick={() => copyDiscordPostSnippet(post)}
                      >
                        Copy Post
                      </button>
                      <button
                        type="button"
                        className="h-8 border border-rose-300 px-3 text-xs font-semibold text-rose-800 hover:bg-rose-50"
                        onClick={() => cancelQueuedPost(post)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-stone-800">{post.post_summary}</p>
                  <pre className="whitespace-pre-wrap border border-stone-200 bg-white px-3 py-2 font-mono text-xs text-stone-800">
                    {post.mechanics_text}
                  </pre>
                </div>
              ))
            )}
          </div>
        </CollapsibleSection>

        {session ? (
          <CollapsibleSection
            title="Workspace"
            summary="Sheets, campaign access, and Discord linking live here when you need them."
          >
            <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="grid gap-4">
                <section className="border border-stone-300 bg-stone-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-base font-bold">Saved Sheets</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        {characters.length === 0
                          ? "No saved characters yet."
                          : `${characters.length} saved ${
                              characters.length === 1 ? "character" : "characters"
                            }`}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-stone-700">
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
                              ? "border-red-900 bg-red-50"
                              : "border-stone-300 bg-white"
                          }`}
                          onClick={() => selectCharacter(character.id)}
                        >
                          <span className="block font-bold">{character.name}</span>
                          <span className="mt-1 block text-sm text-stone-600">
                            {character.concept || "No concept yet"}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </section>

                <section className="border border-stone-300 bg-stone-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-bold">Campaign Access</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        Open a saved sheet, enter the GM&apos;s invite code, then join.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="h-11 border border-red-900 bg-red-900 px-4 font-semibold text-white hover:bg-red-800 disabled:opacity-50"
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
                    <span className="text-sm font-semibold text-stone-600">
                      Invite Code
                    </span>
                    <input
                      className="border border-stone-300 bg-white px-3 py-2 uppercase outline-none focus:border-stone-700"
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
                              ? "border-red-900 bg-red-50"
                              : "border-stone-300 bg-white"
                          }`}
                          onClick={() => applyCampaign(campaign)}
                        >
                          <span className="block font-bold">{campaign.name}</span>
                          <span className="mt-1 block text-xs text-stone-600">
                            Invite {campaign.invite_code}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </section>

                <section className="border border-stone-300 bg-stone-50 p-4">
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="text-base font-bold">Recipe Library</h3>
                      <p className="mt-1 text-sm text-stone-600">
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
                        className="border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
                        value={newRecipeName}
                        onChange={(event) => setNewRecipeName(event.target.value)}
                        placeholder="Recipe name"
                      />
                      <input
                        className="border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
                        value={newRecipeFamily}
                        onChange={(event) => setNewRecipeFamily(event.target.value)}
                        placeholder="Family"
                      />
                      <input
                        className="border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700 md:col-span-2"
                        value={newRecipeCoreTags}
                        onChange={(event) => setNewRecipeCoreTags(event.target.value)}
                        placeholder="Core tags: violence, oath, passage"
                      />
                      <input
                        className="border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700 md:col-span-2"
                        value={newRecipeChroma}
                        onChange={(event) => setNewRecipeChroma(event.target.value)}
                        placeholder="Chroma: Red, Gold"
                      />
                      <textarea
                        className="min-h-20 border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
                        value={newRecipeHit}
                        onChange={(event) => setNewRecipeHit(event.target.value)}
                        placeholder="Hit"
                      />
                      <textarea
                        className="min-h-20 border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
                        value={newRecipeStrongHit}
                        onChange={(event) => setNewRecipeStrongHit(event.target.value)}
                        placeholder="Strong hit"
                      />
                      <textarea
                        className="min-h-20 border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700 md:col-span-2"
                        value={newRecipeMiss}
                        onChange={(event) => setNewRecipeMiss(event.target.value)}
                        placeholder="Miss"
                      />
                    </div>
                    <button
                      type="button"
                      className="h-10 border border-stone-900 bg-stone-900 px-4 text-sm font-semibold text-white hover:bg-stone-700"
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
                            className="grid gap-2 border border-stone-300 bg-white p-3"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <span className="block font-bold">{recipe.name}</span>
                                <span className="mt-1 block text-xs text-stone-600">
                                  {recipe.family || "Unfiled"} · {(recipe.core_tags ?? []).join(", ")}
                                </span>
                              </div>
                              <button
                                type="button"
                                className={`h-9 border px-3 text-xs font-semibold ${
                                  assigned
                                    ? "border-rose-300 text-rose-800 hover:bg-rose-50"
                                    : "border-stone-300 hover:bg-stone-50"
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
                            <p className="text-xs text-stone-700">
                              Chroma: {(recipe.chroma ?? []).join(" + ")}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>

                <section className="border border-stone-300 bg-stone-50 p-4">
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="text-base font-bold">Card Library</h3>
                      <p className="mt-1 text-sm text-stone-600">
                        Create custom cards and add them to this character&apos;s deck.
                      </p>
                    </div>
                    <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_140px]">
                      <input
                        className="border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
                        value={newCardWord}
                        onChange={(event) => setNewCardWord(event.target.value)}
                        placeholder="Card word"
                      />
                      <select
                        className="border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700"
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
                        className="border border-stone-300 bg-white px-3 py-2 outline-none focus:border-stone-700 md:col-span-2"
                        value={newCardTags}
                        onChange={(event) => setNewCardTags(event.target.value)}
                        placeholder="Tags: omen, prophecy, warning"
                      />
                    </div>
                    <button
                      type="button"
                      className="h-10 border border-stone-900 bg-stone-900 px-4 text-sm font-semibold text-white hover:bg-stone-700"
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
                            className="flex flex-wrap items-center justify-between gap-2 border border-stone-300 bg-white p-3"
                          >
                            <div>
                              <span className="block font-bold">{card.word}</span>
                              <span className="mt-1 block text-xs text-stone-600">
                                {card.color} · {(card.tags ?? []).join(", ")}
                              </span>
                            </div>
                            <button
                              type="button"
                              className={`h-9 border px-3 text-xs font-semibold ${
                                inDeck
                                  ? "border-rose-300 text-rose-800 hover:bg-rose-50"
                                  : "border-stone-300 hover:bg-stone-50"
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

              <section className="border border-stone-300 bg-stone-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-bold">Discord Link</h3>
                    <p className="mt-1 text-sm text-stone-600">
                      {discordProfile?.discord_username
                        ? `Linked as ${discordProfile.discord_username}. Generate a fresh code only when you need it.`
                        : "Generate a one-time code here, then run /account link in Discord."}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="h-11 border border-stone-900 bg-stone-900 px-4 font-semibold text-white hover:bg-stone-700 disabled:opacity-60"
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
                  <div className="border border-stone-300 bg-white px-3 py-2 text-sm">
                    <span className="block font-semibold text-stone-600">Discord account</span>
                    <span className="mt-1 block font-semibold text-stone-900">
                      {discordProfile?.discord_username || "Not linked yet"}
                    </span>
                  </div>
                  <div className="border border-stone-300 bg-white px-3 py-2 text-sm">
                    <span className="block font-semibold text-stone-600">Link code</span>
                    <span className="mt-1 block font-mono font-semibold text-stone-900">
                      {linkCode
                        ? `${linkCode.code}${linkCode.claimed_at ? " (claimed)" : ""}`
                        : "Generate a code"}
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </CollapsibleSection>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-stone-300 bg-white p-4">
            <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,180px)]">
              <label className="grid min-w-0 gap-1">
                <span className="text-sm font-semibold text-stone-600">Name</span>
                <input
                  className="min-w-0 border border-stone-300 px-3 py-2 text-2xl font-bold outline-none focus:border-stone-700"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label className="grid min-w-0 gap-1">
                <span className="text-sm font-semibold text-stone-600">
                  Pronouns
                </span>
                <input
                  className="min-w-0 border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                  value={pronouns}
                  onChange={(event) => setPronouns(event.target.value)}
                />
              </label>
            </div>
            <label className="mt-3 grid gap-1">
              <span className="text-sm font-semibold text-stone-600">Concept</span>
              <textarea
                className="min-h-20 resize-y border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                value={concept}
                onChange={(event) => setConcept(event.target.value)}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Counter label="Focus" value={focus} max={3} setValue={setFocus} />
            <Counter label="Thread" value={thread} max={3} setValue={setThread} />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-stone-300 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-bold">Core Words</h2>
              <span className="text-sm text-stone-600">{coreWords.length}/4</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {coreWords.map((coreWord) => (
                <div key={coreWord.id} className="grid gap-2 border border-stone-200 p-3">
                  <input
                    className="border border-stone-300 px-3 py-2 font-bold outline-none focus:border-stone-700"
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
                    className="border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-700"
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
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <label className="grid gap-1 border border-stone-300 bg-white p-4">
              <span className="text-base font-bold">Tie</span>
              <textarea
                className="min-h-24 resize-y border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                value={tie}
                onChange={(event) => setTie(event.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <TextEntryList
            title="Marks"
            items={marks}
            setItems={setMarks}
            placeholder="shaken, watched, off-balance"
          />
          <TextEntryList
            title="Wounds"
            items={wounds}
            setItems={setWounds}
            placeholder="black ash, red hunger"
          />
        </section>

        <CollapsibleSection
          title="Gear"
          summary={`${gear.length} listed ${gear.length === 1 ? "item" : "items"}.`}
        >
          <GearList items={gear} setItems={setGear} />
        </CollapsibleSection>

        <CollapsibleSection
          title="Cards"
          summary={`${hand.length}/4 in hand, ${deck.length} in deck, ${discard.length} discarded.`}
        >
          <section className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
            <div className="border border-stone-300 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold">Hand</h2>
                <span className="text-sm text-stone-600">{hand.length}/4</span>
              </div>
              <div className="grid gap-2">
                {hand.map((card) => (
                  <button
                    type="button"
                    key={card.word}
                    className={`flex items-center justify-between border px-3 py-2 text-left font-semibold ${colorStyles[card.color]}`}
                    onClick={() => discardCard(card.word)}
                  >
                    <span>{card.word}</span>
                    <span className="text-xs uppercase">{card.color}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-stone-300 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-base font-bold">Deck</h2>
                <button
                  type="button"
                  className="h-9 border border-stone-300 px-3 text-sm font-semibold hover:bg-stone-50"
                  onClick={drawCard}
                >
                  Draw
                </button>
              </div>
              <p className="font-mono text-4xl font-black">{deck.length}</p>
              <p className="mt-2 text-sm text-stone-600">Cards remaining</p>
            </div>

            <div className="border border-stone-300 bg-white p-4">
              <h2 className="mb-3 text-base font-bold">Discard</h2>
              <div className="flex flex-wrap gap-2">
                {discard.length === 0 ? (
                  <p className="text-sm text-stone-600">No cards discarded.</p>
                ) : (
                  discard.map((card) => (
                    <span
                      key={card.word}
                      className={`border px-2 py-1 text-sm ${colorStyles[card.color]}`}
                    >
                      {card.word}
                    </span>
                  ))
                )}
              </div>
            </div>
          </section>
        </CollapsibleSection>

        <details className="border border-stone-300 bg-[#191714] p-4 text-stone-50">
          <summary className="cursor-pointer font-bold">Current sheet payload</summary>
          <pre className="mt-4 max-h-80 overflow-auto text-xs leading-5">
            {JSON.stringify(sheetJson, null, 2)}
          </pre>
        </details>
          </>
        ) : null}
      </div>
    </main>
  );
}
