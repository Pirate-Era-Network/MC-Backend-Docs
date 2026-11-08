---
sidebar_position: 12
---

# Quests

Quest YAML, objective types, and the saved progress map. The quest script is [quests](../quests/README.md).

| Key | Role | Page |
| --- | --- | --- |
| `quest_data_keys` | Quest YAML names | [quests.md](../quests/README.md) |
| `quest_objective_types` | `KILL` / `TALK` / `WAYPOINT` / `AREA` / `QUEST` | [quests.md](../quests/README.md) |
| `quest_objective_orders` | `ANY` / `ORDERED` | [quests.md](../quests/README.md) |
| `quest_objective_keys` | Objective YAML names | [quests.md](../quests/README.md) |
| `quest_objective_prefixes` | Optional `npc_` / `waypoint_` / `area_` on those ids | [quests.md](../quests/README.md) |
| `quest_progress_keys` | Saved status and objective map | [quests.md](../quests/README.md) |
| `quest_statuses` | `ACTIVE` / `COMPLETE` | [quests.md](../quests/README.md) |
| `quest_defaults` | Required amount `1`, autocomplete `true`, order `ANY`, reference depth `8` | [quests.md](../quests/README.md) |
| `quest_waypoint_defaults` | `arrive_range` `5` for pending `WAYPOINT` objectives | [quests.md](../quests/README.md) |
| `quest_uncategorized_key` | Flag key `uncategorized` when a quest has no category | [quests.md](../quests/README.md) |
