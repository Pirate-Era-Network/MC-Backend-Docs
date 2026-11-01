---
sidebar_position: 17
---

# Trade

**Live.** Shared 54 chest, ready handshake, swap, cancel return. Not a `gui: true` wiki PAGE. Convert-money in legacy `TradeSystem.dsc` is already Cost Component (`/withdraw`). Counts stay analytics. Who/what/when is Mongo `record_receipt` TRADE. YAML `/Trades/` is forbidden. See [receipts.md](receipts.md) and [analytics.md](analytics.md).

Harvest: invite clickable became `OPEN_TRADE` (session starts when the op runs). Ready slots 4/6. Soulbound block. 1m cooldown. No distance check in legacy. Crew-war `droppable` is a pack BOOLEAN plus `blocked_flags`, not a crew engine.

## Backend vs Frontend

| Layer | Owns |
| --- | --- |
| Backend | Session, shared chest, ready buttons, swap, cancel return, cooldown stamp, item flag cancel, live index |
| Frontend `global_trade_config` | `menu`, `cooldown`, `blocked_flags`. Omit `max_distance` for unlimited |
| Frontend `menu_trade` | Size, allowed slots, ready slots, separator/ready materials, `appearance` (title glyphs). `gui: false` |
| Frontend `appearance` | Same keys as other menus: `background`, `header`, `footer`, `header_text` (lowercase transcript). Optional `title:` skips the glyph stack |
| Frontend items | `soulbound: true` / `untradable: true` on Item Config |
| Frontend mechanics | Who to trade with (`target: LOOK`). Distance can also be a mechanic `BOOLEAN` |

## OPEN_TRADE

Task: `operation_open_trade`. Overlay `ENTITY`. Caster is player one. First other resolved player is the partner. Smoke: `mechanic_example_open_trade`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_TRADE` |
| `target` | no | Partner. Default targeting with ENTITY overlay. `LOOK` at a player |
| `menu` | no | Layout script. Default `global_trade_config.menu` (`menu_trade`) |
| `max_distance` | no | Blocks if farther. Omit here and in config for unlimited |

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_trade].data_key[data].get[look_partner]>
/packitem item_example_soulbound
/packitem item_example_untradable
/packtrade list
/packreceipt test
/packreceipt trade
```

A pack ships its own `menu_trade` (or a second script plus `OPEN_TRADE` `menu:`). Point `global_trade_config.menu` at that script. Cooldown, `blocked_flags`, and optional `max_distance` stay on `global_trade_config`.

`appearance` uses the same `gui_appearance` catalog as other menus (`pagebackground`, `mingo_light`, …). Do not invent a glyph. Overlay `header_text` stays lowercase.

## Item flags

`create_item_from_config` stamps `untradable` when the Item Config sets it true. Clicks that would put a listed `blocked_flags` item into the chest cancel. Taking your own items out is allowed.

## Admin

`/packtrade list` PAGE of live sessions. `clear` cancels all and returns items. `prune` drops ghost rows. `remove [id]` cancels one. Timed. Wipe on start and reload. Not restored.

Completed swaps write a TRADE receipt. `/packreceipt trade` (optional day or `player [name]`) is the staff history PAGE. Cancel writes nothing.

## What can go wrong

- Opening trade with `OPEN_MENU` or `gui: true`. That is a fakeitem GUI. Trade is a real shared chest. `appearance` only changes the title overlay.
- Expecting a Backend crew-war check. Put `untradable` on the item or gate the mechanic with a BOOLEAN.
- Putting a YAML receipt under `/Trades/`. Use analytics `trade.completed` plus item obtained/spent, and `/packreceipt` for the Mongo row.
- Restoring a trade chest after reboot. Leftover is cancelled like GPS.
