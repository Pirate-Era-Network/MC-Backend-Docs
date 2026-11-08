---
sidebar_position: 2
---

# /balance

Shows the currencies this player actually holds. Any player can run it. Console has no wallet, so it is a player command.

## System

Currencies are Frontend `currency_*` scripts. The wallet is `flag_saves.currencies`. Coin items are the pack `withdraw_item` with `currency_amount` stamped on the item.

| Piece | Where |
| --- | --- |
| Command | [Currencies/balance_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Currencies/balance_command.dsc) |
| Getters | [Currencies/currency_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Currencies/currency_utils.dsc) |
| Option catalog | [currencies](../currencies.md) |

## Use

```text
/balance
```

There are no arguments. The command walks every registered currency. A row is skipped when both the wallet and the coin count are 0. If every row is skipped, chat says you have no currency.

Each shown row is the display name and the wallet number. Flagged coins in inventory are added in parentheses. A coin stack with no amount flag counts as its vanilla quantity.

## What can go wrong

- Expecting a currency you do not hold to appear. Empty wallets stay off the list.
- Reading the coin parenthesis as a second wallet. That number is items in the inventory.
