---
sidebar_position: 36
---

# DASH

`DASH` shoves the living dasher once, then the pulse only sweeps hits and plays `loop`. It does not spawn a display, and it does not re-apply velocity every tick. Put `speed` and `range` under `dash:`. `range: 0` means no distance cap. `UP` and `DOWN` keep look XZ and set Y. They are not a pure vertical vector. Default `continue: false` stops the dasher on the first hit. `bounce_modes` defaults to punch, step, and wall together. A slam's landing AOE goes in `end`. A sibling operation does not wait for the coast. Wall, step, and entity rules that the shot also uses are on [Display and pulse](display.md). A cloud model on the trail is [SPAWN_COSMETIC](cosmetics.md).

Task: `operation_dash`. Nested Dash Config (`dash:`). Physics stays on the living dasher. There is no display entity. Overlay `ENTITY`. Default `target: SELF`.

One look-direction impulse, then coast. The pulse `repeat` is hit sweep and `loop` FX, not a new shove each tick. Count is lifetime ticks / tickrate, plus a bounce linger if `bounce` is set. Never `while`. Stop early on standstill, water (when bounce is 0), optional `range`, or grounded after `grounded_after` pulses (default 5).

`speed` is the impulse scale (legacy `velocity`). Put it under `dash:` so it is not the LOOK targeting range. `LOOK` uses current facing at shove time. `FORWARD` locks spawn yaw. `UP` / `DOWN` keep look XZ and set Y (`slamaoe` used look `mul[1]` with `y: 1.5` then `y: -1`). `DOWN` also stops when grounded after the first pulse.

Default `continue: false` zeros the dasher after the first unique hit (one victim per pulse). `continue: true` keeps coasting. `pierce` only caps unique hits when continue is true. `multi_hit` clears the unique list every `multi_hit_interval` pulses (default 8). `pullwith` drags already-hit victims along the look vector, then zeros them if still within `pull_stop` at end.

`bounce` is a shared charge count. `bounce_modes` picks which spenders are on: `PUNCH` (left-click reverse), `STEP` (step-on-block hop), `WALL` (yaw 180 reflect). Omit `bounce_modes` to enable all three. `bounce_wall` is a nested map: `hop` (add `bounce_y` after a wall reflect, default true), `floor` (allow the ground to count as a wall, default false), `max_pitch` (look-down degrees that skip wall unless `floor` is true, default 45). `bounce_sound` plays on every spend. `collision: NONE` skips wall reflect. `BOTH` / `BLOCKS` only stop on a wall when charges are gone. Non-player casters hop `y: 0.5` and wait `3t` before the look impulse.

`slamaoe` is `DASH` LOOK with `y: 1.5` and `duration: 15t`, nested `end` `DASH` DOWN (look XZ, negative Y) until land, nested `end` AOE. Not a second Backend engine. Sibling ops do not wait. `NO_KNOCKBACK` does not skip this op.

`loop` / `hit` / `end` are nested mechanic configs. `hit` sets context TARGET to the victim. All three set placeholder `dash_end`. `source_type` is `DASH`. Barriers use the same noted-area flag as PROJECTILE. Default `collision` is `ENTITIES` (legacy had no wall stop). A particle trail is `loop` `PLAY_EFFECT` `target: dash_end`. A geppo-style cloud **model** is nested `SPAWN_COSMETIC`. See [Cosmetic operations](cosmetics.md).

| `direction` | What it does |
| --- | --- |
| `LOOK` (default) | One impulse along current facing, then coast |
| `FORWARD` | Same, spawn yaw locked |
| `UP` | Look XZ `mul[1]`, Y = `speed`. Slam hop |
| `DOWN` | Look XZ `mul[1]`, Y = `-speed`. Stops on ground after the first pulse |

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `DASH` |
| `dash` | no | Nested config. Overlay onto the op |
| `direction` | no | `LOOK` / `FORWARD` / `UP` / `DOWN` |
| `speed` | no | Impulse scale. Default `1.5`. Prefer under `dash:` |
| `range` | no | Optional max distance. Default `0` (off). Legacy stop is time / standstill / ground |
| `pierce` | no | Unique living hits before travel ends when `continue: true`. Default `1`. `0` never ends from hit count |
| `continue` | no | Default `false`. First hit zeros the dasher. `true` keeps going |
| `pullwith` | no | Default `false`. Drag hit victims with look velocity |
| `pull_range` | no | Pull search. Default `3` |
| `pull_stop` | no | End brake if still this close. Default `5` |
| `collision` | no | `ENTITIES` (default), `BOTH`, `BLOCKS`, `NONE` |
| `hitbox` | no | Living search radius. Default `1.5` |
| `bounce` | no | Charge count. `true` or a number. Default `0` |
| `bounce_modes` | no | List `PUNCH` / `STEP` / `WALL`. Omit for all three |
| `bounce_wall` | no | Nested wall options. `hop` / `floor` / `max_pitch` |
| `bounce_y` | no | Punch/step hop Y, and wall hop add. Default `0.5` |
| `bounce_impulse` | no | Punch/step look scale. Default `3` |
| `bounce_recent` | no | Debounce after a spend. Default `5t` |
| `bounce_sound` | no | Sound on punch, step, or wall bounce |
| `y` | no | Extra Y added to LOOK / FORWARD. Default `0` |
| `follow_pitch` | no | Default `true`. `false` zeros pitch on LOOK |
| `multi_hit` | no | Clear unique-hit list every interval. Default `false` |
| `multi_hit_interval` | no | Default `8` |
| `tickrate` | no | Default `1t` |
| `lifetime` | no | Coast cap. Default `1s` (20 pulses). Op `duration:` also sets this |
| `loop` | no | Mechanic each pulse at `dash_end` |
| `hit` | no | Mechanic per new victim |
| `end` | no | Mechanic at last location after travel |
| `target` | no | Who dashes. Overlay `ENTITY`. Default SELF |

```yaml
operations:
    1:
        type: DASH
        target: SELF
        dash:
            direction: LOOK
            speed: 1.5
            continue: false
            collision: ENTITIES
        loop:
            operations:
                1:
                    type: PLAY_EFFECT
                    target: dash_end
                    effect: CLOUD
                    quantity: 4
        hit:
            operations:
                1:
                    type: DEAL_DAMAGE
                    target: TARGET
                    value: 5
                    damage_type: ENTITY_ATTACK
        end:
            operations:
                1:
                    type: PLAY_SOUND
                    target: dash_end
                    sound: ENTITY_PLAYER_ATTACK_SWEEP
```

Smoke: `mechanic_example_dash`.

Harvest: `dash.dsc` (one impulse, coast, hitbox, `continue`, `pullwith`, water, 20t / standstill / grounded). Bounce: `bouncetask` in `generalmovetasks.dsc` (left click reverse, step forward) plus wall reflect (yaw 180, new impulse). FE `bounce_modes` / `bounce_wall` interchange those spenders. `slamaoe.dsc` is look+Y up, wait, look+Y down, then `basicaoe` child. Knockback, cosmetics, startvelocity, endscript stay other ops. See the plan DASH compose note.
