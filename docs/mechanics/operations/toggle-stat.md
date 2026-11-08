---
sidebar_position: 10
---

# TOGGLE_STAT

`TOGGLE_STAT` flips one stat through `SET_STAT`. If the effective value is already on, it writes `0`. If it is off, it writes `1` and uses this op's `session` or `duration`. That is one cue, which fits a menu. When the on path and the off path need different sounds, keep two triggerables. This op is not that pair.

Task: `operation_toggle_stat`. Per resolved entity: if effective on (overlay or persist > 0), same as `SET_STAT` `value: 0`. If off, same as `SET_STAT` `value: 1` with this op's `session:` / `duration:`.

Not the enter/exit replacement. Different sounds and narrates stay two triggerables (or two mechanic blocks with complementary `BOOLEAN`). Use this for menus and a single cue.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `TOGGLE_STAT` |
| `stat` | yes | Any stat (`stat_casting_mode`) |
| `duration` | no | Used only when turning on |
| `session` | no | Used only when turning on |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `self_toggle_casting_mode` in `mechanic_example_control_effects`.
