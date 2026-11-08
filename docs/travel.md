---
sidebar_position: 27
---

# Travel

**Live.** Waypoint Config plus `TRAVEL_TO_WAYPOINT`. Paying uses Cost Component. Requirements use the same maps as mechanics.

Backend: [Travel/waypoint_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Travel/waypoint_utils.dsc), [Travel/waypoint_index.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Travel/waypoint_index.dsc), [Travel/waypoint_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Travel/waypoint_command.dsc), [Mechanics/Individual_operations/travel_operation.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/travel_operation.dsc).

Frontend examples: `Travel/waypoint_examples.dsc`. Admin list: `Menus/menu_waypoint_list.dsc`. Smoke mechanics: `mechanic_example_travel`.

Op: `TRAVEL_TO_WAYPOINT`. Command: `/packwaypoint`.

Most spots are placed in game, the same idea as an Essentials warp. Stand there and `/packwaypoint set dock`. That writes server flag `waypoint_index`. There is no marker entity. Reload does not wipe the flag.

A `waypoint_` script with the same id is the rules. `dock` and `waypoint_dock` are one waypoint. The placed location wins. Requirements, cost, and display stay on the script you travel to. `place:` points coordinates at a different placed id and leaves those rules on this script.

A placed-only warp (no script) is free and has no requirements. A script-only warp (YAML location, never set in game) still works. GPS (`START_GPS`) is a compass marker, not this.

## Scripts

| Prefix | What it is |
| --- | --- |
| `waypoint_` | Rules for one travel point. Display, category, requirements, travel cost, optional location, optional `place` |
| (same id on `waypoint_index`) | The live coordinates, saved by `/packwaypoint set` |

Category is a label string for menus. It is not a script prefix and not an area category.

## Waypoint Config

