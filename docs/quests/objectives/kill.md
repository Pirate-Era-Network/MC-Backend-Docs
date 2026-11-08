---
sidebar_position: 1
---

# KILL

`KILL` counts a death. `ON_KILL` calls it (path 4). The victim is the death target. `target_entity` matches the entity type or the custom name, ignoring case and spaces. Omit `target_entity` to count any non-player kill. A player victim never counts.

File: `Quests/objectives/objective_kill.dsc`. Shared objective keys are on [Quests](../README.md).

```yaml
defeat_anyone:
    type: KILL
    target_entity: zombie
    required_amount: 2
    text: quest_example_defeat_text
```
