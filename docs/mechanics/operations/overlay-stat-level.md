---
sidebar_position: 7
---

# OVERLAY_STAT_LEVEL

`OVERLAY_STAT_LEVEL` writes a temporary level. `get_target_stat_level` reads that overlay first, then the saved level. `data.stats` stays as it was. The math starts from the persisted level and then replaces the one overlay on that stat. Omit `duration` and the overlay stays until [CLEAR_STAT_OVERLAY](clear-stat-overlay.md).

Task: `operation_overlay_stat_level`. Smoke: `mechanic_example_overlay_stat_level`.

Temporary level. Writes `runtime_data.stat_level_overlays.<stat>` through `set_stat_level_overlay` with optional `expire:`. `get_target_stat_level` reads that flag first, then the persisted level. True `data.stats` is unchanged.

Math starts from the persisted level, then replaces the overlay (one overlay per stat). Default `stat_operation` is `SET`.

| Extra key | Required | Notes |
| --- | --- | --- |
| `duration` | no | DurationTag (`10s`), or a `NUMBER` / `VALUE` stat (seconds). Omit it to keep the overlay until `CLEAR_STAT_OVERLAY` |

`/stats` `LvL` follows the overlay until it expires, then the true level.