| Key | Status | Notes |
| --- | --- | --- |
| `location` | Live | Fallback coordinates when nothing is placed. Map of `x` `y` `z`, optional `yaw` `pitch` `world`. Or a LocationTag (`l@...`). Omit when the spot is placed in game |
| `place` | Live | Another waypoint id. Coordinates come from that placed row (or that script's location). Requirements and cost stay on this script |
| `display.name` | Live | Transcript key or literal. Chat and the list menu |
| `display.arrive_text` | Live | Transcript key or literal. Chat after a successful move. Omit to use the default arrive line |
| `category` | Live | Label. Omit to show the no-category word |
| `requirements` | Live | Same maps as mechanic requirements. Empty passes. Checked on the traveler |
| `travel_cost` | Live | Cost Component rows. `TAKE` from the traveler into Void. Empty is free |
| `wiki` | Live | Longer body |
| `notinwiki` | Live | Stored for a later wiki scan. This engine does not list waypoints in the wiki yet |

Omit `location.world` to use the traveler's current world. A named world must already be loaded. LocationTag order is `x,y,z,pitch,yaw,world`. Pitch comes before yaw.

If a placed location is stored and that world is not loaded, travel fails. It does not fall back to the script location.

```
place: dock
location:
    x: 0
    y: 100
    z: 0
    yaw: 0
    pitch: 0
requirements:
    1:
        type: SNEAKING
        mode: HAS
travel_cost:
    1:
        type: CURRENCY
        id: currency_belly
        amount: 5
        action: TAKE
```

`display.name` and `display.arrive_text` are transcript keys. `wiki` is the longer body.

## Travel

Order for each player:

1. The id must be a placed row, a `waypoint_` script, or both. `place:` redirects which row supplies coordinates.
2. The location must resolve. A placed location wins. An unloaded placed world does not use the script location.
3. `area_allows_travel` at the player's feet. `TRAVEL: DENY` blocks the op. Walking is not blocked. This gate is never skipped.
4. `requirements`, unless `ignore_requirements` is true.
5. `travel_cost`, unless `ignore_cost` is true. A failed pay does not teleport.
6. Teleport, then `fire_quest_waypoint`. A `WAYPOINT` quest objective also advances when the player walks within `arrive_range` of the resolved spot. See [quests.md](quests/README.md). Use `START_GPS` with `waypoint:` or `/packgps waypoint` to point the arrow. Quests do not auto-start GPS.

The traveler pays. `TAKE` goes to Void. The analytics tag is the waypoint script id.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `TRAVEL_TO_WAYPOINT` |
| `waypoint` | yes | `waypoint_example_dock` or `example_dock`. `waypoint_id` is the same field |
| `ignore_cost` | no | `true` skips `travel_cost` |
| `ignore_requirements` | no | `true` skips `requirements` |
| `target` | no | Who. Overlay `ENTITY`. Non-players are skipped |

```
operations:
    1:
        type: TRAVEL_TO_WAYPOINT
        target: SELF
        waypoint: waypoint_example_dock
```

## Command

`/packwaypoint set [name]` saves where you stand, including yaw and pitch. `dock` and `waypoint_dock` are the same id. Names are lowercase letters, numbers, and underscores. If a location was already saved, the chat says moved.

`/packwaypoint move [name]` is the same save.

`/packwaypoint remove [name]` drops the placed row. The script stays.

`/packwaypoint list` opens the admin PAGE for a player. Console narrates every placed row and every script. Left click travels with cost and requirements ignored. Area `TRAVEL` deny still blocks that click. Shift left removes a **placed-only** row (no `waypoint_` script). Rows with a pack script show lore that the script must be removed from the pack first.

`/packwaypoint show [radius]` draws client-only `sea_lantern` markers on every waypoint with a resolved location in this world within the radius. Default radius is `waypoint_show_defaults.radius` (10). A new run cancels the last markers for that player.

`/packwaypoint here` lists waypoints in this world within `waypoint_here_range` (5 blocks).

`/packwaypoint go [name]` is any player. Same gates as the op.

`/packwaypoint force [name]` is op only. It sets both ignore flags. Area `TRAVEL` deny still blocks it.

`/packwaypoint clear` wipes `waypoint_index` only. Scripts remain.

`/packwaypoint prune` drops rows that are not a map or have no location. An unloaded world is kept.

`set`, `move`, `go`, `force`, and `here` need a player. Console can list, remove, clear, and prune.

## Smoke

```
/packwaypoint set dock
/packwaypoint show
/packwaypoint list
/packwaypoint here
/packwaypoint go dock
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_travel].data_key[data].get[self_travel_dock]>
/packwaypoint go waypoint_example_gate
/packwaypoint force waypoint_example_gate
```

`/packwaypoint set example_dock` overwrites the example coordinates and keeps the free script. Stand still for the gate row (requirements fail). Sneak with 5 belly (it pays and moves). `self_travel_gate_free` skips both gates.

A quest objective `type: WAYPOINT` with `waypoint: waypoint_example_dock` fills when that travel succeeds. A list click does too, because it still runs `TRAVEL_TO_WAYPOINT`.

## What can go wrong

- Using `START_GPS` for a named dock. That draws a compass. This op teleports.
- Putting `APPLY_TRANSACTION` as operation 1 and `TRAVEL_TO_WAYPOINT` as operation 2. A failed pay still runs the sibling. The travel op pays inside itself.
- Expecting a `WAYPOINT` quest to fill from walking alone without being within `arrive_range`. Proximity is checked once per second from `player_game_loop`, not every move.
- `TRAVEL: DENY` does not block walking. It blocks this op, including `force` and the list click.
- Setting `location.world` to a world that is not loaded. The move is refused. The same is true for a placed spot in an unloaded world.
- Swapping yaw and pitch in an `l@` string. Pitch is the fourth number.
- Expecting `/packwaypoint clear` to delete `waypoint_` scripts. It only wipes placed rows.
- Expecting `/packwaypoint remove` to delete requirements. It only drops the placed location. The script location is used again after that.
