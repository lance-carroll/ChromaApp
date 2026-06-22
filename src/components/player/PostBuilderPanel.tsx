"use client";

import type { ChromaWorkspace } from "@/hooks/useChromaWorkspace";
import { Button, CollapsibleSection, Surface } from "@/components/ui";
import {
  chromaNames,
  colorStyles,
  getGearDetailText,
  getGearLabel,
  gradeBonus,
  postTypeTones,
  threatBucketByColor,
  toneColorVars,
} from "@/lib/chroma";
import type { PostType } from "@/lib/chroma";

const postTypeLabels: Record<PostType, string> = {
  act: "Act",
  breathe: "Breathe",
  setup: "Setup",
  ghost: "Ghost",
};

export function PostBuilderPanel(w: ChromaWorkspace) {
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
    actFreeform,
    setActFreeform,
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
    requiredChromaCount,
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
        <Surface as="section">
          <div className="flex flex-col gap-3 border-b border-border pb-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                  Active Turn
                </p>
                <h2 className="mt-1 text-xl font-black text-foreground">
                  Compose Post
                </h2>
                <p className="mt-1 text-sm text-foreground/70">
                  Build the move, choose the words that fuel it, then queue the finished post.
                </p>
              </div>
              <div className="grid gap-2 text-sm sm:grid-cols-3">
                <div className="border border-border bg-surface-muted px-3 py-2">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-foreground/60">
                    Character
                  </span>
                  <span className="mt-1 block font-semibold text-foreground">
                    {activeSheetLabel}
                  </span>
                </div>
                <div className="border border-border bg-surface-muted px-3 py-2">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-foreground/60">
                    Campaign
                  </span>
                  <span className="mt-1 block font-semibold text-foreground">
                    {activeCampaignLabel}
                  </span>
                </div>
                <div className="border border-border bg-surface-muted px-3 py-2">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-foreground/60">
                    Scene
                  </span>
                  <span className="mt-1 block font-semibold text-foreground">
                    {activeSceneLabel} · {activeBeatLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-border bg-[#fcfaf6] p-4">
            <h3 className="text-lg font-bold">Build</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {(Object.keys(postTypeLabels) as PostType[]).map((type) => {
                const isSelected = postType === type;
                const tone = toneColorVars[postTypeTones[type]];

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => changePostType(type)}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3.5 py-2 text-sm font-semibold tracking-tight transition-all duration-150 active:translate-y-px"
                    style={
                      isSelected
                        ? {
                            borderColor: tone,
                            backgroundColor: `color-mix(in srgb, ${tone} 16%, transparent)`,
                            color: tone,
                          }
                        : {
                            borderColor: "var(--color-border)",
                            backgroundColor: "var(--color-surface)",
                            color: "var(--color-foreground)",
                          }
                    }
                  >
                    {postTypeLabels[type]}
                  </button>
                );
              })}
            </div>

            {postType === "act" || postType === "setup" ? (
              <div className="mt-4 grid gap-3 border border-border bg-white p-3">
                {postType === "act" ? (
                  <>
                    <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
                      <input
                        type="checkbox"
                        checked={actFreeform}
                        onChange={(event) => setActFreeform(event.target.checked)}
                      />
                      Act without a Recipe
                    </label>
                    {actFreeform ? (
                      <p className="border border-border bg-surface-muted px-3 py-2 text-sm text-foreground/70">
                        Freeform Act: any Core Word works, and one matching Chroma source
                        completes the post.
                      </p>
                    ) : (
                      <>
                        {!hasAvailableRecipes ? (
                          <p className="border border-chroma-gold/40 bg-chroma-gold/10 px-3 py-2 text-sm font-semibold text-chroma-gold-ink">
                            No recipes are assigned to this character yet. Add one in
                            Workspace, or act without a recipe above.
                          </p>
                        ) : null}
                        <label className="grid gap-1">
                          <span className="text-sm font-semibold text-foreground/80">
                            Recipe
                          </span>
                          <select
                            className="min-w-0 border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
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
                          <div className="border border-border bg-surface-muted p-3 text-sm text-foreground/80">
                            <p className="font-bold">{selectedRecipe.family}</p>
                            <p className="mt-1">
                              Tags: {selectedRecipe.coreTags.join(", ")}
                            </p>
                            <p className="mt-1">
                              Chroma: {selectedRecipe.chroma.join(" + ")}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                    <label className="grid max-w-[120px] gap-1">
                      <span className="text-sm font-semibold text-foreground/80">
                        Challenge Rating
                      </span>
                      <input
                        className="min-w-0 border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                        type="number"
                        min={7}
                        max={15}
                        value={challengeRating}
                        onChange={(event) =>
                          setChallengeRating(Number(event.target.value))
                        }
                      />
                    </label>
                    <div className="grid gap-2 text-sm text-foreground/80 sm:grid-cols-3">
                      <span className="border border-border bg-surface-muted px-3 py-2">
                        Core: {isCoreEligible ? "eligible" : "not eligible"}
                      </span>
                      <span className="border border-border bg-surface-muted px-3 py-2">
                        Chroma: {matchedChromaCount}/{requiredChromaCount}
                      </span>
                      <span className="border border-border bg-surface-muted px-3 py-2">
                        Grade: {actGrade} +{gradeBonus[actGrade]}
                      </span>
                    </div>
                  </>
                ) : null}
                {postType === "setup" ? (
                  <label className="grid gap-1">
                    <span className="text-sm font-semibold text-foreground/80">
                      Setup Word
                    </span>
                    <input
                      className="min-w-0 border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                      value={setupWord}
                      onChange={(event) => setSetupWord(event.target.value)}
                      placeholder="marked path, braced door, held chain"
                    />
                  </label>
                ) : null}
                {postType === "act" ? (
                  <>
                    <span className="border border-border bg-surface-muted px-3 py-2 text-sm font-semibold text-foreground">
                      Act spends 1 Focus
                    </span>
                    <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
                      <input
                        type="checkbox"
                        checked={spendThreadWithPost}
                        onChange={(event) =>
                          setSpendThreadWithPost(event.target.checked)
                        }
                        disabled={
                          thread === 0 || matchedChromaCount < requiredChromaCount
                        }
                      />
                      Spend 1 Thread to Heighten
                    </label>
                  </>
                ) : null}
                {postType === "act" || postType === "setup" ? (
                  <>
                    <div className="grid gap-3 border border-border bg-surface-muted p-3 sm:grid-cols-[1fr_160px]">
                      <label className="grid gap-1">
                        <span className="text-sm font-semibold text-foreground/80">
                          Scene Word
                        </span>
                        <input
                          className="min-w-0 border border-border px-3 py-2 outline-none focus:border-accent"
                          value={sceneWord}
                          onChange={(event) => setSceneWord(event.target.value)}
                          placeholder="mercy, gate, crown"
                        />
                      </label>
                      <label className="grid gap-1">
                        <span className="text-sm font-semibold text-foreground/80">
                          Chroma
                        </span>
                        <select
                          className="min-w-0 border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
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
                      <p className="text-sm text-foreground/70 sm:col-span-2">
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
              <div className="mt-4 grid gap-3 border border-border bg-white p-3">
                <label className="grid gap-1">
                  <span className="text-sm font-semibold text-foreground/80">
                    Ghost Intent
                  </span>
                  <textarea
                    className="min-h-20 resize-y border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                    value={ghostIntent}
                    onChange={(event) => setGhostIntent(event.target.value)}
                    placeholder="follows the group and keeps watch"
                  />
                </label>
              </div>
            ) : null}

            {postType === "breathe" ? (
              <div className="mt-4 grid gap-3 border border-border bg-white p-3">
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
                    <span className="text-sm font-semibold text-foreground/80">
                      Threat Bucket Source Color
                    </span>
                    <select
                      className="min-w-0 border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
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

          <div className="border border-border bg-[#fcfaf6] p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold">Fuel</h3>
                <p className="mt-1 text-sm text-foreground/70">
                  Select the Core Word, Card Words, and Gear Words your post is using.
                </p>
              </div>
              <span className="text-sm font-semibold text-foreground/80">
                {hand.length} cards in hand
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                Core Words
              </h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {coreWords.map((coreWord) => (
                  <button
                    type="button"
                    key={`builder-core-${coreWord.id}`}
                    className={`border px-3 py-2 text-left hover:bg-surface-muted ${
                      selectedCoreWordId === coreWord.id
                        ? "border-accent bg-accent/10"
                        : "border-border bg-surface"
                    }`}
                    onClick={() =>
                      setSelectedCoreWordId(
                        selectedCoreWordId === coreWord.id ? null : coreWord.id,
                      )
                    }
                    disabled={postType !== "act"}
                  >
                    <span className="block font-bold">{coreWord.word}</span>
                    <span className="mt-1 block text-xs text-foreground/70">
                      {coreWord.tags}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                Hand
              </h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {hand.length === 0 ? (
                <p className="text-sm text-foreground/70">No cards in hand.</p>
              ) : (
                hand.map((card) => (
                  <button
                    type="button"
                    key={`builder-card-${card.word}`}
                    className={`border px-3 py-2 text-left font-semibold hover:brightness-95 ${
                      selectedCardWords.includes(card.word)
                        ? "ring-2 ring-accent"
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
              <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                Gear
              </h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {gear.length === 0 ? (
                  <p className="text-sm text-foreground/70">No gear listed.</p>
                ) : (
                  gear.map((entry) => (
                    <button
                      type="button"
                      key={`builder-gear-${entry.id}`}
                      className={`border px-3 py-2 text-left hover:bg-surface-muted ${
                        selectedGearIds.includes(entry.id)
                          ? "border-accent bg-accent/10"
                          : "border-border bg-surface"
                      }`}
                      onClick={() => toggleSelectedGear(entry.id)}
                      disabled={postType === "breathe" || postType === "ghost"}
                    >
                      <span className="block text-sm font-semibold">
                        {getGearLabel(entry)}
                      </span>
                      <span className="mt-1 block text-xs text-foreground/70">
                        {getGearDetailText(entry) || "No tags or tracked state"}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="border border-accent bg-foreground p-4 text-accent-ink xl:col-span-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-bold">Review And Queue</h3>
                <p className="mt-1 text-sm text-foreground/60">
                  Confirm the post after you finish selecting words and gear.
                </p>
              </div>
            </div>
            <div className="mt-4 border border-accent bg-accent p-3">
              <p className="text-sm font-semibold text-foreground/50">Preview</p>
              <p className="mt-1 text-sm text-accent-ink">{postSummary()}</p>
              {builderNotice ? (
                <p className="mt-3 border border-chroma-gold/40 bg-chroma-gold/10 px-3 py-2 text-sm font-semibold text-chroma-gold-ink">
                  {builderNotice}
                </p>
              ) : null}
              {mechanicsSummary ? (
                <div className="mt-3 border border-border bg-white">
                  <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
                    <p className="text-sm font-bold text-foreground">
                      Generated Mechanics
                    </p>
                    <button
                      type="button"
                      className="border border-border px-3 py-1 text-sm font-semibold hover:bg-surface-muted"
                      onClick={copyMechanicsSummary}
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap px-3 py-2 font-mono text-sm text-foreground">
                    {mechanicsSummary}
                  </pre>
                </div>
              ) : null}
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="h-11 border border-border bg-accent px-4 text-sm font-semibold text-accent-ink hover:bg-accent/80"
                  onClick={clearPostBuilder}
                >
                  Clear
                </button>
                {mechanicsSummary ? (
                  <button
                    type="button"
                    className="h-11 border border-border bg-accent px-4 text-sm font-semibold text-accent-ink hover:bg-accent/80"
                    onClick={editGeneratedPost}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    className="h-11 border border-accent bg-accent px-4 text-sm font-semibold text-white hover:opacity-90"
                    onClick={submitPost}
                  >
                    Queue Post
                  </button>
                )}
              </div>
            </div>
          </div>
          </div>
        </Surface>

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
              <p className="text-sm text-foreground/70">No submitted posts yet.</p>
            ) : (
              visiblePlayerPosts.map((post) => (
                <div key={post.id} className="grid gap-2 border border-border bg-surface-muted p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="grid gap-1">
                      <span className="text-sm font-bold uppercase tracking-wide text-foreground/80">
                        {post.post_type}
                      </span>
                      <span className="text-xs text-foreground/70">{post.id}</span>
                      <span className="text-xs text-foreground/70">
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
                              : "text-chroma-red-ink"
                        }`}
                      >
                        {post.status}
                      </span>
                      <button
                        type="button"
                        className="h-8 border border-border px-3 text-xs font-semibold hover:bg-surface-muted"
                        onClick={() => copyDiscordPostSnippet(post)}
                      >
                        Copy Post
                      </button>
                      <button
                        type="button"
                        className="h-8 border border-chroma-red/40 px-3 text-xs font-semibold text-chroma-red-ink hover:bg-chroma-red/10"
                        onClick={() => cancelQueuedPost(post)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{post.post_summary}</p>
                  <pre className="whitespace-pre-wrap border border-border bg-white px-3 py-2 font-mono text-xs text-foreground">
                    {post.mechanics_text}
                  </pre>
                </div>
              ))
            )}
          </div>
        </CollapsibleSection>
    </>
  );
}
