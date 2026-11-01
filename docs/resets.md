---
sidebar_position: 32
---

# Daily reset

**Live** as one Backend scheduler plus Frontend `dailyreset_` rows. Harvest: legacy `daily_reset_events.dsc` fired `on system time 00:00`, wiped `dailyreward`, announced, wiped monthly pass, reset hourly replay, and granted login gifts.

Modern: add or remove a reset by editing Frontend data. The scheduler does not special-case pass, login chest, replay caps, or shop dailies. Those opt in as their own `dailyreset_` scripts.

Due times (when a `DAILY` or `HOURLY` row becomes due) live in [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc) `daily_reset_clocks`. They are server OS time, not a player-facing clock. Who today is online players (due-time tick plus join catch-up). Offline UUID documents wait on Mongo.

The world event is `after system time minutely every:15` (event lines cannot be tags). That is 0, 15, 30, and 45 past each hour. Clock minutes must be in `daily_reset_allowed_clock_minutes`. Off-grid minutes snap to `0`. The handler skips a quarter-hour that is not a DAILY or HOURLY clock, so default `"00:00"` / `0` only walks players on the hour.

## Files

| Piece | Path |
| --- | --- |
| Prefix, due times, allowed clock minutes, action types | [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc) |
| Getters | [Resets/reset_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Resets/reset_utils.dsc) |
| Apply due / one row / notice | [Resets/reset_scheduler.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Resets/reset_scheduler.dsc) |
| Due-time every:15, start/reload, join | [Resets/reset_world.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Resets/reset_world.dsc) |
| `/packreset` | [Resets/reset_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Resets/reset_command.dsc) |
| Smoke rows | `pirate-era-core-frontend/Resets/reset_examples.dsc` |
| Smoke stats | `stat_daily_claimed`, `stat_shop_daily`, `stat_replay_uses` |
| Shop RUN_MECHANIC body | `mechanic_example_daily_reset` |

## When

`when` is a `daily_reset_when` value.

| Value | Period | Due time |
| --- | --- | --- |
| `DAILY` | Calendar day after `daily_reset_clocks.daily` (quoted `HH:mm`, minute 0/15/30/45) | Default `"00:00"` |
| `HOURLY` | That hour after `daily_reset_clocks.hourly` (minute 0/15/30/45) | Default `0` |

Unknown `when` skips the row. Change the due time in `rules.dsc`. Keep the minute on the every:15 grid.

A player who is offline at that due time still gets due rows on join. Start and reload apply once for whoever is already online. Period ids, not an exact `HH:mm` match, so a missed clock still applies on the next due tick or on join.

## What

Numbered `actions` map (same shape as mechanic `operations`).

| `type` | Keys | Effect |
| --- | --- | --- |
| `CLEAR_FLAG` | `flag` | Wipe a `flag_saves` key (`season_pass`) or `key.nested`. Unknown keys are a no-op |
| `CLEAR_STAT` | `stat` | Overlay off, persist `0` |
| `SET_STAT` | `stat`, `value` | Live `SET_STAT` op. Missing `target` becomes `SELF` |
| `GRANT_LOOT` | `table` | Live `GRANT_LOOT` op |
| `RUN_MECHANIC` | `mechanic` | Live `RUN_MECHANIC` op (load a `mechanic_*` script) |

## Message

| Key | Required | Notes |
| --- | --- | --- |
| `message` | no | Transcript key. Chat. Omit for silence |
| `title` | no | Transcript key. Vanilla screen title. Omit to skip |
| `subtitle` | no | Transcript key under the title |

## Who

Online players only. Stamp is `flag_saves.daily_reset` → `data.daily_reset.<id>` (prefix stripped) with the period string. Force ignore that stamp with `/packreset run` or `/packreset test`.

## Smoke

| Script | When | Job |
| --- | --- | --- |
| `dailyreset_example_login` | DAILY | Clear claimed, grant `loottable_example`, chat plus title |
| `dailyreset_example_replay` | HOURLY | `SET_STAT` `stat_replay_uses` to `3`. No message |
| `dailyreset_example_shop` | DAILY | Clear shop claimed, `RUN_MECHANIC` `mechanic_example_daily_reset` |
| `dailyreset_example_pass` | DAILY | Clear `stat_seasonpass_example_reward`. Monthly map wipe is `CLEAR_FLAG` `season_pass` on a row you add |

```text
/packreset list
/packreset test dailyreset_example_login
/packreset due
/packreset run dailyreset_example_replay
```

## What can go wrong

- Hardcoding `on system time 00:00` as the only due fire. The tick is `minutely every:15`. Clocks pick which of those quarter-hours apply.
- An off-grid daily minute (`04:07`). Allowed minutes are 0, 15, 30, 45. Anything else snaps to `0`.
- Changing `every:15` in the world script without changing `daily_reset_allowed_clock_minutes`.
- Unquoted `daily: 00:00`. The colon is a nested map. Quote it (`"00:00"`).
- Splitting that quoted value on a real `:`. `data_key` stores it as `00<&co>00` because `00:00` looks like a duration. The getter splits `<&co>` first.
- Wiping `data.season_pass` from Backend. Pass opt-in is a FE `CLEAR_FLAG` / `CLEAR_STAT` row.
- Expecting offline players to reset at midnight. That wait is Mongo UUID docs.
- Using a `flag:` that is not a `flag_saves` key. The wipe is skipped.
