---
sidebar_position: 1
slug: /entities
---

# Entities

A punch is an `entityskill_` row on the Denizen entity. The Mythic YAML is only the vanilla shell those rows ride on.

Combat mobs and companions. Prefixes: `entity_`, `entityai_`, `entityanimation_`, `entitymodel_`, `entityskill_`, `entityprofile_`. Living HP and damage stay on `livingentity_`. On the Frontend, one mob's `entity_`, `entityai_`, and `entityskill_` containers share that mob's file (`entity_example_boar.dsc`). Profiles and living entities stay shared. See [living-entities.md](../living-entities.md) and [Mythic mechanisms](mythic-mechanisms.md).

## Mythic base types

MythicMobs holds a small set of **vanilla Type shells**. Pack content does not add a Mythic mob file per entity. Campaign already did this (`entity: base_land_mob` plus a Model Engine blueprint).

| Rules key (`mythic_base_types`) | Mythic internal name | Vanilla Type |
| --- | --- | --- |
| `statue` | `base_statue_mob` | ARMOR_STAND |
| `land` | `base_land_mob` | ZOMBIE |
| `water` | `base_water_mob` | DROWNED |
| `passive_water` | `base_passive_water_mob` | DOLPHIN |
| `air` | `base_air_mob` | PHANTOM |
| `land_tamed` | `base_land_mob_tamed` | WOLF |

Those Mythic rows keep Health/Damage at `1`, enable `ThreatTable`, and only change Options when needed. The statue sets `Collidable: false`. Land, water, and air set `PreventSunburn: true` (zombie, drowned, and phantom burn in daylight). Spawn does not set `should_burn`. Display, MEG model, stats, AI, skills, loot, and nametag live on Denizen `entity_` (and piece scripts).

`entity_.data.mythic` is that internal name. Smoke: `entity_example_boar` uses `mythic: base_land_mob` and `model.blueprint: boar`.

Wrong: a Mythic YAML named after every grunt or boss. Right: pick a base, attach the model in Denizen.

Only add a new Mythic YAML when you need a **new vanilla Type** (or a shell option none of the bases cover).

## Spawn (Live)

`spawn_entity` (`Entities/entity_spawn.dsc`) is the only register path. Callers: `/packentity spawn`, `SPAWN_ENTITY`, area `MOB_SPAWN` (`tick_one_area_mob_spawn`).

Order: chunkload → `mythicspawn` → wait 1t → index stamp → inject model → inject Mythic AI + vanilla cleanup + `prevent_vanilla_drops` → `finalize_entity_spawn_stats` (wait 2t, harvest `SpawnPEentity` settle, then inject living init → profile → refill → shell heal → nametag). All inject, no parallel `run` on stats. Optional spawn invulnerable / crew after.

`entity_.prevent_vanilla_drops: true` stamps `runtime_data.entity.prevent_vanilla_drops`, zeros equipment drop chance, clears vanilla death loot and XP (`on entity dies` → `NO_DROPS` / `NO_XP`), and clears Mythic death drops (`on mythicmob mob dies` → empty list). Omit or `false` keeps default Bukkit/Mythic behavior. Land shells are often `ZOMBIE`, so camp grunts usually set this true. Pack loot later uses engine ops, not rotten flesh from the shell.

Mythic adjust matches legacy `handle_entity_mythicmob_settings`: `despawn_mode`, `faction`, `ai_goals`, `ai_targets`. `pathfinding_malus` is a `MythicMobsMobTag` mechanism (`adjust <entity.mythicmob> pathfinding_malus`). Goal names, target names, and path types come from `.cursor/denizen_context/external_options/mythic_mobs_ai_options.md`. `faction` is the Mythic group those faction target selectors compare. Why it exists, and how Frontend pairs it with `ai_targets`, is `.cursor/denizen_context/external_options/mythic_mobs_factions_documentation.md`. Campaign grunts often set both AI lists to `clear` so the zombie shell does not swing on its own. Threat table + follow range still chase the player. **Melee hits are not Mythic skills and not vanilla mob attacks.** They are `entityskill_` rows with `trigger: MELEE` (legacy `peentity_target_loop` + `PEentity_swing` wrapping a skill body). Boss **cast** rows use `trigger: CAST` and the `entityai_.cast` cadence. Optional `heal_on_target_loss` matches legacy `healontargetloss` on target loss.

