import type { ActGradeName, GearItem } from "./types";

export function makeAccountLinkCode(length = 8) {
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

export function getAppUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

export function getGearLabel(item: GearItem) {
  return item.name.trim() || "Unnamed gear";
}

export function getGearDetailText(item: GearItem) {
  return [
    item.tags.length > 0 ? item.tags.join(", ") : "",
    item.chroma ? `${item.chroma} chroma${item.tapped ? " (tapped)" : ""}` : "",
    item.guard_max > 0 ? `Guard ${item.guard}/${item.guard_max}` : "",
    item.supply_max > 0 ? `Supply ${item.supply}/${item.supply_max}` : "",
  ]
    .filter(Boolean)
    .join(" | ");
}

export function getGearSummary(item: GearItem) {
  const details = getGearDetailText(item);

  return details ? `${getGearLabel(item)} - ${details}` : getGearLabel(item);
}

export function getActGrade({
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
