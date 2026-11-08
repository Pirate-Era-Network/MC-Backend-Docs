---
sidebar_position: 13
---

# /packgps

Staff tool for the GPS arrow index. Ops and the console can run it.

## System

One arrow per player, stored on `gps_index` by owner uuid. Arrows are timed. Start and reload wipe them. `START_GPS` and `STOP_GPS` are the mechanic path. This command is the admin list plus a waypoint shortcut.

| Piece | Where |
| --- | --- |
| Command | [Mechanics/Individual_operations/gps_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/gps_command.dsc) |
| Index | [Mechanics/Individual_operations/gps_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/gps_index.dsc) |
| Option catalog | [mechanics](../mechanics/operations.md) |

## Use

```text
/packgps
/packgps list
/packgps waypoint <waypoint>
/packgps remove (player)
/packgps prune
/packgps clear
```

| Action | What it does |
| --- | --- |
| `list` | Player opens `menu_gps_list` (remaining time, leftover, teleport click). Console narrates the same rows. |
| `waypoint` | Point your arrow at that waypoint's resolved location. Needs a player. |
| `remove` | No name stops your arrow. A name stops that owner's arrow, online or offline. |
| `prune` | Drop leftover, ghost, and orphan rows. Live arrows stay. |
| `clear` | Remove every tracked arrow. |

## What can go wrong

- Expecting arrows to come back after reload. They are wiped on purpose.
- `waypoint` when that id has no resolved location.
- `prune` expected to remove a live arrow. Use `remove` or `clear` for a live one.
