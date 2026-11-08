---
sidebar_position: 11
---

# /packquest

Reads or edits quest progress stored on `flag_saves.quests`. This is chat, not a menu.

`status` is for the player who runs it. Looking up another player, and every edit action, is op only. Console can narrate when a player is named.

## System

Start, advance, complete, and wipe call the same tasks as the quest mechanic ops. `force` completes even when objectives or requirements are not met. `complete` still requires an active quest, finished objectives, and passing requirements.

| Piece | Where |
| --- | --- |
| Command | [Quests/quest_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Quests/quest_command.dsc) |
| Progress | [Quests/quest_progress.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Quests/quest_progress.dsc) |
| Option catalog | [quests](../quests/README.md) |

## Use

```text
/packquest
/packquest status (quest) (player)
/packquest start <quest> (player)
/packquest advance <quest> <objective> (amount) (player)
/packquest complete <quest> (player)
/packquest force <quest> (player)
/packquest wipe <quest> (player)
```

`status` with no quest prints every saved row, then each objective as current / required. A quest argument prints that quest only. `quest_example` and `example` are the same id.

`advance` adds `amount` to one objective. Amount defaults to 1. The quest must already be active, and the objective id must exist on that quest.

`start` refuses an unknown quest, a missing category, a quest already on the player, or a previous-quest gate. `wipe` removes that quest's saved row.

The player argument is the last argument. On `advance`, a player name can sit where the amount would be when you are not passing a number.

## What can go wrong

- `complete` before objectives are full. Use `force` when staff should skip the gates.
- `advance` on a quest that is not active.
- A player using `status` on someone else. That lookup is op only.
