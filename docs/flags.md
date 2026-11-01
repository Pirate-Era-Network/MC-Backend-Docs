---
sidebar_position: 5
---

# Player flags

**Partial.** Paths come from `rules.dsc` `flag_saves`. Getters and setters exist for stats, currencies, living-entity bind, language, triggerable bind, casting session, trigger cooldowns, SkillMove category bans, gear slot ids, cosmetic persist channels, season pass counters, vault slot maps, daily reset period stamps, and quest progress.

Persisted paths start with `data.`. Runtime paths start with `runtime_data.`.

| rules key | Path | Status |
| --- | --- | --- |
| `living_entity` | `data.living_entity` | Live (script name bind) |
| `stats` | `data.stats` | Live (stat id without prefix → level) |
| `consumable_stats` | `data.consumed_stats` | Live. Path says `consumed`, key says `consumable` |
| `currencies` | `data.currencies` | Live (cap, min, death loss, withdraw) |
| `analytics` | `data.analytics` | Live counters (`obtained` / `spent`). See [analytics.md](analytics.md) |
| `builds` | `data.builds` | Contract |
| `quests` | `data.quests` | Live (category id, then quest id, then status and objective progress). See [quests.md](quests.md) |
| `classes` | `data.classes` | Unused leftover. Do not implement. Class progress is Frontend `stat_*` only |
| `mounts` | `data.mounts` | Contract. `entity_` id to a row (`stats`, `consumables`, `passenger_policy`, `defeated_at`). See [mounts.md](mounts.md) |
| `equipped_mount` | `data.equipped_mount` | Contract. Owned `entity_` id the whistle uses. Not a key inside `data.mounts` |
| `vaults` | `data.vaults` | Live (PRIVATE slot maps plus backup ring). SHARED notes are `vault_index`, not this path |
| `gear` | `data.gear` | Live (Global Build `gear_slots` id to `item_*` id). Relics, rings, backpacks. No entity. No inventory scan |
| `cosmetic_persist` | `data.cosmetic_persist` | Live (cosmetic channel id to `cosmetic_*` / `item_*` display script). Passenger stands respawn from this |
| `cosmetic_overlays` | `data.cosmetic_overlays` | Live (session VANILLA/HELD overlay backup. Previous ItemTag per slot) |
| `season_pass` | `data.season_pass` | Live (per `seasonpass_` id: type FREE/PAID, level, progress, redeemed.free / redeemed.paid) |
| `chat_prefix` | `data.chat_prefix` | Live (`prefixes` and `suffixes` are ordered `title_*` id lists). See [titles.md](titles.md). Mute and the word warning counter are `chat_runtime_flags`, not this path. See [chat.md](chat.md) |
| `hud_layout` | `data.hud.layout` | Live (persist `hud_` script id). SHOW/HIDE overlays stay on `hud_runtime_flags`. See [hud.md](hud.md) |
| `daily_reset` | `data.daily_reset` | Live (last applied period per `dailyreset_` id). See [resets.md](resets.md) |
| `activebuild` | `runtime_data.activebuild` | Contract |
| `activemount` | `runtime_data.activemount` | Contract. Live mount entity. Script id is `equipped_mount`. See [mounts.md](mounts.md) |
| `stat_level_overlays` | `runtime_data.stat_level_overlays` | Live (per-stat temporary level, may expire). Pack verbal and VALUE overlays. Not world locks |
| `cooldowns` | `runtime_data.cooldowns` | Live (expire flags written by `triggerable_cooldowns`. Item consume envelope uses the same path) |
| `banned_categories` | `runtime_data.banned_categories` | Live (expire flags written by `BAN_CATEGORY`) |
| `world_locks` | `runtime_data.world_locks` | Live (expire flags written by `NO_WALK` / `HIDDEN` / other world-lock ops) |
| `activelanguage` | `runtime_data.language` | Live |

World areas are not a player flag. The index is the server flag `area_index`. Groups are the server flag `area_group_index`. See [areas.md](areas.md).

Placed waypoints are not a player flag. The index is the server flag `waypoint_index`. A `waypoint_` script with the same id keeps requirements and cost. See [travel.md](travel.md).

Mongo later serializes the `flag_saves` set through getters. Do not persist runtime-only keys until you decide they belong here. Menu open-state lives in `menu_runtime_flags`, not `flag_saves`. Triggerable bind lives in `triggerable_runtime_flags`. HUD SHOW/HIDE overlays live in `hud_runtime_flags`. See [menus.md](menus.md), [triggers.md](triggers.md), and [hud.md](hud.md).

## What can go wrong

- Using `data.consumable_stats` as the path. The real path is `data.consumed_stats`.
- Writing `data.classes`. Unused leftover. Class progress is pack stats under `data.stats`.
- Writing the whistle id as `data.mounts.equipped`. That key is read as a mount row. The id is `data.equipped_mount`. See [mounts.md](mounts.md).
- Writing cosmetic display ids into `data.gear`. Those belong on `data.cosmetic_persist`. Gear is `EQUIP_GEAR`. Cosmetics are `EQUIP_COSMETIC`. Frontend may run both. Backend does not spawn a stand from a gear id.
- Writing `pepass` flags. Season pass persist is `data.season_pass`.
- Writing vault items onto a `gui: true` menu. Use `OPEN_STORAGE`. See [vaults.md](vaults.md).
- Writing trade items onto a `gui: true` menu. Use `OPEN_TRADE`. See [trades.md](trades.md).
- Writing these flags in a mechanic or join event. Use the domain setter.
- Writing `data.quests` from a mechanic. Use `START_QUEST`, `ADVANCE_QUEST`, and `COMPLETE_QUEST`. See [quests.md](quests.md).
- Writing HUD SHOW/HIDE overlays onto `data.hud.layout`. Persist is the layout id only. Overlays are `runtime_data.hud`.
