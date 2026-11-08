---
sidebar_position: 18
---

# In-game player wiki

**Live.** Hub plus category PAGE menus. Backend indexes existing prefixes and builds lore on click. This is not `docs/` (dev option catalog) and not a Discord or web wiki. There is no `wiki_` runtime prefix.

Harvest: `itemwiki_mainpage.dsc` (`itemwiki_generic_wikimenu`), `itemwiki_helperfunctions.dsc`, `pewiki.dsc`. Live engine uses `server.flag[scripts.<prefix>]` from reload, not `util.scripts` at open.

## Files

| Piece | Path |
| --- | --- |
| Prefix lists and opt-out | `Wiki/wiki_utils.dsc` |
| `/packwiki` | `Wiki/wiki_command.dsc`. See [commands/packwiki](commands/packwiki.md) |
| PAGE itemlist and lore | `Wiki/wiki_lore.dsc` |
| Reload listed-name and drop-source indexes | `Wiki/wiki_index.dsc` |
| Ops | `Mechanics/Individual_operations/open_wiki_operation.dsc` |
| Menus | `pirate-era-core-frontend/Menus/menu_wiki.dsc` |

## How it works (lag)

These are the live versions of the old wiki tricks. Theme fruit/hat subcategories, `- while` loot flatten, and hourly chest `chunkload` are not ported.

| When | What runs |
| --- | --- |
| Reload | `rebuild_wiki_listed_index` writes `server.flag[wiki_listed]` (names that pass `notinwiki`). `rebuild_wiki_source_index` writes `server.flag[wiki_sources]` from loot / crate / season YAML. No loot roll. Nested tables use a depth cap |
| Category PAGE open | Flag get for that category. Thin rows (`wiki_script` + `category` only). PAGE already windows 54 at a time |
| Fill / page turn | `fill_page_kind` builds icons for the visible 54 cells. Stub lore is `wiki_click_more_lore` only |
| Click a row | `REVEAL_WIKI_LORE`. Ratelimit `1s`. Skip if `wiki_revealed`. One script's wiki body plus drop lines replace that cell. Does not open `menu_wiki_entry` |

`OPEN_WIKI_MENU` with `script:` still opens the one-entry PAGE. Hub and `/packwiki <script>` use that path.

Hub is GENERIC (`menu_wiki_hub`). Category clicks are `OPEN_WIKI_MENU` `category: ITEMS` (or `SKILLMOVES` / `CLASSES` / `QUESTS` / `CURRENCIES`).

## Opt-out

On any listed data script:

```yaml
notinwiki: true
```

Smoke: `item_belly_coin`.

## Copy keys

`wiki:` and `display_name` (or item `display.displayname` / currency `display.name`) are transcript keys or literals. Same lookup as [language.md](language.md). Overlay headers stay lowercase.

## How to open

```text
/packwiki
/packwiki items
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_wiki].data_key[data].get[self_open_hub]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_wiki].data_key[data].get[self_open_items]>
```

## What can go wrong

- Adding a `wiki_` prefix. The indexer reads existing prefixes only
- Building a second inventory script. Use `OPEN_WIKI_MENU` on the shared menu engine
- Putting stam / CD / damage columns here. That is the creator balance sheet, not the player wiki
- Forgetting reload. Listed names and drop sources are built in `reload_all_server_flags`
- Building drop lines or full item maps for every row at PAGE open. Sources belong on the reveal click. Fill only expands the current 54
- Opting out with `wiki: false`. Opt-out is `notinwiki: true`. `wiki:` is the long body
