---
sidebar_position: 19
---

# /staticloot

Binds a `loottable_*` to the trapped chest or barrel you are looking at. Op only. `list` needs a player. Bind and unbind need you to look at the block.

## System

The block flag stores the table, cooldown, and mode (`shared` or `player`). Opening the container fills it from that table when the cooldown allows. Crates opened from an item are `OPEN_LOOT_CRATE`, not this command.

| Piece | Where |
| --- | --- |
| Command | [Loot/static_loot_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Loot/static_loot_command.dsc) |
| World listener | [Loot/static_loot_world.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Loot/static_loot_world.dsc) |
| Index | [Loot/static_loot_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Loot/static_loot_index.dsc) |
| Option catalog | [loot](../loot.md) |

## Use

```text
/staticloot bind <table> <cooldown> (shared|player)
/staticloot unbind
/staticloot list
```

| Action | What it does |
| --- | --- |
| `bind` | Attach the table to the looked-at container. Cooldown is a duration such as `1h`. Omitted mode is shared. |
| `unbind` | Clear the bind on the looked-at block. |
| `list` | Open the static loot PAGE. |

The block must be an allowed loot material. A block that already has a table must be unbound before a new bind.

## What can go wrong

- Looking at the wrong block. The cursor block is the target, not the block under your feet.
- A cooldown that is missing or zero seconds.
- Binding a script that is not a `loottable_`.
