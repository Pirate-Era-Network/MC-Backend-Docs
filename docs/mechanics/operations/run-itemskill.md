---
sidebar_position: 19
---

# RUN_ITEMSKILL

`RUN_ITEMSKILL` loads an `itemskill_*` script and runs its `mechanics`. The envelope matches [RUN_SKILLMOVE](run-skillmove.md): banned categories, requirements, then costs. A failed gate does nothing. Omit `skill` to load `skills:` from the held item. Set `hand` to `MAIN` or `OFFHAND` when that list should come from a specific slot instead of the click item. The world click that reaches this op is a Frontend triggerable. The item skill script has no `event:` key. Unlocks are a `BOOLEAN` on the skill.

Task: `operation_run_itemskill`. Loads `itemskill_*` data and runs `mechanics` with the current caster/targets. Same envelope as `RUN_SKILLMOVE` (banned categories, skill `requirements`, Cost Component `costs`). Failed gate is a no-op. World click is a Frontend triggerable (`ON_ITEM_USE` plus `SNEAKING` / `ITEM_HAS_SKILLS`). This is still a loader, not a cast engine.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `RUN_ITEMSKILL` |
| `skill` | no | One script id (`itemskill_example_use` or `example_use`). Omit to load `skills:` from the click/held Item Config |
| `hand` | no | `MAIN` or `OFFHAND`. When set, `skills:` come from that slot on the caster. Ignore click item. |

Missing script is a no-op. Unlocks are `BOOLEAN` on the skill, not a Backend map.
