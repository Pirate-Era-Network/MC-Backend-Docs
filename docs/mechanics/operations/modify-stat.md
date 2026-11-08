---
sidebar_position: 5
---

# MODIFY_STAT

`MODIFY_STAT` changes a consumable's current pool: a heal, a spend, or a fill. It skips a stat that has no `stat_consumable_config`, and it does not write the stat's level. A level change is [MODIFY_STAT_LEVEL](modify-stat-level.md) or [OVERLAY_STAT_LEVEL](overlay-stat-level.md). The op only writes entities, so a location rule such as `CURSOR` resolves to nobody. `ADD_PERCENT` takes a fraction. `0.25` is 25 percent of the reference, and `25` is twenty-five times that reference. Default `value_base` is `CURRENT`. Use `MAX` when the percent should be of the pool cap. An `amount` that names an event value is skipped when that value is empty.

Task: `operation_modify_stat`. Smoke: `mechanic_example_modify_stat` in `pirate-era-core-frontend/Mechanics/mechanic_examples.dsc`.

Consumable current only (heal / damage / fill). Skips stats that have no `stat_consumable_config`. Does not write levels.

This op always overlays `target_type` to `ENTITY`. Location-only rules (CURSOR) resolve to nobody. Targeting keys still go through `resolve_mechanic_operation_targets`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `MODIFY_STAT` |
| `stat` | yes | Consumable stat script name (`stat_stamina` or `stamina`) |
| `amount` | yes | Flat number, `stat_*` via `resolve_mechanic_value`, or a `mechanic_event_values` key (`damage`, `value`, …) |
| `stat_operation` | no | Default `ADD_FLAT`. Values from `mechanic_stat_operations` |
| `value_base` | no | Default `CURRENT`. `CURRENT` is the pool. `MAX` is the computed stat max. Used by `ADD_PERCENT` and `MULTIPLY` |
| `value_source` | no | `caster` or `target` when `amount` is a `stat_*` ref |
| `target` | no | Who. See [targeting.md](../targeting.md) |
| `origin` | no | AOE search center. Default CASTER |
| `range` | no | LOOK ray, or AOE radius around origin |
| `origin_range` | no | LOOK / CURSOR ray when those are origin |

`stat_operation` values (`rules.dsc` `mechanic_stat_operations`):

| Value | Result |
| --- | --- |
| `ADD_FLAT` | current + amount (negative amount is damage). Ignores `value_base` |
| `ADD_PERCENT` | current + reference * amount. `CURRENT`: 2 and `0.5` gives 1. `MAX`: max 20 and `0.5` gives 10 |
| `MULTIPLY` | reference * amount |
| `SET` | amount. Ignores `value_base` |

Unknown `stat_operation` skips the write. Clamp (floor `depletes_to`, cap the computed stat max) happens inside `set_consumable_stat_value`.

Full Scalable Value Config (base/max/minLevel/maxLevel/equation on the op) is not wired. Use a number, a `stat_*` ref, or an event value key.

```yaml
self_heal_stamina:
    operations:
        1:
            type: MODIFY_STAT
            target: SELF
            stat: stat_stamina
            stat_operation: ADD_FLAT
            amount: 5
```

Percent of max (current 2, max 20, amount `0.5` restores 10):

```yaml
self_heal_stamina_percent_max:
    operations:
        1:
            type: MODIFY_STAT
            target: SELF
            stat: stat_stamina
            stat_operation: ADD_PERCENT
            value_base: MAX
            amount: 0.5
```

Check `/stats` for `Currently` on stamina.
