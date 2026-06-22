create extension if not exists "pgcrypto";

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null default 'Unnamed Wanderer',
  pronouns text not null default '',
  concept text not null default '',
  focus integer not null default 3 check (focus between 0 and 3),
  thread integer not null default 0 check (thread between 0 and 3),
  core_words jsonb not null default '[]'::jsonb,
  marks jsonb not null default '[]'::jsonb,
  wounds jsonb not null default '[]'::jsonb,
  gear jsonb not null default '[]'::jsonb,
  tie text not null default '',
  bond text not null default '',
  burden text not null default '',
  hand jsonb not null default '[]'::jsonb,
  deck jsonb not null default '[]'::jsonb,
  discard jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  name text not null,
  family text not null default '',
  core_tags text[] not null default '{}',
  chroma text[] not null default '{}',
  hit text not null default '',
  strong_hit text not null default '',
  miss text not null default '',
  source_type text not null default 'system' check (source_type in ('system', 'personal', 'campaign')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete cascade,
  word text not null,
  color text not null default 'Red',
  tags text[] not null default '{}',
  source_type text not null default 'system' check (source_type in ('system', 'personal', 'campaign')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.character_recipes (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (character_id, recipe_id)
);

alter table public.characters enable row level security;

drop policy if exists "Characters are readable by their owner" on public.characters;
create policy "Characters are readable by their owner"
on public.characters for select
using (auth.uid() = owner_id);

drop policy if exists "Characters are created by their owner" on public.characters;
create policy "Characters are created by their owner"
on public.characters for insert
with check (auth.uid() = owner_id);

drop policy if exists "Characters are editable by their owner" on public.characters;
create policy "Characters are editable by their owner"
on public.characters for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "Characters are deletable by their owner" on public.characters;
create policy "Characters are deletable by their owner"
on public.characters for delete
using (auth.uid() = owner_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists characters_set_updated_at on public.characters;
create trigger characters_set_updated_at
before update on public.characters
for each row execute function public.set_updated_at();

alter table public.recipes enable row level security;
alter table public.cards enable row level security;
alter table public.character_recipes enable row level security;

drop trigger if exists recipes_set_updated_at on public.recipes;
create trigger recipes_set_updated_at
before update on public.recipes
for each row execute function public.set_updated_at();

drop trigger if exists cards_set_updated_at on public.cards;
create trigger cards_set_updated_at
before update on public.cards
for each row execute function public.set_updated_at();

alter table public.characters
add column if not exists tie text not null default '';

update public.characters
set tie = coalesce(
  nullif(tie, ''),
  nullif(concat_ws(' | ', nullif(bond, ''), nullif(burden, '')), ''),
  ''
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'New Campaign',
  invite_code text not null default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  beat_number integer not null default 1 check (beat_number >= 1),
  default_cr integer not null default 9 check (default_cr between 7 and 15),
  posting_window text not null default '24-48 hours',
  scene_words jsonb not null default '[]'::jsonb,
  threat jsonb not null default '{"Peril":0,"Intrigue":0,"Dread":0}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.campaigns enable row level security;

drop policy if exists "Campaigns are readable by their owner" on public.campaigns;
create policy "Campaigns are readable by their owner"
on public.campaigns for select
using (auth.uid() = owner_id);

drop policy if exists "Campaigns can be found by signed-in users" on public.campaigns;

drop policy if exists "Campaigns are created by their owner" on public.campaigns;
create policy "Campaigns are created by their owner"
on public.campaigns for insert
with check (auth.uid() = owner_id);

drop policy if exists "Campaigns are editable by their owner" on public.campaigns;
create policy "Campaigns are editable by their owner"
on public.campaigns for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "Campaigns are deletable by their owner" on public.campaigns;
create policy "Campaigns are deletable by their owner"
on public.campaigns for delete
using (auth.uid() = owner_id);

drop trigger if exists campaigns_set_updated_at on public.campaigns;
create trigger campaigns_set_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

alter table public.campaigns
alter column threat set default '{"Peril":0,"Intrigue":0,"Dread":0}'::jsonb;

update public.campaigns
set threat = jsonb_build_object(
  'Peril',
  coalesce((threat->>'Peril')::integer, 0) +
  coalesce((threat->>'Red')::integer, 0) +
  coalesce((threat->>'Black')::integer, 0),
  'Intrigue',
  coalesce((threat->>'Intrigue')::integer, 0) +
  coalesce((threat->>'Blue')::integer, 0) +
  coalesce((threat->>'Gold')::integer, 0) +
  coalesce((threat->>'White')::integer, 0),
  'Dread',
  coalesce((threat->>'Dread')::integer, 0) +
  coalesce((threat->>'Green')::integer, 0) +
  coalesce((threat->>'Violet')::integer, 0)
);

create table if not exists public.campaign_characters (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (campaign_id, character_id)
);

alter table public.campaign_characters enable row level security;

create or replace function public.is_campaign_owner(check_campaign_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.campaigns
    where campaigns.id = check_campaign_id
    and campaigns.owner_id = auth.uid()
  );
$$;

create or replace function public.is_character_owner(check_character_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.characters
    where characters.id = check_character_id
    and characters.owner_id = auth.uid()
  );
$$;

create or replace function public.is_campaign_member(check_campaign_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.campaign_characters
    where campaign_characters.campaign_id = check_campaign_id
    and campaign_characters.owner_id = auth.uid()
  );
$$;

create or replace function public.can_read_character_as_campaign_gm(check_character_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.campaign_characters
    join public.campaigns on campaigns.id = campaign_characters.campaign_id
    where campaign_characters.character_id = check_character_id
    and campaigns.owner_id = auth.uid()
  );
$$;

drop policy if exists "Recipes readable by owners members or system" on public.recipes;
create policy "Recipes readable by owners members or system"
on public.recipes for select
using (
  owner_id is null
  or auth.uid() = owner_id
  or (campaign_id is not null and (public.is_campaign_owner(campaign_id) or public.is_campaign_member(campaign_id)))
);

drop policy if exists "Users can create personal or campaign recipes" on public.recipes;
create policy "Users can create personal or campaign recipes"
on public.recipes for insert
with check (
  auth.uid() = owner_id
  and (
    (source_type = 'personal' and campaign_id is null)
    or (source_type = 'campaign' and campaign_id is not null and public.is_campaign_owner(campaign_id))
  )
);

drop policy if exists "Users can edit their recipes" on public.recipes;
create policy "Users can edit their recipes"
on public.recipes for update
using (auth.uid() = owner_id)
with check (
  auth.uid() = owner_id
  and source_type <> 'system'
);

drop policy if exists "Users can delete their recipes" on public.recipes;
create policy "Users can delete their recipes"
on public.recipes for delete
using (auth.uid() = owner_id and source_type <> 'system');

drop policy if exists "Cards readable by owners members or system" on public.cards;
create policy "Cards readable by owners members or system"
on public.cards for select
using (
  owner_id is null
  or auth.uid() = owner_id
  or (campaign_id is not null and (public.is_campaign_owner(campaign_id) or public.is_campaign_member(campaign_id)))
);

drop policy if exists "Users can create personal or campaign cards" on public.cards;
create policy "Users can create personal or campaign cards"
on public.cards for insert
with check (
  auth.uid() = owner_id
  and (
    (source_type = 'personal' and campaign_id is null)
    or (source_type = 'campaign' and campaign_id is not null and public.is_campaign_owner(campaign_id))
  )
);

drop policy if exists "Users can edit their cards" on public.cards;
create policy "Users can edit their cards"
on public.cards for update
using (auth.uid() = owner_id)
with check (
  auth.uid() = owner_id
  and source_type <> 'system'
);

drop policy if exists "Users can delete their cards" on public.cards;
create policy "Users can delete their cards"
on public.cards for delete
using (auth.uid() = owner_id and source_type <> 'system');

drop policy if exists "Character recipes readable by owner or GM" on public.character_recipes;
create policy "Character recipes readable by owner or GM"
on public.character_recipes for select
using (
  auth.uid() = owner_id
  or public.can_read_character_as_campaign_gm(character_id)
);

drop policy if exists "Character recipes manageable by owner or GM" on public.character_recipes;
create policy "Character recipes manageable by owner or GM"
on public.character_recipes for insert
with check (
  auth.uid() = owner_id
  and (
    public.is_character_owner(character_id)
    or public.can_read_character_as_campaign_gm(character_id)
  )
);

drop policy if exists "Character recipes updatable by owner or GM" on public.character_recipes;
create policy "Character recipes updatable by owner or GM"
on public.character_recipes for update
using (
  auth.uid() = owner_id
  or public.can_read_character_as_campaign_gm(character_id)
)
with check (
  auth.uid() = owner_id
  or public.can_read_character_as_campaign_gm(character_id)
);

drop policy if exists "Character recipes deletable by owner or GM" on public.character_recipes;
create policy "Character recipes deletable by owner or GM"
on public.character_recipes for delete
using (
  auth.uid() = owner_id
  or public.can_read_character_as_campaign_gm(character_id)
);

insert into public.cards (owner_id, campaign_id, word, color, tags, source_type)
select null, null, seed.word, seed.color, seed.tags, 'system'
from (
  values
    ('hunger', 'Red', array['desire','pursuit','need']),
    ('blood', 'Red', array['wound','violence','kinship']),
    ('spark', 'Red', array['fire','ignition','signal']),
    ('chain', 'Red', array['binding','force','restraint']),
    ('drum', 'Red', array['summons','rhythm','war']),
    ('blush', 'Red', array['shame','desire','exposure']),
    ('fang', 'Red', array['violence','beast','threat']),
    ('mirror', 'Blue', array['reflection','truth','duplication']),
    ('ledger', 'Blue', array['record','debt','commerce']),
    ('brine', 'Blue', array['water','preservation','memory']),
    ('map', 'Blue', array['passage','place','knowledge']),
    ('silence', 'Blue', array['absence','sound','secrecy']),
    ('frost', 'Blue', array['cold','delay','stillness']),
    ('ink', 'Blue', array['record','mark','secret']),
    ('root', 'Green', array['growth','binding','place']),
    ('cough', 'Green', array['body','illness','need']),
    ('moss', 'Green', array['growth','ruin','softness']),
    ('seed', 'Green', array['beginning','growth','hidden']),
    ('vine', 'Green', array['binding','motion','nature']),
    ('balm', 'Green', array['healing','care','relief']),
    ('marrow', 'Green', array['body','depth','life']),
    ('bell', 'Gold', array['sound','warning','attention']),
    ('crown', 'Gold', array['authority','pride','status']),
    ('coin', 'Gold', array['commerce','debt','exchange']),
    ('guard', 'Gold', array['authority','violence','order']),
    ('torch', 'Gold', array['light','signal','attention']),
    ('oath', 'Gold', array['promise','status','binding']),
    ('banner', 'Gold', array['faction','reputation','command']),
    ('dream', 'Violet', array['omen','unreality','prophecy']),
    ('veil', 'Violet', array['concealment','threshold','magic']),
    ('star', 'Violet', array['distance','omen','guidance']),
    ('echo', 'Violet', array['repetition','memory','sound']),
    ('mask', 'Violet', array['deception','identity','ritual']),
    ('door', 'Violet', array['threshold','passage','choice']),
    ('omen', 'Violet', array['warning','fate','sign']),
    ('ash', 'Black', array['death','ruin','residue']),
    ('grave', 'Black', array['death','place','memory']),
    ('rot', 'Black', array['decay','body','corruption']),
    ('shadow', 'Black', array['concealment','fear','absence']),
    ('bone', 'Black', array['death','body','structure']),
    ('debt', 'Black', array['obligation','guilt','cost']),
    ('knife', 'Black', array['violence','secrecy','betrayal']),
    ('mercy', 'White', array['compassion','judgment','absolution']),
    ('saint', 'White', array['oath','faith','memory']),
    ('silver', 'White', array['purity','value','reflection']),
    ('candle', 'White', array['light','vigil','fragility']),
    ('prayer', 'White', array['speech','faith','hope']),
    ('witness', 'White', array['truth','judgment','attention']),
    ('linen', 'White', array['care','body','healing'])
) as seed(word, color, tags)
where not exists (
  select 1 from public.cards
  where cards.owner_id is null
  and cards.campaign_id is null
  and cards.word = seed.word
  and cards.color = seed.color
);

insert into public.recipes (owner_id, campaign_id, name, family, core_tags, chroma, hit, strong_hit, miss, source_type)
select null, null, seed.name, seed.family, seed.core_tags, seed.chroma, seed.hit, seed.strong_hit, seed.miss, 'system'
from (
  values
    ('Bell-Cracker Cut', 'Strike', array['violence','weapon','force','command','sound'], array['Red','Gold'], 'Break, silence, interrupt, or disable an object, alarm, voice, weapon, or power source.', 'Also remove, change, or corrupt one Scene Word.', 'It breaks loudly or dangerously. Add Threat, spend Gear, or trigger Pressure.'),
    ('Blood for the Door', 'Strike / Sway', array['violence','sacrifice','force','oath','passage'], array['Red','Black'], 'Force passage through something that wants payment.', 'You choose what it takes.', 'It opens and takes more than you offered.'),
    ('Saint-Stone Intercession', 'Shelter', array['defense','protection','oath','healing','faith'], array['White','Blue'], 'Protect someone from supernatural, moral, psychic, or memory-based harm.', 'Also reveal what the danger wanted from them.', 'You protect them, but the danger marks you instead.'),
    ('Brace the Threshold', 'Shelter', array['defense','place','passage','craft','protection'], array['White','Gold'], 'Secure a doorway, room, camp, or vulnerable position.', 'Create a Setup Word tied to the secured place.', 'It holds only if someone stays, pays, or is exposed.'),
    ('Pilgrim''s Read', 'Uncover', array['memory','knowledge','perception','ritual','oath','trace'], array['Blue','White'], 'Interpret sacred marks, vows, paths, warnings, relics, or ritual architecture.', 'Ask an additional question or reveal a hidden route.', 'You learn the truth by triggering part of it.'),
    ('Follow the Slip', 'Uncover', array['memory','perception','truth','speech','suspicion','attention'], array['Blue','Gold'], 'Turn an NPC''s slip into a concrete lead.', 'They don''t realize what they revealed.', 'You get the lead, but they know you noticed.'),
    ('False Key', 'Distort', array['deception','lock','secrecy','shadow','magic','passage'], array['Blue','Black'], 'Bypass, deceive, or confuse a lock, seal, ward, watcher, or gate.', 'It remains fooled after you pass.', 'It opens, but something knows.'),
    ('Ashen Veil', 'Distort', array['concealment','shadow','magic','deception','fear','death'], array['Black','Violet'], 'Hide yourself, obscure an ally, or blur a scene boundary.', 'Create a temporary Black or Violet Setup Word.', 'You vanish from the wrong thing or attract something worse.'),
    ('Quiet Crossing', 'Move', array['motion','stealth','passage','patience','water','shadow'], array['Blue','Green'], 'Move through danger without raising Alert.', 'Bring someone or something with you safely.', 'You arrive, but Pressure advances.'),
    ('Mercy Purchase', 'Sway / Shelter', array['mercy','trust','care','healing','debt','oath','speech'], array['White','Green'], 'Gain trust by addressing a need, pain, fear, or vulnerability.', 'The NPC offers more than you asked for.', 'The need becomes your responsibility.'),
    ('Soft Confession', 'Sway', array['speech','truth','vulnerability','guilt','oath','memory'], array['White','Blue'], 'Lower suspicion or make someone answer one question without hostility.', 'They reveal what they wish you hadn''t asked.', 'You reveal more than intended.'),
    ('Knife Under the Table', 'Sway / Distort', array['threat','fear','deception','violence','speech','status'], array['Red','Black'], 'Force a concession through menace, blackmail, or implied violence.', 'They comply without public escalation.', 'They escalate, call help, or mark you as dangerous.')
) as seed(name, family, core_tags, chroma, hit, strong_hit, miss)
where not exists (
  select 1 from public.recipes
  where recipes.owner_id is null
  and recipes.campaign_id is null
  and recipes.name = seed.name
);

insert into public.character_recipes (character_id, recipe_id, owner_id)
select characters.id, recipes.id, characters.owner_id
from public.characters
cross join public.recipes
where recipes.source_type = 'system'
and not exists (
  select 1 from public.character_recipes
  where character_recipes.character_id = characters.id
  and character_recipes.recipe_id = recipes.id
);

drop policy if exists "Roster readable by character owner or campaign GM" on public.campaign_characters;
create policy "Roster readable by character owner or campaign GM"
on public.campaign_characters for select
using (
  auth.uid() = owner_id
  or public.is_campaign_owner(campaign_id)
);

drop policy if exists "Players can link their own characters" on public.campaign_characters;
drop policy if exists "Campaign owners can link their own characters" on public.campaign_characters;
create policy "Campaign owners can link their own characters"
on public.campaign_characters for insert
with check (
  auth.uid() = owner_id
  and public.is_character_owner(character_id)
  and public.is_campaign_owner(campaign_id)
);

drop policy if exists "Campaigns are readable by members" on public.campaigns;
create policy "Campaigns are readable by members"
on public.campaigns for select
using (public.is_campaign_member(id));

create or replace function public.join_campaign_by_invite(
  join_code text,
  join_character_id uuid
)
returns table (
  id uuid,
  owner_id uuid,
  name text,
  invite_code text,
  beat_number integer,
  default_cr integer,
  posting_window text,
  scene_words jsonb,
  threat jsonb,
  created_at timestamptz,
  updated_at timestamptz,
  link_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_campaign public.campaigns%rowtype;
  joined_link public.campaign_characters%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Sign in before joining a campaign.';
  end if;

  if not public.is_character_owner(join_character_id) then
    raise exception 'Open one of your saved sheets before joining a campaign.';
  end if;

  select *
  into matched_campaign
  from public.campaigns
  where campaigns.invite_code = upper(trim(join_code))
  limit 1;

  if matched_campaign.id is null then
    raise exception 'Invite code not found.';
  end if;

  insert into public.campaign_characters (
    campaign_id,
    character_id,
    owner_id
  )
  values (
    matched_campaign.id,
    join_character_id,
    auth.uid()
  )
  on conflict (campaign_id, character_id) do update
  set owner_id = excluded.owner_id
  returning *
  into joined_link;

  return query
  select
    matched_campaign.id,
    matched_campaign.owner_id,
    matched_campaign.name,
    matched_campaign.invite_code,
    matched_campaign.beat_number,
    matched_campaign.default_cr,
    matched_campaign.posting_window,
    matched_campaign.scene_words,
    matched_campaign.threat,
    matched_campaign.created_at,
    matched_campaign.updated_at,
    joined_link.id;
end;
$$;

drop policy if exists "Roster deletable by character owner or campaign GM" on public.campaign_characters;
create policy "Roster deletable by character owner or campaign GM"
on public.campaign_characters for delete
using (
  auth.uid() = owner_id
  or public.is_campaign_owner(campaign_id)
);

drop policy if exists "Campaign GMs can read linked characters" on public.characters;
create policy "Campaign GMs can read linked characters"
on public.characters for select
using (public.can_read_character_as_campaign_gm(id));

create table if not exists public.campaign_scenes (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'New Scene',
  summary text not null default '',
  is_active boolean not null default false,
  scene_words jsonb not null default '[]'::jsonb,
  default_cr integer not null default 9 check (default_cr between 7 and 15),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.campaign_scenes enable row level security;

drop policy if exists "Scenes readable by campaign roster or GM" on public.campaign_scenes;
create policy "Scenes readable by campaign roster or GM"
on public.campaign_scenes for select
using (
  public.is_campaign_owner(campaign_id)
  or public.is_campaign_member(campaign_id)
);

drop policy if exists "Scenes editable by campaign GM" on public.campaign_scenes;
create policy "Scenes editable by campaign GM"
on public.campaign_scenes for all
using (public.is_campaign_owner(campaign_id))
with check (public.is_campaign_owner(campaign_id));

drop trigger if exists campaign_scenes_set_updated_at on public.campaign_scenes;
create trigger campaign_scenes_set_updated_at
before update on public.campaign_scenes
for each row execute function public.set_updated_at();

create table if not exists public.campaign_beats (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references public.campaign_scenes(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  beat_number integer not null default 1 check (beat_number >= 1),
  prompt text not null default '',
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (scene_id, beat_number)
);

alter table public.campaign_beats enable row level security;

drop policy if exists "Beats readable by campaign roster or GM" on public.campaign_beats;
create policy "Beats readable by campaign roster or GM"
on public.campaign_beats for select
using (
  public.is_campaign_owner(campaign_id)
  or public.is_campaign_member(campaign_id)
);

drop policy if exists "Beats editable by campaign GM" on public.campaign_beats;
create policy "Beats editable by campaign GM"
on public.campaign_beats for all
using (public.is_campaign_owner(campaign_id))
with check (public.is_campaign_owner(campaign_id));

drop trigger if exists campaign_beats_set_updated_at on public.campaign_beats;
create trigger campaign_beats_set_updated_at
before update on public.campaign_beats
for each row execute function public.set_updated_at();

create table if not exists public.campaign_posts (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  scene_id uuid references public.campaign_scenes(id) on delete set null,
  beat_id uuid references public.campaign_beats(id) on delete set null,
  character_id uuid not null references public.characters(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  post_type text not null check (post_type in ('act', 'breathe', 'setup', 'ghost')),
  post_summary text not null default '',
  mechanics_text text not null default '',
  mechanics_payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'resolved', 'rejected')),
  resolution_text text not null default '',
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.campaign_posts
add column if not exists mechanics_payload jsonb not null default '{}'::jsonb;

update public.campaign_posts
set post_type = 'breathe'
where post_type in ('recover', 'exhale');

alter table public.campaign_posts
drop constraint if exists campaign_posts_post_type_check;

alter table public.campaign_posts
add constraint campaign_posts_post_type_check
check (post_type in ('act', 'breathe', 'setup', 'ghost'));

alter table public.campaign_posts enable row level security;

drop policy if exists "Posts readable by owner or campaign GM" on public.campaign_posts;
create policy "Posts readable by owner or campaign GM"
on public.campaign_posts for select
using (
  auth.uid() = owner_id
  or public.is_campaign_owner(campaign_id)
);

drop policy if exists "Posts can be created by their owner" on public.campaign_posts;
create policy "Posts can be created by their owner"
on public.campaign_posts for insert
with check (
  auth.uid() = owner_id
  and public.is_character_owner(character_id)
  and exists (
    select 1
    from public.campaign_characters
    where campaign_characters.campaign_id = campaign_posts.campaign_id
    and campaign_characters.character_id = campaign_posts.character_id
    and campaign_characters.owner_id = auth.uid()
  )
);

drop policy if exists "Posts can be updated by owner or campaign GM" on public.campaign_posts;
create policy "Posts can be updated by owner or campaign GM"
on public.campaign_posts for update
using (
  auth.uid() = owner_id
  or public.is_campaign_owner(campaign_id)
)
with check (
  auth.uid() = owner_id
  or public.is_campaign_owner(campaign_id)
);

drop trigger if exists campaign_posts_set_updated_at on public.campaign_posts;
create trigger campaign_posts_set_updated_at
before update on public.campaign_posts
for each row execute function public.set_updated_at();

create table if not exists public.campaign_discord_links (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  guild_id text not null,
  channel_id text not null,
  thread_id text,
  linked_by text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (campaign_id),
  unique (guild_id, channel_id)
);

alter table public.campaign_discord_links enable row level security;

drop policy if exists "Discord links readable by campaign GM" on public.campaign_discord_links;
create policy "Discord links readable by campaign GM"
on public.campaign_discord_links for select
using (public.is_campaign_owner(campaign_id));

drop policy if exists "Discord links editable by campaign GM" on public.campaign_discord_links;
create policy "Discord links editable by campaign GM"
on public.campaign_discord_links for all
using (public.is_campaign_owner(campaign_id))
with check (public.is_campaign_owner(campaign_id));

drop trigger if exists campaign_discord_links_set_updated_at on public.campaign_discord_links;
create trigger campaign_discord_links_set_updated_at
before update on public.campaign_discord_links
for each row execute function public.set_updated_at();

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  discord_user_id text unique,
  discord_username text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles readable by owner" on public.profiles;
create policy "Profiles readable by owner"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Profiles editable by owner" on public.profiles;
create policy "Profiles editable by owner"
on public.profiles for all
using (auth.uid() = id)
with check (auth.uid() = id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table if not exists public.discord_account_link_codes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  code text not null unique,
  expires_at timestamptz not null,
  claimed_at timestamptz,
  claimed_discord_user_id text,
  claimed_discord_username text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id)
);

alter table public.discord_account_link_codes enable row level security;

drop policy if exists "Account link codes readable by owner" on public.discord_account_link_codes;
create policy "Account link codes readable by owner"
on public.discord_account_link_codes for select
using (auth.uid() = owner_id);

drop policy if exists "Account link codes editable by owner" on public.discord_account_link_codes;
create policy "Account link codes editable by owner"
on public.discord_account_link_codes for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop trigger if exists discord_account_link_codes_set_updated_at on public.discord_account_link_codes;
create trigger discord_account_link_codes_set_updated_at
before update on public.discord_account_link_codes
for each row execute function public.set_updated_at();
