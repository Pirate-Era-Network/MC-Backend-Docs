---
sidebar_position: 21
---

# /packprojectile

Lists or clears tracked projectile shots. Ops and the console can run it.

## System

Each shot is one row on `projectile_index`. Trails and attached models share that shot id. Shots are timed. Start and reload wipe them. `PROJECTILE` is the mechanic that creates them. This command is the admin list.

| Piece | Where |
| --- | --- |
| Command | [Mechanics/Individual_operations/projectile_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/projectile_command.dsc) |
| Index | [Mechanics/Individual_operations/projectile_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/projectile_index.dsc) |
| Option catalog | [mechanics](../mechanics/operations/README.md) |

## Use

```text
/packprojectile
/packprojectile list
/packprojectile prune
/packprojectile clear
```

| Action | What it does |
| --- | --- |
| `list` | Player opens `menu_projectile_list` (remaining time, leftover, teleport click). Console narrates the same rows. |
| `prune` | Drop leftover, ghost, and orphan rows. Live shots stay. |
| `clear` | Remove every tracked shot. |

## What can go wrong

- Expecting shots to survive reload. The index is wiped on purpose.
- `prune` expected to stop a shot that is still in the air. Use `clear` for live shots.
