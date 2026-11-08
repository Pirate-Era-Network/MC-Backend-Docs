---
sidebar_position: 20
---

# Loot

**Partial / Live resolver.** Prefixes `loottable_`, `lootpool_`, `lootentry_`, `lootcrate_`. Backend rolls those scripts and grants through `grant_loot_results`. Party split is not in this engine.

Files: `Loot/loot_utils.dsc`, `Loot/loot_grant.dsc`, `Loot/loot_crate.dsc`, `Loot/static_loot_world.dsc`, `Loot/static_loot_command.dsc`, `Loot/static_loot_index.dsc`. `/staticloot` is [commands/staticloot](commands/staticloot.md). Ops: `GRANT_LOOT`, `OPEN_LOOT_CRATE`, `TELEPORT`. Item category index: `Items/item_category_utils.dsc`.

Examples: `pirate-era-core-frontend/Loot/`

## How to fire

```text
/ex run loot_test def.loot_table:loottable_example
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_grant_loot]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_open_loot_crate]>
/packitem item_treasure_chest
```

`loot_test` narrates the grant maps then applies them. `GRANT_LOOT` applies only. `OPEN_LOOT_CRATE` opens the chest roll visual, then grants.

World container (not the GUI): look at a trapped chest or barrel.

```text
/staticloot bind loottable_example 5m
/staticloot bind loottable_example 5m player
/staticloot unbind
/staticloot list
```

## Nested rolls

`TABLE_REFERENCE` `referenceid` is another `loottable_*`. When that entry wins, the resolver rolls that table's pools (same as a top-level roll). That child table can reference another table or pool. Depth cap: `loot_table_reference_depth` (`8`).

`POOL_REFERENCE` is the same idea for a `lootpool_*`. It runs that pool's rolls and entries.

Smoke: `loottable_example` can hit `loottable_example_bonus`, which hits `loottable_example_deep` (`TEXT`: `nested loot ok` in chat, not an item). Crate GUI smoke is `loottable_example_crate` (hats, wand, nested wand).

## Loot table (`loottable_*`)

| Key | Status | Notes |
| --- | --- | --- |
| `requirements` | Live | Same maps as mechanic requirements. Caster is the loot recipient |
| `conditions` | Live | Alias of `requirements` if `requirements` is missing |
| `pools` | Live | List or keyed map of `lootpool_*` ids, or inline pool maps |

If table requirements fail, the table yields nothing.

## Loot pool (`lootpool_*`)

| Key | Status | Notes |
| --- | --- | --- |
| `rolls` | Live | How many weighted picks. Default `1` |
| `bonus_rolls` | Live | Extra picks (integer), or a map with `amount` plus optional `requirements` |
| `bonusrolls` | Live | Alias of `bonus_rolls` |
| `entries` | Live | Keyed map or list. Each row is a `lootentry_*` id, `{ entry: lootentry_* }`, or an inline entry map |
| `requirements` | Live | Skip the whole pool when they fail |

## Loot entry (`lootentry_*` or inline)

| Key | Status | Notes |
| --- | --- | --- |
| `type` | Live | `ITEM` `CURRENCY` `TABLE_REFERENCE` `POOL_REFERENCE` `ITEM_CATEGORY` `COMMAND` `TEXT` |
| `referenceid` | Live | Item/currency/table/pool script, category name, chat text, or command string (no slash) |
| `baseweight` | Live | Default `1`. Weight `<= 0` is skipped |
| `quantity` | Live | Integer, or `{ min: n, max: n }` |
| `weight_modifiers` / `weightmodifiers` | Live | Keyed rows. See below |
| `requirements` / `conditions` | Live | Skip this entry when they fail |
| `upgrades` | Live | Sequential. See below |
| `config` | Live | Unwrap one nested map (old FE shell) |

## Item categories

Item Config `categories:` is a list (`hat`). Reload builds `server.flag[item_categories]` once (`rebuild_item_category_index`). `list_items_in_category` / `pick_item_script_in_category` read that map. They do not scan every `item_*` on a roll.

`ITEM_CATEGORY` `referenceid: hat` becomes a normal `ITEM` grant with a random script from that list. Empty category yields nothing.

## WeightModifier

| Key | Notes |
| --- | --- |
| `mode` | `ADD_FLAT` `MULTIPLY_BASE` `SET_MIN` |
| `stat` | Effective level on the recipient. Missing level is `0` |
| `amount` | If present, used instead of the stat |
| `cap` | After this row, weight cannot exceed this |

Rows run in key order.

## LootUpgrade

Keyed sequential rows. Each may unwrap `config:`.

| Key | Notes |
| --- | --- |
| `requirements` | Must pass |
| `chance` | Same as Eventstat (`0` to `1`, or `0` to `100`) |
| `new_type` | Replaces `type` when the row hits |
| `new_referenceid` | Replaces `referenceid` when the row hits |

Later rows see the new type and id.

## Loot crate (`lootcrate_*`)

