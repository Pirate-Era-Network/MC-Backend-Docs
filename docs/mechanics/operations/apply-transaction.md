---
sidebar_position: 29
---

# APPLY_TRANSACTION

`APPLY_TRANSACTION` settles a cost list. `TAKE` hits `source`. `GIVE` hits `destination`. It checks every row, then applies them, so a failure spends nothing. The next numbered operation in the parent mechanic still runs after a failed pay. Put the purchase (`GIVE_ITEM`, `GRANT_LOOT`, `NARRATE`) in `onsuccess`, and put the "not enough" line in `onfail`. `destination: VOID` with `action: GIVE` discards the grant. Player-to-player currency does nothing unless `rules.player_transfer` allows it. `SYSTEM` mints. A travel fare is not this op sitting in front of [TRAVEL_TO_WAYPOINT](travel-to-waypoint.md). That op pays inside itself.

Task: `operation_apply_transaction`. Settles a Cost Component list. `TAKE` hits `source`. `GIVE` hits `destination`. Check-all then apply. No partial spend.

`onsuccess` / `onfail` are nested mechanic configs (same shape as damage-route hooks). Put the purchase (`GIVE_ITEM`, `GRANT_LOOT`, `NARRATE`) in `onsuccess`. Put the “not enough” feedback in `onfail`. Do not put those as sibling `operations.2`. Sibling ops still run after a failed pay.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `APPLY_TRANSACTION` |
| `costs` | yes | Keyed maps. `type` CURRENCY / ITEM / STAT, `id`, `amount`, `action` TAKE / GIVE |
| `source` | no | `SELF` (default), `TARGET`, `SYSTEM` |
| `destination` | no | `VOID` (default), `SELF`, `TARGET`, `SYSTEM` |
| `value_source` | no | `caster` or `target` when a cost `amount` is a `stat_*` |
| `onsuccess` | no | Mechanic config after a full settle |
| `onfail` | no | Mechanic config when can-pay fails |
| `analytics` | no | Sink id for counters (shop name). See [analytics.md](../../analytics.md) |

Bare SkillMove rows (`stat` + `amount`) are STAT TAKE (stamina). CURRENCY on a skill is optional. Player-to-player CURRENCY requires `rules.player_transfer`. SYSTEM mints. VOID discards.

Smoke: `self_grant_belly`, `self_pay_belly`, `self_withdraw_belly`, `self_redeem_belly`. Commands: `/withdraw`, `/redeem`, `/pay` when FE `player_pay: ALLOW`. Wiki: [currencies.md](../../currencies.md).