Living-entity HP is pack stats. When the health route hits `depletes_to`, the engine kills the entity (legacy died at vanilla health 0). `mythicmob mob dies` unregisters the index. Pack `damage_routing` `ondeplete` hooks still run before that kill.

Missing Mythic base narrates `entity_mythic_missing_text`. Index keys are [entity rules](../rules/entities.md). Live ops: `SPAWN_ENTITY`, `SET_ENTITY_MODEL`, `ANIMATE_ENTITY`, `MYTHIC_PATH`, `MYTHIC_SIGNAL`, `MYTHIC_THREAT`. See [mechanics/operations.md](../mechanics/operations/README.md).

## Level (Live)

Pack level is not Mythic level. `resolve_spawn_entity_level` picks `use_area_level` (highest area `entity_level` at the spawn point), else an explicit `spawn_level`, else `entity_level_default` (5).

`apply_entity_profile_at_level` always flags `runtime_data.entity.resolved_level`. When `entityprofile_` multipliers are present, each listed living-entity stat is `SET_STAT` to `resolved * mul`, consumables refill to the new max, and `visual_level` is `resolved * average(multipliers)`. Without multipliers, `visual_level` equals `resolved_level`. Never adjust Depenizen Mythic level.

`/packentity spawn [entity_script] [level|area]`: a decimal third arg is `spawn_level`. `area` sets `use_area_level` true. Success narrates `entity_spawn_level_text` with resolved and visual.

## Profile (Live)

`entityprofile_*` holds a `multipliers` map of pack stat ids (legacy `pe_entity_types` hp/str/wp). Smoke profiles: `entityprofile_grunt`, `miniboss`, `boss`, `superboss`, `tank`, `glass_cannon`. `entity_example_boar` uses `entityprofile_grunt` with `stat_health`, `stat_strength`, `stat_willpower` on `livingentity_example_boar`. Spawn applies `resolved_level * multiplier` per stat, then refills consumables. Nametag `level_mode` `SCALED` paints `visual_level` (resolved times profile average). `RESOLVED` paints the spawn level. `entityprofile_superboss` at level 45 yields visual ~255, not 45.

## Nametag (Live)

`Entities/entity_nametag.dsc` draws the Model Engine `nametag` bone. Config is `entity_.visuals.nametag` (`entity_nametag_data_keys`). `level_mode` is `SCALED` (visual) or `RESOLVED` (resolved). Name is a transcript key or literal (overlay stays lowercase). Level glyphs use `pelevels_fontpack`. HP glyphs use `peentity_fontpack:pehealthbars`.

Init waits 1t after spawn. `SET_ENTITY_MODEL` / `apply_entity_model_at_spawn` rebinds after 1t when the nametag flag is already stamped. Damage refresh runs `update_entity_nametag` after living-entity routing (before triggerable notify). Optional `nametag_status` bonus alphabet is a runtime flag.

Smoke: `/packentity smoke nametag` (separate from `all`). Narrates `entity_smoke_nametag_text`.

## Cast arsenal (Live)

`Entities/entity_cast.dsc` runs on the same 1s delta as `player_game_loop`, from `entity_engine_events`. It walks `entity_index` rows (no `while`).

`entity_` lists `entityskill_` ids under `skills`. `entityai_` may add `cast:` for `trigger: CAST` and `FOLLOW_UP` rows:

| Key | Role |
| --- | --- |
| `initial_delay` / `interval_min` / `interval_max` / `idle_interval` | Cadence |
| `pick` | `WEIGHTED` (default), `PRIORITY`, or `SEQUENCE` |
| `entries` | Skill id list for the default phase |
| `phases` | Map of phase id to `hp_below` / `hp_above`, optional `pick`, and `entries` |
| `fallback` | Skill id when the pool is empty after gates |
| `pause_while` | World-lock ids. Any present freezes the whole arsenal (hyperarmor pattern) |

`entityskill_` gates: `cooldown`, `min_range` / `max_range`, `hp_above` / `hp_below`, `chance`, `weight`, `priority`, `no_repeat`, `no_repeat_group`, `requirements`, `face_target`, entry `pause_while`. `trigger: MELEE` is WEIGHTED among passers (legacy `punchanimation` list). After a completed swing, that row's `cooldown` is stamped on every MELEE skill so the pool shares one attackspeed. `FOLLOW_UP` rows only fire while `cast_follow_up` is armed (duration `entity_cast_follow_up_duration` in `rules.dsc`) after the mob lands a hit. `follow_up_guaranteed: true` skips that entry's cooldown while the arm window is live. `trigger: HURT` fires from `core_custom_damage_event` after a landed hit (WEIGHTED among passers, skipped while `cast_busy`). After a completed flinch, that row's `cooldown` is stamped on every HURT skill (legacy `hurtanimation` list). `SEQUENCE` stays on the current entry until `repeats` successful wraps (default 1), then advances. A cast sets `cast_busy`, runs `BEFORE` ops (inject so `ANIMATE_ENTITY` delay blocks the wrap), then `RUN_SKILLMOVE` and `AFTER`. If a reaction clears `cast_busy` during the windup, the body aborts.

`entityanimation_` may set `delay`, `lock_movement`, `invulnerable_during`, and `speed`. Point `ANIMATE_ENTITY` `animation:` at that script id (or a bare MEG state name).

Smoke: spawn `entity_example_boar`, hit it once so Mythic sets a target, stand within 8 blocks. After the first 1s arm tick, expect a punch about every 3s. Crocodile clips are `/packentity smoke`.

## Hit gates, reactions, behaviors (Live)

Legacy anti-cheese (max hit distance, water chase, mobility dash) is pack data, not hard-coded loops.

**`entity_.hit_requirements`** (`Entities/entity_hit_gates.dsc`): list of mechanic `requirements` checked on the **attacker** before HP routing. Context caster is the attacker, primary target is the victim. Use `DISTANCE` with `source: target` and `other: caster` to cap how far away players can hurt the mob (`horizontal: true` optional). Optional `transcript` key narrates the attacker on fail. Injected on `core_custom_damage_event` and stops the packet when a row fails.

**`entityai_.reactions`**: map of row ids (`entity_reaction_keys` in `rules.dsc`). Each row may filter `damage_types`, `min_range` / `max_range` (victim to attacker), `requirements`, `pause_while` / `only_while` world-lock ids, `cooldown`, `hits` plus `reset_after`, `negate: true` (pre phase, cancels damage), and `interrupt: true` (clears `cast_busy` and wipes `cast_state` so an in-flight windup aborts). While `INVULNERABLE` blocks HP, `interrupt: true` rows still run when `cast_busy` is set (`try_interrupt_entity_cast_on_invulnerable_hit`), so windup godmode can be cancelled. `operations` are mechanic blocks or a list of ops (same as `entityskill_` / damage route hooks). State lives under `runtime_data.entity.reaction`. `Entities/entity_reactions.dsc`.

**`entityai_.behaviors`**: map of row ids with `interval`, optional `modes` (allow list of `entity_ai_modes` values), optional `only_with_target` (default true), `requirements`, and `operations`. Runs on the entity AI tick when a Mythic target exists (`Entities/entity_combat_behaviors.dsc`). A `modes` miss skips the row before interval and requirements.