Harvested from `ClickableTreasureChests.dsc` (`PETreasurechestMenu`). Right click a **held** crate item opens a **27** chest. Colored stained glass fills every slot except **14**. Slot 14 cycles random rolls from the same table, then the pre-rolled winner. 20 frames, `5t` apart, wooden-button click. Then level-up, wait 1s, close. **Grant runs on close** (early close still pays). Nested tables are `resolve_loot_table`, not a `while`.

Not a menu-kind click page. Clicks are cancelled.

| Key | Notes |
| --- | --- |
| `table` | `loottable_*` to roll (pre-roll plus per-frame teasers) |
| `size` | `27` (legacy default) or `54` |
| `ticks` | Frames. Default `20` |
| `tickrate` | Wait between frames. Default `5t` |
| `highlight_slot` | Prize cell. Default `14` |
| `consume` | If true, take 1 from the held item when the GUI opens |
| `sound` | Per-frame. Default `BLOCK_WOODEN_BUTTON_CLICK_ON` |
| `sound_volume` | Default `3` |
| `finish_sound` | After the last frame. Default `ENTITY_PLAYER_LEVELUP` |
| `close_delay` | Wait before auto-close. Default `1s` |
| `title` | Stored. Inventory script title is `treasure chest` |

`filler_category` is unused for this GUI. Pane colors live in `loot_crate_pane_materials`.

Item bind: Item Config `loot_crate: lootcrate_example`. Triggerable `ON_ITEM_USE` plus `ITEM_HAS_LOOT_CRATE` plus `OPEN_LOOT_CRATE` (no `crate:` reads the held item). Smoke: `triggerable_loot_crate_item`, `item_treasure_chest`, table `loottable_example_crate`. Same job as legacy `commanddata: treasurechestdata` plus `loottable` on the item.

## World static loot (`/staticloot`)

Harvested from `ConquerServer/StaticEventSystem/staticlootables.dsc`. Tables themselves live under `ConquerServer/StaticLoot`. This is **not** the treasure-chest GUI.

Bind stores parent location flag `static_loot` (`table`, `cooldown`, `mode`). Allowed materials: `trapped_chest`, `barrel`. `/staticloot unbind` wipes the parent (including every player snapshot).

`/staticloot list` opens `menu_static_loot_list` (PAGE). Backend overlays `itemlist` from `server.flag[static_loot_index]`. Each row is world, xyz, table, mode, cooldown, and who opened this cycle (name plus remaining CD in PLAYER mode). Click closes the menu and teleports to that block. Chests bound before the index existed need a rebind to show up.

| Mode | Bind | Open |
| --- | --- | --- |
| `SHARED` | `/staticloot bind loottable_example 5m` or `... 5m shared` | Fills the **block** inventory. Location `cooleddown` for everyone. Vanilla chest opens. Same leftover for whoever opens next |
| `PLAYER` | `/staticloot bind loottable_example 5m player` | Cancels vanilla. Opens a virtual chest. Roll is per player uuid on that location. Another player gets their own roll |

`PLAYER` snapshot: `static_loot.players.<uuid>.contents` (slot map) and `static_loot.players.<uuid>.cooleddown` with `expire:`. Contents do not expire with the timer. Reopen during CD shows leftovers (close writes the virtual slots back). When that player's CD ends, the next open re-rolls and overwrites contents.

`ITEM` results go in the container (shared) or the virtual chest (player). `CURRENCY` / `TEXT` / `COMMAND` are skipped here. Table `rolls` replace legacy `fillstaticloot` with a random 3-6 extra picks.

## Grant

| Type | Action |
| --- | --- |
| `ITEM` | Cost Component GIVE (same as shops). Counts as item obtained |
| `CURRENCY` | `APPLY_TRANSACTION` GIVE path. Wallet or `ITEM` form stacks, from FE `form` |
| `TEXT` | `narrate` to the player |
| `COMMAND` | `execute as_player` with `referenceid` as the command |
| `TABLE_REFERENCE` / `POOL_REFERENCE` | Flattened into child rolls |
| `ITEM_CATEGORY` | Flattened into `ITEM` |

Non-players are skipped. Missing item/currency scripts are skipped.

## What can go wrong

- Using a YAML list of empty `conditions:` tags. Non-map rows are ignored. Use mechanic requirement maps.
- Expecting party split. That waits on social.
- `GRANT_LOOT` without `table:`. The op is a no-op.
- Nested tables deeper than 8. Further `TABLE_REFERENCE` / `POOL_REFERENCE` yields nothing.
- `ITEM_CATEGORY` before reload. The index is built in `reload_all_server_flags`.
- `COMMAND` as a Denizen task name. It is a player Minecraft/command string.
- Binding a crate GUI to a world chest. Held items use `OPEN_LOOT_CRATE`. World containers use `/staticloot` and fill the block inventory.
- Right clicking a `SHARED` static lootable on cooldown. The container still opens. It does not refill until location `cooleddown` expires.
- Expecting `PLAYER` mode to fill the real chest. It never does. Leftovers live on the location player snapshot.
- Putting extra items into the virtual chest. Close saves them on that snapshot. The next roll after CD wipes that map.
