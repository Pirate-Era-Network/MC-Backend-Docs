---
sidebar_position: 26
---

# Quests

**Live.** Categories, quests, objective progress, complete mechanics, and loot entry rewards.

Backend: [Quests/quest_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Quests/quest_utils.dsc), [Quests/quest_progress.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Quests/quest_progress.dsc), [Quests/objectives/quest_objective_dispatch.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Quests/objectives/quest_objective_dispatch.dsc), [Quests/quest_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Quests/quest_command.dsc), [Mechanics/Individual_operations/quest_operation.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/quest_operation.dsc).

Frontend examples: `Quests/quest_examples.dsc`.

Ops: `START_QUEST`, `ADVANCE_QUEST`, `COMPLETE_QUEST`. `source_type` is `QUEST`.

A skill or menu gate is a Frontend BOOLEAN. Put `SET_STAT` in `complete_mechanics`. Do not add a quest-id check inside other ops.

## Scripts

| Prefix | What it is |
| --- | --- |
| `questcategory_` | Display for menus. Not a progress row |
| `quest_` | One quest. Objectives, requirements, rewards, complete mechanics |

`questcategory_` also starts with `quest_`. Reload lists those category scripts under `scripts.quest_` as well. Quest lookup skips the longer prefix. Wiki skips them too. Still set `notinwiki: true` on a category.

There is no world index. Progress is `flag_saves.quests` (`data.quests`).

## Save shape

```
data.quests.<category id>.<quest id>:
  status: ACTIVE or COMPLETE
  objectives:
    <objective key>: <amount>
```

The category id is the `questcategory_` script name. A quest with no `category` uses the flag key `uncategorized`. Not started means the row is missing.

`next` and `previous` are script ids. `previous` blocks `START_QUEST` until that quest is `COMPLETE`. `next` does not start anything. A complete mechanic calls `START_QUEST` when the pack wants the chain to continue.

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
| `objective_order` | Live | `ANY` (default) or `ORDERED`. `ORDERED` follows key order in the script |
| `requirements` | Live | Same maps as mechanic requirements. Checked on turn-in |
| `objectives` | Live | Keyed map. See below |
| `rewards` | Live | Keyed map of loot entries. Every row grants. Weight is ignored |
| `complete_mechanics` | Live | Keyed map of mechanic maps. Runs after rewards |

Empty `objectives` does not autocomplete on start. Turn that quest in with `COMPLETE_QUEST`. That is the talk-to-turn-in shape.

`requirements` that fail leave the quest `ACTIVE` with full objectives. Call `COMPLETE_QUEST` again after the gate passes. Autocomplete only runs on the progress tick that fills the last objective.

## Objective engine

Same split as mechanic operations. The dispatcher in `quest_objective_dispatch.dsc` walks active quests and chooses `type`. Each type is its own file. A new type is a new file plus one `case`. Do not match a mob, npc, waypoint, or area inside the dispatcher.

| Type | File | Option | Who calls it |
| --- | --- | --- | --- |
| `KILL` | `objective_kill.dsc` | `target_entity` | `ON_KILL` (path 4). The victim is the death target |
| `TALK` | `objective_talk.dsc` | `npc` | `fire_quest_talk`. No NPC click engine yet |
| `WAYPOINT` | `objective_waypoint.dsc` | `waypoint`, optional `arrive_range` | `fire_quest_waypoint` from travel, walk within range, or proximity tick |
| `AREA` | `objective_area.dsc` | `area` | `fire_quest_area_enter` from a successful player enter |
| `QUEST` | `objective_quest.dsc` | `quest` | Fills when that quest is `COMPLETE` |

`target_entity` matches the entity type or the custom name, ignoring case and spaces. Omit `target_entity` to count any non-player kill. A player victim never counts.

`objective_order: ORDERED` only advances the first key that is still short. Later keys wait. `ANY` lets every objective advance. The sequence is the key order in the quest script.

