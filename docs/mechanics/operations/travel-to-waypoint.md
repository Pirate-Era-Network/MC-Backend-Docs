---
sidebar_position: 33
---

# TRAVEL_TO_WAYPOINT

`TRAVEL_TO_WAYPOINT` teleports to a placed row on `waypoint_index`. A `waypoint_` script with the same id adds requirements and `travel_cost`. The fare is settled inside this op. A failed pay does not teleport, so you do not put [APPLY_TRANSACTION](apply-transaction.md) in front of it as a sibling. `ignore_cost` and `ignore_requirements` skip those two gates. An area rule `TRAVEL: DENY` still blocks the move. Arrival calls `fire_quest_waypoint`. Walking onto the coordinates does not fill a `WAYPOINT` objective. A compass that points at the dock without moving the player is [START_GPS](gps.md). The placed spot, the script, and the gates are on [travel](../../travel.md).

Task: `operation_travel_to_waypoint`. A placed row on `waypoint_index` is the live spot. A `waypoint_` script with the same id adds requirements and `travel_cost`. Full page: [travel.md](../../travel.md).

`ignore_cost` and `ignore_requirements` skip those two gates. Area `TRAVEL: DENY` still blocks the move. A failed pay does not teleport. Arrival calls `fire_quest_waypoint`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `TRAVEL_TO_WAYPOINT` |
| `waypoint` | yes | `waypoint_example_dock` or `example_dock`. `waypoint_id` is the same field |
| `ignore_cost` | no | `true` skips `travel_cost` |
| `ignore_requirements` | no | `true` skips `requirements` |
| `target` | no | Who. Overlay `ENTITY`. Non-players are skipped |

```yaml
operations:
    1:
        type: TRAVEL_TO_WAYPOINT
        target: SELF
        waypoint: waypoint_example_dock
```

Smoke: `mechanic_example_travel`. `/packwaypoint go waypoint_example_dock`.
