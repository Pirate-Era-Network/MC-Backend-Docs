---
sidebar_position: 8
---

# /packtitle

Opens the title equip menu for you. Any player can run it. Console stops.

## System

Titles are Frontend `title_` scripts. Unlock is a BOOLEAN stat. Equip appends the id onto the player's prefix or suffix list. Chat paint reads those lists. This command does not equip a title by itself.

| Piece | Where |
| --- | --- |
| Command | [Titles/title_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Titles/title_command.dsc) |
| Lists and equip | [Titles/title_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Titles/title_utils.dsc) |
| Menu | `menu_title_equip` |
| Option catalog | [titles](../titles.md) |

The same PAGE is what `OPEN_TITLE_MENU` opens.

## Use

```text
/packtitle
```

Locked rows have no click. Equip and unequip reopen the PAGE so several titles can be stacked in one sitting.

## What can go wrong

- Expecting `/packtitle` to change chat by itself. Equip a row in the menu, then `/packchat` to preview the line.
