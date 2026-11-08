---
sidebar_position: 18
---

# RUN_SKILLMOVE

`RUN_SKILLMOVE` loads a `skillmove_*` script and runs its `mechanics` with the current caster and targets. The envelope runs first: banned categories, the skill's requirements, then Cost Component costs (check, then take into the void). A class check is a `BOOLEAN` requirement on the skill, not a filter inside this loader. A failed gate does nothing. Pass `skill`, or pass `stat` when a `REFERENCE` stat holds the script id. This loader is not a cast engine.

Task: `operation_run_skillmove`. Loads a `skillmove_*` data script and runs its `mechanics` with the current caster/targets. Envelope gates run first: banned categories, skill `requirements`, then Cost Component `costs` (check then take into Void). Class is a `BOOLEAN` requirement on the skill, not a loader filter. Failed gate is a no-op. This is still a loader, not a cast engine.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `RUN_SKILLMOVE` |
| `skill` | no | Script id (`skillmove_example` or `example`) |
| `stat` | no | REFERENCE stat whose stored value is the script id |

One of `skill` or `stat` is required. Missing script or unbound `none` is a no-op.
