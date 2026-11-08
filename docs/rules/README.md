---
sidebar_position: 1
slug: /rules
---

# rules.dsc

This catalog is every top-level key in `rules.data`. An op reads a key with `get_rule_value` and uses that result. File: [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc).

When you add a key, add the row on that key's category page. `flag_saves` paths stay on [flags](../flags.md).

## What can go wrong

- Adding a prefix in Frontend and forgetting it here. Reload will not register those scripts.
- Pointing `global_item_config` at the build script again. It must stay `global_item_config`.
- Hardcoding `data.stats` instead of `flag_saves.stats`.
- Unquoted `-` `*` `+` `/` under `data`. `subtract: -` is a YAML list marker. The `rules` script will not exist and every `get_rule_value` call fails. Quote them (`"-"` `"*"` `"+"` `"/"`).
- Putting `dummy:` on `gear_slots`. Dummy is leftover unused. Persist stands are `cosmetic_channels`. Gear is `EQUIP_GEAR`. Cosmetics are `EQUIP_COSMETIC`.

## Categories

- [Pointers](pointers.md)
- [Prefixes](prefixes.md)
- [Mechanics](mechanics.md)
- [Items](items.md)
- [Effects and velocity](effects.md)
- [Projectiles](projectiles.md)
- [Dash](dash.md)
- [Holograms, GPS, and spray](holograms.md)
- [Areas](areas.md)
- [Quests](quests.md)
- [Travel](travel.md)
- [Entities](entities.md)
- [Mounts](mounts.md)
- [Cosmetics and gear](cosmetics.md)
- [Menus](menus.md)
- [HUD](hud.md)
- [Stats and world locks](stats.md)
- [Triggerables](triggerables.md)
- [Chat, titles, and wiki](chat.md)
- [Season pass](season-pass.md)
- [Skills and Global Build](skills.md)
- [Currencies and costs](currencies.md)
- [Gamerules](gamerules.md)
- [Loot](loot.md)
- [Living entities and damage](living-entities.md)
- [Daily reset](resets.md)
- [Persistence](persistence.md)
