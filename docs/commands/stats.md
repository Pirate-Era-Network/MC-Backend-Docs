---
sidebar_position: 5
---

# /stats

Prints this player's effective stat levels. Any player can run it.

## System

The list is the effective view from `stat_level_views`. Regen stats show per-second recovery from the reload table. Consumable stats show the current bar and the level. Other stats show the level. A stat can hide itself from this command.

| Piece | Where |
| --- | --- |
| Command | [Stats/stat_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Stats/stat_command.dsc) |
| Getters | [Stats/stat_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Stats/stat_utils.dsc) |
| Option catalog | [stats](../stats.md) |

## Use

```text
/stats
```

There are no arguments. Chat starts with the checking line, then one row per visible stat.

## What can go wrong

- Looking here for a hidden stat. `stat_hides_from_stats_command` skips that row.
- Reading the level as the consumable current value. Consumable rows print both.
