---
sidebar_position: 37
---

# SPAWN_NOTABLE

`SPAWN_NOTABLE` notes an ellipsoid or a cuboid. There is no display entity. Cage glass is `showfake`, which the client treats as a wall even though the server does not, so omit `material` when the player has to walk out. `CUBOID` draws that box's faces. `fill: true` is every block in the volume, which is the wrong choice for a large radius. `EDGE` is the visual shell. `SURFACE` is the full shell. `loop` runs even when the zone is empty. `inside` runs only for occupants. Recast of the same note name removes the live one and does not place a second cage. Push belongs in `on_enter` as [APPLY_VELOCITY](apply-velocity.md). `barrier: true` is the wall flag [PROJECTILE](projectile.md) and [DASH](dash.md) already read. `EMPTY` despawns on the first pulse if nobody is inside. The pulse count is on [Display and pulse](display.md).

Task: `operation_spawn_notable`. Nested Spawn Notable Config (`notable:`). Notes an ellipsoid or cuboid at a LOCATION (default SELF). Kind is `SKILLMOVE` on the shared notable registry. World islands later write `AREA` into the same flags. There is no display entity. Cage visuals are `showfake`. Op `duration:` also sets lifetime.

Note name is `<player>_<id>` (default id `entrap`), same filter shape as legacy. Recast of that name tears the cage down and does not place a new one. Cast again to place.

`on_enter` / `on_exit` fire from `Events/global_events.dsc` (`entity enters/exits` ellipsoid or cuboid). They are optional nested mechanics. Knockback, pull, and damage belong there as `APPLY_VELOCITY` / `DEAL_DAMAGE`. Omit the keys for a quiet zone. `loop` is occupancy-independent edge VFX (legacy `loopparticles`). PLAY_EFFECT `target: notable_shell` hits the **visual** particle list. Default `particle_mode: EDGE` is the visual shell with even `.y` and air (`entrapmove` `loopparticles`, opeope Room). `SURFACE` is the full shell with no even-Y skip. `inside` is a counted `repeat` pulse on occupants (buffs). `end` fires when the note is removed. Placeholders `notable_center` and `notable_shell` (list of Locations). `source_type` is `NOTABLE`.

`barrier: true` flags the noted area with `projectile_barrier_flag` (`barrier`). PROJECTILE and DASH already snapshot that set. This op does not port a fruit barrier script.

Default despawn is lifetime plus caster outside for `2s`. `IN_AREA` on another mechanic is how packs skip stamina in a zone. Do not bake that into this op. Grounded-before-place is a `GROUNDED` requirement on the mechanic that contains the op.

Reload, server start, quit, and join unnote leftover `SKILLMOVE` rows only.

| `shape` | What it does |
| --- | --- |
| `ELLIPSOID` (default) | `<location.to_ellipsoid[radius,height,radius]>` |
| `CUBOID` | Facing block corners (`backward_flat` / `left` / `forward_flat` / `right`). Glass is that box's faces, not a sphere |

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `SPAWN_NOTABLE` |
| `notable` | no | Nested config. Overlay onto the op |
| `id` | no | Name suffix and `IN_AREA` id. Default `entrap` |
| `shape` | no | `ELLIPSOID` / `CUBOID` |
| `radius` | no | Visual size (glass and dust). Default `5`. Prefer under `notable:` |
| `height` | no | Visual Y radius or cuboid height. Default `5` |
| `inset` | no | Extra blocks on the **note** past the visual. Default `1`. Cuboid adds `inset` on each face (`radius + inset * 2`). `0` matches visual to zone |
| `particle_mode` | no | `EDGE` (default): visual shell, even `.y`, air. Same as `entrapmove` loopparticles. `SURFACE`: full shell, no even-Y skip |
| `barrier` | no | Flag the note for projectile/dash walls. Default `false` |
| `material` | no | Fake block material. `none` (default) skips showfake. CUBOID is a box. ELLIPSOID is a sphere shell |
| `fill` | no | Default `false` (shell). `true` is every block in the volume |
| `one_per_caster` | no | Default `true`. Recast of the live name removes it |
| `exclude_caster` | no | Default `false`. Skip the caster in enter/exit/inside |
| `exclude_original` | no | Default `false`. Skip entities already inside at spawn |
| `tickrate` | no | Loop, inside pulse, and outside-timer. Default `5t` |
| `lifetime` | no | Note cap. Default `8s`. Op `duration:` also sets this |
| `despawn` | no | `DURATION`, `CASTER_OUTSIDE` (default pair), `CASTER_DEAD`, `CASTER_QUIT`, `EMPTY` |
| `on_enter` | no | Mechanic when Denizen fires enter. Optional |
| `on_exit` | no | Mechanic when Denizen fires exit. Optional |
| `loop` | no | Mechanic each pulse at the shell. Optional. Does not need occupants |
| `inside` | no | Mechanic each pulse. TARGET is the occupant list |
| `end` | no | Mechanic when the note is removed |
| `target` | no | Center location who-rule. Default SELF. Overlay LOCATION |

```yaml
operations:
    1:
        type: SPAWN_NOTABLE
        target: SELF
        notable:
            shape: ELLIPSOID
            radius: 4
            height: 3
            lifetime: 8s
            tickrate: 10t
            material: glass
            particle_mode: EDGE
        on_enter:
            operations:
                1:
                    type: NARRATE
                    target: TARGET
                    text: entered zone
        on_exit:
            operations:
                1:
                    type: NARRATE
                    target: TARGET
                    text: left zone
        loop:
            operations:
                1:
                    type: PLAY_EFFECT
                    target: notable_shell
                    effect: DUST
                    quantity: 1
                    offset: 0,0,0
                    special_data:
                        size: 1.2
                        color: aqua
        end:
            operations:
                1:
                    type: PLAY_SOUND
                    target: notable_center
                    sound: BLOCK_GLASS_BREAK
```

Smoke: `mechanic_example_spawn_notable`.

Harvest: `entrapmove.dsc` (named note, fake non-solid shell, recast removes, caster outside 2s, cuboid from facing corners, Denizen enter/exit). `opeope.dsc` Room `loopparticles` plays on that shell, not the volume. Knockback/pull stay nested `APPLY_VELOCITY`. Edge dust is nested `loop` `PLAY_EFFECT` `target: notable_shell` with `particle_mode: EDGE`. Barriers: `flag barrier` (`return_barriers`). Do not port `barrierbarrier.dsc`. Grounded wait is a `GROUNDED` requirement. Stamina exemption is `IN_AREA`.
