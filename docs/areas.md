---
sidebar_position: 33
---

# Areas

**Live.** Area Config templates, world instances, area groups, AreaRule checks, and optional categories.

Backend: [Areas/area_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_utils.dsc), [Areas/area_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_index.dsc), [Areas/area_group_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_group_index.dsc), [Areas/area_world.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_world.dsc), [Areas/area_wand.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_wand.dsc), [Areas/categories/](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/tree/main/Areas/categories).

Frontend examples: `Areas/area_examples.dsc`, `Areas/farm_examples.dsc`. Admin list: `Menus/menu_area_list.dsc`.

## Scripts

| Prefix | What it is |
| --- | --- |
| `area_` | Optional template. Fills keys the area flag did not set |
| `areagroup_` | Optional group template. The live row is `area_group_index` |
| `farm_` | Farm node definition. Schematic, materials, respawn, loot. Linked from the area with `farm:` |

A world instance is not a script. `/packarea place` notes a cuboid or ellipsoid and stores the row on `area_index`. Groups are rows on `area_group_index`. Place links the two. Editing a group flag updates every member on the next check. Nothing writes a `.dsc` from the game.

## Categories

No category required. A plain area is a WorldGuard-style island. A category is extra data plus one task file under `Areas/categories/`. The break dispatcher chooses on the category id.

| Id | Aliases | File | Behavior |
| --- | --- | --- | --- |
| `FARM` | `farm`, `farming` | `area_category_farm.dsc` | Schematic paste, material break, loot, respawn |
| `MOB_SPAWN` | `mob_spawn` | `area_category_mob_spawn.dsc` | Mob ids, cap, radii, cooldown, leash, level, leash flags, patrol. `area_mob_spawn_world` runs `spawn_entity` every 1s |

Freeform labels (`safe`, `gate`) stay as uppercased strings for `IN_AREA` and menus. They have no module file.

## How a check resolves

For each behavior key, and for each rule id:

1. The area's own flag value, if that key is set.
2. Else groups on that area, higher group priority first. The first group that sets that key or that rule id wins it. A group that sets `PVP` does not clear another group's `OPEN_CHESTS`.
3. Else the template script (`template`, or `config` on older rows). A group template's `config:` pointer is read only for keys the group flag left out.
4. Else the defaults for priority, shape, radius, and height.

Empty, `none`, and an empty list or map count as unset, so a later layer can still fill them.

`on_entry`, `on_exit`, `on_tick`, and `on_event` are one key each. The first layer that sets that key keeps the whole list. They do not append across groups.

Place writes shape, radius, and height onto the area row, so the note size stays what was placed. Rules are not copied at place time. `/packarea rule` writes one rule id onto the area (that id then beats its groups). `/packarea grouprule` writes one rule id onto the group. `/packarea group name priority:n` stores the group's sort priority on the flag.

Overlapping notes: the highest area priority that sets a rule id wins that rule. Entry, exit, tick, and event mechanics still run for every area you are inside.

## AreaRule

| Id | Value | What DENY does |
| --- | --- | --- |
| `PVP` | `ALLOW` or `DENY` | Player versus player damage stops before HP when either player is in the area. Op attackers bypass |
| `OPEN_CHESTS` | `ALLOW` or `DENY` | Chest, trapped chest, barrel, shulker, ender chest. Denies when the player or the chest block is in the area |
| `INTERACT_NPCS` | `ALLOW` or `DENY` | Right click on a non-player entity. Denies when the player or that entity is in the area |
| `TRAVEL` | `ALLOW` or `DENY` | `area_allows_travel` returns false. Walking is not blocked. `TRAVEL_TO_WAYPOINT` and `/packwaypoint` call that proc |
| `BUILD_HEIGHT` | number | Place and break are cancelled when the block is above a limit set at the block or at the player |
| `MOUNT_SPEED_CAP` | number | Scales a mount's landSpeed, waterSpeed, and airSpeed at the mount's location. `none` or unset means no scale. Entry and exit refresh the entity that crossed, including when that entity is the mount and not a player |
| `PUBLIC_ACCESS` | `ALLOW` or `DENY` | A non-op player who enters is moved back and does not get entry mechanics |
| `NO_CAST` | `ALLOW` or `DENY` | The click drops a mechanic that would `RUN_SKILLMOVE` or `RUN_ITEMSKILL` before swing or the item cooldown starts. Op casters bypass. The target's area does not matter |

