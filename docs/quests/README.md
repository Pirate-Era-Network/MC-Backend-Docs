---
sidebar_position: 1
slug: /quests
---

# Quests

A quest is a `quest_` script. Progress is `flag_saves.quests` (`data.quests`). A skill or menu gate is a Frontend `BOOLEAN`. Put `SET_STAT` in `complete_mechanics`. Do not add a quest-id check inside other ops. `next` is structure for menus. It does not start the following quest. A complete mechanic calls `START_QUEST` when the pack wants the chain to continue. `previous` blocks `START_QUEST` until that quest is `COMPLETE`.

Ops: `START_QUEST`, `ADVANCE_QUEST`, `COMPLETE_QUEST`. `source_type` is `QUEST`. Examples: `pirate-era-core-frontend/Quests/quest_examples.dsc`.

Backend: [Quests/quest_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Quests/quest_utils.dsc), [Quests/quest_progress.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Quests/quest_progress.dsc), [Quests/objectives/quest_objective_dispatch.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Quests/objectives/quest_objective_dispatch.dsc), [Quests/quest_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Quests/quest_command.dsc), [Mechanics/Individual_operations/quest_operation.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/quest_operation.dsc).

## Scripts

| Prefix | What it is |
| --- | --- |
| `questcategory_` | Display for menus. Not a progress row |
| `quest_` | One quest. Objectives, requirements, rewards, complete mechanics |

`questcategory_` also starts with `quest_`. Reload lists those category scripts under `scripts.quest_` as well. Quest lookup skips the longer prefix. Wiki skips them too. Still set `notinwiki: true` on a category.

There is no world index.

## Save shape

```
data.quests.<category id>.<quest id>:
  status: ACTIVE or COMPLETE
  objectives:
    <objective key>: <amount>
```

The category id is the `questcategory_` script name. A quest with no `category` uses the flag key `uncategorized`. Not started means the row is missing.

## Quest Config

| Key | Status | Notes |
| --- | --- | --- |
| `display_name` | Live | Transcript key or literal. Wiki uses this |
| `wiki` | Live | Longer body |
| `notinwiki` | Live | Hides the script from the quest wiki |
| `category` | Live | `questcategory_` id. Omit for `uncategorized` |
| `next` | Live | Structure for menus. Does not auto-start |
| `previous` | Live | Must be `COMPLETE` before this quest can start |
| `autocomplete` | Live | Default `true`. `false` waits for `COMPLETE_QUEST` |
| `objective_order` | Live | `ANY` (default) or `ORDERED`. `ORDERED` follows key order in the script, not the alphabet |
| `requirements` | Live | Same maps as mechanic requirements. Checked on turn-in |
| `objectives` | Live | Keyed map. Shared keys below. Each type adds its own |
| `rewards` | Live | Keyed map of loot entries. Every row grants. Weight is ignored |
| `complete_mechanics` | Live | Keyed map of mechanic maps. Runs after rewards |

Empty `objectives` does not autocomplete on start. Turn that quest in with `COMPLETE_QUEST`. That is the talk-to-turn-in shape.

`requirements` that fail leave the quest `ACTIVE` with full objectives. Call `COMPLETE_QUEST` again after the gate passes. Autocomplete only runs on the progress tick that fills the last objective.

Only `ACTIVE` rows that were already saved are counted. A complete mechanic that starts the next quest does not get that same signal. `ADVANCE_QUEST` still adds progress by hand. It does not replace the types below.

## Objectives

The dispatcher walks active quests and chooses `type`. A new type is a new file plus one `case`. Shared keys are on every objective. The type pages add the id that objective watches.

| Key | Status | Notes |
| --- | --- | --- |
| `type` | Live | One of the types below. Omit it and the objective does not listen |
| `required_amount` | Live | Default `1`. Each match adds `1` |
| `text` | Live | Optional transcript key or literal. Menus, HUD, and `/packquest status` |
| `complete_mechanics` | Live | Keyed map. Runs once when this objective reaches `required_amount` |

`objective_order: ORDERED` only advances the first key that is still short. Later keys wait. `ANY` lets every objective advance.

- [KILL](objectives/kill.md)
- [TALK](objectives/talk.md)
- [WAYPOINT](objectives/waypoint.md)
- [AREA](objectives/area.md)
- [QUEST](objectives/quest.md)

## Rewards

Each `rewards` row is a `lootentry_` id or an inline loot entry map. `load_loot_entry_data` then `resolve_loot_entry_roll`. Entry requirements still apply. `TABLE_REFERENCE` still flattens. Grant goes through `grant_loot_results` (items and currency use Cost Component).

Data scripts store a list of maps as a keyed map (`1:`, `2:`).

```
rewards:
    1: lootentry_example_currency
    2:
        type: CURRENCY
        referenceid: currency_belly
        quantity: 1
```

## Complete mechanics

Keyed map of mechanic maps. `source_type` is `QUEST`.

```
complete_mechanics:
    1:
        operations:
            1:
                type: NARRATE
                transcript: quest_example_done_text
                target: SELF
            2:
                type: START_QUEST
                quest: quest_example_turnin
                target: SELF
```

A pack that needs a skill gate adds `SET_STAT` on its own `BOOLEAN` in that list. The engine does not read quest ids from other ops.

## Command

`/packquest` status is for any player. The other actions are op.

```text
/packquest status
/packquest start quest_example
/packquest advance quest_example defeat_anyone 2
/packquest complete quest_example_turnin
/packquest force quest_example
/packquest wipe quest_example
```

`force` skips objective and requirement gates. It still will not pay a quest that is already `COMPLETE`. `wipe` deletes that row so it can start again.

## What can go wrong

- Treating `next` as an automatic start. Call `START_QUEST`.
- Gating a skill with `if quest_example`. Use a `BOOLEAN` from `complete_mechanics`.
- Putting a dash list of maps on `rewards` or `complete_mechanics`. Use a keyed map.
- Omitting `type` and expecting every kill to count. Only [KILL](objectives/kill.md) listens to `ON_KILL`.
- Setting `objective_order: ORDERED` and expecting map key order to follow the alphabet. The order is the order of the keys in the script.
- Naming a category script and expecting it to stay out of `scripts.quest_`. The prefix scan includes it. Lookup and wiki skip `questcategory_`.
- Autocomplete with zero objectives. That quest waits for `COMPLETE_QUEST`.
- Writing `data.quests` from a mechanic. Use the ops.
