---
sidebar_position: 23
---

# Season pass

**Live.** One Frontend `seasonpass_` file per season. Backend stores counters and redeems through existing ops. XP sources are triggerables. The menu is PAGE or SCROLL.

Harvest: `Core/Season Pass/PEpassMenu.dsc`, `PEpassProgressEvent.dsc`. Legacy flags were `pepass.type` free/paid, `level`, `progress`, `redeemed.<n>`. Only mythicmob kills granted XP. Rewards were a hardcoded item map. Monthly wipe lived in daily reset.

Modern: date window and tracks live on the FE file. `GRANT_SEASON_XP` is the only XP write. A pack binds `ON_KILL`, quest complete, or a boss triggerable itself. Redeem runs that row's `GRANT_LOOT` / `GIVE_ITEM` / `SET_STAT`. Next month is a new `seasonpass_` script, not a Backend rewrite. Daily reset does not special-case pass. A pack that wants a wipe adds a `dailyreset_` row (`CLEAR_FLAG` `season_pass` or `CLEAR_STAT`). See [resets.md](resets.md).

## Files

| Piece | Path |
| --- | --- |
| Prefix, flag path, YAML keys | [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc) `seasonpass_config`, `flag_saves.season_pass` |
| Getters and counters | `SeasonPass/season_pass_utils.dsc` |
| PAGE / SCROLL overlay | `SeasonPass/season_pass_menu.dsc` |
| `/packseasonpass` | `SeasonPass/season_pass_command.dsc`. See [commands/packseasonpass](commands/packseasonpass.md) |
| Ops | `Mechanics/Individual_operations/season_pass_operation.dsc` |
| Smoke season | `pirate-era-core-frontend/SeasonPass/seasonpass_example.dsc` |
| Next month file | `pirate-era-core-frontend/SeasonPass/seasonpass_example_next.dsc` |
| Menus | `menu_seasonpass` (PAGE), `menu_seasonpass_scroll` (SCROLL) |

## Season Config

`type: data`, name `seasonpass_<id>`. Quote `start` / `end` (they contain `:`).

```yaml
seasonpass_example:
    type: data
    debug: false
    data:
        display_name: seasonpass_example_name
        wiki: seasonpass_example_wiki
        start: "2026/09/01 00:00:00"
        end: "2026/10/01 00:00:00"
        track_length: 5
        xp_per_level: 10
        tracks:
            free:
                1:
                    display:
                        displayname: seasonpass_free_1_name
                        material: stick
                        custommodeldata: 0
                    rewards:
                        1:
                            type: GIVE_ITEM
                            target: SELF
                            item: item_example_skill_wand
            paid:
                1:
                    rewards:
                        1:
                            type: SET_STAT
                            target: SELF
                            stat: stat_seasonpass_example_reward
                            value: 1
```

| Key | Status | Notes |
| --- | --- | --- |
| `start` / `end` | Live | Quoted TimeTag text. Omit a side to leave it open. Outside the window, XP and redeem are no-ops |
| `track_length` | Live | Max level. Counted `repeat` when converting XP |
| `xp_per_level` | Live | Progress needed per level. Default `200` from rules |
| `tracks.free` / `tracks.paid` | Live | Numbered rows. Missing rows are skipped |
| `display` | Live | Optional PAGE icon. Same shape as Item Config `display` |
| `rewards` | Live | Numbered mechanic ops. Smoke uses `GIVE_ITEM`, `GRANT_LOOT`, `SET_STAT` |
| `display_name` / `wiki` | Live | Transcript keys |

Backend picks the first in-window `seasonpass_` from the prefix list. `season:` on an op pins one script.

## Persist

`flag_saves.season_pass` → `data.season_pass.<id>` with prefix stripped (`seasonpass_example` → `example`).

| Field | Meaning |
| --- | --- |
| `type` | `FREE` or `PAID` |
| `level` | Completed levels |
| `progress` | XP toward the next level |
| `redeemed.free.<n>` / `redeemed.paid.<n>` | Claimed rows |

Paid rows require `type: PAID`. Shop menus call `SET_SEASON_TRACK` after `APPLY_TRANSACTION`.

## Ops

See [mechanics/operations.md](mechanics/operations.md). `/packseasonpass` opens PAGE. `/packseasonpass scroll` opens SCROLL. `xp` / `track` / `redeem` / `wipe` are op.

Kill XP smoke: `triggerable_seasonpass_kill_xp` (`ON_KILL` + `GRANT_SEASON_XP` `amount: 1`). Bind it on the living entity. Do not add a mythicmob world script.

## What can go wrong

- Unquoted `start: 2026/09/01 00:00:00`. The `:` is a YAML map. Quote the value.
- Writing a Backend `on entity death` for pass XP. That is a triggerable.
- Hardcoding next month's rewards in Backend. Add `seasonpass_october`.
- Storing redeemed on a player flag named `pepass`. Use `flag_saves.season_pass`.
- Using `- while` to convert XP. Remaining levels is the `repeat` cap.
- Expecting daily reset to wipe the pass. Pass opt-in waits on `phase8-daily-reset`.
