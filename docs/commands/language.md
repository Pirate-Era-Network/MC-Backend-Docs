---
sidebar_position: 6
---

# /language

Cycles the language this player reads. Any player can run it. Console stops.

## System

Languages are Frontend `general_transcript_*` scripts. The active language is `flag_saves.activelanguage`. A missing flag uses `registry_gamerules.language.default`.

The command sets the next language in the registered list, then wraps to the first. It restamps inventory Item Config lore, because that text is baked into the item. An open engine menu reloads so overlay copy matches the new language.

| Piece | Where |
| --- | --- |
| Command | [utils/language_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/utils/language_command.dsc) |
| Lookup | [utils/language_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/utils/language_utils.dsc) |
| Option catalog | [language](../language.md) |

## Use

```text
/language
```

Run it again to move to the next transcript. The confirm line is already in the new language.

Generated admin lists (GPS, areas, and the rest) were built when the menu opened. Close and reopen that menu after changing language.

## What can go wrong

- Only one transcript script is loaded. The cycle stays on that language.
- Expecting a closed admin list to rewrite itself. Reopen it.
