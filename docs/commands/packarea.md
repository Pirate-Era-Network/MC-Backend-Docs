---
sidebar_position: 14
---

# /packarea

Places and edits world areas from where you stand. Op only, and the sender must be a player. Console stops.

## System

A placed area is a noted cuboid or ellipsoid plus a row on `area_index`. It is not a new script. Groups live on `area_group_index`. Rules on the area or the group are what `AreaRule` checks read. The wand in `area_wand.dsc` selects corners. This command places, stretches, and edits.

| Piece | Where |
| --- | --- |
| Command | [Areas/area_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_command.dsc) |
| Index | [Areas/area_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_index.dsc) |
| Groups | [Areas/area_group_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Areas/area_group_index.dsc) |
| Option catalog | [areas](../areas.md) |

## Use

```text
/packarea place <area_script> (group) (category:<name>)
/packarea group <name> (priority:<n>)
/packarea rule <id> <value>
/packarea grouprule <group> <id> <value>
/packarea tall
/packarea here
/packarea list
/packarea remove
/packarea clear
/packarea prune
```

| Action | What it does |
| --- | --- |
| `place` | Note the wand selection at your feet. The first real `area_` script is the template. Other words are group names. `category:farm` sets the category. |
| `group` | Create the group row, or set its priority when you pass `priority:` a number. Priority on the flag beats the template. |
| `rule` | Set one rule on the highest priority area you are standing in. The id must be an `area_rule_ids` value. |
| `grouprule` | Set that rule on the named group. Members pick it up on the next check. |
| `tall` | Stretch the two wand corners to world min and max height. |
| `here` | Narrate the areas at your feet, highest priority first. |
| `list` | Open the area PAGE. |
| `remove` | Delete the highest priority area you are standing in. |
| `clear` | Wipe the area index. |
| `prune` | Drop index rows that are not a valid area payload. |

## What can go wrong

- `place` with an `areagroup_` name in the template slot. Group names are members. Only an `area_` script is the template.
- `rule` while standing in no area.
- `remove` while areas overlap. The highest priority one is the one that goes.
