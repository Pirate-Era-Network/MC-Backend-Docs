---
sidebar_position: 41
---

# START_GPS and STOP_GPS

`START_GPS` draws one arrow for the caster, who must be a player. The destination is a location target or a `waypoint` id. `target: SELF` is your feet, and the arrow arrives at once. Follow offset belongs under `gps:`. Targeting `offset` moves the destination. Recast `START_GPS` to replace the live arrow. Pairing `STOP_GPS` and `START_GPS` as siblings both run, which is the wrong replace. The marker is an `item_display` teleported each pulse. An attach to the owner is not visible to that player, and a vanilla compass needle spins on its own. `STOP_GPS` clears that player's marker. Quit, start, and reload clear it too. This is a world marker, not a HUD part, and it is not [TRAVEL_TO_WAYPOINT](travel-to-waypoint.md). The pulse is on [Display and pulse](display.md).

Tasks: `operation_start_gps`, `operation_stop_gps`. Nested GPS Config (`gps:`). Owner is the mechanic caster (must be a player). Destination is targeting LOCATION (CURSOR, LOOK, a placeholder, or TARGET feet) or `waypoint:` / `waypoint_id:` (travel resolution, same ids as `TRAVEL_TO_WAYPOINT`). One GPS per player. Recast START removes the live one first. Smoke: `/packgps waypoint example_dock`.

Marker is `item_display`, not armor stand. Legacy `attach` to the owner is not visible to that player, so each pulse teleports to a look-relative offset. Default is `0,1.5,4` (right, up, forward-flat). `height` / `forward` / `right` overlay one axis. The teleport uses `.face[destination]` (same as PROJECTILE) so the arrow points at the dest. Do not use a compass item. Vanilla compass needles spin on their own. Other players are `hide_entity` each pulse.

Pulse is lifetime ticks / tickrate ticks, then `- repeat`. Never `- while`. Same world shows `distance_text` (`<[distance]>` is the blocks left, parsed on the pulse queue). Wrong world shows `wrong_world_text` and does not stop. Distance under `arrive_range` (default 5) plays `arrive_sound`, narrates `arrive_text`, then stops.

`lifetime` or op `duration:` is the max follow time (default `120s`). Tickrate default `5t`. Arrow model is Frontend: `material` (or `item`) plus `modeldata` (or `custom_model_data` / `custommodeldata`). Default material is `carved_pumpkin`. Smoke uses legacy CMD `182`. Billboard default `fixed` so facing matters.

STOP_GPS resolves ENTITY targets (default SELF) and clears that player's marker. Quit, start, and reload also clear it (`gps_engine_events`). Not a HappyHUD plugin and not the HUD composer.

Live arrows are indexed on `server.flag[gps_index]` keyed by owner uuid. Timed. Do not restore after reboot. Admin: `/packgps list` opens `menu_gps_list` (PAGE, remaining lifetime, leftover/ghost, teleport click). Console narrates the same rows. `/packgps prune` drops leftover, ghost, and orphans. `/packgps clear` removes every arrow. `/packgps remove [player]` stops one owner.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `START_GPS` or `STOP_GPS` |
| `gps` | no | Nested config. Overlay onto the op |
| `target` | yes on START unless `waypoint` is set | Destination who-rule. Overlay LOCATION. SELF is your feet and arrives at once |
| `waypoint` | no | `waypoint_dock` or `dock`. Resolves through travel. `waypoint_id` is the same field |
| `arrive_range` | no | Blocks. Default `5` |
| `lifetime` | no | DurationTag or seconds. Op `duration:` wins. Default `120s` |
| `tickrate` | no | Default `5t` |
| `item` | no | Vanilla material or `item_*`. Alias of `material`. Default `carved_pumpkin` |
| `material` | no | Same as `item` |
| `custom_model_data` | no | Packed model id. Theme arrows stay on Frontend |
| `modeldata` | no | Same as `custom_model_data`. Also `custommodeldata` |
| `offset` | no | Right, up, forward-flat as `x,y,z`. Default `0,1.5,4`. Prefer under `gps:` so it is not targeting offset |
| `height` | no | Blocks above the player. Overlay on offset Y. Alias `up`. Default `1.5` |
| `forward` | no | Blocks in front of the player (yaw only). Overlay on offset Z. Default `4` |
| `right` | no | Blocks to the player's right. Overlay on offset X. Default `0` |
| `scale` | no | Vector. Default `1,1,1` |
| `billboard` | no | Display `display:`. Default `fixed` |
| `distance_text` | no | Nametag. `<[distance]>` is blocks left |
| `wrong_world_text` | no | Nametag when worlds differ |
| `arrive_text` | no | Narrate on arrive. Default `destination reached`. Set `none` to skip |
| `arrive_sound` | no | `playsound` to the owner. Default `ENTITY_PLAYER_LEVELUP`. Set `none` to skip |

```yaml
operations:
    1:
        type: START_GPS
        target: CURSOR
        gps:
            arrive_range: 5
            lifetime: 60s
            material: carved_pumpkin
            modeldata: 182
            height: 1.5
            forward: 4
            distance_text: "<&c><[distance]> blocks left"
            wrong_world_text: "<&c>wrong world"
            arrive_text: destination reached
```

```yaml
operations:
    1:
        type: STOP_GPS
        target: SELF
```

Smoke: `mechanic_example_gps`.

```text
/packgps list
/packgps prune
/packgps clear
```

Harvest: `GpsSystem.dsc` (carved_pumpkin CMD 182 arrow, hide from others, point at dest, distance in name, stop under 5, wrong-world text). Leave dungeon/conquerworld and `/PEgps` behind. Do not port armor stand, compass, or `- while`.