A `QUEST` objective watches another quest. It does not start that quest and it does not pay that quest's rewards. Put `START_QUEST` in mechanics when the pack wants the other quest to begin. If each quest requires the other, neither can finish. A chain stops after `reference_depth` (default 8).

`npc`, `waypoint`, and `area` are required on those types. The prefix (`npc_`, `waypoint_`, `area_`) is optional on either side. `area` matches the placed area id or the template script name.

`ADVANCE_QUEST` still adds progress by hand. It does not replace these types.

Only `ACTIVE` rows that were already saved are counted. A complete mechanic that starts the next quest does not get that same signal.

`WAYPOINT` resolves the spot through the travel engine (placed `waypoint_index` row, then script `location`, optional `place:`). `TRAVEL_TO_WAYPOINT` and `/packwaypoint go` call `fire_quest_waypoint` after a successful teleport. Walking within `arrive_range` also calls it once per second from `player_game_loop` (`tick_quest_waypoint_objectives`). That is not a move listener. Point the player with `START_GPS` `waypoint:` or `/packgps waypoint [name]`. Quests do not start GPS by themselves.

## Objective Config

| Key | Status | Notes |
| --- | --- | --- |
| `type` | Live | `KILL`, `TALK`, `WAYPOINT`, `AREA`, or `QUEST` |
| `required_amount` | Live | Default `1`. Each match adds `1`. A `QUEST` match fills the bar |
| `text` | Live | Optional transcript key or literal. Menus, HUD, and `/packquest status` |
| `target_entity` | Live | `KILL` only. Entity type or custom name. Omit for any non-player |
| `npc` | Live | `TALK` only |
| `waypoint` | Live | `WAYPOINT` only |
| `arrive_range` | Live | `WAYPOINT` only. Blocks from the resolved spot. Default `quest_waypoint_defaults` (`5`) |
| `area` | Live | `AREA` only. Instance id or template script |
| `quest` | Live | `QUEST` only. Another `quest_` script |
| `complete_mechanics` | Live | Keyed map. Runs once when this objective reaches `required_amount` |

```
objectives:
    defeat_anyone:
        type: KILL
        target_entity: zombie
        required_amount: 2
        text: quest_example_defeat_text
    meet_nami:
        type: TALK
        npc: npc_nami
    reach_dock:
        type: WAYPOINT
        waypoint: waypoint_dock
    enter_gate:
        type: AREA
        area: area_example_gate
    finish_turnin:
        type: QUEST
        quest: quest_example_turnin
```

## Rewards

Each `rewards` row is a `lootentry_` id or an inline loot entry map. `load_loot_entry_data` then `resolve_loot_entry_roll`. Entry requirements still apply. `TABLE_REFERENCE` still flattens. Grant goes through `grant_loot_results` (items and currency use Cost Component).

Data scripts store a list of maps as a keyed map (`1:`, `2:`), same as mechanic `operations` and loot pool `entries`.

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

A pack that needs a skill gate adds `SET_STAT` on its own BOOLEAN in that list. The engine does not read quest ids from other ops.

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
- Gating a skill with `if quest_example`. Use a BOOLEAN from `complete_mechanics`.
- Putting a dash list of maps on `rewards` or `complete_mechanics`. Use a keyed map.
- Omitting `type` and expecting every kill to count. Only `type: KILL` listens to `ON_KILL`. Omit `target_entity` to count any non-player.
- Expecting a `QUEST` objective to start the other quest. Call `START_QUEST`.
- Setting `objective_order: ORDERED` and expecting map key order to follow the alphabet. The order is the order of the keys in the script.
- Naming a category script and expecting it to stay out of `scripts.quest_`. The prefix scan includes it. Lookup and wiki skip `questcategory_`.
- Autocomplete with zero objectives. That quest waits for `COMPLETE_QUEST`.
- Writing `data.quests` from a mechanic. Use the ops.
