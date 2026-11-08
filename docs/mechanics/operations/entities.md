---
sidebar_position: 49
---

# Entities and mounts

These operations act on a combat mob or a mount. The punch, the level, and the model attachment live on the Denizen entity. The Mythic YAML is only the vanilla shell. Mount rows, seats, and cast sets are the ride. Lifecycle is on [entities](../../entities/README.md). The ride is on [mounts](../../mounts.md). Depenizen mechanisms that these ops call are on [Mythic mechanisms](../../entities/mythic-mechanisms.md).

| Type | Keys | Task |
| --- | --- | --- |
| `SPAWN_ENTITY` | `entity` (or `entity_script`), optional `location` (else LOCATION targeting), `owner`, `area`, `home`, `level`, `use_area_level` | `operation_spawn_entity` → `spawn_entity` |
| `SUMMON_MOUNT` | optional `entity` (owned `entity_` id, else equipped row). Does not create a row | `operation_summon_mount` → `summon_mount_for_player` |
| `UNSUMMON_MOUNT` | none. No body is a no-op | `operation_unsummon_mount` → `clear_live_mount` |
| `MOUNT` | optional `mount` entity, else the target's live mount. Owner uses `pemountseat`. Anyone else uses passenger `megmount` | `operation_mount` |
| `FORCE_DISMOUNT` | none. One seated player. Does not remove the mount | `operation_force_dismount` |
| `RESTORE_MOUNT` | optional `entity` (else equipped). Pays `restore.costs` after delay and requirements | `operation_restore_mount` |
| `REFRESH_MOUNT` | optional `mount` entity, else the live mount | `operation_refresh_mount` → `refresh_mount_entity` |
| `SET_MOUNT_ROW` | `create` + `entity`, `equipped`, `passenger_policy`, `stat` + `delta`. Create stores profile numbers and does not spawn | `operation_set_mount_row` |
| `SET_ENTITY_MODEL` | `model` (`entitymodel_` id, bare blueprint id, or inline map with `blueprint` / `scale` / `hitbox` / `remove_previous`) | `operation_set_entity_model` → `apply_entity_model_at_spawn` |
| `ANIMATE_ENTITY` | `animation` (`entityanimation_` id, bare MEG state, or inline map), optional `li` / `lo` / `speed` / `force` / `delay` / `lock_movement` / `invulnerable_during` | `operation_animate_entity` → `megstate` |
| `MYTHIC_PATH` | `path` (Location list) or LOCATION targeting, optional `speed` / `tolerance` / `duration` / `timeoutdistance` / `timeouttime` | `operation_mythic_path` → `mythicpath` |
| `MYTHIC_SIGNAL` | `signal` (case sensitive), optional `source` (else caster) | `operation_mythic_signal` → `mythicsignal` |
| `MYTHIC_THREAT` | `action` (`ADD` / `SUBTRACT` / `SET`), `amount`, optional `for` (else caster) | `operation_mythic_threat` → `mythicthreat` |
| `SET_COMPANION_STATE` | `state` (`FOLLOW` / `HOLD` for AI, or `RECALLED` / `STORED` for roster). No `target` means every live companion of the caster | `operation_set_companion_state` |
| `SET_ENTITY_AI` | optional `goals`, `targets`, `malus`, `mode` | `operation_set_entity_ai` |
| `RESET_MYTHIC_TARGET` | none. Clears the ActiveMob target only | `operation_reset_mythic_target` |
| `PLAY_BOSS_MUSIC` | `sound`. Also `entity_.boss_music` at spawn. Pulse uses `entity_boss_music_sound_category`. Death/remove calls `stop_entity_boss_music` (`stop_sound`) | `operation_play_boss_music` |

`entity_.mythic` is a shared base id (`base_land_mob`, and the other shells), not a unique Mythic mob per content row. Boss and hurt clips use `ANIMATE_ENTITY`, which calls `megstate` on the first active model. Mythic skill bodies stay off the base shell.

Staff clips for these ops are `/packentity smoke`. Defaults live in `rules.dsc` `entity_smoke_values`.

Spawn ops that put a display in the world follow [Display and pulse](display.md).
