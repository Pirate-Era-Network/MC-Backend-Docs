---
sidebar_position: 4
---

# /pay

Sends wallet currency from you to another online player. The command always exists. Whether it moves money depends on the pack.

## System

Frontend `registry_gamerules.economy.player_pay` is `ALLOW` or `TRADE_ONLY`. `TRADE_ONLY` answers with a clear refusal so a guessed `/pay` is not an unknown command. `ALLOW` sends currency when that currency's `rules.player_transfer` is true.

The send is a Cost Component transaction. Take from the sender wallet, give to the recipient wallet. It is separate from `/withdraw`.

| Piece | Where |
| --- | --- |
| Command | [Currencies/currency_pay.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Currencies/currency_pay.dsc) |
| Gamerule | `economy.player_pay` |
| Option catalog | [currencies](../currencies.md) |

## Use

```text
/pay <player> <amount> (currency)
```

`player` is an online player, and not yourself. `amount` is at least 1. Omit `currency` only when exactly one currency has `player_transfer`. The recipient gets a received line.

## What can go wrong

- `player_pay` left on `TRADE_ONLY`. The command replies that this server does not use `/pay`.
- `player_pay: ALLOW` while `player_transfer` is false on that currency. The send is refused.
- Not enough wallet currency. Coins in the inventory are not spent.
