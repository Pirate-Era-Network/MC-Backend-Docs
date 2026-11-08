---
sidebar_position: 10
---

# /packitem

Gives a pack Item Config to a player. Ops and the console can run it. A linked player must be op.

## System

The item is built with `create_item_from_config` for the receiver, then given with `give_target_item_from_config`. That is the same give path mechanics use. Display name and lore follow the receiver's language.

| Piece | Where |
| --- | --- |
| Command | [Items/item_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Items/item_command.dsc) |
| Option catalog | [items](../items.md) |

## Use

```text
/packitem
/packitem <item> (quantity) (player)
```

No arguments lists every registered `item_*` script.

`item` is the script name with or without the `item_` prefix. `quantity` defaults to 1. When the second argument is a player name, quantity stays 1 and that player receives the item. Otherwise the second argument is the quantity and the third is the player. A missing player is the sender. Console must name a player.

## What can go wrong

- An unknown script name. Chat lists nothing and says the item is unknown.
- Quantity below 1. The command stops with no give.
- Console with no player argument. There is nobody to give the item to.
