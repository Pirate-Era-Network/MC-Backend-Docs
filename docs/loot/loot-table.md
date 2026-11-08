---
sidebar_position: 2
---

# Loot table

Write a `loottable_` when a roll should check requirements once, then pick from one or more pools. If the table requirements fail, the table yields nothing.

| Key | Status | Notes |
| --- | --- | --- |
| `requirements` | Live | Same maps as mechanic requirements. Caster is the loot recipient |
| `conditions` | Live | Alias of `requirements` if `requirements` is missing |
| `pools` | Live | List or keyed map of `lootpool_*` ids, or inline pool maps |

A pool's own rolls are on [Loot pool](loot-pool.md). Nested tables and the depth cap are on [Loot](README.md).

Using a YAML list of empty `conditions:` tags drops those rows. Non-map rows are ignored. Use mechanic requirement maps.
