---
sidebar_position: 14
---

# Entities

Entity index, nametag, cast, companion, and Mythic shell keys. The lifecycle is [entities](../entities/README.md).

| Key | Role | Page |
| --- | --- | --- |
| `entity_index_flag` | Server map `entity_index` of live combat mobs. Wiped on start and reload | [entities.md](../entities/README.md) |
| `entity_list_menu` | `menu_entity_list` | [entities.md](../entities/README.md) |
| `entity_remove_range` | `/packentity remove` nearest search radius | [entities.md](../entities/README.md) |
| `entity_boss_music_sound_category` | SoundCategory for boss music pulse and `stop_sound` on death | [entities.md](../entities/README.md) |
| `entity_smoke_values` | `/packentity smoke` defaults (model, animation, signal, threat, path) | [entities.md](../entities/README.md) |
| `entity_nametag_data_keys` | `visuals.nametag` keys (name, level_mode, health, alignment, …) | [entities.md](../entities/README.md) |
| `entity_nametag_level_modes` | `SCALED` / `RESOLVED` display level | [entities.md](../entities/README.md) |
| `entity_entity_flag` | Entity stamp `entity_index_id`. Child models share it | [entities.md](../entities/README.md) |
| `entity_remove_flag` | Pending wipe `entity_index_remove`. Chunk load drops stamped leftovers | [entities.md](../entities/README.md) |
| `entity_payload_keys` | Index row: id, entity, script, area, owner, started, home, remove | [entities.md](../entities/README.md) |
| `companion_cap` | Live companions one owner may have (`3`) | [entities.md](../entities/README.md) |
| `companion_roster_states` / `companion_roster_keys` | `OUT` / `RECALLED` / `STORED` roster row shape | [entities.md](../entities/README.md) |
| `entity_cast_pick_modes` / `entity_cast_phase_keys` / `entity_cast_follow_up_duration` | Cast arsenal pick, phases, FOLLOW_UP arm window | [entities.md](../entities/README.md) |
| `entity_skill_data_keys` | Skill gates plus `pause_while`, `repeats`, `follow_up_guaranteed` | [entities.md](../entities/README.md) |
| `entity_ally_notify_signal` / `entity_notify_radius_default` / `entity_patrol_repath_interval` | Ally call-in signal, notify radius fallback, PATROL repath cadence | [entities.md](../entities/README.md) |
| `entity_threat_keys` | `swap_threshold` / `hold_time` | [entities.md](../entities/README.md) |
| `entity_level_default` | Level when the op, the command, and the area all omit it (`5`) | [areas.md](../areas/README.md) |
| `mythic_base_types` | Shared Mythic shells: `base_statue_mob`, `base_land_mob`, `base_water_mob`, `base_passive_water_mob`, `base_air_mob`, `base_land_mob_tamed`. `entity_.mythic` picks one | [entities.md](../entities/README.md) |
| `entity_data_keys` | `mythic`, `living_entity`, `model`, `ai`, `profile`, `prevent_vanilla_drops`, `hit_requirements`, `mount`, crew/home/patrol/visuals keys | [entities.md](../entities/README.md), [mounts.md](../mounts.md) |
| `entity_runtime_flags` | Living-entity flags under `runtime_data.entity` (owner, faction, cast_busy, cast_state, patrol_points, …) | [entities.md](../entities/README.md) |
| `entity_ai_data_keys` | `entityai_` keys including `notify_allies` / `notify_radius`. Dual fields use setters (flag + Mythic). No Mythic level | [entities.md](../entities/README.md) |
| `mechanic_entity_operations` | Spawn, model, animate, path, signal, threat, `SET_ENTITY_AI`, `RESET_MYTHIC_TARGET`, `SET_COMPANION_STATE`, `PLAY_BOSS_MUSIC` | [mechanics/operations.md](../mechanics/operations/README.md) |
| `entity_companion_keys` | `teleport_distance`, `friendly_fire` only | [entities.md](../entities/README.md) |
| `entity_companion_states` | `FOLLOW` / `HOLD` | [entities.md](../entities/README.md) |
| `entity_ai_modes` | `FOLLOW` / `HOLD` / `IDLE` / `COMBAT` / `PATROL` / `RETURN_HOME` / `FLEE` | [entities.md](../entities/README.md) |
| `entity_flee_keys` | `hp_below` (0 to 100) | [entities.md](../entities/README.md) |
