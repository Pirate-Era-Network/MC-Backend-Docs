---
sidebar_position: 30
---

# Menus

**Live** for open, click, close, footer fakeitems, packet cancel, kinds, `OPEN_MENU`, `CLOSE_MENU`, `OPEN_CONFIRM`, `OPEN_DIALOGUE`, and `OPEN_TYPING`.

Prefix: `menu_`. Player-facing configs live in Frontend. Glyph letters and pack ids live in `gui_appearance`. Backend assembles the title and runs kind behavior.

There is one click/close dispatcher. Do not add a world handler per menu. Player chat is not a UI. Do not add `on player chats` for confirm, deny, buy, or typed text.

## Files

| Piece | Path |
| --- | --- |
| Prefix, kinds, runtime flags | [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc) |
| Getters and setters | [utils/menu_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/utils/menu_utils.dsc) |
| Title layers and offsets | [utils/menu_title_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/utils/menu_title_utils.dsc) |
| Merge, chest fill, footer fakeitems, open/click/close | [utils/menu_load_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/utils/menu_load_utils.dsc) |
| Kind fill and kind_action | [Menus/menu_kind_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Menus/menu_kind_utils.dsc) plus `menu_kind_<kind>.dsc` per kind |
| Click / drag / close / packet cancel | [Menus/menu_handler.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Menus/menu_handler.dsc) (`engine_menu` chest script plus events) |
| Ops | open_menu, close_menu, open_confirm, open_dialogue, open_typing under `Mechanics/Individual_operations/` |
| Pack catalog | `pirate-era-core-frontend/Menus/gui_appearance.dsc` |
| Kind shells | `pirate-era-core-frontend/Menus/menu_kind_templates.dsc` |
| Smoke | `pirate-era-core-frontend/Menus/menu_examples.dsc` |

## Title contract

Layer order matches the updated Core/Menus engine:

1. Background font plus `=` plus catalog letter
2. Header font plus `=` plus catalog letter
3. Footer font plus `=` plus catalog letter
4. Optional alphabet font plus offset helper plus header text

Offset helper: `=` is -10, space is +10, `_` is -1, `!` is +1. Pack-specific pads (`+b`, `****`, underscore runs) live under `gui_appearance.offsets`.

If `data.title` is set, that parsed string wins and skips the shader stack. Prefer `appearance` for real menus.

## Footer and packets

The chest is the `engine_menu` inventory script (CHEST, size 54), same pattern as legacy `pirate_era_main_menu`. Load adjusts its title and reopens that inventory. It is not `note`d and it is not flagged. Current menu data lives on the player.

Footer icons are `fakeitem` on the player inventory (`menu_footer_slot_count`, 36). Chest icons are also faked at `slot + menu_footer_slot_count` so a cancelled packet does not blank them.

While a menu is open the player has `menu_runtime_flags.fake_inventory`. `Menus/menu_handler.dsc` cancels `on player receives packet class:ClientboundContainerSetContentPacket` (priority -30, bukkit LOWEST). That class name is a Denizen event literal. It cannot be read from `rules.dsc`.

On close: clear the fakeinventory flag, then `inventory update` if the player is still online and spawned.

Clicks are `on player clicks in engine_menu` (including footer raw slots above 54). Cursor is cleared to air. Footer items are restored from `menu_runtime_flags.current_footer`.

## Kinds

`kind` is a `menu_kinds` value. Unknown kind is GENERIC. Backend merges `menu_kind_templates` first, then `merge_with`, then the menu itself. `kind` already pulls the template. Do not also list that template in `merge_with`.

| Kind | Job |
| --- | --- |
| GENERIC | Slots and footer_slots as written |
| DECISION | Yes slot 21, no slot 25, return slot 9. Used by `OPEN_CONFIRM` |
| DIALOGUE | NPC glyph plus wrapped lines in the title. Next/prev/close buttons. Used by `OPEN_DIALOGUE` |
| TYPING | In-chest QWERTY. Confirm writes `event_values.text`. Used by `OPEN_TYPING` |
| PAGE | 54 items per page from `itemlist`. `open_menu_for_target` `config_overlay` can replace `itemlist` (static loot list, hologram list, season pass track, spray equip, spray admin list, player wiki categories) |
| SCROLL | Fat (3 boxes, 2 slots high) or slim (6). Optional `quest_box` or `npc` title extras |
| SELECTION | Carousel slots 20/23/26 plus a 3-wide select button |
| SKILLTREE | Same title stack, skilltree background. No editor save path |

`scroll_list` and `orderlist` are numbered maps (`1:`, `2:`), same as `slots` and `operations`. Do not use YAML list dashes.

Kind-internal buttons use `kind_action` (slot key and/or item flag `menu_kind_action`). Values are `menu_kind_actions` in rules. Those are not inject task names.

## Menu Config (Frontend)

`type: data`. Script name starts with `menu_`. Keys sit under `data:`.

```yaml
menu_example_hub:
    type: data
    data:
        id: example_hub
        kind: GENERIC
        size: 54
        gui: true
        appearance:
            background: generic
            header: mingo_light
            footer: generic
            header_text: Example Hub
        slots:
            11:
                item: item_belly_coin
                click: ANY
                mechanics:
                    operations:
                        1:
                            type: OPEN_MENU
                            menu: menu_example_page
                            target: SELF
```

