---
sidebar_position: 9
---

# SET_STAT

`SET_STAT` writes one stat, and the keys you set decide whether that write is saved or temporary. A number with no `duration` and no `session` persists on `data.stats`, which is how a menu binds a `REFERENCE` slot. The same write with `duration` is a timed overlay. `session: true` stays until `SET_STAT` `value: 0` or [CLEAR_STAT_OVERLAY](clear-stat-overlay.md). Casting mode is the session form. A persisted `1` would stay on after the fight. A flip with no fixed 0 or 1 is [TOGGLE_STAT](toggle-stat.md).

Task: `operation_set_stat`. One op, two layers.

| Keys | Meaning |
| --- | --- |
| `value: 1` or a number/id, no `duration`, no `session` | Persist (`data.stats`). Menus bind REFERENCE slots here |
| same + `duration: 10s` | Overlay expire (timed on) |
| same, `session: true`, no duration | Overlay until `SET_STAT` `value: 0` or `CLEAR_STAT_OVERLAY` |
| `value: 0` | Clear overlay for that stat, then persist 0 |

Flip without a fixed 0/1 is `TOGGLE_STAT`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `SET_STAT` |
| `stat` | yes | `stat_skillmove_1` or any stat |
| `value` | yes | Number, 0/1, script id, or `stat_*` (`NUMBER` / `VALUE` / `REFERENCE`) |
| `duration` | no | Overlay expire. Flat `10s`, or a `NUMBER` / `VALUE` stat (seconds) |
| `value_source` | no | `caster` (default) or `target` when `value` or `duration` is a `stat_*` ref |
| `session` | no | Overlay with no expire |
| `target` | no | Who. Overlay `ENTITY` |
