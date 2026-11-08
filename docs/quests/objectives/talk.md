---
sidebar_position: 2
---

# TALK

`TALK` fills when something calls `fire_quest_talk` for `npc`. There is no NPC click engine yet, so the pack calls that proc from the talk mechanic. The prefix `npc_` is optional on either side.

File: `Quests/objectives/objective_talk.dsc`. Shared objective keys are on [Quests](../README.md).

```yaml
meet_nami:
    type: TALK
    npc: npc_nami
```
