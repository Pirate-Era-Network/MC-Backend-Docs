---
sidebar_position: 1
slug: /loot
---

# Loot

A roll starts at a `loottable_` and walks that table's pools. When a `TABLE_REFERENCE` wins, the resolver rolls that other table the same way, including its own references. A `POOL_REFERENCE` runs one `lootpool_` instead of a whole table. The chain stops at `loot_table_reference_depth` (8). A deeper reference yields nothing. Party split is not in this engine.

Prefixes: `loottable_`, `lootpool_`, `lootentry_`, `lootcrate_`. Grant goes through `grant_loot_results`. Examples: `pirate-era-core-frontend/Loot/`.

Files: `Loot/loot_utils.dsc`, `Loot/loot_grant.dsc`, `Loot/loot_crate.dsc`, `Loot/static_loot_world.dsc`, `Loot/static_loot_command.dsc`, `Loot/static_loot_index.dsc`. Item category index: `Items/item_category_utils.dsc`.

- [Loot table](loot-table.md)
- [Loot pool](loot-pool.md)
- [Loot entry](loot-entry.md) (weight and upgrades live here)
- [Loot crate](loot-crate.md)
- [World static loot](static-loot.md)

`GRANT_LOOT` applies a table. `OPEN_LOOT_CRATE` plays the chest, then grants. A world chest or barrel is `/staticloot`, not the crate GUI.

## What can go wrong

- Expecting party split. That waits on social.
- Nested tables deeper than 8. Further `TABLE_REFERENCE` or `POOL_REFERENCE` yields nothing.
- `GRANT_LOOT` without `table:`. The op does nothing.
- Binding a crate GUI to a world chest. Held items use `OPEN_LOOT_CRATE`. World containers use [static loot](static-loot.md).
