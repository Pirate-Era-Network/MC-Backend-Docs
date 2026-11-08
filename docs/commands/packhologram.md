---
sidebar_position: 20
---

# /packhologram

Places, lists, or removes persistent world holograms. Op only, and the sender must be a player. Console stops.

## System

The command is a thin wrapper around `spawn_hologram_at_location`, the same spawn `SPAWN_HOLOGRAM` uses. Text is a `text_display`. Rows are stored on `hologram_index` and restored on start. Damage numbers use the same spawn task but they expire and are not indexed, so they do not show in this list.

| Piece | Where |
| --- | --- |
| Command | [Mechanics/Individual_operations/hologram_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/hologram_command.dsc) |
| Spawn | [Mechanics/Individual_operations/spawn_hologram_operation.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/spawn_hologram_operation.dsc) |
| Option catalog | [mechanics](../mechanics/operations.md) |

## Use

```text
/packhologram <text>
/packhologram <size> <text>
/packhologram list
/packhologram remove
```

| Action | What it does |
| --- | --- |
| text | Spawn at your feet with the default size. The rest of the line is the hologram text. |
| size then text | The first argument is a number. That number is the display size. The rest is the text. |
| `list` | Open `menu_hologram_list`. A row click teleports you to that hologram. |
| `remove` | Delete the nearest indexed hologram within `hologram_remove_range`. |

Pivot, background, billboard, and offset come from `hologram_defaults`. Lifetime is omitted, so the hologram stays until removed.

## What can go wrong

- Deleting the display by hand. The index still has the text, and restore puts it back. Use `remove` or the list.
- Expecting damage numbers in the list. Those are not indexed.
- A size with no text after it.
