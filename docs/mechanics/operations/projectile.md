---
sidebar_position: 35
---

# PROJECTILE

`PROJECTILE` moves a shot. Travel numbers live under `projectile:`, so `range` next to `target: LOOK` is not the travel distance. The default world entity is an `item_display` with scripted steps. A snowball is only for a vanilla projectile hit. `travel: LINE` is a beam with no entity. The pulse is a counted `repeat`. Entity choice for that display, and why a snowball is the exception, are on [Display and pulse](display.md). Knockback on hit is [APPLY_VELOCITY](apply-velocity.md) inside `hit`. A player dash is [DASH](dash.md). `invertible` only flags the shot. A recast that reverses it is a pack mechanic. `stay_alive_model` needs `stay_alive`, or the parked display is never spawned. Trails share the shot id. They are not their own index rows. Reload leaves leftovers on `/packprojectile list`. `prune` or `clear` removes them.

Task: `operation_projectile`. Nested Projectile Config (`projectile:`). Default world entity is `item_display` with scripted travel (`pushentity` harvest). Optional snowball for vanilla projectile physics. `travel: LINE` is `instantbeam` (one step per block of range, same tick unless `tickrate` is set). Pulse is `repeat`, never `while`.

`range` / `speed` belong under `projectile:` so they are not the LOOK targeting range. Start is `target` as a LOCATION (default SELF), then op `offset` (`left,up,forward`), then pack `start_height` (default `1`, `0` is feet). Facing is the caster look. `follow_pitch: false` zeros pitch at spawn only. `aimed: true` aims at caster look `forward[range]` even if spawn is offset (barrage). `y` lifts that destination. Snowball `height` > 0 is Shoot arc. `height` 0 is direct `speed`. `spread` is Shoot spread. `homing: true` locks a victim at spawn (LOOK, else a non-caster TARGET).

Visuals match `static_armorstand`. `model.rotation` / `pose` is spawn orientation. Root `rotation:` / `spin:` is per-pulse axis spin (`vector: 1,0,0` is X, like murakumogiri). `attached` extra displays teleport with the shot (`attached_spin` for their own axis). `controllable` steers with caster look. `invertible` flags the shot so a recast can set `projectile_inverted` (moves backward). `inverted: true` starts already reversed. `priority` removes other players' projectiles in 2 blocks. `bounce` is wall reflects (`true` = 1, or a count). `chain: true` uses `maxchain`. Barriers are noted areas with flag `projectile_barrier_flag` (`barrier`). Snapshot at spawn. A different set stops travel (`collision: NONE` skips this). `stay_alive` is linger duration (trail plus flying entity). `stay_alive_model` is the parked leftover display at the last point for that duration.

Live shots are indexed on `server.flag[projectile_index]` (one row per shot). Trails, attached models, and parked stay displays stamp the same `projectile_shot` id. Reload and start wipe them. Do not restore a shot after reboot. Admin: `/packprojectile list` opens `menu_projectile_list` (PAGE, remaining lifetime, leftover/ghost, teleport click). `/packprojectile prune` drops leftover, ghost, and orphans. `/packprojectile clear` removes every tracked shot.

Pack compose (not PROJECTILE keys): knockback and pushback are `hit` APPLY_VELOCITY. Sounds and particles are `loop` / `hit` / `end`. Pull-to-target is APPLY_VELOCITY GUIDE. Barrage amount/interval is mechanic `repeat`. End AOE is `end`. Venom-mob turrets are a later entity op, not this shot.

`loop` / `hit` / `end` are nested mechanic configs. `hit` sets context TARGET to the victim. All three set placeholder `projectile_end`. `source_type` is `PROJECTILE`.

