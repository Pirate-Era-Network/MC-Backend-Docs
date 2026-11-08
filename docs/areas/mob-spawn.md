---
sidebar_position: 3
---

# MOB_SPAWN

`category: mob_spawn` plus `mob_spawn` on the Area Config keeps a camp of indexed mobs. The task file is `Areas/categories/area_category_mob_spawn.dsc`. `tick_all_area_mob_spawn_areas` runs every second from `area_mob_spawn_world`. While any player is within `activation_radius` of the area center, the camp spawns up to `max` indexed mobs, leashes wanderers, and respects `cooldown` between attempts. When nobody is in that radius, `clear_indexed_entities_by_area` wipes the camp. The area script and the resolve order stay on [Areas](README.md).

| Key | Role |
| --- | --- |
| `mobs` | List of mob ids |
| `max` | Cap on live spawns from this area. Default `4` |
| `spawn_radius` | Spawn distance from center. Default `8` |
| `activation_radius` | Player distance that arms the area. Default `24` |
| `cooldown` | Delay between spawn attempts. Default `10s` |
| `leash` | Max distance a mob may wander from center. Default `16` |
| `level` | Spawner level. Default `5`. Used when `use_area_level` is off, or when no area sets `entity_level` |
| `use_area_level` | When true, area `entity_level` wins and this row's `level` is the fallback. Default false |
| `heal_on_leash` | Refill the living-entity health route when a leash pull happens. Default false |
| `combat_reset_on_leash` | Clears hardset skill cooldowns, the cast step, and the Mythic target, then heals when `heal_on_leash` is also set. Default false. Omit and leash only teleports |
| `patrol` | Optional list of offsets from the area center (`x`, `y`, `z`). No default |

Patrol offsets stamp onto the mob before the mode FSM (`patrol_points`). Idle `PATROL` re-issues `mythicpath` on an interval (`entity_patrol_repath_interval`). `entity_.patrol` offsets from the spawn point work the same way when the area omits `patrol`.

`entity_level` is an area behavior key, not a key inside `mob_spawn`. A group that sets it fills every member that does not set its own, through `resolve_area_effective_config`. If no area sets it, spawn falls through to the row `level`, then `entity_level_default` (`5`).

`set_area_mob_spawn_value` writes one key onto the area flag. Templates fill gaps the same way as farming.
