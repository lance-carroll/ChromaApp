"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Card = {
  word: string;
  color: string;
};

type CoreWord = {
  id: number;
  word: string;
  tags: string;
};

type Entry = {
  id: number;
  value: string;
};

type GearItem = {
  id: number;
  name: string;
  tags: string[];
  chroma: string;
  guard: number;
  guard_max: number;
  supply: number;
  supply_max: number;
  tapped: boolean;
};

type SceneWord = {
  id: number;
  word: string;
  color: string;
};

type ThreatBucket = "Peril" | "Intrigue" | "Dread";
type ThreatPool = Record<ThreatBucket, number>;

type SheetPayload = {
  name: string;
  pronouns: string;
  concept: string;
  focus: number;
  thread: number;
  core_words: CoreWord[];
  marks: Entry[];
  wounds: Entry[];
  gear: GearItem[];
  tie: string;
  hand: Card[];
  deck: Card[];
  discard: Card[];
};

type CharacterRow = SheetPayload & {
  id: string;
  owner_id: string;
  updated_at: string;
  bond?: string;
  burden?: string;
};

type CampaignRow = {
  id: string;
  owner_id: string;
  name: string;
  invite_code: string;
  beat_number: number;
  default_cr: number;
  posting_window: string;
  scene_words: SceneWord[];
  threat: ThreatPool;
  updated_at: string;
};

type CampaignCharacterLink = {
  id: string;
  campaign_id: string;
  character_id: string;
  owner_id: string;
};

type CampaignSceneRow = {
  id: string;
  campaign_id: string;
  owner_id: string;
  name: string;
  summary: string;
  is_active: boolean;
  scene_words: SceneWord[];
  default_cr: number;
  updated_at: string;
};

type CampaignBeatRow = {
  id: string;
  scene_id: string;
  campaign_id: string;
  owner_id: string;
  beat_number: number;
  prompt: string;
  is_active: boolean;
  updated_at: string;
};

type CampaignPostStatus = "pending" | "resolved" | "rejected";

