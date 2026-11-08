---
sidebar_position: 4
---

# PLAY_EFFECT

`PLAY_EFFECT` is the visual op: particles, local lightning, a block-crack overlay, screen shake, a bleed border, falling-block debris, dropped bursts, or an EffectLib shape. `SCREEN_SHAKE` and `BLOODY_SCREEN` are this op. They are not HUD parts. `kind: BLOCK_CRACK` is the crack command. Sand bits are `effect: BLOCK` plus `special_data.material`. `BLOCK_EXPLOSION` copies nearby blocks into falling-block debris and does not break the floor. Quote equation strings that start with `-` or `#`. Debris entity type and the pulse count are on [Display and pulse](display.md).

Task: `operation_play_effect`. Smoke: `mechanic_example_play_effect`. Templates: `pirate-era-core-frontend/Mechanics/effect_templates.dsc`.

Particles, local lightning, blockcrack overlay, screen shake, bleed worldborder, falling_block debris, drop bursts, or EffectLib shapes. Default `target_type` is LOCATION except `SCREEN_SHAKE` / `BLOODY_SCREEN` (those overlay ENTITY). Entities become feet locations unless `follow: true` (EffectLib origin is the entity).

`SCREEN_SHAKE` and `BLOODY_SCREEN` are mechanic VFX, not the HUD composer. `BLOCK_EXPLOSION` / `DEBRIS` spawn flagged falling_block that must not place. Explosion searches solid blocks around the cell **under** the target (`below[1]`), same as legacy quake. `DROP_BURST` is dropped items (hana/snow).

Harvest: `screenshakeeffect`, `bloodyscreeneffect`, `blockexplosioneffect`, `hanahanaflowereffect`, `fallingblockdropprevention` in `generalmovetasks.dsc`. Quake fruit calls `blockexplosioneffect`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `PLAY_EFFECT` |
| `kind` | no | `PARTICLE` (default), `LIGHTNING`, `BLOCK_CRACK`, `SCREEN_SHAKE`, `BLOODY_SCREEN`, `BLOCK_EXPLOSION`, `DEBRIS`, `DROP_BURST`, `HELIX`, `SPHERE`, `CIRCLE`, `CONE`, `CYLINDER`, `EQUATION`, `LINE`, `ATOM`. Omit kind if `effect:` is a particle, or if `x_equation` is set (EQUATION), or `effect: LIGHTNING` |
| `effect` | for PARTICLE | Particle name (`DUST`, `CLOUD`). Legacy `REDSTONE` / `block_crack` / `crit_magic` are aliased |
| `quantity` | no | Default `10`. Number or `stat_*` |
| `offset` | no | Particle spread. Default `0.5,0.5,0.5`. Targeting offset is separate (feet shift) |
| `visibility` | no | Default `50` |
| `special_data` | no | Map (`size` / `color` / `material`), or legacy `2|#C2B280`, or a bare material for BLOCK |
| `data` | no | PlayEffect `data:` number |
| `follow` | no | EffectLib only. Origin is the entity so the shape tracks them |
| `size` | no | BLOCK_CRACK search radius. Default `2`. Also EffectLib redstone size |
| `progress` | no | BLOCK_CRACK 1-10. Default `8` |
| `duration` | no | BLOCK_CRACK overlay, shake/bleed length, debris/drop lifetime |
| `amount` | no | SCREEN_SHAKE look nudge. Default `0.1` |
| `velocity` | no | BLOCK_EXPLOSION / DEBRIS fling, or particle velocity vector |
| `velocity_x` / `velocity_y` | no | DROP_BURST fling. Default `0.3` |
| `materials` | no | BLOCK_EXPLOSION / DEBRIS type list. Random per spawn. Else `material:` else the world block |
| `volume` | no | LIGHTNING replay volume. Default `3` |
| `effect_data` | no | Raw EffectLib map. Merged with the snake_case keys below |
| `particle` / `particles` / `color` / `iterations` / `period` / `radius` | no | Copied into `effect_data` |
| `x_equation` / `y_equation` / `z_equation` | for EQUATION | EffectLib `xEquation` etc. Quote YAML values that start with `-` or `#` |
| `relative_offset` | no | EffectLib `relative-offset` |
| `radius_increase` / `length_grow` / `angular_velocity` / `radius_grow` / `particles_cone` | no | Sphere / cone grow keys |
| `strands` / `curve` / `height` / `material` / `pitch` / `rotation` / `randomize` | no | Shape extras |
| `target` | no | Who. See [targeting.md](../targeting.md) |
| `origin` | no | AOE search center |
| `range` | no | LOOK / AOE |

`LINE` origin is the resolved location. The other end is context TARGET when that is an entity.

Named fruit-style bursts are Frontend `mechanic_effect_*` templates. `RUN_MECHANIC` them. Overlay quantity or color with `inherit:`.

```yaml
operations:
    1:
        type: PLAY_EFFECT
        target: SELF
        effect: DUST
        quantity: 20
        special_data:
            size: 1.5
            color: red
```

```yaml
operations:
    1:
        type: RUN_MECHANIC
        mechanic: mechanic_effect_equation_slash
```
