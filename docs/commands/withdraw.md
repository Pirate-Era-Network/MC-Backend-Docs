---
sidebar_position: 3
---

# /withdraw and /redeem

`/withdraw` turns wallet currency into one coin item. `/redeem` turns that coin item back into the wallet. Both are player commands. They share [Currencies/currency_withdraw.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Currencies/currency_withdraw.dsc).

Shops still take `type: CURRENCY` from the wallet. These commands exist so a `BOTH` currency can also sit in the inventory as a droppable item.

## System

Convert uses the same Cost Component as `APPLY_TRANSACTION`. Wallet to coins is `tradeable`. Coins to wallet is `redeemable`. The two flags are independent. Menus can call `convert_currency_between_forms` with the same directions.

| Piece | Where |
| --- | --- |
| Commands and convert task | [Currencies/currency_withdraw.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Currencies/currency_withdraw.dsc) |
| Currency rules | Frontend `currency_*` `rules.tradeable` and `rules.redeemable` |
| Option catalog | [currencies](../currencies.md) |

One coin item holds the whole amount in `currency_amount`. `/withdraw 1000` is one item, not 1000 vanilla items. The minting player is stamped on the item.

## Use

```text
/withdraw <amount> (currency)
/redeem (amount) (currency)
/redeem
```

Omit `currency` only when exactly one registered currency allows that direction. Two or more need the script name (`currency_belly` or `belly`).

`/redeem` with no arguments uses the coin in your hand, including its amount and currency flag. `/redeem currency_belly` also uses the held coin's amount. `/redeem 50` redeems 50 of the only redeemable currency, or of the held coin when the hand is a withdraw item and you did not name a currency.

## What can go wrong

- `tradeable: false` on `/withdraw`, or `redeemable: false` on `/redeem`. That direction is closed.
- A full inventory on withdraw. The coin must fit before the wallet is taken.
- Naming a currency the pack did not register.