Omit a rule to leave it unset. Unset is not deny.

## Mechanics

| Key | When |
| --- | --- |
| `enter_requirements` | Same requirement list mechanics use. Empty passes. A player who fails is moved 4 blocks backward and entry operations do not run |
| `exit_requirements` | Same list. A player who fails is moved 4 blocks toward the area center. Exit is already after the fact, so this is a teleport |
| `on_entry` | Entity enters the note, after requirements pass. Players also see `display.enter_text` |
| `on_exit` | Entity exits, after requirements pass |
| `on_tick` | Once a second while a player is inside, from the player loop |
| `on_event` | Map of trigger ids (`ON_BLOCK_BREAK`) to mechanic lists. Fired from `fire_stat_event` after triggerables and Eventstats |

`source_type` is `AREA`. Each `on_entry` or `on_exit` entry is a mechanic map with `operations`. Op players bypass `PUBLIC_ACCESS`. They do not bypass `enter_requirements` or `exit_requirements`.

```
enter_requirements:
- type: BOOLEAN
  stat: stat_example_quest
  mode: HAS
on_entry:
- operations:
    1:
      type: PLAY_SOUND
      target: SELF
      target_type: ENTITY
      sound: ENTITY_EXPERIENCE_ORB_PICKUP
      volume: 0.4
      pitch: 1.2
```

`display.name` and `display.enter_text` are transcript keys. `wiki` is the longer body.

## Farming (FARM)

Harvested from legacy `ConquerServer/FarmingSystem` (weakpoint, multi-hit, animated clear/rebuild).

`category: farm` plus a linked `farm_` script:

```
# Area Config
category: farm
farm: farm_example_oak

# farm_example_oak (type: data)
schematic: example_node
respawn: 30s
materials:
- oak_log
loot: loottable_example
hits: 5
tools:
  iron_axe: 3
break_time: 5s
build_time: 2s
on_hit:
- operations:
    1:
      type: PLAY_SOUND
      target: SELF
      target_type: ENTITY
      sound: BLOCK_NOTE_BLOCK_BELL
      volume: 0.8
      pitch: 1.2
on_break:
- operations:
    1:
      type: PLAY_SOUND
      target: SELF
      target_type: ENTITY
      sound: ENTITY_PLAYER_LEVELUP
      volume: 0.6
      pitch: 1
on_wrong_hit:
- operations:
    1:
      type: NARRATE
      target: SELF
      transcript: area_farm_wrong_weakpoint_text
```

| Key | Role |
| --- | --- |
| `schematic` | Denizen schematic name. Place pastes it with `noair` |
| `materials` | Block names that count as the node (`oak_log`) |
| `respawn` | Delay after the clear animation before rebuild starts. Default `30s` |
| `loot` | `loottable_` granted once when hits reach the need |
| `hits` | Base chops on the weakpoint. Default `1` |
| `tools` | Map of item script id or material name to a lower hit count |
| `break_time` | Clear animation length. Default `5s` |
| `build_time` | Rebuild animation length. Default `2s` |
| `weakpoint_particle` | Particle on the marked block. Default `wax_on` |
| `weakpoint_pulse` | Particle interval. Default `10t` |
| `session_timeout` | Idle time after the last successful chop before progress and particles clear. Default `10s`. Actively mining refreshes it |
| `on_hit` | Mechanic list when the weakpoint is chopped (not yet depleted) |
| `on_break` | Mechanic list when the node depletes |
| `on_wrong_hit` | Mechanic list when a listed material that is not the weakpoint is hit. When set, replaces the default wrong-weakpoint chat line |