**Optional movement** (`Entities/entity_movement.dsc`): omit a key and that helper is off. Helpers only run while the stamped `ai_mode` is `COMBAT`. `max_jump_height` uses the legacy hop from `PEentity_movement.dsc`. The target must be 2 to that many blocks higher, and within 3 blocks horizontally. It damps the current velocity, sets Y to the height gap divided by 3.5, nudges X by 0.5, then nudges X again after 5 ticks. The next attempt waits 2 seconds. `water_movement` plus `water_speed` climbs onto nearby land or dashes through water. `mobility` leaps when the target is past the melee `max_range` (or `mobility_range`). `mobility_cooldown` defaults to `4s`. `mobility_animation` plays `ANIMATE_ENTITY` on the mob. The boar omits these, so it does not leap.

**Companions** (`Entities/entity_companion.dsc`): an `entityai_` `companion` block. Summon with `SPAWN_ENTITY` (owner defaults to the player caster). Mythic owns the walk (`gotoowner` plus `meleeattack`). Pack melee reads the Mythic threat-table top (`mythicmob.target`), not `has_target`. Living-entity and player hits cancel vanilla before Mythic `OwnerAttacker` / `OwnerTarget` can fire, so Denizen bridges both: owner hurt and owner landed hit call `engage_companions_for_owner` (FOLLOW only, HOLD stays). Frontend still lists those Mythic selectors as backup for non-routed shells. `aigoal_` / `aitarget_` / `aipath_` are Frontend lists compiled on reload. `SET_ENTITY_AI` can set `goals`, `targets`, `malus`, or `mode` and skips any key you omit. `SET_COMPANION_STATE` `FOLLOW` or `HOLD` applies that mode. `RECALLED` / `STORED` despawn the body and flip the roster row (join only restores `OUT`). Roster key is a stable `companion_instance` id. Soft world uuid is only a pointer. Level is snapshotted on the row. Boss `crew:` uses the same roster shape on the owner entity. `teleport_distance` is a 10 second snap when the body is still out but too far. Shell `target_range` (FollowRange) must be larger than `gotoowner` follow distance. `friendly_fire` defaults false. Cap is `companion_cap`. `despawn_after` on `entityai_` removes an idle pet after that duration with no fight target.

**AI modes** (`Entities/entity_ai_modes.dsc`): companions use `FOLLOW` / `HOLD`. Combat mobs use `IDLE` / `COMBAT` / `PATROL` / `RETURN_HOME` / `FLEE`. Spawn stamps `patrol_points` before `ai_mode` so patrol-only camps opt in. Mode stamp only when the pack can swap (`modes:`, `deaggro_range`, patrol points, or companion). The 1 second tick skips mobs without that stamp. Lists adjust only when the desired mode changes. A mode profile that omits `goals` / `targets` / `malus` stamps only (no Mythic list rewrite). Use that when `IDLE` and `COMBAT` share the same hunt lists. `PATROL` runs `mythicpath` from stamped patrol points (area `mob_spawn.patrol` or `entity_.patrol` offsets) and repaths on `entity_patrol_repath_interval` while idle. `RETURN_HOME` clears the ActiveMob target and paths home when past `deaggro_range`. Home leash is `deaggro_range` + `RETURN_HOME` + area `leash`. Do not invent a second `leash_range` / `return_on_deaggro` key. `FLEE` only when `entityai_.flee.hp_below` is set (0 to 100) and pack HP percent is under that while a fight target exists. Companions never auto-enter `COMBAT` / `IDLE` / `FLEE`.

**`notify_allies`**: when `entityai_.notify_allies` is true, a new indexed engage signals same-faction indexed Mythic allies within `notify_radius` (default `entity_notify_radius_default`) with `entity_ally_notify_signal`, and seeds their Mythic target if they have none. Requires `faction:` on the caller and allies. Boar smoke uses `faction: Grunt`.

