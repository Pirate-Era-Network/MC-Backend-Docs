---
sidebar_position: 16
---

# /packmount

Summons, puts away, or lists a player's saved mount rows. Ops and the console can run it. A missing player is the sender. Console must name a player.

Live bodies still show on `/packentity list`. A recalled companion row is not a mount row and is not listed here.

## System

Each owned mount is a row under the player's mount flag, keyed by `entity_` script. Summon uses the equipped row (the whistle id). Unsummon saves, dismounts, then removes the body. Defeated rows refuse summon until something clears `defeated_at`.

| Piece | Where |
| --- | --- |
| Command | [Mounts/mount_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mounts/mount_command.dsc) |
| Rows and summon | [Mounts/mount_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mounts/mount_utils.dsc), [Mounts/mount_spawn.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mounts/mount_spawn.dsc) |
| Option catalog | [mounts](../mounts.md) |

## Use

```text
/packmount summon (player)
/packmount unsummon (player)
/packmount list (player)
```

| Action | What it does |
| --- | --- |
| `summon` | Spawn the equipped mount row for that player. |
| `unsummon` | Save and remove the live body. No body is still a success. |
| `list` | One chat line per saved row, with health and whether that script is the live body. |

## What can go wrong

- Summon with nothing equipped, or a row the player does not own.
- Summon of a defeated row. Heal or clear the defeat before it will spawn.
- Expecting companion roster pets in this list. Those stay on the entity index.
