---
sidebar_position: 8
---

# CLEAR_STAT_OVERLAY

`CLEAR_STAT_OVERLAY` removes temporary levels. With no `stat`, it drops every world-lock overlay, every overlay whose Frontend `presentation.cleansed` is true, and `runtime_data.banned_categories`. An explicit `stat` can name any overlay. Like the other stat writes, it only resolves entities. What each smoke key means is on [control effects](../../control-effects.md).

`CLEAR_STAT_OVERLAY` with no `stat` drops every world-lock overlay, every overlay whose FE `presentation.cleansed` is true, and `runtime_data.banned_categories`. An explicit `stat` can be any overlay.

Same targeting overlay as the other stat ops (`ENTITY`).

Smoke keys live in `mechanic_example_control_effects`. What each key means: [control-effects.md](../../control-effects.md) (Smoke tests).
