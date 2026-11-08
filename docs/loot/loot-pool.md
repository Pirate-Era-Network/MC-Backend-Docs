---
sidebar_position: 3
---

# Loot pool

A `lootpool_` is one weighted draw inside a table. `rolls` is how many picks. Default is `1`. Failed pool requirements skip the whole pool.

| Key | Status | Notes |
| --- | --- | --- |
| `rolls` | Live | How many weighted picks. Default `1` |
| `bonus_rolls` | Live | Extra picks (integer), or a map with `amount` plus optional `requirements` |
| `bonusrolls` | Live | Alias of `bonus_rolls` |
| `entries` | Live | Keyed map or list. Each row is a `lootentry_*` id, `{ entry: lootentry_* }`, or an inline entry map |
| `requirements` | Live | Skip the whole pool when they fail |

What an entry contains, including weight and upgrades, is on [Loot entry](loot-entry.md).
