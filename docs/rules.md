---
sidebar_position: 3
---

# rules.dsc

**Live** as the shared contract. File: [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc). Read it with `proc[get_rule_value].context[<key>]`. Never copy these strings into ops.

This page tracks every top-level key under `rules.data`. When you add a key, add a row here.

## Pointers (script names)

| Key | Value today | Notes |
| --- | --- | --- |
| `player_entity` | `livingentity_player` | Default living-entity config for players |
| `gamerules` | `registry_gamerules` | Frontend pack policy. [gamerules.md](gamerules.md) |
| `allowed_damage_types_gamerules` | `allowed_vanilla_damage_types` | Contract until that registry exists |
| `global_build_config` | `global_build_config` | Live schema (skill/passive slot stats, gear slot ids, cosmetic persist channels, GIVE_ITEM dest cells) |
| `global_vault_config` | `global_vault_config` | Live schema (vault size, pages, combat BOOLEAN pointer). See [vaults.md](vaults.md) |
| `global_trade_config` | `global_trade_config` | Live schema (cooldown, blocked_flags, optional max_distance). See [trades.md](trades.md) |
| `global_mongo_config` | `global_mongo_config` | Pack database and collection names. URI stays in secrets. See [receipts.md](receipts.md) |
| `global_item_config` | `global_item_config` | Live schema (tiers, max level, skill slot lists, sets). Set piece counting is not an engine |
| `global_format_config` | `global_format_config` | Live via format lookup |

## script_prefixes

Each entry has `type` (usually `data`) and `value` (the name prefix). Reload collects `util.scripts` whose name starts with `value`.

| Prefix key in rules | Prefix string | Status |
| --- | --- | --- |
| `registry_prefix` | `registry_` | Live (gamerules) |
| `stat_prefix` | `stat_` | Live |
| `livingentity_prefix` | `livingentity_` | Live |
| `currency_prefix` | `currency_` | Live |
| `loottable_prefix` | `loottable_` | Live resolver |
| `lootpool_prefix` | `lootpool_` | Live resolver |
| `lootentry_prefix` | `lootentry_` | Live resolver |
| `lootcrate_prefix` | `lootcrate_` | Live crate GUI |
| `item_prefix` | `item_` | Live (create/give, skills list, consume envelope) |
| `repairprofile_prefix` | `repairprofile_` | Contract |
| `levelprofile_prefix` | `levelprofile_` | Contract |
| `questcategory_prefix` | `questcategory_` | Live. Menu grouping. Also matches `quest_` because the name starts with that prefix. See [quests.md](quests.md) |
| `quest_prefix` | `quest_` | Live. Objectives, complete mechanics, loot entry rewards |
| `waypoint_prefix` | `waypoint_` | Live. Placed spots share the id. See [travel.md](travel.md) |
| `entity_config` | `entity_` | Live. Piece prefixes below also start with `entity_`. An `entity_` list must skip those names |
| `entityai_prefix` | `entityai_` | Live. Targeting, cast pattern, reactions, companion, notify_allies |
| `entityanimation_prefix` | `entityanimation_` | Live. Model Engine state for `megstate` (delay, lock, invuln) |
| `entitymodel_prefix` | `entitymodel_` | Live. Model Engine blueprint, scale, hitbox |
| `entityskill_prefix` | `entityskill_` | Live. MELEE / CAST / FOLLOW_UP / HURT wrap around a `skillmove_` |
| `entityprofile_prefix` | `entityprofile_` | Live. Stat multiplier template |
| `mount_config` | `mount_` | Reserved. The ride is `entity_.mount`. See [mounts.md](mounts.md) |
| `castset_prefix` | `castset_` | Contract. Hotbar overlay set. See [mounts.md](mounts.md) |
| `npc_config` | `npc_` | Contract |
| `dialogue_config` | `dialogue_` | Contract |
| `class_config` | `class_` | Frontend menu catalog. Progress is pack stats. Do not use `data.classes` |
| `skillmove_config` | `skillmove_` | Live (`RUN_SKILLMOVE`) |
| `mechanic_config` | `mechanic_` | Live (`RUN_MECHANIC`, inherit script names) |
| `itemskill_config` | `itemskill_` | Live (`RUN_ITEMSKILL`) |
| `cosmetic_config` | `cosmetic_` | Live (`EQUIP_COSMETIC` / `CLEAR_COSMETIC` / `SPAWN_COSMETIC`) |
| `seasonpass_config` | `seasonpass_` | Live (`GRANT_SEASON_XP` / `SET_SEASON_TRACK` / `REDEEM_SEASON_REWARD` / `OPEN_SEASON_PASS`) |
| `spray_config` | `spray_` | Live (`PLACE_SPRAY` / `OPEN_SPRAY_MENU`, `peimagemap` filled_map) |
| `poster_config` | `poster_` | Live (`/packposter`, `peimagemap` filled_map, map ids 1 to 10) |
| `title_config` | `title_` | Live (`OPEN_TITLE_MENU`, `EQUIP_TITLE`, ChatPrefix lists) |
| `chatrow_prefix` | `chatrow_` | Live. Crew, rank, and extra chat strings. See [chat.md](chat.md) |
| `chatwords_prefix` | `chatwords_` | Live. Optional word list. See [chat.md](chat.md) |
| `general_transcript` | `general_transcript_` | Live |
| `menu_prefix` | `menu_` | Live |
| `hud_prefix` | `hud_` | Live. Layout of `hudpart_` rows. See [HUD](hud/README.md) |
| `hudpart_prefix` | `hudpart_` | Live. One actionbar glyph piece. See [HUD](hud/README.md) |
| `dailyreset_prefix` | `dailyreset_` | Live. Clocked wipe/grant rows. See [resets.md](resets.md) |
| `triggerable_prefix` | `triggerable_` | Live |
| `levelcap_prefix` | `levelcap_` | Live (shared VALUE minlevel/maxlevel) |
| `area_prefix` | `area_` | Live. Optional area template. Instances are `area_index` notes. See [areas.md](areas.md) |
| `areagroup_prefix` | `areagroup_` | Live. Optional group template. Live rows are `area_group_index`. See [areas.md](areas.md) |

