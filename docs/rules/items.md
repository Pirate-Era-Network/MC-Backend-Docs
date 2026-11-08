---
sidebar_position: 6
---

# Items

Item flags, hands, grips, consume, and the global item config. How to write an item is [items](../items/README.md).

| Key | Role | Page |
| --- | --- | --- |
| `item_runtime_flags` | `item_script`, `level`, optional `item_tier` / `item_set` / `unvaultable` / `soulbound` / `untradable`, plus `currency_amount` / creator on withdraw coins | [items.md](../items/README.md), [currencies.md](../currencies.md), [vaults.md](../vaults.md), [trades.md](../trades.md) |
| `item_data_keys` | Display, skills, consume, grip, events, level, tier, set, durability, … | [items.md](../items/README.md) |
| `item_hand_slots` | `MAIN` / `OFFHAND` | [items.md](../items/README.md), [triggers.md](../triggers/README.md) |
| `item_swing_animations` | `ARM_SWING` / `ARM_SWING_OFFHAND` | [mechanics/operations.md](../mechanics/operations/README.md) |
| `item_grip_types` | `ONE_HANDED` / `TWO_HANDED` (pack data) | [items.md](../items/README.md) |
| `itemskill_data_keys` | Same envelope names as SkillMove, including `cost_payer` | [items.md](../items/README.md), [mounts.md](../mounts.md) |
| `item_consume_data_keys` | `cooldown` / `requirements` / `mechanics` / `take` | [items.md](../items/README.md) |
| `item_consume_cooldown_prefix` | `consume_` | [items.md](../items/README.md) |
| `global_item_data_keys` | `tiers` / `max_item_level` / `skill_slots` / `sets` | [items.md](../items/README.md) |
| `global_item_set_keys` | `needed_pieces` / `skills` | [items.md](../items/README.md) |
| `item_equipment_keys` | `slot` | [items.md](../items/README.md) |
| `vanilla_inventory_slots` | helmet 40 / chestplate 39 / leggings 38 / boots 37 | [items.md](../items/README.md), [cosmetics.md](../cosmetics.md) |
| `give_item_occupied_modes` | `DISPLACE` / `REPLACE` / `SKIP` | [mechanics/operations.md](../mechanics/operations/README.md) |
