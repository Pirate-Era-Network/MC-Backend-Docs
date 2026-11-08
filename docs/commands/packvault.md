---
sidebar_position: 26
---

# /packvault

Lists or clears shared vault notes. Op only. `list` needs a player. Console can `clear`, `prune`, and `remove`.

## System

Private vault pages stay on the player flag `flag_saves.vaults`. Shared banks are Denizen noted inventories plus `vault_index`. Start restores a missing note. This command is the admin side of the shared index. It does not open a player's private page. `OPEN_STORAGE` does that.

| Piece | Where |
| --- | --- |
| Command | [Vaults/vault_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Vaults/vault_command.dsc) |
| Index | [Vaults/vault_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Vaults/vault_index.dsc) |
| Option catalog | [vaults](../vaults.md) |

## Use

```text
/packvault
/packvault list
/packvault remove <id>
/packvault prune
/packvault clear
```

| Action | What it does |
| --- | --- |
| `list` | Open the vault PAGE. Console gets the usage line instead of a menu. |
| `remove` | Delete that shared vault id, note included. Tab completion lists current ids. |
| `prune` | Drop a row that is not a map, or whose noted chest is already gone. |
| `clear` | Remove every tracked shared vault. |

## What can go wrong

- Using `clear` to wipe private player vaults. Those rows are not in this index.
- `remove` with no id.
