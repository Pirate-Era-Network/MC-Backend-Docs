---
sidebar_position: 12
---

# /packwaypoint

Places waypoints and travels to them. `go` is any player. `set`, `move`, `remove`, `list`, `show`, `here`, `force`, `clear`, and `prune` are op. Console can `list`, `remove`, `clear`, and `prune`.

## System

`set` and `move` save the player location on server flag `waypoint_index`. A `waypoint_` script with the same id keeps requirements and cost. Travel uses `travel_player_to_waypoint`, the same path as `TRAVEL_TO_WAYPOINT`. Area rule `TRAVEL` deny still blocks, including `force` and the list-menu click.

| Piece | Where |
| --- | --- |
| Command | [Travel/waypoint_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Travel/waypoint_command.dsc) |
| Index and travel | [Travel/waypoint_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Travel/waypoint_index.dsc), [Travel/waypoint_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Travel/waypoint_utils.dsc) |
| Option catalog | [travel](../travel.md) |

## Use

```text
/packwaypoint go <name>
/packwaypoint set <name>
/packwaypoint move <name>
/packwaypoint remove <name>
/packwaypoint force <name>
/packwaypoint list
/packwaypoint here
/packwaypoint show (radius)
/packwaypoint clear
/packwaypoint prune
```

`dock` and `waypoint_dock` are the same id. Names are lowercase letters, numbers, and underscores.

| Action | What it does |
| --- | --- |
| `go` | Travel with cost and requirements. Any player. |
| `force` | Travel with cost and requirements ignored. Op only. Area deny still applies. |
| `set` / `move` | Save where you stand, including yaw and pitch. A second save says the spot moved. |
| `remove` | Drop the placed row. The `waypoint_` script stays, and its script location is used again. |
| `list` | Player opens the admin PAGE. A row click travels with both ignore flags. Console narrates every row. |
| `here` | List waypoints in this world within `waypoint_here_range` (5 blocks). |
| `show` | Client-only markers for waypoints in this world. Default radius is `waypoint_show_defaults.radius` (10). A new run clears your previous markers. |
| `clear` | Wipe `waypoint_index`. Scripts remain. |
| `prune` | Drop rows that are not a map or have no location. An unloaded world is kept. |

## What can go wrong

- `clear` or `remove` expected to delete the `waypoint_` script. Only the placed coordinates go away.
- `go` while the area you are in, or the destination area, denies `TRAVEL`.
- `set` from console. Saving needs the sender's location.
