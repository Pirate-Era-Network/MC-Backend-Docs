---
sidebar_position: 9
---

# /packwiki

Opens the in-game wiki for you. Any player can run it. This is the player wiki, not this docs site.

## System

The indexer lists existing prefixes (items, skillmoves, classes, quests, currencies) and skips scripts with `notinwiki`. Lore is built when a row is clicked.

| Piece | Where |
| --- | --- |
| Command | [Wiki/wiki_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Wiki/wiki_command.dsc) |
| Indexer | [Wiki/wiki_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Wiki/wiki_utils.dsc) |
| Option catalog | [wiki](../wiki.md) |

`OPEN_WIKI_MENU` opens the same menus.

## Use

```text
/packwiki
/packwiki <category>
```

No argument opens the hub. A category argument opens that category page. The category is the wiki category id the pack registered (`items`, and the other hub ids).

## What can go wrong

- Passing a category the pack did not register. The opener falls through to the hub when the name does not resolve.
