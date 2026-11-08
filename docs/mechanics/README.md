---
sidebar_position: 1
---

# Mechanics

**Partial.** A mechanic is a numbered `operations:` map. A skill, an item skill, a triggerable, or [RUN_MECHANIC](operations/run-mechanic.md) runs that map, and each number is one operation. An unknown `type` is ignored. An operation does not invent targeting. Who and where come from [targeting](targeting.md). Values, including duration and a `SET_STAT` `value`, go through `resolve_mechanic_value`. `MODIFY_STAT` `amount` may also be an event value key.

## Pages

- [Targeting](targeting.md)
- [Context](context.md)
- [Requirements](requirements.md)
- [Operations](operations/README.md). Spawn ops share [display and pulse](operations/display.md).

## Mechanic config (Frontend)

`type: data`. Operations is a **keyed map** (`1`, `2`, …). Denizen data scripts do not use a list of maps.

```yaml
some_mechanic:
    type: data
    data:
        delay: 0t
        repeat:
            amount: 1
            delay: 1t
        requirements:
            1:
                type: STAT
                stat: stat_stamina
                min: 1
        operations:
            1:
                type: PLAY_SOUND
                target: SELF
                target_type: LOCATION
                sound: BLOCK_NOTE_BLOCK_PLING
```

Examples live in `pirate-era-core-frontend/Mechanics/mechanic_examples.dsc`.

| Key | Status |
| --- | --- |
| `operations` | Live |
| `delay` | Live |
| `repeat.amount` / `repeat.delay` | Live |
| `requirements` | Live (see [requirements.md](requirements.md)) |
| `inherit` | Live (parent mechanic script name, see [inherit](operations/inherit.md)) |
| `duration` | Live (after inherit merge, stamps ops that omitted duration. Op duration wins. Omit means until cleanse or persist) |
| chance (scalable) | Missing |

The dispatcher is `handle_mechanic_operations` in `Mechanics/Core/mechanic_utils.dsc`. Production code builds a context with `build_mechanic_context`, then runs `run_mechanic_config`.

## Numbers in ops

Flat number, or a `stat_*` script name. Default source is the caster. See `mechanic_value_sources` in [rules](../rules/README.md). `MODIFY_STAT` `amount` may also be an event_values key (`damage`, `value`, …). Full Scalable Value Config (exp/log, min/max level on the op itself) is not wired for mechanics. Stat value_config linear math is used when you pass a `stat_*` ref.

## What can go wrong

- Writing `operations:` as a YAML list of maps. Use `1:`, `2:`.
- Copying target logic into a new op instead of `resolve_mechanic_operation_targets`.
- Hardcoding `SELF` or `LOCATION`. Read `get_rule_value`.
