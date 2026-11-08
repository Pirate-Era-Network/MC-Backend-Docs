---
sidebar_position: 40
---

# Quest operations

`START_QUEST`, `ADVANCE_QUEST`, and `COMPLETE_QUEST` write `flag_saves.quests`. Start stores `ACTIVE` and zeroed objectives, and it does nothing if the quest is already active or complete, or if a listed `previous` quest is not complete. Advance is the manual bump for one objective. Typed objectives advance themselves. Complete turns the quest in only when every objective is full and `requirements` pass. Staff skip is `/packquest force`, not this op. A skill gate inside the turn-in is `SET_STAT` on a Frontend `BOOLEAN` in `complete_mechanics`. These ops do not read a quest id as a requirement. The quest script, the save, and the objective types are on [quests](../../quests/README.md).

Tasks: `operation_start_quest`, `operation_advance_quest`, `operation_complete_quest`. Progress is `flag_saves.quests`. Full page: [quests.md](../../quests/README.md).

`START_QUEST` writes `ACTIVE` and zero objectives. A listed `previous` quest must already be `COMPLETE`. Already active or complete does nothing.

`ADVANCE_QUEST` adds `amount` (default `1`) to one objective on an active quest. Typed objectives advance themselves. This op is the manual bump.

`COMPLETE_QUEST` turns in when every objective is full and `requirements` pass. It does not skip those gates. Staff skip is `/packquest force`.

Autocomplete uses the same complete task. A skill gate is `SET_STAT` on a Frontend BOOLEAN inside `complete_mechanics`. These ops do not read a quest id as a requirement.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `START_QUEST`, `ADVANCE_QUEST`, or `COMPLETE_QUEST` |
| `quest` | yes | `quest_example` or `example` |
| `objective` | ADVANCE | Objective key on that quest |
| `amount` | no | ADVANCE only. Default `1` |
| `target` | no | Who. Overlay `ENTITY`. Non-players are skipped |

```yaml
operations:
    1:
        type: START_QUEST
        target: SELF
        quest: quest_example
```

Smoke: `/packquest start quest_example`, kill two (or `/packquest advance quest_example defeat_anyone 2`), then `/packquest complete quest_example_turnin`.
