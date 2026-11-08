---
sidebar_position: 4
---

# Loot entry

A `lootentry_` (or an inline map on a pool) is one weighted outcome. Weight `<= 0` is skipped. Default weight is `1`. Failed entry requirements skip that row.

| Key | Status | Notes |
| --- | --- | --- |
| `type` | Live | `ITEM` `CURRENCY` `TABLE_REFERENCE` `POOL_REFERENCE` `ITEM_CATEGORY` `COMMAND` `TEXT` |
| `referenceid` | Live | Item, currency, table, or pool script, category name, chat text, or command string (no slash) |
| `baseweight` | Live | Default `1`. Weight `<= 0` is skipped |
| `quantity` | Live | Integer, or `{ min: n, max: n }` |
| `weight_modifiers` / `weightmodifiers` | Live | Keyed rows. See Weight |
| `requirements` / `conditions` | Live | Skip this entry when they fail |
| `upgrades` | Live | Sequential. See Upgrade |
| `config` | Live | Unwrap one nested map (old Frontend shell) |

`COMMAND` is a Minecraft command string run as the player. It is not a Denizen task name.

## Weight

Rows run in key order. `stat` is the effective level on the recipient. A missing level is `0`. If `amount` is set, it is used instead of the stat. After a row, weight cannot exceed `cap`.

| Key | Notes |
| --- | --- |
| `mode` | `ADD_FLAT` `MULTIPLY_BASE` `SET_MIN` |
| `stat` | Effective level on the recipient. Missing level is `0` |
| `amount` | If present, used instead of the stat |
| `cap` | After this row, weight cannot exceed this |

## Upgrade

Keyed sequential rows. Each may unwrap `config:`. Later rows see the new type and id.

| Key | Notes |
| --- | --- |
| `requirements` | Must pass |
| `chance` | Same as Eventstat (`0` to `1`, or `0` to `100`) |
| `new_type` | Replaces `type` when the row hits |
| `new_referenceid` | Replaces `referenceid` when the row hits |

## Item categories

Item Config `categories:` is a list (`hat`). Reload builds `server.flag[item_categories]` once (`rebuild_item_category_index`). `list_items_in_category` and `pick_item_script_in_category` read that map. They do not scan every `item_*` on a roll.

`ITEM_CATEGORY` with `referenceid: hat` becomes a normal `ITEM` grant of a random script from that list. An empty category yields nothing. The index is built in `reload_all_server_flags`, so a category added in the same session is empty until reload.

## Grant

| Type | Action |
| --- | --- |
| `ITEM` | Cost Component GIVE (same as shops). Counts as item obtained |
| `CURRENCY` | `APPLY_TRANSACTION` GIVE path. Wallet or `ITEM` form stacks, from Frontend `form` |
| `TEXT` | `narrate` to the player |
| `COMMAND` | `execute as_player` with `referenceid` as the command |
| `TABLE_REFERENCE` / `POOL_REFERENCE` | Flattened into child rolls. Depth cap is on [Loot](README.md) |
| `ITEM_CATEGORY` | Flattened into `ITEM` |

Non-players are skipped. Missing item or currency scripts are skipped. The nested roll itself is on [Loot](README.md).
