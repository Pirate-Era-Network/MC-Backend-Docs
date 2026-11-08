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

Feature scripts do not write `- flag <player> ...`. Reads and writes go through a domain util. Flag paths come from `get_rule_value`. Target-aware scripts `- inject set_target`. Loot grant uses Cost Component GIVE (`apply_player_cost_delta`) for ITEM and CURRENCY. Currency spend uses `APPLY_TRANSACTION`. Wallet versus item convert is `/withdraw` and `/redeem`.

| Name | Job |
| --- | --- |
| `stat_utils` | Stat reads and writes |
| `currency_utils` | Wallet reads and writes |
| `living_entity_utils` | Living-entity init and routing helpers |
| `language_utils` | Transcript lookup |
| `menu_utils` / `menu_load_utils` | Menu open, fill, and runtime flags |
| `hud_utils` | HUD layout and part flags |
| `reset_utils` | Daily reset rows |
| `global_build_utils` | Skill, gear, and cosmetic slot ids |
| `gear_utils` | `flag_saves.gear` |
| `item_utils` / `global_item_utils` / `item_category_utils` | Item create, global item config, category index |
| `loot_utils` | Table rolls |
| `cost_utils` | Cost Component |
| `analytics_utils` | Obtain and spend counters. See [analytics](analytics.md) |
| `season_pass_utils` | Season progress |
| `title_utils` | Chat title lists |
| `chat_utils` | Chat rows and the word filter |
| `quest_utils` | Quest progress |
| `flag_saves` / `menu_runtime_flags` / `hud_runtime_flags` | Flag path roots from `get_rule_value` |
| `loot_crate_runtime_flags` | Crate rolling lock and pending grants |
| `static_loot_block_flag` | World chest parent (`Loot/static_loot_world.dsc`). `PLAYER` contents sit under that parent |
| `static_loot_index_flag` | Bound chest locations (`Loot/static_loot_index.dsc`) |
| `hologram_index_flag` | Persistent holograms (`hologram_index.dsc`) |
| `gps_index_flag` | Live GPS arrows (`gps_index.dsc`) |
| `spray_index_flag` | Live spray frames (`spray_index.dsc`) |
| `projectile_index_flag` | Live projectile shots (`projectile_index.dsc`) |
| `entity_index_flag` | Live combat mobs (`Entities/entity_index.dsc`) |
| `cosmetic_index_flag` | Live cosmetic displays (`cosmetic_index.dsc`) |
| `area_index_flag` | World areas (`Areas/area_index.dsc`) |
| `area_group_index_flag` | Area groups (`Areas/area_group_index.dsc`) |
| `engine_notables` | Skill cages. Wiped on reload. Area notes are not |
| Mongo | `Persistence/mongo_utils.dsc`. Pack names are Frontend `global_mongo_config`. URI is `secrets.secret`, not player `flag_saves` |

Event receipts: [receipts](receipts.md).

## Mechanics in one line

Something builds a context map (`build_mechanic_context`) and fires `run_mechanic_config`. That raises custom event `execute_mechanic`. Requirements run, then delay/repeat, then each operation. Operations call `resolve_mechanic_operation_targets`. World events reach this through `fire_stat_event` ([triggers.md](triggers/README.md)). Details: [mechanics/README.md](mechanics/README.md).

## What can go wrong

- Naming a Frontend script without its prefix. It never lands in `server.flag[scripts.*]`.
- Reloading Backend without Frontend (or the reverse). Prefix lists go empty for that side.
- Writing flags in a mechanic op. Persistence and path changes then break in many files.
