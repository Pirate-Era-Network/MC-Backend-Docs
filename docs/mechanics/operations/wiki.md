---
sidebar_position: 46
---

# Wiki operations

`OPEN_WIKI_MENU` opens the player wiki hub or one category page. The indexer reads `item_`, `skillmove_`, `class_`, `quest_`, and `currency_` scripts. Opt out with `notinwiki: true`. There is no `wiki_` prefix, and this menu is not the `docs/` catalog. `REVEAL_WIKI_LORE` replaces the open page cell with the body and the drop lines. It does not open a second inventory. The engine builds that op from the page click, so pack YAML does not fire it by hand for a normal row. Building every drop line when the page opens is the cost this op avoids. The menus and the opt-out are on [wiki](../../wiki.md).

Task: `operation_open_wiki_menu`. Player wiki hub or category PAGE. Category rows are script ids. Click runs `REVEAL_WIKI_LORE` on that cell. Indexer reads `item_`, `skillmove_`, `class_`, `quest_`, `currency_`. Opt-out is `notinwiki: true`. Drop lore comes from the reload map. Not `docs/`. Not a `wiki_` prefix. Full page: [wiki.md](../../wiki.md).

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_WIKI_MENU` |
| `category` | no | `ITEMS` `SKILLMOVES` `CLASSES` `QUESTS` `CURRENCIES`. Omit with no `script:` for the hub |
| `script` | no | One content script. Opens the entry PAGE |
| `menu` | no | Override hub / category / entry menu id |
| `target` | yes | Who. Overlay `ENTITY` |

```yaml
operations:
    1:
        type: OPEN_WIKI_MENU
        target: SELF
        category: ITEMS
```

Smoke: `mechanic_example_wiki`. `/packwiki`. `/packwiki items`.

## REVEAL_WIKI_LORE

Task: `operation_reveal_wiki_lore`. Harvest `itemwiki_generic_wikimenu`: stub lore until click, `ratelimit 1s`, skip if already revealed. Replaces that PAGE cell with wiki body plus drop lines. Does not open a second inventory. Not for combat. Caster must already have the wiki PAGE open.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `REVEAL_WIKI_LORE` |
| `category` | no | `ITEMS` and the other wiki categories. Infer from `script:` if omitted |
| `script` | no | Content script. Else the clicked item `wiki_script` flag |
| `target` | yes | Who. Overlay `ENTITY` |

```yaml
operations:
    1:
        type: REVEAL_WIKI_LORE
        target: SELF
        category: ITEMS
        script: item_example_skill_wand
```

Engine PAGE clicks build this op from the thin row. Pack YAML does not need to fire it by hand.
