---
sidebar_position: 5
---

# Mechanics

Shared `mechanic_*` keys: context, targeting, requirements, inherit, value bases, source types, event values, and the default AOE range. How a mechanic runs is [mechanics](../mechanics/README.md).

| Key | Role | Page |
| --- | --- | --- |
| `mechanic_context` | Context map field names | [mechanics/context.md](../mechanics/context.md) |
| `mechanic_placeholder_locations` | Built-in location names | [mechanics/targeting.md](../mechanics/targeting.md) |
| `mechanic_target_rules` | SELF / TARGET / AOE_* | [mechanics/targeting.md](../mechanics/targeting.md) |
| `mechanic_value_sources` | caster / target for stat numbers and requirement `source` | [mechanics/README.md](../mechanics/README.md), [mechanics/requirements.md](../mechanics/requirements.md) |
| `mechanic_target_types` | ENTITY / LOCATION | [mechanics/targeting.md](../mechanics/targeting.md) |
| `mechanic_requirement_types` | STAT / HEALTH / IN_WATER / IN_AIR / GROUNDED / IN_AREA / HAS_STATUS_EFFECT / FLAG / BOOLEAN / ITEM_IN_HAND_LEVEL / ITEM_HAS_SKILLS / ITEM_HAS_LOOT_CRATE / ITEM_HAS_CONSUME / SNEAKING / MOUNTED / MOUNT_ROLE / MOUNT_LOCOMOTION | [mechanics/requirements.md](../mechanics/requirements.md) |
| `mechanic_requirement_status_modes` | HAS / NOT | [mechanics/requirements.md](../mechanics/requirements.md) |
| `mechanic_requirement_water_materials` | Block names that count as in-water | [mechanics/requirements.md](../mechanics/requirements.md) |
| `mechanic_inherit_keys` | `inherit` / `duration` | [mechanics/operations.md](../mechanics/operations/README.md) |
| `mechanic_stat_value_bases` | CURRENT / MAX | [mechanics/operations.md](../mechanics/operations/README.md) |
| `mechanic_default_aoe_range` | Default `6` if op omits `range` | [mechanics/targeting.md](../mechanics/targeting.md) |
| `mechanic_event_values` | Common event_values keys | [mechanics/context.md](../mechanics/context.md) |
| `mechanic_source_types` | Who fired the mechanic | [mechanics/context.md](../mechanics/context.md) |
