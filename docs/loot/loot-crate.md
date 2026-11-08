---
sidebar_position: 5
---

# Loot crate

A `lootcrate_` is the held-item chest, harvested from `ClickableTreasureChests.dsc` (`PETreasurechestMenu`). Right click a held crate item opens a 27 chest. Colored stained glass fills every slot except 14. Slot 14 cycles random rolls from the same table, then the pre-rolled winner. 20 frames, `5t` apart, wooden-button click. Then level-up, wait 1s, close. Grant runs on close. An early close still pays. Nested tables use `resolve_loot_table`.

This is not a menu-kind click page. Clicks are cancelled. It is not a world chest. World containers are [static loot](static-loot.md).

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

Item bind: Item Config `loot_crate: lootcrate_example`. The triggerable is `ON_ITEM_USE` plus `ITEM_HAS_LOOT_CRATE` plus `OPEN_LOOT_CRATE` (no `crate:` reads the held item). Examples: `triggerable_loot_crate_item`, `item_treasure_chest`, table `loottable_example_crate`.
