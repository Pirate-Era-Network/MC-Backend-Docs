---
sidebar_position: 1
slug: /areas
---

# Areas

An area is a placed note plus optional scripts. A plain area is an island: rules, entry text, and mechanics, with no extra module. A group that sets one rule does not clear a different rule from another group. The first group that sets a given rule id wins that id. `PVP` on one group leaves `OPEN_CHESTS` from another group in place.

A world instance is not a script. `/packarea place` notes a cuboid or ellipsoid and stores the row on `area_index`. Groups are rows on `area_group_index`. Editing a group flag updates every member on the next check. Nothing writes a `.dsc` from the game.

Examples: `pirate-era-core-frontend/Areas/area_examples.dsc`, `Areas/farm_examples.dsc`. Admin list: `Menus/menu_area_list.dsc`. Command writeup: [packarea](../commands/packarea.md).

Backend: [Areas/area_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_utils.dsc), [Areas/area_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_index.dsc), [Areas/area_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_command.dsc), [Areas/area_group_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_group_index.dsc), [Areas/area_world.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_world.dsc), [Areas/area_wand.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_wand.dsc), [Areas/categories/](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/tree/main/Areas/categories).

## Scripts

| Prefix | What it is |
| --- | --- |
| `area_` | Optional template. Fills keys the area flag did not set |
| `areagroup_` | Optional group template. The live row is `area_group_index` |
| `farm_` | Farm node definition. Linked from the area with `farm:`. See [Farm](farm.md) |

## Categories

No category is required. A category is extra data plus one task file under `Areas/categories/`. The break dispatcher chooses on the category id.

- [FARM](farm.md) pastes a schematic and grants loot when the node breaks.
- [MOB_SPAWN](mob-spawn.md) keeps a camp of indexed mobs while a player is nearby.

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

Do not put the area on `engine_notables`. That list is skill cages and is wiped on reload.

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

```yaml
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

## Command

Op only.

```text
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
