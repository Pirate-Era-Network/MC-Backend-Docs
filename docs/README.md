---
sidebar_position: 1
slug: /
---

# Backend wiki

Option catalog for the Denizen MMORPG **backend** (`mc-denizen-core-backend`). Frontend content lives in `pirate-era-core-frontend`. This folder is the living list of what the engine accepts. Host these `.md` files as a wiki later without rewriting them.

## Status words

| Word | Meaning |
| --- | --- |
| Live | Backend runs this. Frontend can ship configs. |
| Partial | Some keys work. Missing keys are named on the page. |
| Contract | Prefix or flag path exists in `rules.dsc`. No engine yet. |
| Stub | Script exists but does not do the real work (narrate, empty shell). |

Do not document a key as Live unless a `.dsc` reads it.

## Pages

- [How the framework works](framework.md)
- [rules.dsc](rules/README.md)
- [Gamerules](gamerules.md)
- [Player flags](flags.md)
- [Stats](stats.md)
- [Control effects](control-effects.md)
- [Currencies](currencies.md)
- [Analytics](analytics.md)
- [Receipts / Mongo](receipts.md)
- [API engine](api.md)
- [Living entities](living-entities.md)
- [Entities (combat / Mythic bases)](entities/README.md)
- [Mounts](mounts.md)
- [Items](items/README.md)
- [Vaults](vaults.md)
- [Trade](trades.md)
- [In-game wiki](wiki.md)
- [Language](language.md)
- [Loot](loot/README.md)
- [Skills, classes, Global Build](skills.md)
- [Cosmetics and gear](cosmetics.md)
- [Season pass](season-pass.md)
- [Titles / ChatPrefix](titles.md)
- [Chat](chat.md)
- [Quests](quests/README.md)
- [Travel](travel.md)
- [Contract prefixes](content-contracts.md)
- [Triggerables and Eventstats](triggers/README.md)
- [Menus](menus/README.md)
- [HUD](hud/README.md)
- [Daily reset](resets.md)
- [Areas](areas/README.md)
- [Mechanics](mechanics/README.md)
- [Commands](commands/index.md)
- [Keeping this wiki honest](maintaining.md)

## What can go wrong

- Coding a new config key and skipping this folder. The option is then invisible.
- Copying Contract pages into Frontend as if they already run.
- Hardcoding flag paths or `SELF` / `LOCATION` strings instead of `get_rule_value`.
