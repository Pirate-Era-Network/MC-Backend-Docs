---
sidebar_position: 18
---

# /packreset

Lists or fires Frontend `dailyreset_` rows. Op only. `due`, `run`, and `test` need a player. Console can `list`.

## System

The scheduler applies due rows on the clock and on join. This command is the staff override. `run` and `test` skip the period stamp, so you do not wait for midnight. They are the same path.

| Piece | Where |
| --- | --- |
| Command | [Resets/reset_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Resets/reset_command.dsc) |
| Scheduler | [Resets/reset_scheduler.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Resets/reset_scheduler.dsc) |
| Option catalog | [daily reset](../resets.md) |

## Use

```text
/packreset
/packreset list
/packreset due
/packreset run (script)
/packreset test (script)
```

| Action | What it does |
| --- | --- |
| `list` | Chat every registered `dailyreset_` name. |
| `due` | Apply whatever is due for you, the same catch-up as join. |
| `run` / `test` | Force one row, ignoring the "already ran this period" stamp. A missing name uses the first registered script. |

## What can go wrong

- `run` with a script that is not a `dailyreset_` name.
- `due` from console. Catch-up needs a player.
- Expecting `due` to repeat a row that already stamped this period. Use `run` or `test` to ignore the stamp.
