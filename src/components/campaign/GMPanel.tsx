"use client";

import type { ChromaWorkspace } from "@/hooks/useChromaWorkspace";
import { Button, CollapsibleSection, GaugeBar, Surface, TextEntryList } from "@/components/ui";
import {
  chromaNames,
  colorStyles,
  oppositionTierHints,
  oppositionTierLabels,
  oppositionTierTones,
  threatBucketByColor,
  threatBucketStyles,
  toneColorVars,
} from "@/lib/chroma";
import type { CampaignOppositionRow, OppositionTier, ThreatBucket } from "@/lib/chroma";

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-xs font-semibold text-foreground/80">
      {label} <span className="font-mono">{value}</span>
    </span>
  );
}

function OppositionCard({
  entry,
  updateOpposition,
  deleteOpposition,
  addOppositionCondition,
  updateOppositionCondition,
  removeOppositionCondition,
}: {
  entry: CampaignOppositionRow;
  updateOpposition: (id: string, updates: Partial<CampaignOppositionRow>) => void;
  deleteOpposition: (id: string) => void;
  addOppositionCondition: (entry: CampaignOppositionRow) => void;
  updateOppositionCondition: (
    entry: CampaignOppositionRow,
    conditionId: number,
    updates: Partial<CampaignOppositionRow["conditions"][number]>,
  ) => void;
  removeOppositionCondition: (entry: CampaignOppositionRow, conditionId: number) => void;
}) {
  const tone = toneColorVars[oppositionTierTones[entry.tier]];

  return (
    <div
      className="grid gap-3 rounded-md border p-3"
      style={{ borderColor: `color-mix(in srgb, ${tone} 40%, transparent)` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
              style={{
                borderColor: tone,
                backgroundColor: `color-mix(in srgb, ${tone} 16%, transparent)`,
                color: tone,
              }}
            >
              {oppositionTierLabels[entry.tier]}
            </span>
            {entry.resolved ? (
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Resolved
              </span>
            ) : null}
          </div>
          <input
            className="mt-2 w-full min-w-0 rounded-md border border-border px-3 py-2 font-bold outline-none focus:border-accent"
            value={entry.name}
            onChange={(event) => updateOpposition(entry.id, { name: event.target.value })}
          />
          <p className="mt-1 text-xs text-foreground/60">{oppositionTierHints[entry.tier]}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="h-9 text-xs"
            onClick={() => updateOpposition(entry.id, { resolved: !entry.resolved })}
          >
            {entry.resolved ? "Reopen" : "Mark Resolved"}
          </Button>
          <Button
            variant="danger"
            className="h-9 text-xs"
            onClick={() => deleteOpposition(entry.id)}
          >
            Remove
          </Button>
        </div>
      </div>

      {entry.tier === "threat" ? (
        <div className="grid gap-2 sm:grid-cols-[1fr_100px]">
          <GaugeBar
            label="Segments"
            value={entry.segments_current}
            max={Math.max(entry.segments_max, 1)}
            setValue={(value) =>
              updateOpposition(entry.id, {
                segments_current: value,
                resolved: value >= entry.segments_max,
              })
            }
            tone={oppositionTierTones.threat}
          />
          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
              Max
            </span>
            <input
              type="number"
              min={1}
              max={3}
              className="min-w-0 rounded-md border border-border px-3 py-2 outline-none focus:border-accent"
              value={entry.segments_max}
              onChange={(event) =>
                updateOpposition(entry.id, {
                  segments_max: Math.max(1, Number(event.target.value)),
                })
              }
            />
          </label>
        </div>
      ) : null}

      {entry.tier === "trial" ? (
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
              Conditions ({entry.conditions.filter((condition) => condition.resolved).length}/
              {entry.conditions.length})
            </span>
            <Button
              variant="secondary"
              className="h-8 text-xs"
              onClick={() => addOppositionCondition(entry)}
            >
              + Condition
            </Button>
          </div>
          {entry.conditions.map((condition) => (
            <div key={condition.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={condition.resolved}
                onChange={(event) =>
                  updateOppositionCondition(entry, condition.id, { resolved: event.target.checked })
                }
              />
              <input
                className="min-w-0 flex-1 rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
                placeholder="Sever its anchor chain"
                value={condition.label}
                onChange={(event) =>
                  updateOppositionCondition(entry, condition.id, { label: event.target.value })
                }
              />
              <label className="flex items-center gap-1 text-xs text-foreground/60">
                <input
                  type="checkbox"
                  checked={condition.hidden}
                  onChange={(event) =>
                    updateOppositionCondition(entry, condition.id, { hidden: event.target.checked })
                  }
                />
                Hidden
              </label>
              <button
                type="button"
                className="text-foreground/50 hover:text-foreground"
                aria-label="Remove condition"
                onClick={() => removeOppositionCondition(entry, condition.id)}
              >
                x
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <textarea
        className="min-h-16 resize-y rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-accent"
        placeholder="Notes - how it's framed, what it responds to"
        value={entry.notes}
        onChange={(event) => updateOpposition(entry.id, { notes: event.target.value })}
      />
    </div>
  );
}

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
    createOpposition,
    updateOpposition,
    deleteOpposition,
    addOppositionCondition,
    updateOppositionCondition,
    removeOppositionCondition,
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
    visibleSceneOpposition,
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
    <div className="flex flex-col gap-6">
      <Surface className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
            Active Campaign
          </p>
          <h2 className="text-xl font-bold">
            {campaignId ? campaignName || "Untitled campaign" : "No campaign open"}
          </h2>
        </div>
        <span className="text-sm text-foreground/70">
          {campaignBusy ? "Saving..." : campaignNotice}
        </span>
      </Surface>

      {campaignId ? (
        <>
          <Surface>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                  Challenge Rating
                </h3>
                <p className="mt-1 text-sm text-foreground/70">
                  Tune the active CR for posting and keep scene defaults in sync.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  className="h-9 w-9 px-0 text-lg"
                  onClick={() => setChallengeRating(clampChallengeRating(challengeRating - 1))}
                  disabled={challengeRating <= 7}
                >
                  -
                </Button>
                <span className="min-w-16 rounded-md border border-border bg-surface px-3 py-2 text-center font-mono text-lg font-bold">
                  {challengeRating}
                </span>
                <Button
                  variant="secondary"
                  className="h-9 w-9 px-0 text-lg"
                  onClick={() => setChallengeRating(clampChallengeRating(challengeRating + 1))}
                  disabled={challengeRating >= 15}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button variant="secondary" onClick={() => setChallengeRating(campaignDefaultCr)}>
                Use Campaign Default ({campaignDefaultCr})
              </Button>
              <Button
                variant="secondary"
                onClick={() => setChallengeRating(activeScene?.default_cr ?? campaignDefaultCr)}
              >
                Use Scene Default ({activeScene?.default_cr ?? campaignDefaultCr})
              </Button>
              <Button variant="primary" onClick={() => void saveCampaignChallengeRating(challengeRating)}>
                Save Campaign Default
              </Button>
              <Button
                variant="primary"
                onClick={() => void saveSceneChallengeRating(challengeRating)}
                disabled={!sceneId}
              >
                Save Scene Default
              </Button>
            </div>
          </Surface>

          <Surface>
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
                  <div key={post.id} className="grid gap-2 rounded-md border border-border bg-surface-muted p-3">
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
                    <pre className="whitespace-pre-wrap rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs text-foreground">
                      {post.mechanics_text}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </Surface>

          <Surface>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                Scenes And Beats
              </h3>
              <span className="text-sm text-foreground/70">{campaignScenes.length} scenes</span>
            </div>
            {campaignScenes.length > 0 ? (
              <div className="mt-3 grid gap-2">
                {campaignScenes.map((scene) => (
                  <div
                    key={scene.id}
                    className={`grid gap-2 rounded-md border px-3 py-2 ${
                      scene.id === sceneId ? "border-accent bg-accent/10" : "border-border"
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
                      <Button variant="secondary" className="h-8 text-xs" onClick={() => setActiveScene(scene.id)}>
                        Set Active
                      </Button>
                    </div>
                    {scene.is_active ? (
                      <span className="text-xs font-semibold uppercase tracking-wide text-accent">Active</span>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm font-semibold text-foreground/70">Scene Name</span>
                <input
                  className="min-w-0 rounded-md border border-border px-3 py-2 outline-none focus:border-accent"
                  value={sceneName}
                  onChange={(event) => setSceneName(event.target.value)}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-semibold text-foreground/70">Scene Summary</span>
                <textarea
                  className="min-h-20 resize-y rounded-md border border-border px-3 py-2 outline-none focus:border-accent"
                  value={sceneSummary}
                  onChange={(event) => setSceneSummary(event.target.value)}
                />
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button variant="primary" onClick={saveScene}>
                  Save Scene
                </Button>
                <Button
                  variant="secondary"
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
                </Button>
              </div>
              <label className="grid gap-1">
                <span className="text-sm font-semibold text-foreground/70">Beat Number</span>
                <input
                  className="min-w-0 rounded-md border border-border px-3 py-2 outline-none focus:border-accent"
                  type="number"
                  min={1}
                  value={beatNumber}
                  onChange={(event) => setBeatNumber(Number(event.target.value))}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-semibold text-foreground/70">Active Beat Prompt</span>
                <textarea
                  className="min-h-20 resize-y rounded-md border border-border px-3 py-2 outline-none focus:border-accent"
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
                        className={`grid gap-2 rounded-md border px-3 py-2 ${
                          beat.id === beatId ? "border-accent bg-accent/10" : "border-border"
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
                            <span className="block font-bold">Beat {beat.beat_number}</span>
                            <span className="mt-1 block text-xs text-foreground/70">
                              {beat.prompt || "No prompt yet"}
                            </span>
                          </button>
                          <Button variant="secondary" className="h-8 text-xs" onClick={() => setActiveBeat(beat.id)}>
                            Set Active
                          </Button>
                        </div>
                        {beat.is_active ? (
                          <span className="text-xs font-semibold uppercase tracking-wide text-accent">Active</span>
                        ) : null}
                      </div>
                    ))}
                </div>
              ) : null}
              <div className="grid gap-2 sm:grid-cols-2">
                <Button variant="primary" onClick={beatId ? saveBeat : createBeat} disabled={!sceneId}>
                  {beatId ? "Save Beat" : "Create Next Beat"}
                </Button>
                <Button
                  variant="secondary"
                  disabled={!sceneId}
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
                >
                  New Beat
                </Button>
              </div>
            </div>
          </Surface>

          <Surface>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                  Opposition
                </h3>
                <p className="mt-1 text-sm text-foreground/70">
                  Obstacles, Threats, and Trials for {activeSceneLabel}.
                </p>
              </div>
              <div className="flex gap-2">
                {(Object.keys(oppositionTierLabels) as OppositionTier[]).map((tier) => (
                  <Button
                    key={`add-opposition-${tier}`}
                    variant="secondary"
                    className="h-9 text-xs"
                    onClick={() => createOpposition(tier)}
                  >
                    + {oppositionTierLabels[tier]}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-3 grid gap-3">
              {visibleSceneOpposition.length === 0 ? (
                <p className="text-sm text-foreground/70">
                  No Obstacles, Threats, or Trials framed for this scene yet.
                </p>
              ) : (
                visibleSceneOpposition.map((entry) => (
                  <OppositionCard
                    key={entry.id}
                    entry={entry}
                    updateOpposition={updateOpposition}
                    deleteOpposition={deleteOpposition}
                    addOppositionCondition={addOppositionCondition}
                    updateOppositionCondition={updateOppositionCondition}
                    removeOppositionCondition={removeOppositionCondition}
                  />
                ))
              )}
            </div>
          </Surface>

          <div className="grid gap-4 lg:grid-cols-2">
            <Surface>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                  Scene Words For Active Scene
                </h3>
                <Button variant="secondary" className="h-9 text-sm" onClick={addSceneWord}>
                  Add
                </Button>
              </div>
              <div className="mt-3 grid gap-2">
                {campaignSceneWords.length === 0 ? (
                  <p className="text-sm text-foreground/70">No scene words yet.</p>
                ) : (
                  campaignSceneWords.map((entry) => (
                    <div key={entry.id} className="grid gap-2 sm:grid-cols-[1fr_130px_40px]">
                      <input
                        className="min-w-0 rounded-md border border-border px-3 py-2 outline-none focus:border-accent"
                        value={entry.word}
                        onChange={(event) => updateSceneWord(entry.id, { word: event.target.value })}
                        placeholder="gate, crown, rain"
                      />
                      <select
                        className="min-w-0 rounded-md border border-border bg-surface px-3 py-2 outline-none focus:border-accent"
                        value={entry.color}
                        onChange={(event) => updateSceneWord(entry.id, { color: event.target.value })}
                      >
                        {chromaNames.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="secondary"
                        className="h-10 px-0"
                        onClick={() => removeSceneWord(entry.id)}
                        aria-label="Remove scene word"
                      >
                        x
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Surface>

            <Surface>
              <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">Threat</h3>
              <div className="mt-3 grid gap-2">
                {Object.keys(threatBucketStyles).map((color) => {
                  const bucket = color as ThreatBucket;

                  return (
                    <div
                      key={bucket}
                      className={`grid grid-cols-[1fr_36px_36px_36px] items-center gap-2 rounded-md border px-2 py-2 ${threatBucketStyles[bucket]}`}
                    >
                      <span className="text-sm font-bold">{bucket}</span>
                      <button
                        type="button"
                        className="h-8 rounded border border-current bg-white/40 font-bold"
                        onClick={() => adjustThreat(bucket, -1)}
                      >
                        -
                      </button>
                      <span className="text-center font-mono font-bold">{threat[bucket] ?? 0}</span>
                      <button
                        type="button"
                        className="h-8 rounded border border-current bg-white/40 font-bold"
                        onClick={() => adjustThreat(bucket, 1)}
                      >
                        +
                      </button>
                    </div>
                  );
                })}
              </div>
            </Surface>
          </div>

          <Surface>
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground/70">Roster</h3>
            <p className="mt-1 text-sm text-foreground/70">
              Characters linked to this campaign. Select one to edit marks and wounds.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {activeCampaignCharacters.length === 0 ? (
                <span className="text-sm text-foreground/70 sm:col-span-2 xl:col-span-3">
                  No sheets linked yet.
                </span>
              ) : (
                activeCampaignCharacters.map((character) => (
                  <button
                    type="button"
                    key={`linked-${character.id}`}
                    className={`rounded-md border p-3 text-left transition-colors ${
                      campaignTargetCharacterId === character.id
                        ? "border-accent bg-accent/10"
                        : "border-border bg-surface-muted hover:border-foreground/30"
                    }`}
                    onClick={() => setCampaignTargetCharacterId(character.id)}
                  >
                    <span className="block font-bold">{character.name}</span>
                    <span className="mt-0.5 block text-xs text-foreground/60">
                      {character.concept || "No concept yet"}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <StatPill label="Focus" value={character.focus} />
                      <StatPill label="Thread" value={character.thread} />
                      <StatPill label="Marks" value={character.marks.length} />
                      <StatPill label="Wounds" value={character.wounds.length} />
                    </div>
                  </button>
                ))
              )}
            </div>
            {activeCampaignTargetCharacter ? (
              <div className="mt-5 grid gap-3 border-t border-border pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide text-foreground/70">
                      Condition Editor
                    </h4>
                    <p className="mt-1 text-sm text-foreground/70">
                      Editing marks and wounds for {activeCampaignTargetCharacter.name}.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="h-10 text-sm"
                      onClick={() => {
                        setCampaignTargetMarks(activeCampaignTargetCharacter.marks ?? []);
                        setCampaignTargetWounds(activeCampaignTargetCharacter.wounds ?? []);
                      }}
                    >
                      Reset
                    </Button>
                    <Button variant="primary" className="h-10 text-sm" onClick={saveCampaignTargetConditions}>
                      Save Conditions
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <TextEntryList
                    title="Marks"
                    items={campaignTargetMarks}
                    setItems={setCampaignTargetMarks}
                    placeholder="shaken, watched, off-balance"
                    tone="Violet"
                  />
                  <TextEntryList
                    title="Wounds"
                    items={campaignTargetWounds}
                    setItems={setCampaignTargetWounds}
                    placeholder="black ash, red hunger"
                    tone="Red"
                  />
                </div>
              </div>
            ) : null}
          </Surface>
        </>
      ) : (
        <Surface className="text-sm text-foreground/70">
          No campaign open yet. Use Campaign Setup below to create or load one.
        </Surface>
      )}

      <CollapsibleSection
        title="Campaign Setup"
        summary="Create, rename, switch, or delete campaigns - rarely needed once a campaign is running."
        defaultOpen={!campaignId}
      >
        <div className="grid gap-4">
          {campaigns.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {campaigns.map((campaign) => (
                <button
                  type="button"
                  key={campaign.id}
                  className={`rounded-md border px-3 py-2 text-left hover:bg-surface-muted ${
                    campaign.id === campaignId ? "border-accent bg-accent/10" : "border-border"
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
            <div className="grid gap-3">
              <label className="grid gap-1">
                <span className="text-sm font-semibold text-foreground/70">Campaign Name</span>
                <input
                  className="min-w-0 rounded-md border border-border px-3 py-2 outline-none focus:border-accent"
                  value={campaignName}
                  onChange={(event) => setCampaignName(event.target.value)}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-semibold text-foreground/70">Posting Window</span>
                <input
                  className="min-w-0 rounded-md border border-border px-3 py-2 outline-none focus:border-accent"
                  value={postingWindow}
                  onChange={(event) => setPostingWindow(event.target.value)}
                />
              </label>
              <div className="grid gap-2 sm:grid-cols-4">
                <Button variant="primary" onClick={saveCampaign} disabled={campaignBusy}>
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={linkCharacterToCampaign}
                  disabled={!characterId || !campaignId}
                >
                  Add Open Sheet
                </Button>
                <Button variant="danger" onClick={deleteCampaign} disabled={!campaignId || campaignBusy}>
                  Delete
                </Button>
                <span className="flex h-10 items-center rounded-md border border-border px-3 text-sm text-foreground/70">
                  {campaignInviteCode ? `Invite ${campaignInviteCode}` : "Save for invite"}
                </span>
              </div>
            </div>
          ) : (
            <Button variant="primary" onClick={newCampaignDraft}>
              Open New Campaign Draft
            </Button>
          )}

          {!campaignId ? (
            <CollapsibleSection
              title="New Campaign Draft"
              summary="Set a name and posting window, then save to create it."
              defaultOpen={campaignDraftOpen}
            >
              <div className="grid gap-3">
                <label className="grid gap-1">
                  <span className="text-sm font-semibold text-foreground/70">Campaign Name</span>
                  <input
                    className="min-w-0 rounded-md border border-border px-3 py-2 outline-none focus:border-accent"
                    value={campaignName}
                    onChange={(event) => setCampaignName(event.target.value)}
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm font-semibold text-foreground/70">Posting Window</span>
                  <input
                    className="min-w-0 rounded-md border border-border px-3 py-2 outline-none focus:border-accent"
                    value={postingWindow}
                    onChange={(event) => setPostingWindow(event.target.value)}
                  />
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button variant="primary" onClick={saveCampaign} disabled={campaignBusy}>
                    Save Draft
                  </Button>
                  <Button variant="secondary" onClick={newCampaignDraft}>
                    Reset Draft
                  </Button>
                </div>
              </div>
            </CollapsibleSection>
          ) : null}
        </div>
      </CollapsibleSection>
    </div>
  );
}