Season pass is Live. Spray is Live. Titles are Live. Daily reset is Live. Chat rows are Live. Areas are Live. Quests are Live. Travel is Live. See [season-pass.md](season-pass.md), [titles.md](titles.md), [resets.md](resets.md), [chat.md](chat.md), [areas.md](areas.md), [quests.md](quests.md), [travel.md](travel.md), and [content-contracts.md](content-contracts.md).

## flag_saves

See [flags.md](flags.md).

## Control effect stats

`world_lock_operations` maps lock keys (`no_walk`) to mechanic types (`NO_WALK`). Pack YAML uses the type. Runtime flags: `flag_saves.world_locks`. Silence, stunned, and casting mode are pack BOOLEAN stats. `control_effect_melee_damage_types` is the vanilla cause list `NO_MELEE_DAMAGE` blocks. `control_effect_forget_target_range` is how far `attack cancel` searches when hidden or untargetable is applied.

`stat_kinds` is `VALUE` (equations), `BOOLEAN` (on/off), `NUMBER` (stored number), `REFERENCE` (script/id). `FLAG` aliases `BOOLEAN`. Overlay is the timed apply, not a kind. Same `stat_` prefix.

## Stat presentation

`stat_presentation_keys` is the FE `stat_config.presentation` map (`vanilla_effect`, `movement`, `knockback`, `cleansed`, …). Sprint and knockback use those keys on listed stats. There is no `default_stats` name lookup. `stat_presentation_movement` is `NONE` / `WALK` / `SPRINT` / `BOTH`. `stat_presentation_effect_duration` is the potion recast window (`2s`) for presentation-driven potions. `stat_presentation_vanilla_flag` is the runtime flag for potions we applied that way. `player_vanilla_walk_speed` and `player_vanilla_fly_speed` restore those PlayerTag values after `NO_WALK` (legacy stun used `0.2`). See [control-effects.md](control-effects.md) and [stats.md](stats.md).

## Stat level views

`stat_level_views` in [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc). Pass the value into `get_target_stat_level`, `get_all_target_stats`, and `get_stat_value_of_target`.

| View | Meaning |
| --- | --- |
| `PERSISTED` | `data.stats` only. Default for `get_all_target_stats` |
| `EFFECTIVE` | Overlay flag if present, else persisted. Default for `get_target_stat_level` and `get_stat_value_of_target` |
| `OVERLAY` | Overlay flag if present, else persisted |

Unknown view names become `EFFECTIVE`. Add a new row here when a new layer lands. Gear persist is `flag_saves.gear`, not a stat view.

## Mechanic keys

