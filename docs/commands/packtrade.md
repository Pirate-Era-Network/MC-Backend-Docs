---
sidebar_position: 25
---

# /packtrade

Lists or clears live trade sessions. Op only. `list` needs a player. Console can `clear`, `prune`, and `remove`.

## System

A trade is two virtual chests plus a row on `trade_index`. `OPEN_TRADE` starts a session. Start and reload wipe leftover chests. They are not restored. This command is the admin side of that index.

| Piece | Where |
| --- | --- |
| Command | [Trade/trade_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Trade/trade_command.dsc) |
| Index | [Trade/trade_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Trade/trade_index.dsc) |
| Option catalog | [trades](../trades.md) |

## Use

```text
/packtrade
/packtrade list
/packtrade remove <id>
/packtrade prune
/packtrade clear
```

| Action | What it does |
| --- | --- |
| `list` | Open the trade PAGE. Console gets the usage line instead of a menu. |
| `remove` | Cancel that session id and tell the players. The id is a key on `trade_index`. Tab completion lists current ids. |
| `prune` | Drop a bad row. Cancel a session when either player is missing, offline, or no longer in the trade menu. |
| `clear` | Cancel every tracked session. |

## What can go wrong

- `remove` with no id.
- Expecting a trade to still be listed after reload. Start and reload clear the index.