Only the **weakpoint** (an outer material block with particles) accepts hits after the session starts. The **first** break of any listed material starts the session, counts as hit one, picks a weakpoint, and starts particles. After each later non-final hit the weakpoint moves. The broken-block overlay lasts for `session_timeout` and refreshes on each successful chop (same idle clock). If nobody successfully chops for `session_timeout` (default `10s`), progress, particles, and crack clear and the next break is any-break again. Clear and rebuild animate bottom-up like legacy `breakResource` / `respawnResource`.

The area row stores `farm: farm_example_oak`. The editor picks that link. Inline `farming:` still works. A linked `farm:` wins when both are present.

If the schematic file exists, the note is the schematic cuboid. If it does not, the area still places as the config box and chat says the schematic is missing.

## Mob spawn (MOB_SPAWN)

`category: mob_spawn` plus `mob_spawn` on the Area Config. The keys below are the contract. `tick_all_area_mob_spawn_areas` runs every second from `area_mob_spawn_world`. While any player is within `activation_radius` of the area center, the camp spawns up to `max` indexed mobs, leashes wanderers, and respects `cooldown` between attempts. When nobody is in that radius, `clear_indexed_entities_by_area` wipes the camp (legacy empty spawner). Patrol offsets stamp onto the mob before the mode FSM (`patrol_points`). Idle `PATROL` re-issues `mythicpath` on an interval (`entity_patrol_repath_interval`). `entity_.patrol` offsets from the spawn point work the same way when the area omits `patrol`.

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

`entity_level` is an area behavior key, not a key inside `mob_spawn`. A group that sets it fills every member that does not set its own, through `resolve_area_effective_config`. If no area sets it, spawn falls through to the row `level`, then `entity_level_default` (`5`).

`set_area_mob_spawn_value` writes one key onto the area flag. Templates fill gaps the same way as farming.

## Command

Op only.

```
/packarea place
/packarea place area_example_safe
/packarea place area_example_farm areagroup_example_safe category:farm
/packarea place area_example_gate
/packarea group areagroup_example_safe priority:10
/packarea rule PVP DENY
/packarea grouprule areagroup_example_safe OPEN_CHESTS DENY
/packarea tall
/packarea here
/packarea list
/packarea remove
/packarea clear
/packarea prune
```

`here` lists every area under your feet, highest priority first. The first row is the one `remove` deletes. `remove` deletes the highest priority area you are standing in, drops it from its groups, and airs the schematic saved on that row. A second overlapping area keeps its own schematic until that row is removed. Terrain the paste left alone stays. `list` opens the PAGE. Left click teleports. Shift left click opens rename, delete, groups, category, and farm link. `tall` stretches the two wand corners from bedrock to build height. Skip it for a short cuboid. `prune` drops bad index rows and AREA notes that have no index row. `clear` removes every indexed area. `group` creates the flag row if needed. `rule` writes that rule id on the area you are standing in. `grouprule` writes it on the group, which every member reads until the area sets the same id.

## Staff wand

`/packitem item_area_wand` gives the blaze rod. Op only.

Left click a block sets corner one. Right click a block sets corner two. Optional `/packarea tall` stretches those corners to world min and max Y. Sneak right click notes that cuboid. Right click air opens the admin PAGE (areas, groups, confirm). Selecting the wand outlines nearby notes for a few seconds. A wand cuboid stores both corners so a missing note rebuilds the same box. Rename writes a display name. The note id does not change. Group clicks add or remove that group on the area you are editing. Category picks farm, mob_spawn, safe, gate, or clear (clear drops the override so a template can refill). Farm link picks a `farm_` script or clears the link. Linking a farm on a bare area also stamps category farm when none is set.

## What can go wrong

- Putting the area on `engine_notables`. That list is skill cages and is wiped on reload.
- Expecting two groups to append `on_entry`. The higher priority group that sets `on_entry` keeps that whole list. The other group's list is used only when the higher one omits `on_entry`.
- A huge schematic. Paste waits. Keep nodes small.
- `TRAVEL: DENY` does not block walking. `TRAVEL_TO_WAYPOINT` and `/packwaypoint` call `area_allows_travel` and refuse the move.
