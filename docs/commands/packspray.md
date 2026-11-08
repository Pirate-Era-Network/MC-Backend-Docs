---
sidebar_position: 22
---

# /packspray

Lists or clears tracked spray frames. Ops and the console can run it.

## System

`PLACE_SPRAY` paints a filled map into an item frame and indexes it on `spray_index` by owner uuid. Frames are timed. Start and reload wipe them. This command does not place a spray. Placement is the mechanic, usually from a spray item.

| Piece | Where |
| --- | --- |
| Command | [Mechanics/Individual_operations/spray_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/spray_command.dsc) |
| Index | [Mechanics/Individual_operations/spray_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/spray_index.dsc) |
| Option catalog | [mechanics](../mechanics/operations/README.md) |

## Use

```text
/packspray
/packspray list
/packspray remove (player)
/packspray prune
/packspray clear
```

| Action | What it does |
| --- | --- |
| `list` | Player opens `menu_spray_list`. Console narrates the same rows. |
| `remove` | No name stops your spray. A name removes that owner's frame, online or offline. |
| `prune` | Drop leftover, ghost, and orphan rows. Live frames stay. |
| `clear` | Remove every tracked frame. |

## What can go wrong

- Using this command to place a new spray. Place one with the spray item or `PLACE_SPRAY`.
- Expecting frames to come back after reload.
