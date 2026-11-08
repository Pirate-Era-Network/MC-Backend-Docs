---
sidebar_position: 2
---

# Mythic mechanisms

These four tables are the Depenizen surfaces this engine maps. A dual setter writes a flag and a Mythic adjust. A mechanism is applied from `entityai_` at spawn. A command is a mechanic op. The last table is what this engine does not call. The mob lifecycle stays on [entities](README.md).

Source: Depenizen `MythicMobsMobTag` mechanisms and Mythic commands. Spawn-time values live on `entityai_` (inline or script). Keys are `rules.dsc` `entity_ai_data_keys`.

## Dual setters (flag + Mythic)

AOE / faction filters read entity flags (`entity_runtime_flags`), not Mythic tags alone. Setters in `Entities/entity_mythic.dsc`:

| Field | Flag | Mythic adjust |
| --- | --- | --- |
| `owner` | `runtime_data.entity.owner` (uuid) | `owner` |
| `faction` | `runtime_data.entity.faction` | `faction` |
| `parent` | `runtime_data.entity.parent` (uuid) | `parent` |
| `stance` | `runtime_data.entity.stance` | `stance` |
| `script` | `runtime_data.entity.script` | (none, Denizen only) |

## Mechanisms → `entityai_` (applied at spawn)

| Depenizen mechanism | Config key | Notes |
| --- | --- | --- |
| `despawn_mode` | `despawn_mode` | Default `NORMAL` |
| `faction` | `faction` | Via `set_entity_faction`. Group name for faction target selectors. See `mythic_mobs_factions_documentation.md` |
| `ai_goals` | `ai_goals` | List. Optional leading `clear`. Names in `mythic_mobs_ai_options.md` |
| `ai_targets` | `ai_targets` | List. Optional leading `clear`. Names in `mythic_mobs_ai_options.md` |
| `pathfinding_malus` | `pathfinding_malus` | Map of path type to cost, or a list of `water\|0` entries. Spawn adjusts the Mythic object. Negative YAML values are quoted. Names in `mythic_mobs_ai_options.md` |
| `level` | unused | Pack level is `resolve_spawn_entity_level` + profile. Never adjust Mythic level |
| `global_cooldown` | `global_cooldown` | Integer (Depenizen) |
| `stance` | `stance` | Via `set_entity_stance` |
| `mythic_variable_map` | `mythic_variable_map` | MapTag |
| `owner` | `owner` | Via `set_entity_owner`. Spawn `owner` arg wins |
| `parent` | `parent` | Via `set_entity_parent` |
| `target` | `target` | Optional Entity or uuid. One-shot at spawn |
| `reset_target` | (none) | No config value. Runtime clear when leash / combat reset needs it |

Read-only tags (`internal_name`, `threat_table`, `has_target`, …) are not config. They are for getters and later AI ticks.

## Commands → mechanic ops (not spawn YAML)

| Depenizen command | Engine surface | Status |
| --- | --- | --- |
| `mythicspawn` | `spawn_entity` | Live |
| `mythicpath` | `MYTHIC_PATH` | Live |
| `mythicsignal` | `MYTHIC_SIGNAL` | Live |
| `mythicthreat` | `MYTHIC_THREAT` | Live |
| `mythicskill` | not used | Boss / hurt clips use `ANIMATE_ENTITY` (`megstate`) + `skillmove_`. Do not put Mythic skill bodies on the base shell |

## Out of this system

| Depenizen surface | Why |
| --- | --- |
| `MythicSpawnerTag` | Area `MOB_SPAWN` + `spawn_entity` replace Mythic spawners |
| Player `mythic_variable_map` | Player Mythic vars, not combat mob configs |

Vanilla attribute cleanup on the living entity (`movement_speed`, `knockback_resistance`, `target_range` → follow range) is also on `entityai_`. That is Bukkit adjust, not a Mythic mechanism.
