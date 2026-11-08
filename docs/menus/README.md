---
sidebar_position: 1
slug: /menus
---

# Menus

A menu is a `menu_` script that fills one chest. There is one click and close dispatcher. Do not add a world handler per menu. Player chat is not the confirm, deny, buy, or typing input. Those answers are slot clicks inside the chest. `kind` already merges that kind's template, so `merge_with` does not list the template again.

Glyph letters and pack ids live in `gui_appearance`. Backend assembles the title and runs the kind. Player-facing configs live in Frontend. Examples: `pirate-era-core-frontend/Menus/menu_examples.dsc`.

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

## Title contract

Layer order:

1. Background font plus `=` plus catalog letter
2. Header font plus `=` plus catalog letter
3. Footer font plus `=` plus catalog letter
4. Optional alphabet font plus offset helper plus header text

Offset helper: `=` is -10, space is +10, `_` is -1, `!` is +1. Pack-specific pads (`+b`, `****`, underscore runs) live under `gui_appearance.offsets`.

If `data.title` is set, that parsed string wins and skips the shader stack. Prefer `appearance` for real menus. Custom-font header text stays lowercase.

## Footer and packets

The chest is the `engine_menu` inventory script (CHEST, size 54), same pattern as legacy `pirate_era_main_menu`. Load adjusts its title and reopens that inventory. It is not `note`d and it is not flagged. Current menu data lives on the player.

Footer icons are `fakeitem` on the player inventory (`menu_footer_slot_count`, 36). Chest icons are also faked at `slot + menu_footer_slot_count` so a cancelled packet does not blank them.

While a menu is open the player has `menu_runtime_flags.fake_inventory`. `Menus/menu_handler.dsc` cancels `on player receives packet class:ClientboundContainerSetContentPacket` (priority -30, bukkit LOWEST). That class name is a Denizen event literal. It cannot be read from `rules.dsc`.

On close: clear the fakeinventory flag, then `inventory update` if the player is still online and spawned.

Clicks are `on player clicks in engine_menu` (including footer raw slots above 54). Cursor is cleared to air. Footer items are restored from `menu_runtime_flags.current_footer`.

## Kinds

Unknown `kind` is [GENERIC](kinds/generic.md). Each kind below adds the slots or buttons that kind owns. Shared slot keys stay on this page.

- [GENERIC](kinds/generic.md)
- [DECISION](kinds/decision.md)
- [DIALOGUE](kinds/dialogue.md)
- [TYPING](kinds/typing.md)
- [PAGE](kinds/page.md)
- [SCROLL](kinds/scroll.md)
- [SELECTION](kinds/selection.md)
- [SKILLTREE](kinds/skilltree.md)

`slots`, `footer_slots`, and kind lists such as `scroll_list` are numbered maps (`1:`, `11:`). Do not use a YAML list of maps.

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
            header_text: example hub
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
| `kind` | no | Default GENERIC. See the kind pages |
| `merge_with` | no | Extra data scripts merged before this menu. Do not repeat the kind template |
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
| `item` | no | Item script name, or an inline map with `display` like [items](../items/README.md) |
| `click` | no | `LEFT` `RIGHT` `SHIFT` `ANY`. Default `ANY` |
| `mechanics` | no | Inline mechanic config. Put `requirements` on this map, not as a slot sibling |
| `kind_action` | no | Backend kind button. See `menu_kind_actions` |

Slot Mechanics use `source_type` `MENU` and `source_id` as the menu script name. `event_values` include `slot`, `click`, `item`, and `text` when typing confirms.

Opening another menu while one is open runs the old `on_close` first, then opens the new chest. The close event from that swap is ignored so `on_close` does not run twice.

Production code uses `OPEN_MENU`, `OPEN_CONFIRM`, `OPEN_DIALOGUE`, `OPEN_TYPING`, `OPEN_WIKI_MENU`, or `run open_menu_for_target`. Item storage is `OPEN_STORAGE`, not a menu kind. See [vaults](../vaults.md). Player-to-player item swap is `OPEN_TRADE`. See [trades](../trades.md). Player wiki: [wiki](../wiki.md).

## Runtime flags

Not in `flag_saves`. Do not persist them. Writes go through `set_menu_runtime_flag` and the open-menu setters. Kind pages name the flags that kind adds. Close clears `runtime_data.menu.kind` once. Typing history is a sibling of `kind`, so close does not wipe it.

| rules key | Path | Meaning |
| --- | --- | --- |
| `open_menu` | `runtime_data.menu.open_menu` | Current menu script name |
| `ignore_close` | `runtime_data.menu.ignore_close` | Set briefly when swapping menus |
| `fake_inventory` | `runtime_data.menu.fake_inventory` | Packet cancel guard |
| `current_config` | `runtime_data.menu.current_config` | Merged map in use |
| `current_footer` | `runtime_data.menu.current_footer` | Footer ItemTags by footer slot |
| `kind_state` | `runtime_data.menu.kind` | Parent for per-open kind flags |

Expire: `menu_runtime_flag_expire` (`1h`).

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
