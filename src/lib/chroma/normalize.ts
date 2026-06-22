import { chromaNames } from "./constants";
import type { Card, CharacterRow, GearItem, RecipeRow, Recipe, ThreatPool } from "./types";

export function parseTagList(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function normalizeCounter(value: unknown) {
  const normalized = Number(value);
  if (!Number.isFinite(normalized)) {
    return 0;
  }
  return Math.max(0, Math.trunc(normalized));
}

export function normalizeChromaColor(value: unknown) {
  const normalized = String(value ?? "").trim();
  return chromaNames.includes(normalized) ? normalized : "";
}

export function parseLegacyGearEntry(id: number, value: string): GearItem {
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

export function normalizeGearItem(rawGear: unknown, fallbackId: number): GearItem {
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
    ? rawTags.map((tag) => String(tag).trim()).filter(Boolean)
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

export function normalizeGear(rawGear: unknown): GearItem[] {
  if (!Array.isArray(rawGear)) {
    return [];
  }

  return rawGear.map((item, index) => normalizeGearItem(item, Date.now() + index));
}

export function normalizeThreatPool(
  rawThreat: Record<string, number> | null | undefined,
): ThreatPool {
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

export function getCharacterTie(character: Partial<CharacterRow>) {
  const existingTie = character.tie?.trim();
  if (existingTie) {
    return existingTie;
  }

  const legacyParts = [character.bond?.trim(), character.burden?.trim()].filter(Boolean);
  return legacyParts.join(" | ");
}

export function normalizeCard(rawCard: unknown): Card | null {
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

export function normalizeCardList(rawCards: unknown): Card[] {
  if (!Array.isArray(rawCards)) {
    return [];
  }

  return rawCards.map(normalizeCard).filter(Boolean) as Card[];
}

export function mapRecipeRow(recipe: RecipeRow): Recipe {
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