| Key | Role | Page |
| --- | --- | --- |
| `mechanic_context` | Context map field names | [mechanics/context.md](mechanics/context.md) |
| `mechanic_placeholder_locations` | Built-in location names | [mechanics/targeting.md](mechanics/targeting.md) |
| `mechanic_target_rules` | SELF / TARGET / AOE_* | [mechanics/targeting.md](mechanics/targeting.md) |
| `mechanic_value_sources` | caster / target for stat numbers and requirement `source` | [mechanics/README.md](mechanics/README.md), [mechanics/requirements.md](mechanics/requirements.md) |
| `mechanic_target_types` | ENTITY / LOCATION | [mechanics/targeting.md](mechanics/targeting.md) |
| `mechanic_requirement_types` | STAT / HEALTH / IN_WATER / IN_AIR / GROUNDED / IN_AREA / HAS_STATUS_EFFECT / FLAG / BOOLEAN / ITEM_IN_HAND_LEVEL / ITEM_HAS_SKILLS / ITEM_HAS_LOOT_CRATE / ITEM_HAS_CONSUME / SNEAKING / MOUNTED / MOUNT_ROLE / MOUNT_LOCOMOTION | [mechanics/requirements.md](mechanics/requirements.md) |
| `mechanic_requirement_status_modes` | HAS / NOT | [mechanics/requirements.md](mechanics/requirements.md) |
| `mechanic_requirement_water_materials` | Block names that count as in-water | [mechanics/requirements.md](mechanics/requirements.md) |
| `item_runtime_flags` | `item_script`, `level`, optional `item_tier` / `item_set` / `unvaultable` / `soulbound` / `untradable`, plus `currency_amount` / creator on withdraw coins | [items.md](items.md), [currencies.md](currencies.md), [vaults.md](vaults.md), [trades.md](trades.md) |
| `item_data_keys` | Display, skills, consume, grip, events, level, tier, set, durability, … | [items.md](items.md) |
| `item_hand_slots` | `MAIN` / `OFFHAND` | [items.md](items.md), [triggers.md](triggers.md) |
| `item_swing_animations` | `ARM_SWING` / `ARM_SWING_OFFHAND` | [mechanics/operations.md](mechanics/operations.md) |
| `item_grip_types` | `ONE_HANDED` / `TWO_HANDED` (pack data) | [items.md](items.md) |
| `itemskill_data_keys` | Same envelope names as SkillMove, including `cost_payer` | [items.md](items.md), [mounts.md](mounts.md) |
| `item_consume_data_keys` | `cooldown` / `requirements` / `mechanics` / `take` | [items.md](items.md) |
| `item_consume_cooldown_prefix` | `consume_` | [items.md](items.md) |
| `global_item_data_keys` | `tiers` / `max_item_level` / `skill_slots` / `sets` | [items.md](items.md) |
| `global_item_set_keys` | `needed_pieces` / `skills` | [items.md](items.md) |
| `item_equipment_keys` | `slot` | [items.md](items.md) |
| `vanilla_inventory_slots` | helmet 40 / chestplate 39 / leggings 38 / boots 37 | [items.md](items.md), [cosmetics.md](cosmetics.md) |
| `give_item_occupied_modes` | `DISPLACE` / `REPLACE` / `SKIP` | [mechanics/operations.md](mechanics/operations.md) |
| `mechanic_inherit_keys` | `inherit` / `duration` | [mechanics/operations.md](mechanics/operations.md) |
| `play_effect_kinds` | PARTICLE / LIGHTNING / BLOCK_CRACK / SCREEN_SHAKE / BLOODY_SCREEN / BLOCK_EXPLOSION / DEBRIS / DROP_BURST / EffectLib shapes | [mechanics/operations.md](mechanics/operations.md) |
| `play_effect_lib_types` | Case-sensitive EffectLib type names | [mechanics/operations.md](mechanics/operations.md) |
| `play_effect_lib_keys` | YAML to EffectLib `effect_data` names | [mechanics/operations.md](mechanics/operations.md) |
| `play_effect_particle_aliases` | Legacy particle names to current names | [mechanics/operations.md](mechanics/operations.md) |
| `play_effect_defaults` | Quantity, lightning sound, blockcrack defaults | [mechanics/operations.md](mechanics/operations.md) |
| `apply_velocity_modes` | KNOCKBACK / PULL / GUIDE / GROUND | [mechanics/operations.md](mechanics/operations.md) |
| `apply_velocity_directions` | AWAY / TOWARD / LOOK / FORWARD | [mechanics/operations.md](mechanics/operations.md) |
| `apply_velocity_defaults` | Amount, Y, stop_distance, tickrate, loop duration | [mechanics/operations.md](mechanics/operations.md) |
| `projectile_travel_types` | DISPLAY / SNOWBALL / LINE | [mechanics/operations.md](mechanics/operations.md) |
| `projectile_collision_filters` | BOTH / ENTITIES / BLOCKS / NONE | [mechanics/operations.md](mechanics/operations.md) |
| `projectile_data_keys` | Nested Projectile Config YAML names | [mechanics/operations.md](mechanics/operations.md) |
| `projectile_runtime_flags` | Owner, snowball, invert, barrier snapshot flags on the spawned entity | [mechanics/operations.md](mechanics/operations.md) |
| `projectile_barrier_flag` | Noted area flag name (`barrier`) | [mechanics/operations.md](mechanics/operations.md) |
| `projectile_index_flag` | Server map of live projectile shots | [mechanics/operations.md](mechanics/operations.md) |
| `projectile_list_menu` | `menu_projectile_list` | [mechanics/operations.md](mechanics/operations.md) |
| `projectile_entity_flag` | Entity flag linking a display or snowball to the shot id | [mechanics/operations.md](mechanics/operations.md) |
| `projectile_payload_keys` | Index row field names | [mechanics/operations.md](mechanics/operations.md) |
| `projectile_defaults` | Range, speed, start_height, aimed, y, height, spread, pierce, hitbox, tickrate, lifetime, item | [mechanics/operations.md](mechanics/operations.md) |
| `dash_directions` | LOOK / FORWARD / UP / DOWN | [mechanics/operations.md](mechanics/operations.md) |
| `dash_collision_filters` | BOTH / ENTITIES / BLOCKS / NONE | [mechanics/operations.md](mechanics/operations.md) |
| `dash_bounce_kinds` | REVERSE (punch impulse) / FORWARD (step impulse) | [mechanics/operations.md](mechanics/operations.md) |
| `dash_bounce_modes` | PUNCH / STEP / WALL FE list | [mechanics/operations.md](mechanics/operations.md) |
| `dash_bounce_wall_keys` | Nested `bounce_wall` hop / floor / max_pitch | [mechanics/operations.md](mechanics/operations.md) |
| `dash_data_keys` | Nested Dash Config YAML names | [mechanics/operations.md](mechanics/operations.md) |
| `dash_runtime_flags` | Active dash and bounce pending on the dasher | [mechanics/operations.md](mechanics/operations.md) |
| `dash_player_flags` | `interactedblock` door-glitch guard | [mechanics/operations.md](mechanics/operations.md) |
| `dash_defaults` | Speed, lifetime, bounce, continue, pullwith | [mechanics/operations.md](mechanics/operations.md) |
| `hologram_billboards` | center / fixed / vertical / horizontal | [mechanics/operations.md](mechanics/operations.md) |
| `hologram_data_keys` | Nested Hologram Config YAML names | [mechanics/operations.md](mechanics/operations.md) |
| `hologram_defaults` | Billboard, world offset, pivot, background, size, scale | [mechanics/operations.md](mechanics/operations.md) |
| `hologram_index_flag` | Server map of persistent hologram payloads | [mechanics/operations.md](mechanics/operations.md) |
| `hologram_list_menu` | `menu_hologram_list` | [mechanics/operations.md](mechanics/operations.md) |
| `hologram_entity_flag` | Entity flag linking a display to the index id | [mechanics/operations.md](mechanics/operations.md) |
| `hologram_payload_keys` | Index row field names | [mechanics/operations.md](mechanics/operations.md) |
| `hologram_restore_search` | Blocks to scan when matching a stored display | [mechanics/operations.md](mechanics/operations.md) |
| `hologram_remove_range` | `/packhologram remove` search radius | [mechanics/operations.md](mechanics/operations.md) |
| `hologram_chunkload_duration` | Chunkload while restoring | [mechanics/operations.md](mechanics/operations.md) |
| `area_rule_ids` | PVP, OPEN_CHESTS, INTERACT_NPCS, TRAVEL, BUILD_HEIGHT, MOUNT_SPEED_CAP, PUBLIC_ACCESS, NO_CAST | [areas.md](areas.md) |
| `area_rule_modes` | ALLOW / DENY | [areas.md](areas.md) |
| `area_data_keys` | Area Config YAML names, including `entity_level` | [areas.md](areas.md) |
| `quest_data_keys` | Quest YAML names | [quests.md](quests.md) |
| `quest_objective_types` | `KILL` / `TALK` / `WAYPOINT` / `AREA` / `QUEST` | [quests.md](quests.md) |
| `quest_objective_orders` | `ANY` / `ORDERED` | [quests.md](quests.md) |
| `quest_objective_keys` | Objective YAML names | [quests.md](quests.md) |
| `quest_objective_prefixes` | Optional `npc_` / `waypoint_` / `area_` on those ids | [quests.md](quests.md) |
| `quest_progress_keys` | Saved status and objective map | [quests.md](quests.md) |
| `quest_statuses` | `ACTIVE` / `COMPLETE` | [quests.md](quests.md) |
| `quest_defaults` | Required amount `1`, autocomplete `true`, order `ANY`, reference depth `8` | [quests.md](quests.md) |
| `quest_waypoint_defaults` | `arrive_range` `5` for pending `WAYPOINT` objectives | [quests.md](quests.md) |
| `quest_uncategorized_key` | Flag key `uncategorized` when a quest has no category | [quests.md](quests.md) |
| `waypoint_data_keys` | Waypoint YAML names, including `place` | [travel.md](travel.md) |
| `waypoint_location_keys` | `world` / `x` / `y` / `z` / `yaw` / `pitch` | [travel.md](travel.md) |
| `waypoint_op_keys` | `waypoint`, `waypoint_id`, `ignore_cost`, `ignore_requirements` | [travel.md](travel.md) |
| `waypoint_defaults` | Yaw `0`, pitch `0` | [travel.md](travel.md) |
| `waypoint_block_reasons` | `unknown` / `location` / `area` / `requirements` / `cost` / `ok` | [travel.md](travel.md) |
| `waypoint_index_flag` | Server flag `waypoint_index` for placed spots | [travel.md](travel.md) |
| `waypoint_list_menu` | Admin PAGE `menu_waypoint_list` | [travel.md](travel.md) |
| `waypoint_here_range` | `/packwaypoint here` radius, `5` | [travel.md](travel.md) |
| `waypoint_show_defaults` | `/packwaypoint show` radius, duration, block material | [travel.md](travel.md) |
| `waypoint_show_runtime_flags` | Player flag list for active showfake blocks | [travel.md](travel.md) |
| `waypoint_payload_keys` | Placed row `id` and `location` | [travel.md](travel.md) |
| `area_defaults` | Priority, shape, radius, height, respawn | [areas.md](areas.md) |
| `area_index_flag` | Server map of world area payloads | [areas.md](areas.md) |
| `area_group_index_flag` | Server map of area group rows | [areas.md](areas.md) |
| `area_behavior_keys` | Keys inherited from a group or template, including `entity_level` | [areas.md](areas.md) |
| `area_mob_spawn_keys` | `mob_spawn` names: mobs, max, radii, cooldown, leash, level, use_area_level, heal_on_leash, combat_reset_on_leash, patrol | [areas.md](areas.md) |
| `area_mob_spawn_defaults` | max `4`, radii, cooldown `10s`, leash `16`, level `5`, leash flags false | [areas.md](areas.md) |
| `area_mob_spawn_runtime_flag` | Server gate `runtime_data.area.mob_spawn.<area_id>.spawn_gate` for spawn cooldown | [areas.md](areas.md) |
| `entity_index_flag` | Server map `entity_index` of live combat mobs. Wiped on start and reload | [content-contracts.md](content-contracts.md) |
| `entity_list_menu` | `menu_entity_list` | [entities.md](entities.md) |
| `entity_remove_range` | `/packentity remove` nearest search radius | [entities.md](entities.md) |
| `entity_boss_music_sound_category` | SoundCategory for boss music pulse and `stop_sound` on death | [entities.md](entities.md) |
| `entity_smoke_values` | `/packentity smoke` defaults (model, animation, signal, threat, path) | [entities.md](entities.md) |
| `entity_nametag_data_keys` | `visuals.nametag` keys (name, level_mode, health, alignment, …) | [entities.md](entities.md) |
| `entity_nametag_level_modes` | `SCALED` / `RESOLVED` display level | [entities.md](entities.md) |
| `entity_entity_flag` | Entity stamp `entity_index_id`. Child models share it | [content-contracts.md](content-contracts.md) |
| `entity_remove_flag` | Pending wipe `entity_index_remove`. Chunk load drops stamped leftovers | [content-contracts.md](content-contracts.md) |
| `entity_payload_keys` | Index row: id, entity, script, area, owner, started, home, remove | [content-contracts.md](content-contracts.md) |
| `companion_cap` | Live companions one owner may have (`3`) | [content-contracts.md](content-contracts.md) |
| `companion_roster_states` / `companion_roster_keys` | `OUT` / `RECALLED` / `STORED` roster row shape | [entities.md](entities.md) |
| `entity_cast_pick_modes` / `entity_cast_phase_keys` / `entity_cast_follow_up_duration` | Cast arsenal pick, phases, FOLLOW_UP arm window | [entities.md](entities.md) |
| `entity_skill_data_keys` | Skill gates plus `pause_while`, `repeats`, `follow_up_guaranteed` | [entities.md](entities.md) |
| `entity_ally_notify_signal` / `entity_notify_radius_default` / `entity_patrol_repath_interval` | Ally call-in signal, notify radius fallback, PATROL repath cadence | [entities.md](entities.md) |
| `entity_threat_keys` | `swap_threshold` / `hold_time` | [entities.md](entities.md) |
| `entity_level_default` | Level when the op, the command, and the area all omit it (`5`) | [areas.md](areas.md) |
| `mythic_base_types` | Shared Mythic shells: `base_statue_mob`, `base_land_mob`, `base_water_mob`, `base_passive_water_mob`, `base_air_mob`, `base_land_mob_tamed`. `entity_.mythic` picks one | [entities.md](entities.md) |
| `entity_data_keys` | `mythic`, `living_entity`, `model`, `ai`, `profile`, `prevent_vanilla_drops`, `hit_requirements`, `mount`, crew/home/patrol/visuals keys | [entities.md](entities.md), [mounts.md](mounts.md) |
| `mount_entity_flag` | Entity flag parent `mount` | [mounts.md](mounts.md) |
| `mount_driver_bone` / `mount_controller` | Driver bone `mount`, controller `pemount` | [mounts.md](mounts.md) |
| `mount_block_keys` | Physics, bones, policies, cast sets, restore, converters | [mounts.md](mounts.md) |
| `mount_physics_keys` | MountSettings field names stamped on the entity flag | [mounts.md](mounts.md) |
| `mount_stat_converter_keys` | `field` / `stat` / `min_percent` / `max_percent` / `points` | [mounts.md](mounts.md) |
| `mount_restore_keys` | `delay` / `costs` / `requirements` / `on_restore` | [mounts.md](mounts.md) |
| `mount_passenger_policies` | `NONE` / `ANYONE` / `PARTY` / `CREW` | [mounts.md](mounts.md) |
| `mount_row_keys` | `stats` / `consumables` / `passenger_policy` / `defeated_at` | [mounts.md](mounts.md) |
| `mount_row_write_keys` | `create` / `entity` / `equipped` / `passenger_policy` / `stat` / `delta` | [mounts.md](mounts.md) |
| `mount_roles` | `driver` / `passenger` | [mounts.md](mounts.md) |
| `mount_locomotion_modes` | `ground` / `swim` / `fly` | [mounts.md](mounts.md) |
| `mount_runtime_flags` | Locomotion stamp and active `castset_` id | [mounts.md](mounts.md) |
| `mount_defaults` | Policy `NONE`, `rider_can_damage` false | [mounts.md](mounts.md) |
| `castset_data_keys` | `requirements` / `slots` | [mounts.md](mounts.md) |
| `entity_runtime_flags` | Living-entity flags under `runtime_data.entity` (owner, faction, cast_busy, cast_state, patrol_points, …) | [entities.md](entities.md) |
| `entity_ai_data_keys` | `entityai_` keys including `notify_allies` / `notify_radius`. Dual fields use setters (flag + Mythic). No Mythic level | [entities.md](entities.md) |
| `mechanic_entity_operations` | Spawn, model, animate, path, signal, threat, `SET_ENTITY_AI`, `RESET_MYTHIC_TARGET`, `SET_COMPANION_STATE`, `PLAY_BOSS_MUSIC` | [mechanics/operations.md](mechanics/operations.md) |
| `entity_companion_keys` | `teleport_distance`, `friendly_fire` only | [entities.md](entities.md) |
| `entity_companion_states` | `FOLLOW` / `HOLD` | [entities.md](entities.md) |
| `entity_ai_modes` | `FOLLOW` / `HOLD` / `IDLE` / `COMBAT` / `PATROL` / `RETURN_HOME` / `FLEE` | [entities.md](entities.md) |
| `entity_flee_keys` | `hp_below` (0 to 100) | [entities.md](entities.md) |
| `area_list_menu` | `menu_area_list` | [areas.md](areas.md) |
| `area_note_prefix` | Note name prefix `area_` | [areas.md](areas.md) |
| `area_payload_keys` | Index row field names | [areas.md](areas.md) |
| `area_area_flags` | Note flags `area_id` and `notable_kind` | [areas.md](areas.md) |
| `area_chest_inventory_types` | Inventories OPEN_CHESTS can cancel | [areas.md](areas.md) |
| `hologram_damage_kinds` | MELEE / SKILL / CRITICAL / PEENTITY / CUSTOM | [mechanics/operations.md](mechanics/operations.md) |
| `hologram_damage_colors` | Color prefixes for those kinds | [mechanics/operations.md](mechanics/operations.md) |
| `hologram_damage_defaults` | Damage number lifetime, offset, random_offset | [mechanics/operations.md](mechanics/operations.md) |
| `gps_data_keys` | Nested GPS Config YAML names | [mechanics/operations.md](mechanics/operations.md) |
| `gps_defaults` | Arrive range, lifetime, tickrate, item, offset | [mechanics/operations.md](mechanics/operations.md) |
| `gps_runtime_flags` | Owner session, entity, destination | [mechanics/operations.md](mechanics/operations.md) |
| `gps_entity_flag` | Entity flag storing the index id (owner uuid) | [mechanics/operations.md](mechanics/operations.md) |
| `gps_index_flag` | Server map of live GPS arrows | [mechanics/operations.md](mechanics/operations.md) |
| `gps_list_menu` | `menu_gps_list` | [mechanics/operations.md](mechanics/operations.md) |
| `gps_payload_keys` | Index row field names | [mechanics/operations.md](mechanics/operations.md) |
| `spray_data_keys` | Nested Spray Config YAML names | [mechanics/operations.md](mechanics/operations.md) |
| `spray_defaults` | Range, lifetime, start_id `11`, mapImages root, REFERENCE slot | [mechanics/operations.md](mechanics/operations.md) |
| `spray_rotations` | AUTO plus item_frame Rotation names | [mechanics/operations.md](mechanics/operations.md) |
| `spray_runtime_flags` | Owner session and entity | [mechanics/operations.md](mechanics/operations.md) |
| `spray_entity_flag` | Entity flag storing the index id (owner uuid) | [mechanics/operations.md](mechanics/operations.md) |
| `spray_index_flag` | Server map of live spray frames | [mechanics/operations.md](mechanics/operations.md) |
| `spray_list_menu` | `menu_spray_list` | [mechanics/operations.md](mechanics/operations.md) |
| `spray_equip_menu` | `menu_spray_equip` | [mechanics/operations.md](mechanics/operations.md) |
| `spray_payload_keys` | Index row field names | [mechanics/operations.md](mechanics/operations.md) |
| `title_data_keys` | title_ YAML names (prefix/suffix/placement) | [titles.md](titles.md) |
| `title_placements` | PREFIX / SUFFIX / BOTH | [titles.md](titles.md) |
| `title_defaults` | name_tag icon | [titles.md](titles.md) |
| `title_equip_menu` | `menu_title_equip` | [titles.md](titles.md) |
| `wiki_opt_out_key` | `notinwiki` | [wiki.md](wiki.md) |
| `wiki_source_index_flag` | `wiki_sources` | [wiki.md](wiki.md) |
| `wiki_listed_index_flag` | `wiki_listed` | [wiki.md](wiki.md) |
| `wiki_categories` | ITEMS / SKILLMOVES / CLASSES / QUESTS / CURRENCIES | [wiki.md](wiki.md) |
| `wiki_category_prefix_keys` | Category to `script_prefixes` key | [wiki.md](wiki.md) |
| `wiki_menus` | Hub / entry / category PAGE ids | [wiki.md](wiki.md) |
| `wiki_data_keys` | Wiki YAML and source-row names | [wiki.md](wiki.md) |
| `wiki_source_kinds` | loot / crate / pass | [wiki.md](wiki.md) |
| `wiki_defaults` | PAGE icon paper, `reveal_ratelimit` `1s` | [wiki.md](wiki.md) |
| `wiki_item_flags` | `wiki_revealed` / `wiki_script` on PAGE cells | [wiki.md](wiki.md) |
| `wiki_list_lore_limit` | Unused on stub rows. Kept for entry lore helpers | [wiki.md](wiki.md) |
| `chat_format_script` | `player_chat_format` (`global_format_config` key) | [chat.md](chat.md) |
| `chat_prefix_payload_keys` | `prefixes` / `suffixes` title id lists | [titles.md](titles.md) |
| `chat_title_order` | Where the title block sits among `chatrow_` `order` numbers | [chat.md](chat.md) |
| `chat_source_kinds` | Those kind names | [chat.md](chat.md) |
| `chat_row_data_keys` | `kind` / `order` / `text` / `stat` | [chat.md](chat.md) |
| `chat_words_data_key` | `words` | [chat.md](chat.md) |
| `chat_filter` | enabled, warnings, mute, duplicate window | [chat.md](chat.md) |
| `chat_runtime_flags` | mute, warnings, last message | [chat.md](chat.md) |
| `chat_filter_transcripts` | Filter and preview transcript keys | [chat.md](chat.md) |
| `gear_data_keys` | EQUIP_GEAR / CLEAR_GEAR YAML names (`item` / `slot` / `take`) | [mechanics/operations.md](mechanics/operations.md) |
| `gear_defaults` | `take:` default false | [mechanics/operations.md](mechanics/operations.md) |
| `cosmetic_data_keys` | Nested Cosmetic Config YAML names | [cosmetics.md](cosmetics.md) |
| `cosmetic_kinds` | persist / session | [cosmetics.md](cosmetics.md) |
| `cosmetic_poses` | DEFAULT / SWIMMING / GLIDING | [cosmetics.md](cosmetics.md) |
| `cosmetic_defaults` | Billboard, scale, join delay | [cosmetics.md](cosmetics.md) |
| `cosmetic_runtime_flags` | shown / pose / persist / session entity maps | [cosmetics.md](cosmetics.md) |
| `cosmetic_index_flag` | Server map of live cosmetic displays | [cosmetics.md](cosmetics.md) |
| `cosmetic_id_separator` | Flat index glue (`_`). A dot nests the flag | [cosmetics.md](cosmetics.md) |
| `cosmetic_list_menu` | `menu_cosmetic_list` | [cosmetics.md](cosmetics.md) |
| `cosmetic_payload_keys` | Index row field names | [cosmetics.md](cosmetics.md) |
| `cosmetic_overlay_keys` | Overlay backup field names | [cosmetics.md](cosmetics.md) |
| `cosmetic_overlay_flag` | ItemTag flag on session overlay armor | [cosmetics.md](cosmetics.md) |
| `cosmetic_slot_attach` | HELD / VANILLA / PASSENGER (SPAWN overlay vs passenger. Not `gear_slots`) | [cosmetics.md](cosmetics.md) |
| `seasonpass_data_keys` | Season Config and op YAML names | [season-pass.md](season-pass.md) |
| `seasonpass_payload_keys` | Persist `type` / `level` / `progress` / `redeemed` | [season-pass.md](season-pass.md) |
| `seasonpass_track_keys` | YAML `free` / `paid` | [season-pass.md](season-pass.md) |
| `seasonpass_tracks` | `FREE` / `PAID` | [season-pass.md](season-pass.md) |
| `seasonpass_views` | `PAGE` / `SCROLL` | [season-pass.md](season-pass.md) |
| `seasonpass_defaults` | Track, level, progress, xp per level | [season-pass.md](season-pass.md) |
| `seasonpass_list_menu` | `menu_seasonpass` | [season-pass.md](season-pass.md) |
| `seasonpass_scroll_menu` | `menu_seasonpass_scroll` | [season-pass.md](season-pass.md) |
| `skillmove_data_keys` | `categories` / `requirements` / `costs` / `cost_payer` | [skills.md](skills.md), [mounts.md](mounts.md) |
| `skillmove_cost_payers` | `CASTER` / `MOUNT` | [mounts.md](mounts.md) |
| `skillmove_cost_payer_default` | `CASTER` | [mounts.md](mounts.md) |
| `skillmove_cost_keys` | `type` / `id` / `stat` / `amount` / `action` | [skills.md](skills.md), [currencies.md](currencies.md) |
| `cost_types` | CURRENCY / ITEM / STAT | [currencies.md](currencies.md) |
| `cost_actions` | TAKE / GIVE | [currencies.md](currencies.md) |
| `cost_component_keys` | Cost row field names | [currencies.md](currencies.md) |
| `transaction_parties` | PLAYER / SYSTEM / VOID | [currencies.md](currencies.md) |
| `transaction_context_keys` | Source, destination, costs | [currencies.md](currencies.md) |
| `transaction_op_keys` | APPLY_TRANSACTION YAML names including `onsuccess` / `onfail` / `analytics` | [mechanics/operations.md](mechanics/operations.md) |
| `gamerules_data_keys` | Top-level maps on `registry_gamerules` | [gamerules.md](gamerules.md) |
| `gamerules_economy_keys` | `player_pay` | [currencies.md](currencies.md), [gamerules.md](gamerules.md) |
| `gamerules_language_keys` | `default` | [gamerules.md](gamerules.md), [language.md](language.md) |
| `gamerules_language_keys` | `default` | [gamerules.md](gamerules.md), [language.md](language.md) |
| `gamerules_analytics_keys` | `day_expire` | [gamerules.md](gamerules.md), [analytics.md](analytics.md) |
| `gamerules_hud_keys` | `default` | [gamerules.md](gamerules.md), [HUD](hud/README.md) |
| `gamerules_hunger_keys` | `lose` | [gamerules.md](gamerules.md), [items.md](items.md) |
| `player_pay_modes` | ALLOW / TRADE_ONLY | [currencies.md](currencies.md) |
| `currency_data_keys` | `display` / `rules` / `withdraw_item` / `form` | [currencies.md](currencies.md) |
| `currency_forms` | WALLET / ITEM / BOTH | [currencies.md](currencies.md) |
| `currency_rules_keys` | Init, tradeable, redeemable, player_transfer, death, cap, min | [currencies.md](currencies.md) |
| `currency_loss_on_death` | NONE / ALL / PERCENT | [currencies.md](currencies.md) |
| `currency_runtime_flags` | Death-loss debounce | [currencies.md](currencies.md) |
| `currency_death_loss_flag_expire` | `2s` | [currencies.md](currencies.md) |
| `currency_convert_directions` | WITHDRAW / REDEEM | [currencies.md](currencies.md) |
| `analytics_server_flag` | Server totals/days parent | [analytics.md](analytics.md) |
| `analytics_kinds` | `currency` / `item` / `sink` / `trade` | [analytics.md](analytics.md), [trades.md](trades.md) |
| `analytics_directions` | `obtained` / `spent` | [analytics.md](analytics.md) |
| `analytics_server_keys` | `totals` / `days` | [analytics.md](analytics.md) |
| `analytics_day_flag_expire` | Day bucket expire | [analytics.md](analytics.md) |
| `mongo_connection_id` | Reused Mongo id (`engine`) | [receipts.md](receipts.md) |
| `mongo_secret_key` | Secrets file key (`mongo_uri`). Not the URI | [receipts.md](receipts.md) |
| `api_host` | API engine host (`172.18.0.1`). Not the token | [api.md](api.md) |
| `api_port` | Poster API port (`8000`) | [api.md](api.md) |
| `api_secret_key` | Secrets file key (`api_handshake_token`). Not the token | [api.md](api.md) |
| `poster_index_flag` | Server index `poster_index` | [api.md](api.md) |
| `poster_list_menu` | `menu_poster_list` | [api.md](api.md) |
| `poster_entity_flag` | Frame flag `poster_id` | [api.md](api.md) |
| `poster_file_root` | `../PEUtils/mapImages/` | [api.md](api.md) |
| `poster_data_keys` | Template field names | [api.md](api.md) |
| `poster_payload_keys` | Index row: location, map id, template, subject uuid | [api.md](api.md) |
| `mongo_config_keys` | FE `database` / `collections` / `receipts` | [receipts.md](receipts.md) |
| `receipt_kinds` | `TRADE` live. `TRANSACTION` reserved | [receipts.md](receipts.md) |
| `receipt_data_keys` | Event receipt field names | [receipts.md](receipts.md) |
| `receipt_list_menu` | `menu_receipt_list` PAGE for `/packreceipt` | [receipts.md](receipts.md) |
| `receipt_test_values` | Dummy session/menu/name/token for `/packreceipt test` | [receipts.md](receipts.md) |
| `loot_data_keys` | Table/pool/entry YAML names | [loot.md](loot.md) |
| `loot_result_keys` | Grant map `type` / `referenceid` / `quantity` | [loot.md](loot.md) |
| `loot_entry_types` | ITEM / CURRENCY / TABLE_REFERENCE / POOL_REFERENCE / ITEM_CATEGORY / COMMAND / TEXT | [loot.md](loot.md) |
| `loot_weight_modifier_modes` | ADD_FLAT / MULTIPLY_BASE / SET_MIN | [loot.md](loot.md) |
| `loot_table_reference_depth` | Nested table/pool cap (`8`) | [loot.md](loot.md) |
| `item_category_index_flag` | Reload map `item_categories` | [loot.md](loot.md), [items.md](items.md) |
| `static_loot_block_flag` | Location parent `static_loot` | [loot.md](loot.md) |
| `static_loot_block_keys` | `table` / `cooldown` / `cooleddown` / `mode` / `players` / `contents` / `opens` | [loot.md](loot.md) |
| `static_loot_modes` | `SHARED` / `PLAYER` | [loot.md](loot.md) |
| `static_loot_runtime_flags` | Open location while a virtual chest is up | [loot.md](loot.md) |
| `static_loot_index_flag` | Server list of bound locations | [loot.md](loot.md) |
| `static_loot_list_menu` | `menu_static_loot_list` | [loot.md](loot.md) |
| `loot_crate_runtime_flags` | Rolling lock and pending grants | [loot.md](loot.md) |
| `lootcrate_data_keys` | Crate YAML names | [loot.md](loot.md) |
| `loot_crate_defaults` | 27 chest, 20 frames, 5t, slot 14, button click | [loot.md](loot.md) |
| `loot_crate_pane_materials` | Stained glass around the prize slot | [loot.md](loot.md) |
| `global_build_data_keys` | `skill_slots` / `passive_slots` / `gear_slots` / `equipment_slots` / `cosmetic_channels` | [skills.md](skills.md), [cosmetics.md](cosmetics.md) |
| `global_build_slot_keys` | `stat` / `id` / `attach` (`dummy` leftover unused. `attach` is `equipment_slots` only) | [skills.md](skills.md) |
| `mechanic_stat_value_bases` | CURRENT / MAX | [mechanics/operations.md](mechanics/operations.md) |
| `mechanic_default_aoe_range` | Default `6` if op omits `range` | [mechanics/targeting.md](mechanics/targeting.md) |
| `mechanic_event_values` | Common event_values keys | [mechanics/context.md](mechanics/context.md) |
| `mechanic_source_types` | Who fired the mechanic | [mechanics/context.md](mechanics/context.md) |
| `damage_routing_modes` | REDIRECT / APPLY / SPLIT | [living-entities.md](living-entities.md) |
| `damage_routing_hooks` | onsuccess / ondeplete / onfail FE keys | [living-entities.md](living-entities.md) |
| `damage_routing_redirect_targets` | REDIRECT tokens `attacker`, `mount` (the mount a player victim is sitting on), `rider` (that mount's driver) | [living-entities.md](living-entities.md) |
| `damage_routing_default_split_share` | Default SPLIT `share` (`0.5`) | [living-entities.md](living-entities.md) |
| `damage_routing_max_depth` | Max nested REDIRECT hops (`8`) | [living-entities.md](living-entities.md) |
| `damage_last_attacker_flag` | Attacker stamped before a killing HP write. Death reads it when vanilla damager is empty | [triggers.md](triggers.md) |
| `damage_feedback_sounds` | Hurt replay sounds (player vs other entity) | [living-entities.md](living-entities.md) |
| `damage_feedback_knockback` | Hit knockback `amount` and `y` | [living-entities.md](living-entities.md) |
| `vanilla_adjustifiers` | Combat and resistance `mode`: `FLAT` (overwrite) `+` `-` `*` `/` | [living-entities.md](living-entities.md) |
| `world_lock_operations` | `NO_WALK` / `NO_JUMP` / `HIDDEN` / … | [control-effects.md](control-effects.md) |
| `stat_kinds` | VALUE / BOOLEAN / NUMBER / REFERENCE (`FLAG` = BOOLEAN) | [stats.md](stats.md) |
| `stat_value_config_keys` | `level_cap` / minlevel / maxlevel / equation | [stats.md](stats.md) |
| `levelcap_data_keys` | Template minlevel / maxlevel | [stats.md](stats.md) |
| `control_effect_melee_damage_types` | Vanilla causes `NO_MELEE_DAMAGE` blocks | [control-effects.md](control-effects.md) |
| `stat_presentation_keys` | FE `stat_config.presentation` field names | [stats.md](stats.md), [control-effects.md](control-effects.md) |
| `stat_presentation_movement` | `NONE` / `WALK` / `SPRINT` / `BOTH` | [stats.md](stats.md) |
| `stat_presentation_effect_duration` | Potion recast window | [control-effects.md](control-effects.md) |
| `stat_presentation_vanilla_flag` | Runtime flag for applied potions | [control-effects.md](control-effects.md) |
| `global_menu_appearance` | Frontend `gui_appearance` script name | [menus.md](menus.md) |
| `global_hud_appearance` | Frontend `hud_appearance` script name | [HUD](hud/README.md) |
| `hud_runtime_flags` | Layout, shown, hidden | [HUD](hud/README.md) |
| `hud_runtime_flag_expire` | Expire on SHOW/HIDE when duration omitted (`1h`) | [HUD](hud/README.md) |
| `hud_data_keys` | Layout / part / op YAML names | [HUD](hud/README.md) |
| `hud_appearance_keys` | Catalog field names on `hud_appearance` | [HUD](hud/README.md) |
| `hud_part_kinds` | GLYPH / BAR / STAT / TEXT / CURRENCY / BOOLEAN / EFFECT_STRIP | [HUD](hud/README.md) |
| `hud_stat_views` | CURRENT / MAX / BOTH | [HUD](hud/README.md) |
| `hud_balance_modes` | PAIR / RAW | [HUD](hud/README.md) |
| `hud_strip_modes` | CHARS / TIMES | [HUD](hud/README.md) |
| `hud_presence_operations` | SHOW_HUD_PART / HIDE_HUD_PART on a hudpart_ | [HUD](hud/README.md) |
| `hud_defaults` | Pad char, bar alphabet, space font | [HUD](hud/README.md) |
| `hud_currency_dividers` | Fallback `t` / `b` / `m` / `k` | [HUD](hud/README.md) |
| `daily_reset_clocks` | When DAILY/HOURLY rows become due (OS time, not a player display) | [resets.md](resets.md) |
| `daily_reset_clock_keys` | YAML names on `daily_reset_clocks` | [resets.md](resets.md) |
| `daily_reset_allowed_clock_minutes` | 0 / 15 / 30 / 45. Matches world `minutely every:15` | [resets.md](resets.md) |
| `daily_reset_when` | `DAILY` / `HOURLY` | [resets.md](resets.md) |
| `daily_reset_action_types` | `CLEAR_FLAG` / `CLEAR_STAT` / `SET_STAT` / `GRANT_LOOT` / `RUN_MECHANIC` | [resets.md](resets.md) |
| `daily_reset_data_keys` | `when` / `actions` / message and title fields | [resets.md](resets.md) |
| `daily_reset_title_timings` | Screen title fade/stay | [resets.md](resets.md) |
| `menu_runtime_flags` | Open id, fakeinventory, kind state | [menus.md](menus.md) |
| `menu_runtime_flag_expire` | Expire on those runtime flags (`1h`) | [menus.md](menus.md) |
| `menu_default_size` | `54` | [menus.md](menus.md) |
| `menu_default_title` | Fallback header text `Menu` | [menus.md](menus.md) |
| `menu_allowed_sizes` | `9` through `54` | [menus.md](menus.md) |
| `menu_click_types` | LEFT / RIGHT / SHIFT / ANY | [menus.md](menus.md) |
| `menu_kinds` | GENERIC through SKILLTREE | [menus.md](menus.md) |
| `menu_kind_templates` | `menu_kind_*` Frontend shells | [menus.md](menus.md) |
| `menu_kind_actions` | Kind button names | [menus.md](menus.md) |
| `menu_item_flags` | Item flag names for kind_action and letter | [menus.md](menus.md) |
| `menu_footer_slot_count` | `36`. Player inv size and chest fakeitem offset | [menus.md](menus.md) |
| `stat_event_triggers` | Shared event names (ON_DAMAGE_DEALT, …) | [triggers.md](triggers.md) |
| `triggerable_cast_events` | ON_OFFHAND_SWAP / ON_HOTBAR_SLOT / ON_ITEM_USE / ON_INVENTORY_CLICK / ON_MOUNT | [triggers.md](triggers.md) |
| `triggerable_event_modes` | ALL / ONE | [triggers.md](triggers.md) |
| `triggerable_targets` | Eventstat SELF / VICTIM / AOE | [triggers.md](triggers.md) |
| `triggerable_enemy_filters` | ANY / ENEMY | [triggers.md](triggers.md) |
| `triggerable_runtime_flags` | Bound list | [triggers.md](triggers.md) |
| `triggerable_default_aoe_range` | Eventstat AOE default (`6`) | [triggers.md](triggers.md) |

## What can go wrong

- Adding a prefix in Frontend and forgetting it here. Reload will not register those scripts.
- Pointing `global_item_config` at the build script again. It must stay `global_item_config`.
- Hardcoding `data.stats` instead of `flag_saves.stats`.
- Unquoted `-` `*` `+` `/` under `data`. `subtract: -` is a YAML list marker. The `rules` script will not exist and every `get_rule_value` call fails. Quote them (`"-"` `"*"` `"+"` `"/"`).
- Putting `dummy:` on `gear_slots`. Dummy is leftover unused. Persist stands are `cosmetic_channels`. Gear is `EQUIP_GEAR`. Cosmetics are `EQUIP_COSMETIC`.
