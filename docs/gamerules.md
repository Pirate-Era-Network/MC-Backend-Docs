---
sidebar_position: 4
---

# Gamerules

**Live** as pack-wide server policy. Frontend script `registry_gamerules` (`rules.dsc` pointer `gamerules`). Nested maps only.

This is not a dump for every number. Stat caps are `levelcap_*`. Currency rules are `currency_*`. Item tiers are `global_item_config`. Area PVP is AreaRule.

| Key | Status |
| --- | --- |
| `base_movement_speed` | Live. Walk/sprint floor |
| `economy.player_pay` | Live. `ALLOW` / `TRADE_ONLY` |
| `language.default` | Live. Join / missing language flag |
| `analytics.day_expire` | Live. Server day-bucket expire. Fallback `analytics_day_flag_expire` in `rules.dsc` |
| `hud.default` | Live. Join / missing persist layout. Frontend `hud_example_default` |
| `hunger.lose` | Live. `false` keeps the food bar full. `true` lets vanilla hunger drain. See [items.md](items/README.md) |
| `world.*` | Commented. Wilderness defaults. `phase5-areas` |
| `party.enabled` | Commented. Full party/social configs stay their own scripts. `phase5-social` |
| Vanilla damage list | Other registry: `allowed_damage_types_gamerules` |

Getters: `gamerules_utils.dsc`.

## What can go wrong

- Putting `minlevel` / `maxlevel` here. Use `levelcap_*`.
- Putting crew ranks or item sets here. Those are Global Social / Global Item Config.
- Putting glyph letters here. Those stay in `hud_appearance`. `hud.default` is only the layout script name.
