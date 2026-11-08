---
sidebar_position: 30
---

# GRANT_LOOT

`GRANT_LOOT` resolves a `loottable_*` for each player and grants the results. A missing table does nothing. Non-players are skipped. Party split is not this op. The nested roll, the depth cap, and the table scripts are on [loot](../../loot/README.md).

Task: `operation_grant_loot`. Resolves a `loottable_*` for each player (`Loot/loot_utils.dsc`) then `grant_loot_results`. Missing table is a no-op. Non-players are skipped. Party split is not this op.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `GRANT_LOOT` |
| `table` | yes | `loottable_example` or `example` |
| `target` | no | Who. Overlay `ENTITY` |

Example: `self_grant_loot` in `pirate-era-core-frontend/Mechanics/mechanic_examples.dsc`. Shape: [loot](../../loot/README.md).