| `travel` | What it does |
| --- | --- |
| `DISPLAY` (default) | Spawn `item_display`, teleport `speed` blocks per pulse until range, lifetime, solid, or pierce |
| `SNOWBALL` | Spawn snowball, `shoot` to the resolved end (`aimed` / `y`). `height` > 0 is arc. Else direct `speed`. Optional `spread`. Vanilla snowball damage is cancelled |
| `LINE` | No entity. `points_between` start and `start.forward[range]` (instantbeam). Default `tickrate` `0t` |

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `PROJECTILE` |
| `projectile` | no | Nested config. Overlay onto the op |
| `range` | no | Travel distance. Default `20`. Prefer under `projectile:` |
| `speed` | no | DISPLAY blocks per pulse (default `2`). SNOWBALL shoot speed (default `1.5` if omitted). LINE ignores it |
| `pierce` | no | Unique living hits before travel ends. Default `1`. `0` never ends from hits |
| `start_height` | no | Blocks above the resolved start. Default `1`. `0` skips |
| `aimed` | no | Destination is caster look `forward[range]`. Default `false` (spawn forward) |
| `y` | no | Extra up on the destination. Default `0`. Direct snowball lift without arc |
| `height` | no | Snowball Shoot arc height. Default `0` (direct). Do not use a tiny destination |
| `spread` | no | Snowball Shoot spread. Default `0` |
| `homing` | no | DISPLAY. Lock LOOK (not the caster) at spawn, then re-aim. Default `false` |
| `model` | no | Map: `item`, `scale`, `translation`, `type` (billboard), `rotation` (pose). Flattened if those keys are omitted at root |
| `scale` | no | Display scale. Default `1,1,1` |
| `translation` | no | Display translation. Default `0,0,0` |
| `billboard` | no | item_display `display=`. Default `fixed` |
| `pose` | no | Spawn orientation. `{axis` or `vector`, `degrees}` |
| `spin` | no | Per pulse. `{axis` or `vector`, `degrees}`. Root `rotation:` maps here |
| `trail` | no | Loopmodel. Map with `item`, `scale`, `skip` (default 3) |
| `attached` | no | Extra display maps glued to the shot. Legacy `attachedmodels` |
| `attached_spin` | no | Spin for attached. Map or list. Legacy `attachedmodelrotation` |
| `controllable` | no | DISPLAY follows caster look while within `range` |
| `invertible` | no | Flag the shot `projectile_invertible`. Recast sets `projectile_inverted` |
| `inverted` | no | Start already reversed. Default `false` |
| `priority` | no | Remove other casters' projectiles within 2 |
| `bounce` | no | Wall reflects. `true` or a count. Default `0` |
| `stay_alive` | no | After travel, keep displays and run `loop` on trail pieces |
| `stay_alive_model` | no | Parked leftover display at last location for `stay_alive`. Legacy `stayalivemodel` |
| `multi_hit` | no | Clear unique-hit list each pulse. Default `false` |
| `return` | no | DISPLAY flies back to the caster |
| `hit_on_return` | no | Wipe unique hits before return |
| `chain` | no | Extra DISPLAY segments toward the next living in range. Default `0` |
| `travel` | no | `DISPLAY` / `SNOWBALL` / `LINE` |
| `snowball` | no | `true` forces `SNOWBALL` (legacy `snowball:true`) |
| `collision` | no | `BOTH` (default), `ENTITIES`, `BLOCKS`, `NONE` |
| `item` | no | Display / snowball item. Material name or `item_*`. Default `snowball` |
| `hitbox` | no | Living search radius. Default `1` |
| `tickrate` | no | DISPLAY / SNOWBALL default `1t`. LINE default `0t` |
| `lifetime` | no | DISPLAY / SNOWBALL pulse cap. Default `15s`. Op `duration:` also sets this |
| `offset` | no | Start LOCATION vector `left,up,forward` (after `target`) |
| `follow_pitch` | no | Default `true`. `false` zeros pitch at spawn. Homing does not flatten pitch |
| `loop` | no | Mechanic each pulse at `projectile_end` |
| `hit` | no | Mechanic per new victim |
| `end` | no | Mechanic at last location after travel |
| `target` | no | Start location who-rule. Default SELF |

```yaml
operations:
    1:
        type: PROJECTILE
        target: SELF
        projectile:
            range: 20
            speed: 2
            pierce: 1
            travel: DISPLAY
            collision: BOTH
            item: snowball
        loop:
            operations:
                1:
                    type: PLAY_EFFECT
                    target: projectile_end
                    effect: CRIT
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
                    target: projectile_end
                    sound: ENTITY_ARROW_HIT
```

Smoke: `mechanic_example_projectile`.

```text
/packprojectile list
/packprojectile prune
/packprojectile clear
```

Harvest: `poisonpoison.dsc` hydra, `gomugomu.dsc` trail, `WanoWeapons.dsc` murakumogiri (`rotation.vector`, `attachedmodels`), `CyborgMenu.dsc` strongright (`chain`, `maxchain`, attached trail), `pushentity` (`controllable`, invert flag, attach teleport), `basicprojectileloop` (`priority`). Barriers: noted AreaObject plus `flag barrier` (`return_barriers`). Parked leftover: `stayalivemodel` / `stayalivetime`. Bounce is wall reflect (not a legacy projectile key). Pull and knockback stay other ops. Recast that *sets* invert is still a pack mechanic, not this op.
