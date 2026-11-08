---
sidebar_position: 45
---

# Season pass operations

`GRANT_SEASON_XP` adds progress on the in-window `seasonpass_` and converts it to levels. A missing season or a closed window does nothing. XP sources are triggerables, including `ON_KILL`. Do not add a kill world script, and do not hardcode the next month's rewards in the Backend. Ship a new `seasonpass_` file, and quote `start` and `end`. `SET_SEASON_TRACK` stores `FREE` or `PAID`. A shop calls it from [APPLY_TRANSACTION](apply-transaction.md) `onsuccess`. `REDEEM_SEASON_REWARD` stamps `redeemed` and runs that row's reward ops. Paid rows require `PAID`. `OPEN_SEASON_PASS` opens the page or the scroll. A closed window shows a barrier row. The season script is on [season pass](../../season-pass.md).

## GRANT_SEASON_XP

Task: `operation_grant_season_xp`. Adds progress on the in-window `seasonpass_`. Converts to levels with counted `repeat`. Missing season or closed window is a no-op. Non-players are skipped. XP sources are triggerables (`ON_KILL` smoke: `triggerable_seasonpass_kill_xp`). Do not add a kill world script.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `GRANT_SEASON_XP` |
| `amount` | no | XP to add. Default `1`. Number or `stat_*` |
| `season` | no | `seasonpass_example` or `example`. Omit: first in-window file |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `mechanic_example_seasonpass` `self_xp`. `/packseasonpass xp 10`. Wiki: [season-pass.md](../../season-pass.md).

## SET_SEASON_TRACK

Task: `operation_set_season_track`. Persist `FREE` or `PAID` on that season. Shop `APPLY_TRANSACTION` `onsuccess` calls this.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `SET_SEASON_TRACK` |
| `track` | yes | `FREE` or `PAID` |
| `season` | no | Same as GRANT_SEASON_XP |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `self_paid` / `self_free`. `/packseasonpass track paid`.

## REDEEM_SEASON_REWARD

Task: `operation_redeem_season_reward`. Stamps `redeemed` then runs that row's `rewards` ops (`GRANT_LOOT` / `GIVE_ITEM` / `SET_STAT`). Paid rows require `PAID`. Omit `level` and `track` to mass redeem. Omit `track` with a `level` to claim both rows for that level.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `REDEEM_SEASON_REWARD` |
| `level` | no | Track row. Omit: every eligible row |
| `track` | no | `FREE` or `PAID`. Omit: both |
| `season` | no | Same as GRANT_SEASON_XP |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: PAGE click, SCROLL row click, `self_redeem_all`, `/packseasonpass redeem`.

## OPEN_SEASON_PASS

Task: `operation_open_season_pass`. Opens `menu_seasonpass` (PAGE) or `menu_seasonpass_scroll` (SCROLL) with a Backend overlay. New menu id each open so PAGE recopies `itemlist`. Closed window shows a barrier row.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_SEASON_PASS` |
| `view` | no | `PAGE` (default) or `SCROLL` |
| `menu` | no | Override the rules menu script |
| `season` | no | Same as GRANT_SEASON_XP |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: hub slots, `self_open` / `self_open_scroll`, `/packseasonpass` / `/packseasonpass scroll`.
