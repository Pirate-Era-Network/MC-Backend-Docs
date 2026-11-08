---
sidebar_position: 34
---

# APPLY_VELOCITY

`APPLY_VELOCITY` sets velocity on each resolved entity. `target` is who moves. `origin` is the other end of `AWAY` or `TOWARD`, and it defaults to the caster. `NO_KNOCKBACK` skips the victim. A one-shot does not wait a tick. Self knockback with the default `AWAY` uses you as the origin, the distance is 0, and nothing moves. Use `direction: LOOK` for that shove. This op is not a dash with a hit sweep, and it is not how a projectile travels. Those are [DASH](dash.md) and [PROJECTILE](projectile.md). `GUIDE` and `GROUND` pulse with a counted `repeat`. The count is on [Display and pulse](display.md).

Task: `operation_apply_velocity`. Sets `EntityTag.velocity` on each resolved entity. Overlay `ENTITY`. `NO_KNOCKBACK` skips the victim. Hit-feedback knockback stays `apply_knockback` (that path waits 1t because cancelled vanilla damage wipes motion). This op does not wait on a one-shot.

`origin` is the other end of AWAY / TOWARD (default CASTER). Same origin rules as AOE. `target` is who moves.

| `mode` | What it does |
| --- | --- |
| `KNOCKBACK` (default) | One shove. Default direction AWAY. Default `amount` / `y` match hit knockback |
| `PULL` | One shove toward origin. Default `amount` 1, `y` omitted so the 3D vector keeps its pitch |
| `GUIDE` | Counted `repeat` toward a live origin. Recasts each pulse. Stops at `stop_distance`, despawn, or `NO_KNOCKBACK`. Default duration `2s` at `1t` (40 pulses, same cap as `entitypullwhile`) |
| `GROUND` | Slam until `entity_is_grounded` or duration. Default facing * 0.1 with `y: -4` (`floorpushtarget`) |

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `APPLY_VELOCITY` |
| `mode` | no | `KNOCKBACK`, `PULL`, `GUIDE`, `GROUND` |
| `direction` | no | `AWAY`, `TOWARD`, `LOOK` (caster facing), `FORWARD` (victim facing). Omit to use the mode default |
| `amount` | no | Horizontal scale. Number or `stat_*` |
| `y` | no | Replaces the vector Y when set. KNOCKBACK and GROUND always set Y (defaults `0.35` and `-4`) |
| `allow_knockback_resistance` | no | Default `true`. Scales amount and Y by `1 - clamp(get_knockback_resistance, 0, 1)` |
| `stop_distance` | no | GUIDE AWAY / TOWARD. Default `3` |
| `duration` | no | GUIDE / GROUND loop length. Defaults `2s` / `5s` |
| `tickrate` | no | GUIDE / GROUND wait between pulses. Default `1t` |
| `origin` | no | Vector source for AWAY / TOWARD. Default CASTER |
| `target` | no | Who. Overlay `ENTITY` |

Self knockback: `target: SELF`, `direction: LOOK`. Pull a LOOK entity: `target: LOOK`, `mode: PULL`. Do not use this as player dash travel (`DASH` is that). Do not use this as projectile travel (`pushentity` is PROJECTILE).

Harvest: `dealknockback.dsc`, `entitypullwhile` in `basicprojectile.dsc`, `floorpushtarget` in `generalmovetasks.dsc`.

```yaml
operations:
    1:
        type: APPLY_VELOCITY
        target: LOOK
        mode: KNOCKBACK
        amount: 0.8
        y: 0.4
        allow_knockback_resistance: true
```

Smoke: `mechanic_example_apply_velocity`.
