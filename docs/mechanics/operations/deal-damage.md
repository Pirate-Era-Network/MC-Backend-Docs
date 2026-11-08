---
sidebar_position: 28
---

# DEAL_DAMAGE

`DEAL_DAMAGE` calls `deal_damage` on each resolved entity and skips the caster. `value` is the packet amount, as a number or a `stat_*`. `damage_type` defaults to `CUSTOM`. Use `ENTITY_ATTACK` when the hit should look like melee. `ability` feeds `ON_ABILITY_DAMAGE`. `crit` feeds `ON_CRIT`. This op is not a dual-wield engine. An offhand punch is Frontend `LOOK` with `range: 3`.

Task: `operation_deal_damage`. Calls `deal_damage` on each resolved entity. Not a dual-wield engine. Offhand punch is Frontend `LOOK` plus `range: 3`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `DEAL_DAMAGE` |
| `value` | yes | Packet amount. Number or `stat_*` |
| `damage_type` | no | Packet `type`. Default `CUSTOM`. Use `ENTITY_ATTACK` for melee-style events |
| `ability` | no | Feeds `ON_ABILITY_DAMAGE` |
| `crit` | no | Feeds `ON_CRIT` |
| `value_source` | no | `caster` or `target` when `value` is a `stat_*` |
| `target` | no | Who. Overlay `ENTITY`. Skips the caster |

Smoke: `self_deal_damage_look`. Offhand weapon: mechanic 2 on `triggerable_item_use_offhand`.