**Threat** (`Entities/entity_threat.dsc`): optional `entityai_.threat` with `swap_threshold` and `hold_time`. Reads Mythic `threat_table` and retargets when another uuid leads by the threshold. Engage still seeds threat on cancelled hits. `PLAY_BOSS_MUSIC` (op or `entity_.boss_music` at spawn) stamps a sound the 1s tick replays under `entity_boss_music_sound_category` (default `RECORDS`). Index remove / death runs `stop_entity_boss_music`, which `adjust`s world players with PlayerTag `stop_sound` for that category (and a `minecraft:` key when the stamped sound is one), then clears the flag. Clearing the flag alone does not stop the client loop.

### Boss patterns

Pack-compose Dark Souls-style bosses without new engine keys:

| Pattern | How |
| --- | --- |
| Windup godmode | `entityanimation_` with `delay`, `lock_movement`, `invulnerable_during` on CAST `BEFORE` |
| Hyperarmor | Apply a world lock in `BEFORE`, list it on arsenal/entry `pause_while` so other skills skip |
| Posture break | Reaction `hits` + `reset_after`, then ops (and optional `interrupt: true`) |
| Range cheese | `entity_.hit_requirements` `DISTANCE` (no second `max_hit_range` key) |
| Soft enrage | Area `on_tick` / pack phases (`hp_below`), not a built-in timer |
| Camp call-in | `faction` + `notify_allies` / `notify_radius` on grunts |

Smoke test for cancelled damage: punch a grunt with engage disabled and see if `hurtbytarget` still acquires a target. If it does not, keep the engage bridge. Two-player threat swap is only trustworthy after that test passes.

**Death, loot, and crew** (`Entities/entity_death_rewards.dsc`): `track_damagers` stamps the mob at spawn. Player hits that land add that player's uuid and the damage the routes consumed. `on_death` is mechanic ops with `source_type: ENTITY_DEATH`, run on `mythicmob dies` before index cleanup. `loot.table` is a `loottable_*`. `mode: ALL` rolls once per online damager. `ELIGIBLE` is that roll after `min_contribution`. `SPLIT` rolls once (highest contributor is the caster) and scales item and currency quantities by each player's share of the total. A share under `min_contribution` (0 to 1) gets nothing. Omit `loot` and this engine pays nothing. `crew` is a list of `entity_` ids, or maps with `entity` and optional `linger: true`. They spawn owned by the boss. Boss death removes them unless that row set linger. Admin remove still clears linger rows.

Crocodile clips are `/packentity smoke`. Solo boss without crew: `/packentity spawn entity_smoke_crocodile_boss_solo 45`. `/packentity spawn entity_example_boar` uses Mythic `meleeattack` plus `hurtbytarget` / `players`, stamps IDLE then COMBAT on engage, leashes past 40, and `notify_allies` for `faction: Grunt`. Companion smoke uses `mechanic_example_companion` through `run_mechanic_test` (`summon`, `hold`, `follow`, `recall`, `store`). The wolf follows with `gotoowner`, teleports past 24 on the 10 second pulse, and comes back after relog while the roster row is `OUT`.

## Admin

`/packentity list` opens `menu_entity_list` (PAGE, uuid + status/script/area/owner, teleport click). Console narrates the same rows (uuid first). `/packentity spawn [entity_script] [level|area]` at the player's feet. `/packentity remove` drops the nearest indexed mob within `entity_remove_range`, or `/packentity remove [uuid]` from the list lore. `/packentity prune` drops leftover, ghost, and orphans. `/packentity prune [radius]` removes every indexed mob in that sphere (live too). `/packentity smoke [kind]` runs Live ops on the nearest indexed mob (`all` / `model` / `animate` / `path` / `signal` / `threat` / `nametag`). Defaults are `entity_smoke_values` in `rules.dsc`. `/packentity clear` wipes the index. Remove, prune, and a crew despawn save a mount row before the body goes, including when the owner is offline.


## Mythic mechanisms

Dual setters, spawn mechanisms, commands, and the surfaces this engine does not use are on [Mythic mechanisms](mythic-mechanisms.md).
