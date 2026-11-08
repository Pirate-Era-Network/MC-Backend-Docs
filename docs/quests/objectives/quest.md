---
sidebar_position: 5
---

# QUEST

`QUEST` watches another quest. It fills when that quest is `COMPLETE`. It does not start that quest, and it does not pay that quest's rewards. Put `START_QUEST` in mechanics when the pack wants the other quest to begin. A `QUEST` match fills the bar in one step, whatever `required_amount` says.

If each quest requires the other, neither can finish. A chain stops after `reference_depth` (default 8).

File: `Quests/objectives/objective_quest.dsc`. Shared objective keys are on [Quests](../README.md).

```yaml
finish_turnin:
    type: QUEST
    quest: quest_example_turnin
```
