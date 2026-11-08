---
sidebar_position: 3
---

# WAYPOINT

`WAYPOINT` fills when the player arrives at `waypoint`. The spot resolves through the travel engine: the placed `waypoint_index` row, then the script `location`, then optional `place:`. `arrive_range` is blocks from that spot. Default is `quest_waypoint_defaults` (`5`). The prefix `waypoint_` is optional on either side.

`TRAVEL_TO_WAYPOINT` and `/packwaypoint go` call `fire_quest_waypoint` after a successful teleport. Walking within range also calls it once per second from `player_game_loop` (`tick_quest_waypoint_objectives`). That is not a move listener. Walking onto the coordinates without one of those calls does not fill the objective. Point the player with `START_GPS` `waypoint:` or `/packgps waypoint [name]`. Quests do not start GPS by themselves.

File: `Quests/objectives/objective_waypoint.dsc`. Shared objective keys are on [Quests](../README.md).

```yaml
reach_dock:
    type: WAYPOINT
    waypoint: waypoint_dock
```
