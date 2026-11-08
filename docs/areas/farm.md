---
sidebar_position: 2
---

# FARM

`category: farm` (aliases `farming`) plus a linked `farm_` script pastes a schematic, marks a weakpoint, and grants loot when the chops run out. The task file is `Areas/categories/area_category_farm.dsc`. A plain island does not do this. The area script, the resolve order, and AreaRule stay on [Areas](README.md).

The area row stores `farm: farm_example_oak`. The editor picks that link. Inline `farming:` still works. A linked `farm:` wins when both are present. If the schematic file exists, the note is the schematic cuboid. If it does not, the area still places as the config box and chat says the schematic is missing. Keep nodes small. A huge schematic waits on the paste.

```yaml
category: farm
farm: farm_example_oak
```

```yaml
farm_example_oak:
    type: data
    debug: false
    data:
        schematic: example_node
        respawn: 30s
        materials:
        - oak_log
        loot: loottable_example
        hits: 5
        tools:
            iron_axe: 3
        break_time: 5s
        build_time: 2s
        on_hit:
        - operations:
            1:
                type: PLAY_SOUND
                target: SELF
                target_type: ENTITY
                sound: BLOCK_NOTE_BLOCK_BELL
                volume: 0.8
                pitch: 1.2
        on_break:
        - operations:
            1:
                type: PLAY_SOUND
                target: SELF
                target_type: ENTITY
                sound: ENTITY_PLAYER_LEVELUP
                volume: 0.6
                pitch: 1
        on_wrong_hit:
        - operations:
            1:
                type: NARRATE
                target: SELF
                transcript: area_farm_wrong_weakpoint_text
```

| Key | Role |
| --- | --- |
| `schematic` | Denizen schematic name. Place pastes it with `noair` |
| `materials` | Block names that count as the node (`oak_log`) |
| `respawn` | Delay after the clear animation before rebuild starts. Default `30s` |
| `loot` | `loottable_` granted once when hits reach the need |
| `hits` | Base chops on the weakpoint. Default `1` |
| `tools` | Map of item script id or material name to a lower hit count |
| `break_time` | Clear animation length. Default `5s` |
| `build_time` | Rebuild animation length. Default `2s` |
| `weakpoint_particle` | Particle on the marked block. Default `wax_on` |
| `weakpoint_pulse` | Particle interval. Default `10t` |
| `session_timeout` | Idle time after the last successful chop before progress and particles clear. Default `10s`. Actively mining refreshes it |
| `on_hit` | Mechanic list when the weakpoint is chopped (not yet depleted) |
| `on_break` | Mechanic list when the node depletes |
| `on_wrong_hit` | Mechanic list when a listed material that is not the weakpoint is hit. When set, replaces the default wrong-weakpoint chat line |

Only the weakpoint (an outer material block with particles) accepts hits after the session starts. The first break of any listed material starts the session, counts as hit one, picks a weakpoint, and starts particles. After each later non-final hit the weakpoint moves. The broken-block overlay lasts for `session_timeout` and refreshes on each successful chop. If nobody successfully chops for that long, progress, particles, and crack clear and the next break is any-break again. Clear and rebuild animate bottom-up.