| Key | Required | Notes |
| --- | --- | --- |
| `id` | no | Same id + reload does not rerun `on_close` (title/typing refresh) |
| `kind` | no | Default GENERIC |
| `merge_with` | no | Extra data scripts merged before this menu |
| `appearance` | no | background, header, footer, header_text, header_text_offset (pixels, default `gui_appearance.offsets.header_text`), plus kind extras |
| `title` | no | Parsed override. Skips the shader stack |
| `size` | no | Default 54. Allowed: 9, 18, 27, 36, 45, 54 |
| `gui` | no | Documentation. Clicks and drags always cancel |
| `slots` | no | Keyed map. Slot numbers 1 through size |
| `footer_slots` | no | Keyed map. Footer data slots 1-36 (27-36 are the hotbar row) |
| `on_open` | no | Mechanic map after fill |
| `on_close` | no | Mechanic map on real close. Not on title reload |
| `previous_menu` | no | Return button / typing confirm target |

Each slot or footer slot:

| Key | Required | Notes |
| --- | --- | --- |
| `item` | no | Item script name, or an inline map with `display` like [items.md](items.md) |
| `click` | no | `LEFT` `RIGHT` `SHIFT` `ANY`. Default `ANY` |
| `mechanics` | no | Inline mechanic config. Put `requirements` on this map, not as a slot sibling |
| `kind_action` | no | Backend kind button. See `menu_kind_actions` |

Slot Mechanics use `source_type` `MENU` and `source_id` as the menu script name. `event_values` include `slot`, `click`, `item`, and `text` when typing confirms.

Opening another menu while one is open runs the old `on_close` first, then opens the new chest. The close event from that swap is ignored so `on_close` does not run twice.

## Runtime flags

Not in `flag_saves`. Do not persist them. Writes go through `set_menu_runtime_flag` / the open-menu setters.

| rules key | Path | Meaning |
| --- | --- | --- |
| `open_menu` | `runtime_data.menu.open_menu` | Current menu script name |
| `ignore_close` | `runtime_data.menu.ignore_close` | Set briefly when swapping menus |
| `fake_inventory` | `runtime_data.menu.fake_inventory` | Packet cancel guard |
| `current_config` | `runtime_data.menu.current_config` | Merged map in use |
| `current_footer` | `runtime_data.menu.current_footer` | Footer ItemTags by footer slot |
| `kind_state` | `runtime_data.menu.kind` | Parent for per-open kind flags. Close clears this once. |
| `confirm_payload` | `runtime_data.menu.kind.confirm_payload` | OPEN_CONFIRM yes/no maps |
| `dialogue_page` | `runtime_data.menu.kind.dialogue_page` | Dialogue page index |
| `typing_text` | `runtime_data.menu.kind.typing_text` | Character list |
| `typing_caps` | `runtime_data.menu.kind.typing_caps` | Caps lock |
| `typing_history_index` | `runtime_data.menu.kind.typing_history_index` | History cursor |
| `page_index` / `page_items` | `runtime_data.menu.kind.page_*` | Current page and itemlist |
| `scroll_index` | `runtime_data.menu.kind.scroll_index` | Window start |
| `selection_item` / `selection_index` | `runtime_data.menu.kind.selection_*` | Middle item and order index |
| `typing_history` | `runtime_data.menu.typing_history` | Last confirmed strings. Sibling of `kind`, so close does not wipe it. |

Expire: `menu_runtime_flag_expire` (`1h`).

## How to open

```text
/ex run open_menu_test def.menu_script:menu_example_hub
/ex run open_menu_test def.menu_script:menu_example_cosmetics
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_menu].data_key[data].get[open_hub]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_menu].data_key[data].get[open_cosmetics]>
```

Production code uses `OPEN_MENU`, `OPEN_CONFIRM`, `OPEN_DIALOGUE`, `OPEN_TYPING`, `OPEN_WIKI_MENU`, or `run open_menu_for_target`. Item storage is `OPEN_STORAGE`, not a menu kind. See [vaults.md](vaults.md). Player-to-player item swap is `OPEN_TRADE`, not a PAGE wiki. See [trades.md](trades.md). Player wiki: [wiki.md](wiki.md).

## What can go wrong

- Naming the script without `menu_`. Reload will not list it under `server.flag[scripts.menu_]`
- Writing `slots` as a YAML list of maps. Use `11:`, `13:`
- Putting a task name on the item flag and injecting it. Clicks must be `mechanics:` or `kind_action`
- Confirming or typing in chat
- Hardcoding pack glyph letters in Backend. Change letters in `gui_appearance`
- Skipping packet cancel. Footer fakeitems will wipe into the real inventory
- Flagging a generic (un-noted) inventory. Use the `engine_menu` script chest
- Using size `30`. The shell is 54
- Expecting `OPEN_MENU` to hit a block (`CURSOR`). The op overlays `target_type` `ENTITY`
- Listing the kind template in `merge_with` as well as `kind`. You merge it twice
