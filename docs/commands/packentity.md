---
sidebar_position: 15
---

# /packentity

Staff tool for indexed combat mobs. Ops and the console can run it. Spawn, radius prune, and smoke need a player.

## System

`spawn_entity` is the only register path. This command, the `SPAWN_ENTITY` op, and area mob spawn all call it. The index is `entity_index`. Start and reload wipe it. List, remove, prune, and clear are the admin side of that index.

| Piece | Where |
| --- | --- |
| Command | [Entities/entity_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Entities/entity_command.dsc) |
| Index | [Entities/entity_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Entities/entity_index.dsc) |
| Spawn | [Entities/entity_spawn.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Entities/entity_spawn.dsc) |
| Smoke | [Entities/entity_smoke.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Entities/entity_smoke.dsc) |
| Option catalog | [entities](../entities/README.md) |

## Use

```text
/packentity
/packentity list
/packentity spawn <entity_script> (level|area)
/packentity remove (uuid)
/packentity prune (radius)
/packentity smoke (kind)
/packentity clear
```

| Action | What it does |
| --- | --- |
| `list` | Player opens `menu_entity_list`. Console narrates the same rows, uuid first. |
| `spawn` | Mythic-spawn the entity at your feet and index it. A decimal third argument is the level. `area` uses the area level. Chat then reports resolved level, visual level, and health. |
| `remove` | No uuid removes the nearest indexed mob within `entity_remove_range`. A uuid from the list lore removes that row. |
| `prune` | No radius drops leftover, ghost, and orphan rows. A radius removes every indexed mob in that sphere, including live ones. |
| `smoke` | Run live model, animate, path, signal, threat, or nametag checks on the nearest indexed mob. `kind` defaults to `all`. |
| `clear` | Wipe every indexed mob. |

Removing a mount body saves the mount row first, including when the owner is offline.

## What can go wrong

- `spawn` from console. The mob needs the sender's location.
- `prune 20` expected to only drop ghosts. A radius also deletes live mobs inside it.
- `smoke` with no indexed mob nearby.
