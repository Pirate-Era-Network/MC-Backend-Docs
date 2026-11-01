---
sidebar_position: 2
---

# How the framework works

**Live.** Backend is the engine (tasks, procs, world events). Frontend is `type: data` configs. They share vocabulary through [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc).

## Split

| Side | Repo | Job |
| --- | --- | --- |
| Backend | `mc-denizen-core-backend` | Logic, getters/setters, mechanic dispatcher |
| Frontend | `pirate-era-core-frontend` | Stats, items, currencies, living entities, mechanic examples, menus, HUD, daily reset, language |

Do not put Pirate Era names in Backend. Do not put engine tasks in Frontend.

## Discovery (prefixes)

On reload, `reload_all_server_flags` walks `rules.dsc` `script_prefixes`. Git sync runs it from `reload_all_scripts` after `~reload`. `/ex reload` hits `after reload scripts` in `global_events`. For each prefix it stores matching script names on the server:

`server.flag[scripts.stat_]` is the list of all `stat_*` data scripts.

A longer prefix that starts with a shorter one is stored on both lists. `questcategory_` also matches `quest_`. `entityai_`, `entityanimation_`, `entitymodel_`, `entityskill_`, and `entityprofile_` also match `entity_`. Lookups for the short prefix must skip those longer names. `castset_` is a ride hotbar set. `mount_` is reserved and unused. The ride block is `entity_.mount`. See [mounts.md](mounts.md).

Script **names** keep the prefix (`stat_stamina`). Flag **keys** on the player strip it (`data.stats.stamina`). See [flags.md](flags.md).

## Getters and setters

Feature scripts do not write `- flag <player> ...`. Reads and writes go through domain utils (`stat_utils`, `currency_utils`, `living_entity_utils`, `language_utils`, `menu_utils`, `menu_load_utils`, `hud_utils`, `reset_utils`, `global_build_utils`, `gear_utils`, `item_utils`, `item_category_utils`, `global_item_utils`, `loot_utils`, `cost_utils`, `analytics_utils`, `season_pass_utils`, `title_utils`, `chat_utils`, `quest_utils`). Flag paths always come from `get_rule_value` → `flag_saves` or `menu_runtime_flags` or `hud_runtime_flags`. Target-aware scripts `- inject set_target`. Loot grant uses Cost Component GIVE (`apply_player_cost_delta`) for ITEM and CURRENCY. It does not write flags itself. Currency spend uses `APPLY_TRANSACTION` / Cost Component. Wallet vs item convert is `/withdraw` `/redeem` (or `convert_currency_between_forms`). Crate rolling flags live under `loot_crate_runtime_flags`. World static loot flags live under `static_loot_block_flag` (`Loot/static_loot_world.dsc`). `PLAYER` mode stores per-uuid contents under that parent. Bound locations are listed on `static_loot_index_flag` (`Loot/static_loot_index.dsc`). Persistent holograms are listed on `hologram_index_flag` (`Mechanics/Individual_operations/hologram_index.dsc`). Live GPS arrows are listed on `gps_index_flag` (`Mechanics/Individual_operations/gps_index.dsc`). Live spray frames are listed on `spray_index_flag` (`Mechanics/Individual_operations/spray_index.dsc`). Live projectile shots are listed on `projectile_index_flag` (`Mechanics/Individual_operations/projectile_index.dsc`). Live combat entities are listed on `entity_index_flag` (`Entities/entity_index.dsc`). Live cosmetic displays are listed on `cosmetic_index_flag` (`Mechanics/Individual_operations/cosmetic_index.dsc`). World areas are listed on `area_index_flag` (`Areas/area_index.dsc`). Area groups are listed on `area_group_index_flag` (`Areas/area_group_index.dsc`). Skill cages stay on `engine_notables` and are wiped on reload. Area notes are not. Obtain/spend counters: [analytics.md](analytics.md). Event receipts: [receipts.md](receipts.md). Engine Mongo connect is `Persistence/mongo_utils.dsc`. Pack database names are Frontend `global_mongo_config`. URI is `secrets.secret`. That is not player `flag_saves` persist.

## Mechanics in one line

Something builds a context map (`build_mechanic_context`) and fires `run_mechanic_config`. That raises custom event `execute_mechanic`. Requirements run, then delay/repeat, then each operation. Operations call `resolve_mechanic_operation_targets`. World events reach this through `fire_stat_event` ([triggers.md](triggers.md)). Details: [mechanics/README.md](mechanics/README.md).

## What can go wrong

- Naming a Frontend script without its prefix. It never lands in `server.flag[scripts.*]`.
- Reloading Backend without Frontend (or the reverse). Prefix lists go empty for that side.
- Writing flags in a mechanic op. Persistence and path changes then break in many files.
