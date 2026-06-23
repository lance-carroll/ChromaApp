export type Card = {
  word: string;
  color: string;
};

export type CoreWord = {
  id: number;
  word: string;
  tags: string;
};

export type Entry = {
  id: number;
  value: string;
};

export type GearItem = {
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

export type SceneWord = {
  id: number;
  word: string;
  color: string;
};

export type ThreatBucket = "Peril" | "Intrigue" | "Dread";
export type ThreatPool = Record<ThreatBucket, number>;

export type SheetPayload = {
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

export type CharacterRow = SheetPayload & {
  id: string;
  owner_id: string;
  updated_at: string;
  bond?: string;
  burden?: string;
};

export type CampaignRow = {
  id: string;
  owner_id: string;
  name: string;
  invite_code: string;
  beat_number: number;
  default_cr: number;
  posting_window: string;
  scene_words: SceneWord[];
  threat: ThreatPool;
  pressure_current: number;
  pressure_max: number;
  discovery_current: number;
  discovery_max: number;
  updated_at: string;
};

export type CampaignCharacterLink = {
  id: string;
  campaign_id: string;
  character_id: string;
  owner_id: string;
};

export type CampaignSceneRow = {
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

export type CampaignBeatRow = {
  id: string;
  scene_id: string;
  campaign_id: string;
  owner_id: string;
  beat_number: number;
  prompt: string;
  is_active: boolean;
  updated_at: string;
};

export type OppositionTier = "obstacle" | "threat" | "trial";

export type OppositionCondition = {
  id: number;
  label: string;
  resolved: boolean;
  hidden: boolean;
};

export type CampaignOppositionRow = {
  id: string;
  campaign_id: string;
  scene_id: string | null;
  owner_id: string;
  name: string;
  tier: OppositionTier;
  notes: string;
  segments_current: number;
  segments_max: number;
  conditions: OppositionCondition[];
  resolved: boolean;
  updated_at: string;
};

export type CampaignPostStatus = "pending" | "resolved" | "rejected";

export type StoredPostType = "act" | "breathe" | "setup" | "ghost";
export type PostType = "act" | "breathe" | "setup" | "ghost";
export type ViewMode = "player" | "gm";
export type BreatheChoice = "focus" | "draw";
export type GradeName = "Partial" | "Complete" | "Heightened";
export type ActGradeName = "Incomplete" | GradeName;

export type CampaignPostRow = {
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

export type JoinedCampaignInviteRow = CampaignRow & {
  link_id: string;
};

export type ProfileRow = {
  id: string;
  discord_user_id: string | null;
  discord_username: string;
  updated_at: string;
};

export type LinkCodeRow = {
  id: string;
  owner_id: string;
  code: string;
  expires_at: string;
  claimed_at: string | null;
  claimed_discord_user_id: string | null;
  claimed_discord_username: string | null;
  updated_at: string;
};

export type ChromaComponent = {
  word: string;
  color: string;
  source: "Card" | "Scene" | "Gear";
};

export type Recipe = {
  id: string;
  name: string;
  family: string;
  coreTags: string[];
  chroma: string[];
  hit: string;
  strongHit: string;
  miss?: string;
};

export type RecipeRow = {
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

export type CardRow = {
  id: string;
  owner_id: string | null;
  campaign_id: string | null;
  word: string;
  color: string;
  tags: string[];
  source_type: "system" | "personal" | "campaign";
  updated_at?: string;
};

export type CharacterRecipeRow = {
  id: string;
  character_id: string;
  recipe_id: string;
  owner_id: string;
};
