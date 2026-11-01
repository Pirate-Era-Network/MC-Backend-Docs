---
sidebar_position: 9
---

# Analytics

**Live** for currency and item obtain/spend counters, plus optional shop `sink` tags.

Numbers only. Do not append event lists (no who/what/when). Event receipts are Mongo. See [receipts.md](receipts.md). This page is still `flag_saves.analytics` plus server totals.

Day buckets expire with Frontend `registry_gamerules.analytics.day_expire` (today `8d`). If that key is missing, Backend `analytics_day_flag_expire` is the fallback. Change the pack YAML first.

## Shape

Player: `data.analytics.<kind>.<id>.<direction>`

| Kind | Id | Use |
| --- | --- | --- |
| `currency` | prefix stripped (`belly`) | Mint vs burn of that currency |
| `item` | prefix stripped (`belly_coin`) | Items given or taken |
| `sink` | FE `analytics:` on `APPLY_TRANSACTION` (`example_shop`) | Where money/items went, so you can compare shops |
| `trade` | `completed` | One obtained count per player when both ready buttons swap |

Direction is `obtained` or `spent`.

Server (not a player document):

- `analytics.totals.<kind>.<id>.<direction>`
- `analytics.days.<yyyy-MM-dd>.<kind>.<id>.<direction>` expire `analytics_day_flag_expire`

Getters: `get_target_analytics`, `get_server_analytics_totals`. Writers: `record_analytics_counter` (`run`, not inject).

To see what a shop sells most, tag the pay op `analytics: shop_blacksmith` and read `sink.shop_blacksmith.spent` plus `item.<id>.obtained` from those purchases. That is still aggregates. Who sold what goes in `record_receipt` later (kind `TRANSACTION`).

## Rules

| Event | Counted as | Skip |
| --- | --- | --- |
| Loot CURRENCY / ITEM GIVE | obtained on that kind | |
| SYSTEM mint | obtained | |
| Shop / skill TAKE to VOID | spent | |
| Player-to-player CURRENCY | source spent, dest obtained | |
| Player-to-player item (`OPEN_TRADE`) | giver spent, receiver obtained, plus `trade.completed` | YAML `/Trades/` files. History is [receipts.md](receipts.md) |
| `/withdraw` `/redeem` | neither | Same uuid source and dest |
| Join init | neither | |
| Death ALL / PERCENT | currency spent | `NONE`, `ITEM` form |
| STAT (stamina) costs | neither | Not economy |

## What can go wrong

- Injecting `record_analytics_counter` into a SkillMove queue. It uses `- stop`. Always `run`.
- Treating withdraw as spent. Wallet to coins is the same money.
- Storing chat logs under analytics. Use counters only. Who/what/when is `record_receipt`.
