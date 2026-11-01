---
sidebar_position: 2
---

# Mechanic targeting

Every effect-operation calls `resolve_mechanic_operation_targets`. PLAY_SOUND and MODIFY_STAT smoke: `pirate-era-core-frontend/Mechanics/mechanic_examples.dsc`.

MODIFY_STAT overlays `target_type` to `ENTITY` before that call. It never writes to a location.

There are two axes. **target** is who or what the op hits. **origin** is where AOE searches from. They are not the same thing.

Legacy `basicaoe` did this too: a `location` (center) plus `get_targets_in_area` around that location. A projectile end mechanic passed its impact point as that location. We keep that split.

## Operation keys

| Key | Default | Meaning |
| --- | --- | --- |
| `target` | `SELF` | Who or what. A who-rule, or a placeholder name |
| `origin` | `CASTER` | AOE search center only. Ignored for SELF / TARGET / LOOK / CURSOR |
| `target_type` | `LOCATION` | `ENTITY` or `LOCATION` |
| `range` | see below | LOOK / CURSOR ray, or AOE radius around origin |
| `origin_range` | look `50` / cursor `200` | LOOK / CURSOR ray when those are **origin**. Does not change AOE radius |
| `offset` | `0,0,0` | Relative `(left,up,forward)` on **locations** |

## Who (`target`, `mechanic_target_rules`)

| `target` | Meaning |
| --- | --- |
| `SELF` | The caster |
| `TARGET` | Context `targets` list. Filled by the initiator (skill, projectile hit, `/ex def.targets`). **Not** your cursor. `/ex` defaults this list to you |
| `LOOK` | Entity in the caster's crosshair (`PlayerTag.target.within`). `range` is max distance (default `50`). Empty if none |
| `CURSOR` | Block the caster is looking at (`EntityTag.cursor_on`). `range` is max distance (default `200`). ENTITY resolves to nothing. LOCATION is that block |
| `AOE_ENEMY` / `AOE_ALLIES` / `AOE_ALL` | Living entities within `range` of **origin**, excluding the caster |

AOE names are the future filter. Right now every AOE_* is "all living except caster". Party / enemy / ally comes later. Do not fake factions. Entities with a `untargetable` overlay are omitted from LOOK and AOE. Vanilla mobs also cannot acquire that entity (`on entity targets` cancelled, existing chase dropped). Explicit `TARGET` lists are not filtered. See [control-effects.md](../control-effects.md).

## Where AOE searches (`origin`, `mechanic_origin_rules`)

Only used when `target` is AOE_*.

| `origin` | Center of the search |
| --- | --- |
| `CASTER` | Caster's feet (default). Slam-at-yourself |
| `TARGET` | Primary context target (entity location or a raw Location the initiator passed) |
| `LOOK` | Location of the look-at entity. `origin_range` is the look ray |
| `CURSOR` | Look-at block. Click / ground slam. `origin_range` is the cursor ray |
| any other key | Context placeholder, e.g. `projectile_end` or `dash_end`. The projectile / dash op puts that Location on context when it fires `loop` / `hit` / `end` |

Example: explode around a projectile impact.

```yaml
target: AOE_ENEMY
origin: projectile_end
range: 8
target_type: LOCATION
```

The initiator must pass `placeholders.projectile_end`. The mechanic does not guess. `PROJECTILE` writes that key when it fires `loop` / `hit` / `end`. `DASH` writes `dash_end` the same way. `SPAWN_NOTABLE` writes `notable_center`, and `loop` also writes `notable_shell` as a list of Locations.

## Placeholders as `target`

If `target` is not a who-rule, it is a location/entity name: `caster_location`, `target_location`, or a custom key (`projectile_end`, `dash_end`, `notable_center`, `notable_shell`). Same placeholder map as origin. A placeholder that is a List of Locations expands to every entry (shell dust).

## Test helpers

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_sound].data_key[data].get[self_sound]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_sound].data_key[data].get[look_entity_sound]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_sound].data_key[data].get[cursor_location_sound]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_sound].data_key[data].get[aoe_at_cursor_sound]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_sound].data_key[data].get[aoe_at_projectile_end_sound]> def.placeholders:<map[projectile_end=<player.cursor_on>]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_modify_stat].data_key[data].get[self_heal_stamina]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_sound].data_key[data].get[target_entity_sound]> def.targets:<npc>
```

`/ex run run_mechanic_test def.mechanic_config:<script[mechanic_stun].data_key[data]>` hits you. Templates use `TARGET`, not `SELF`. Smoke keys like `self_apply_stun` overlay `SELF` so they still work if TARGET is empty.

## What can go wrong

- Running a `target: TARGET` template and expecting SELF. The test helper now defaults TARGET to you. Production still needs an initiator-filled list.
- Treating `TARGET` as cursor. Use `LOOK` or `CURSOR`.
- Treating `AOE_ENEMY` as "the enemy is the center". The center is `origin`. The found entities are who get hit.
- Omitting `target_type` when you wanted the entity. Default is LOCATION.
- `origin: projectile_end` with no placeholder. AOE finds nobody.
- `origin: dash_end` with no placeholder. Same miss unless `DASH` fired the mechanic.
- Adding a new who/origin word only in an op. Add it to `rules.dsc` and this page.