type CampaignPostRow = {
  id: string;
  campaign_id: string;
  scene_id: string | null;
  beat_id: string | null;
  character_id: string;
  owner_id: string;
  post_type: StoredPostType;
  post_summary: string;
  mechanics_text: string;
  mechanics_payload: Record<string, unknown>;
  status: CampaignPostStatus;
  resolution_text: string;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

type JoinedCampaignInviteRow = CampaignRow & {
  link_id: string;
};

type ProfileRow = {
  id: string;
  discord_user_id: string | null;
  discord_username: string;
  updated_at: string;
};

type LinkCodeRow = {
  id: string;
  owner_id: string;
  code: string;
  expires_at: string;
  claimed_at: string | null;
  claimed_discord_user_id: string | null;
  claimed_discord_username: string | null;
  updated_at: string;
};

type StoredPostType = "act" | "breathe" | "setup" | "ghost";
type PostType = "act" | "breathe" | "setup" | "ghost";
type ViewMode = "player" | "gm";
type BreatheChoice = "focus" | "draw";
type GradeName = "Partial" | "Complete" | "Heightened";
type ActGradeName = "Incomplete" | GradeName;
type ChromaComponent = {
  word: string;
  color: string;
  source: "Card" | "Scene" | "Gear";
};

type Recipe = {
  id: string;
  name: string;
  family: string;
  coreTags: string[];
  chroma: string[];
  hit: string;
  strongHit: string;
  miss?: string;
};

type RecipeRow = {
  id: string;
  owner_id: string | null;
  campaign_id: string | null;
  name: string;
  family: string;
  core_tags: string[];
  chroma: string[];
  hit: string;
  strong_hit: string;
  miss: string;
  source_type: "system" | "personal" | "campaign";
  updated_at?: string;
};

type CardRow = {
  id: string;
  owner_id: string | null;
  campaign_id: string | null;
  word: string;
  color: string;
  tags: string[];
  source_type: "system" | "personal" | "campaign";
  updated_at?: string;
};

type CharacterRecipeRow = {
  id: string;
  character_id: string;
  recipe_id: string;
  owner_id: string;
};

const defaultCardCatalog: Card[] = [
  { word: "hunger", color: "Red" },
  { word: "blood", color: "Red" },
  { word: "spark", color: "Red" },
  { word: "chain", color: "Red" },
  { word: "drum", color: "Red" },
  { word: "blush", color: "Red" },
  { word: "fang", color: "Red" },
  { word: "mirror", color: "Blue" },
  { word: "ledger", color: "Blue" },
  { word: "brine", color: "Blue" },
  { word: "map", color: "Blue" },
  { word: "silence", color: "Blue" },
  { word: "frost", color: "Blue" },
  { word: "ink", color: "Blue" },
  { word: "root", color: "Green" },
  { word: "cough", color: "Green" },
  { word: "moss", color: "Green" },
  { word: "seed", color: "Green" },
  { word: "vine", color: "Green" },
  { word: "balm", color: "Green" },
  { word: "marrow", color: "Green" },
  { word: "bell", color: "Gold" },
  { word: "crown", color: "Gold" },
  { word: "coin", color: "Gold" },
  { word: "guard", color: "Gold" },
  { word: "torch", color: "Gold" },
  { word: "oath", color: "Gold" },
  { word: "banner", color: "Gold" },
  { word: "dream", color: "Violet" },
  { word: "veil", color: "Violet" },
  { word: "star", color: "Violet" },
  { word: "echo", color: "Violet" },
  { word: "mask", color: "Violet" },
  { word: "door", color: "Violet" },
  { word: "omen", color: "Violet" },
  { word: "ash", color: "Black" },
  { word: "grave", color: "Black" },
  { word: "rot", color: "Black" },
  { word: "shadow", color: "Black" },
  { word: "bone", color: "Black" },
  { word: "debt", color: "Black" },
  { word: "knife", color: "Black" },
  { word: "mercy", color: "White" },
  { word: "saint", color: "White" },
  { word: "silver", color: "White" },
  { word: "candle", color: "White" },
  { word: "prayer", color: "White" },
  { word: "witness", color: "White" },
  { word: "linen", color: "White" },
];

const colorStyles: Record<string, string> = {
  Red: "border-red-300 bg-red-50 text-red-950",
  Blue: "border-sky-300 bg-sky-50 text-sky-950",
  Green: "border-emerald-300 bg-emerald-50 text-emerald-950",
  Gold: "border-yellow-300 bg-yellow-50 text-yellow-950",
  Violet: "border-violet-300 bg-violet-50 text-violet-950",
  Black: "border-stone-400 bg-stone-900 text-stone-50",
  White: "border-zinc-300 bg-white text-zinc-950",
};

const chromaNames = Object.keys(colorStyles);

const defaultThreat: ThreatPool = {
  Peril: 0,
  Intrigue: 0,
  Dread: 0,
};

const threatBucketStyles: Record<ThreatBucket, string> = {
  Peril: "border-red-300 bg-red-50 text-red-950",
  Intrigue: "border-sky-300 bg-sky-50 text-sky-950",
  Dread: "border-violet-300 bg-violet-50 text-violet-950",
};

const threatBucketByColor: Record<string, ThreatBucket> = {
  Red: "Peril",
  Black: "Peril",
  Blue: "Intrigue",
  Gold: "Intrigue",
  White: "Intrigue",
  Green: "Dread",
  Violet: "Dread",
};

const gradeBonus: Record<ActGradeName, number> = {
  Incomplete: 0,
  Partial: 0,
  Complete: 2,
  Heightened: 3,
};

function makeAccountLinkCode(length = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(length);

  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function parseTagList(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeCounter(value: unknown) {
  const normalized = Number(value);
  if (!Number.isFinite(normalized)) {
    return 0;
  }
  return Math.max(0, Math.trunc(normalized));
}

function normalizeChromaColor(value: unknown) {
  const normalized = String(value ?? "").trim();
  return chromaNames.includes(normalized) ? normalized : "";
}

function parseLegacyGearEntry(id: number, value: string): GearItem {
  const [rawName, ...detailParts] = value.split(" - ");
  const name = rawName.trim();
  let detailText = detailParts.join(" - ").trim();

  const guardMatch = detailText.match(/(\d+)\s*guard/i);
  const supplyMatch =
    detailText.match(/supply\s*(\d+)/i) ?? detailText.match(/(\d+)\s*supply/i);
  const chromaMatch = chromaNames.find((color) =>
    new RegExp(`\\b${color}\\b`, "i").test(detailText),
  );

  const guardMax = normalizeCounter(guardMatch?.[1]);
  const supplyMax = normalizeCounter(supplyMatch?.[1]);

  if (guardMatch) {
    detailText = detailText.replace(guardMatch[0], "");
  }

  if (supplyMatch) {
    detailText = detailText.replace(supplyMatch[0], "");
  }

  if (chromaMatch) {
    detailText = detailText.replace(new RegExp(`\\b${chromaMatch}\\b`, "ig"), "");
  }

  detailText = detailText
    .replace(/\bmundane\b/gi, "")
    .replace(/\bchroma\b/gi, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/(^[,\s-]+|[,\s-]+$)/g, "")
    .trim();

  return {
    id,
    name,
    tags: parseTagList(detailText),
    chroma: chromaMatch ?? "",
    guard: guardMax,
    guard_max: guardMax,
    supply: supplyMax,
    supply_max: supplyMax,
    tapped: false,
  };
}

function normalizeGearItem(rawGear: unknown, fallbackId: number): GearItem {
  if (!rawGear || typeof rawGear !== "object") {
    return {
      id: fallbackId,
      name: "",
      tags: [],
      chroma: "",
      guard: 0,
      guard_max: 0,
      supply: 0,
      supply_max: 0,
      tapped: false,
    };
  }

  if ("value" in rawGear && typeof rawGear.value === "string") {
    const rawId =
      "id" in rawGear && typeof rawGear.id === "number" ? rawGear.id : fallbackId;
    return parseLegacyGearEntry(rawId, rawGear.value);
  }

  const id =
    "id" in rawGear && typeof rawGear.id === "number" ? rawGear.id : fallbackId;
  const rawTags = "tags" in rawGear ? rawGear.tags : [];
  const tags = Array.isArray(rawTags)
    ? rawTags
        .map((tag) => String(tag).trim())
        .filter(Boolean)
    : parseTagList(String(rawTags ?? ""));
  const guardMax = Math.max(
    normalizeCounter("guard_max" in rawGear ? rawGear.guard_max : 0),
    normalizeCounter("guard" in rawGear ? rawGear.guard : 0),
  );
  const supplyMax = Math.max(
    normalizeCounter("supply_max" in rawGear ? rawGear.supply_max : 0),
    normalizeCounter("supply" in rawGear ? rawGear.supply : 0),
  );

  return {
    id,
    name: String("name" in rawGear ? rawGear.name ?? "" : "").trim(),
    tags,
    chroma: normalizeChromaColor("chroma" in rawGear ? rawGear.chroma : ""),
    guard:
      guardMax > 0
        ? Math.min(
            normalizeCounter("guard" in rawGear ? rawGear.guard : guardMax),
            guardMax,
          )
        : 0,
    guard_max: guardMax,
    supply:
      supplyMax > 0
        ? Math.min(
            normalizeCounter("supply" in rawGear ? rawGear.supply : supplyMax),
            supplyMax,
          )
        : 0,
    supply_max: supplyMax,
    tapped: Boolean("tapped" in rawGear ? rawGear.tapped : false),
  };
}

function normalizeGear(rawGear: unknown): GearItem[] {
  if (!Array.isArray(rawGear)) {
    return [];
  }

  return rawGear.map((item, index) => normalizeGearItem(item, Date.now() + index));
}

function getGearLabel(item: GearItem) {
  return item.name.trim() || "Unnamed gear";
}

function getGearSummary(item: GearItem) {
  const details = getGearDetailText(item);

  return details
    ? `${getGearLabel(item)} - ${details}`
    : getGearLabel(item);
}

function getGearDetailText(item: GearItem) {
  return [
    item.tags.length > 0 ? item.tags.join(", ") : "",
    item.chroma ? `${item.chroma} chroma${item.tapped ? " (tapped)" : ""}` : "",
    item.guard_max > 0 ? `Guard ${item.guard}/${item.guard_max}` : "",
    item.supply_max > 0 ? `Supply ${item.supply}/${item.supply_max}` : "",
  ]
    .filter(Boolean)
    .join(" | ");
}

function normalizeThreatPool(rawThreat: Record<string, number> | null | undefined): ThreatPool {
  return {
    Peril:
      Number(rawThreat?.Peril ?? 0) +
      Number(rawThreat?.Red ?? 0) +
      Number(rawThreat?.Black ?? 0),
    Intrigue:
      Number(rawThreat?.Intrigue ?? 0) +
      Number(rawThreat?.Blue ?? 0) +
      Number(rawThreat?.Gold ?? 0) +
      Number(rawThreat?.White ?? 0),
    Dread:
      Number(rawThreat?.Dread ?? 0) +
      Number(rawThreat?.Green ?? 0) +
      Number(rawThreat?.Violet ?? 0),
  };
}

function getCharacterTie(character: Partial<CharacterRow>) {
  const existingTie = character.tie?.trim();
  if (existingTie) {
    return existingTie;
  }

  const legacyParts = [character.bond?.trim(), character.burden?.trim()].filter(Boolean);
  return legacyParts.join(" | ");
}

function normalizeCard(rawCard: unknown): Card | null {
  if (!rawCard || typeof rawCard !== "object") {
    return null;
  }

  const word = String("word" in rawCard ? rawCard.word ?? "" : "").trim();
  const color = normalizeChromaColor("color" in rawCard ? rawCard.color : "");

  if (!word || !color) {
    return null;
  }

  return { word, color };
}

function normalizeCardList(rawCards: unknown): Card[] {
  if (!Array.isArray(rawCards)) {
    return [];
  }

  return rawCards.map(normalizeCard).filter(Boolean) as Card[];
}

function mapRecipeRow(recipe: RecipeRow): Recipe {
  return {
    id: recipe.id,
    name: recipe.name,
    family: recipe.family,
    coreTags: Array.isArray(recipe.core_tags) ? recipe.core_tags : [],
    chroma: Array.isArray(recipe.chroma) ? recipe.chroma : [],
    hit: recipe.hit,
    strongHit: recipe.strong_hit,
    miss: recipe.miss,
  };
}

const defaultRecipeCatalog: Recipe[] = [
  {
    id: "bell-cracker-cut",
    name: "Bell-Cracker Cut",
    family: "Strike",
    coreTags: ["violence", "weapon", "force", "command", "sound"],
    chroma: ["Red", "Gold"],
    hit: "Break, silence, interrupt, or disable an object, alarm, voice, weapon, or power source.",
    strongHit: "Also remove, change, or corrupt one Scene Word.",
    miss: "It breaks loudly or dangerously. Add Threat, spend Gear, or trigger Pressure.",
  },
  {
    id: "blood-for-the-door",
    name: "Blood for the Door",
    family: "Strike / Sway",
    coreTags: ["violence", "sacrifice", "force", "oath", "passage"],
    chroma: ["Red", "Black"],
    hit: "Force passage through something that wants payment.",
    strongHit: "You choose what it takes.",
    miss: "It opens and takes more than you offered.",
  },
  {
    id: "saint-stone-intercession",
    name: "Saint-Stone Intercession",
    family: "Shelter",
    coreTags: ["defense", "protection", "oath", "healing", "faith"],
    chroma: ["White", "Blue"],
    hit: "Protect someone from supernatural, moral, psychic, or memory-based harm.",
    strongHit: "Also reveal what the danger wanted from them.",
    miss: "You protect them, but the danger marks you instead.",
  },
  {
    id: "brace-the-threshold",
    name: "Brace the Threshold",
    family: "Shelter",
    coreTags: ["defense", "place", "passage", "craft", "protection"],
    chroma: ["White", "Gold"],
    hit: "Secure a doorway, room, camp, or vulnerable position.",
    strongHit: "Create a Setup Word tied to the secured place.",
    miss: "It holds only if someone stays, pays, or is exposed.",
  },
  {
    id: "pilgrims-read",
    name: "Pilgrim's Read",
    family: "Uncover",
    coreTags: ["memory", "knowledge", "perception", "ritual", "oath", "trace"],
    chroma: ["Blue", "White"],
    hit: "Interpret sacred marks, vows, paths, warnings, relics, or ritual architecture.",
    strongHit: "Ask an additional question or reveal a hidden route.",
    miss: "You learn the truth by triggering part of it.",
  },
  {
    id: "follow-the-slip",
    name: "Follow the Slip",
    family: "Uncover",
    coreTags: ["memory", "perception", "truth", "speech", "suspicion", "attention"],
    chroma: ["Blue", "Gold"],
    hit: "Turn an NPC's slip into a concrete lead.",
    strongHit: "They don't realize what they revealed.",
    miss: "You get the lead, but they know you noticed.",
  },
  {
    id: "false-key",
    name: "False Key",
    family: "Distort",
    coreTags: ["deception", "lock", "secrecy", "shadow", "magic", "passage"],
    chroma: ["Blue", "Black"],
    hit: "Bypass, deceive, or confuse a lock, seal, ward, watcher, or gate.",
    strongHit: "It remains fooled after you pass.",
    miss: "It opens, but something knows.",
  },
  {
    id: "ashen-veil",
    name: "Ashen Veil",
    family: "Distort",
    coreTags: ["concealment", "shadow", "magic", "deception", "fear", "death"],
    chroma: ["Black", "Violet"],
    hit: "Hide yourself, obscure an ally, or blur a scene boundary.",
    strongHit: "Create a temporary Black or Violet Setup Word.",
    miss: "You vanish from the wrong thing or attract something worse.",
  },
  {
    id: "quiet-crossing",
    name: "Quiet Crossing",
    family: "Move",
    coreTags: ["motion", "stealth", "passage", "patience", "water", "shadow"],
    chroma: ["Blue", "Green"],
    hit: "Move through danger without raising Alert.",
    strongHit: "Bring someone or something with you safely.",
    miss: "You arrive, but Pressure advances.",
  },
  {
    id: "mercy-purchase",
    name: "Mercy Purchase",
    family: "Sway / Shelter",
    coreTags: ["mercy", "trust", "care", "healing", "debt", "oath", "speech"],
    chroma: ["White", "Green"],
    hit: "Gain trust by addressing a need, pain, fear, or vulnerability.",
    strongHit: "The NPC offers more than you asked for.",
    miss: "The need becomes your responsibility.",
  },
  {
    id: "soft-confession",
    name: "Soft Confession",
    family: "Sway",
    coreTags: ["speech", "truth", "vulnerability", "guilt", "oath", "memory"],
    chroma: ["White", "Blue"],
    hit: "Lower suspicion or make someone answer one question without hostility.",
    strongHit: "They reveal what they wish you hadn't asked.",
    miss: "You reveal more than intended.",
  },
  {
    id: "knife-under-the-table",
    name: "Knife Under the Table",
    family: "Sway / Distort",
    coreTags: ["threat", "fear", "deception", "violence", "speech", "status"],
    chroma: ["Red", "Black"],
    hit: "Force a concession through menace, blackmail, or implied violence.",
    strongHit: "They comply without public escalation.",
    miss: "They escalate, call help, or mark you as dangerous.",
  },
];

const defaultSheet: SheetPayload = {
  name: "Serit Vane",
  pronouns: "they/them",
  concept: "Oathbreaker knight of the drowned gate",
  focus: 3,
  thread: 0,
  core_words: [
    { id: 1, word: "cleave", tags: "violence, weapon, force" },
    { id: 2, word: "shelter", tags: "defense, protection, oath" },
    { id: 3, word: "confess", tags: "speech, truth, vulnerability" },
    { id: 4, word: "endure", tags: "defense, body, guilt" },
  ],
  marks: [],
  wounds: [],
  gear: [
    {
      id: 1,
      name: "Rusted Sword",
      tags: ["weapon", "violence", "oath"],
      chroma: "",
      guard: 0,
      guard_max: 0,
      supply: 0,
      supply_max: 0,
      tapped: false,
    },
    {
      id: 2,
      name: "Pilgrim Shield",
      tags: ["defense", "protection", "oath", "cover"],
      chroma: "",
      guard: 2,
      guard_max: 2,
      supply: 0,
      supply_max: 0,
      tapped: false,
    },
    {
      id: 3,
      name: "Delver's Pack",
      tags: ["supply", "travel", "utility"],
      chroma: "",
      guard: 0,
      guard_max: 0,
      supply: 3,
      supply_max: 3,
      tapped: false,
    },
  ],
  tie: "I will not abandon Mara - but I abandoned the gate once.",
  hand: [
    { word: "hunger", color: "Red" },
    { word: "mercy", color: "White" },
    { word: "mirror", color: "Blue" },
    { word: "crown", color: "Gold" },
  ],
  deck: defaultCardCatalog.filter(
    (card) =>
      [
        "blood",
        "chain",
        "silence",
        "brine",
        "saint",
        "candle",
        "bell",
        "oath",
        "ash",
        "bone",
        "debt",
        "echo",
        "door",
        "balm",
        "root",
      ].includes(card.word),
  ),
  discard: [],
};

function Counter({
  label,
  value,
  max,
  setValue,
}: {
  label: string;
  value: number;
  max: number;
  setValue: (value: number) => void;
}) {
  return (
    <div className="border border-stone-300 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold uppercase tracking-wide text-stone-600">
          {label}
        </span>
        <span className="font-mono text-xl font-bold">
          {value}/{max}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="h-10 border border-stone-300 bg-stone-50 text-xl hover:bg-stone-100"
          aria-label={`Decrease ${label}`}
          onClick={() => setValue(Math.max(0, value - 1))}
        >
          -
        </button>
        <button
          type="button"
          className="h-10 border border-stone-300 bg-stone-50 text-xl hover:bg-stone-100"
          aria-label={`Increase ${label}`}
          onClick={() => setValue(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}

function TextEntryList({
  title,
  items,
  setItems,
  placeholder,
}: {
  title: string;
  items: Entry[];
  setItems: (items: Entry[]) => void;
  placeholder: string;
}) {
  return (
    <section className="border border-stone-300 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold">{title}</h2>
        <button
          type="button"
          className="h-9 border border-stone-300 px-3 text-sm font-semibold hover:bg-stone-50"
          onClick={() =>
            setItems([...items, { id: Date.now(), value: "" }])
          }
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-2">
            <input
              className="min-w-0 flex-1 border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
              placeholder={placeholder}
              value={item.value}
              onChange={(event) =>
                setItems(
                  items.map((entry) =>
                    entry.id === item.id
                      ? { ...entry, value: event.target.value }
                      : entry,
                  ),
                )
              }
            />
            <button
              type="button"
              className="h-10 w-10 border border-stone-300 hover:bg-stone-50"
              aria-label={`Remove ${title} entry`}
              onClick={() => setItems(items.filter((entry) => entry.id !== item.id))}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function GearList({
  items,
  setItems,
}: {
  items: GearItem[];
  setItems: (items: GearItem[]) => void;
}) {
  function updateGearItem(id: number, updates: Partial<GearItem>) {
    setItems(
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const nextItem = { ...item, ...updates };
        const nextGuardMax = Math.max(0, nextItem.guard_max);
        const nextSupplyMax = Math.max(0, nextItem.supply_max);

        return {
          ...nextItem,
          guard_max: nextGuardMax,
          guard: Math.min(Math.max(0, nextItem.guard), nextGuardMax || 0),
          supply_max: nextSupplyMax,
          supply: Math.min(Math.max(0, nextItem.supply), nextSupplyMax || 0),
          chroma: normalizeChromaColor(nextItem.chroma),
        };
      }),
    );
  }

  return (
    <section className="border border-stone-300 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold">Gear</h2>
          <p className="mt-1 text-sm text-stone-600">
            Structure gear into tags, Chroma, Guard, and Supply.
          </p>
        </div>
        <button
          type="button"
          className="h-9 border border-stone-300 px-3 text-sm font-semibold hover:bg-stone-50"
          onClick={() =>
            setItems([
              ...items,
              {
                id: Date.now(),
                name: "",
                tags: [],
                chroma: "",
                guard: 0,
                guard_max: 0,
                supply: 0,
                supply_max: 0,
                tapped: false,
              },
            ])
          }
        >
          Add Gear
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="grid gap-3 border border-stone-200 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <input
                  className="w-full min-w-0 border border-stone-300 px-3 py-2 font-semibold outline-none focus:border-stone-700"
                  placeholder="Pilgrim Shield"
                  value={item.name}
                  onChange={(event) =>
                    updateGearItem(item.id, { name: event.target.value })
                  }
                />
              </div>
              <button
                type="button"
                className="h-10 w-10 border border-stone-300 hover:bg-stone-50"
                aria-label="Remove gear entry"
                onClick={() =>
                  setItems(items.filter((entry) => entry.id !== item.id))
                }
              >
                x
              </button>
            </div>

            <label className="grid gap-1">
              <span className="text-sm font-semibold text-stone-600">Tags</span>
              <input
                className="border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                placeholder="defense, protection, oath"
                value={item.tags.join(", ")}
                onChange={(event) =>
                  updateGearItem(item.id, {
                    tags: parseTagList(event.target.value),
                  })
                }
              />
            </label>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="grid gap-1">
                <span className="text-sm font-semibold text-stone-600">Chroma</span>
                <select
                  className="border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                  value={item.chroma}
                  onChange={(event) =>
                    updateGearItem(item.id, { chroma: event.target.value })
                  }
                >
                  <option value="">None</option>
                  {chromaNames.map((color) => (
                    <option key={`gear-color-${item.id}-${color}`} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-semibold text-stone-600">Guard Max</span>
                <input
                  type="number"
                  min={0}
                  className="border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                  value={item.guard_max}
                  onChange={(event) =>
                    updateGearItem(item.id, {
                      guard_max: normalizeCounter(event.target.value),
                    })
                  }
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-semibold text-stone-600">Guard Current</span>
                <input
                  type="number"
                  min={0}
                  max={item.guard_max}
                  className="border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                  value={item.guard}
                  onChange={(event) =>
                    updateGearItem(item.id, {
                      guard: normalizeCounter(event.target.value),
                    })
                  }
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-semibold text-stone-600">
                  Tapped This Scene
                </span>
                <button
                  type="button"
                  className={`h-11 border px-3 text-sm font-semibold ${
                    item.tapped
                      ? "border-red-900 bg-red-50 text-red-950"
                      : "border-stone-300 bg-white text-stone-950 hover:bg-stone-50"
                  }`}
                  onClick={() => updateGearItem(item.id, { tapped: !item.tapped })}
                >
                  {item.tapped ? "Tapped" : "Ready"}
                </button>
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm font-semibold text-stone-600">Supply Max</span>
                <input
                  type="number"
                  min={0}
                  className="border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                  value={item.supply_max}
                  onChange={(event) =>
                    updateGearItem(item.id, {
                      supply_max: normalizeCounter(event.target.value),
                    })
                  }
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-semibold text-stone-600">Supply Current</span>
                <input
                  type="number"
                  min={0}
                  max={item.supply_max}
                  className="border border-stone-300 px-3 py-2 outline-none focus:border-stone-700"
                  value={item.supply}
                  onChange={(event) =>
                    updateGearItem(item.id, {
                      supply: normalizeCounter(event.target.value),
                    })
                  }
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CollapsibleSection({
  title,
  summary,
  defaultOpen = false,
  children,
}: {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="border border-stone-300 bg-white">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-stone-50"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h2 className="text-base font-bold">{title}</h2>
          {summary ? (
            <p className="mt-1 text-sm text-stone-600">{summary}</p>
          ) : null}
        </div>
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-stone-500">
          {open ? "Hide" : "Show"}
        </span>
      </button>
      {open ? <div className="border-t border-stone-200 p-4">{children}</div> : null}
    </section>
  );
}

function ActionButton({
  children,
  onClick,
  disabled = false,
  selected = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      className={`min-h-11 border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
        selected
          ? "border-red-900 bg-red-50 text-red-950"
          : "border-stone-300 bg-white text-stone-950 hover:bg-stone-50"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function getActGrade({
  isCoreEligible,
  matchedChromaCount,
  requiredChromaCount,
  spendThreadWithPost,
}: {
  isCoreEligible: boolean;
  matchedChromaCount: number;
  requiredChromaCount: number;
  spendThreadWithPost: boolean;
}): ActGradeName {
  if (!isCoreEligible || matchedChromaCount === 0) {
    return "Incomplete";
  }

  if (matchedChromaCount < requiredChromaCount) {
    return "Partial";
  }

  if (spendThreadWithPost) {
    return "Heightened";
  }

  return "Complete";
}

export default function Home() {
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

  const activeScene =
    campaignScenes.find((scene) => scene.id === sceneId) ??
    campaignScenes.find((scene) => scene.is_active) ??
    null;

  const activeBeat =
    campaignBeats.find((beat) => beat.id === beatId) ??
    campaignBeats.find((beat) => beat.is_active) ??
    null;

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

    setAuthBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin,
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

    applyCharacter(data as CharacterRow);
    setCharacters((currentCharacters) => {
      const savedCharacter = data as CharacterRow;
      const withoutSaved = currentCharacters.filter(
        (character) => character.id !== savedCharacter.id,
      );
      return [savedCharacter, ...withoutSaved];
    });
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
                      className="h-11 border border-stone-300 px-4 font-semibold hover:bg-stone-50"
                      onClick={newCampaignDraft}
                    >
                      New
                    </button>
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
                  <div className="border border-stone-200 p-3">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-stone-600">
                      Current Roster
                    </h3>
                    <p className="mt-1 text-sm text-stone-600">
                      Characters linked to this campaign and available for the active Beat.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeCampaignCharacters.length === 0 ? (
                        <span className="text-sm text-stone-600">
                          No sheets linked yet.
                        </span>
                      ) : (
                        activeCampaignCharacters.map((character) => (
                          <div
                            key={`linked-${character.id}`}
                            className="min-w-[180px] border border-stone-300 bg-stone-50 px-3 py-2"
                          >
                            <span className="block text-sm font-bold">
                              {character.name}
                            </span>
                            <span className="mt-1 block text-xs text-stone-600">
                              F{character.focus} T{character.thread} W{character.wounds.length} H{character.hand.length}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
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
              <ActionButton
                onClick={() => changePostType("act")}
                selected={postType === "act"}
              >
                Act
              </ActionButton>
              <ActionButton
                onClick={() => changePostType("breathe")}
                selected={postType === "breathe"}
              >
                Breathe
              </ActionButton>
              <ActionButton
                onClick={() => changePostType("setup")}
                selected={postType === "setup"}
              >
                Setup
              </ActionButton>
              <ActionButton
                onClick={() => changePostType("ghost")}
                selected={postType === "ghost"}
              >
                Ghost
              </ActionButton>
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
                <ActionButton
                  onClick={() => setBreatheChoice("focus")}
                  selected={breatheChoice === "focus"}
                >
                  Recover Focus
                </ActionButton>
                <ActionButton
                  onClick={() => setBreatheChoice("draw")}
                  disabled={deck.length === 0 || hand.length >= 4}
                  selected={breatheChoice === "draw"}
                >
                  Draw Card
                </ActionButton>
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
