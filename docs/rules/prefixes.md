---
sidebar_position: 3
---

# Prefixes

This is every prefix the reload walk collects. A row marked Contract has no engine yet. Those names are also on [Contract prefixes](../content-contracts.md).

Each entry has `type` (usually `data`) and `value` (the name prefix). Reload collects `util.scripts` whose name starts with `value`.

| Prefix key in rules | Prefix string | Status |
| --- | --- | --- |
| `registry_prefix` | `registry_` | Live (gamerules) |
| `stat_prefix` | `stat_` | Live |
| `livingentity_prefix` | `livingentity_` | Live |
| `currency_prefix` | `currency_` | Live |
| `loottable_prefix` | `loottable_` | Live resolver |
| `lootpool_prefix` | `lootpool_` | Live resolver |
| `lootentry_prefix` | `lootentry_` | Live resolver |
| `lootcrate_prefix` | `lootcrate_` | Live crate GUI |
| `item_prefix` | `item_` | Live (create/give, skills list, consume envelope) |
| `repairprofile_prefix` | `repairprofile_` | Contract |
| `levelprofile_prefix` | `levelprofile_` | Contract |
| `questcategory_prefix` | `questcategory_` | Live. Menu grouping. Also matches `quest_` because the name starts with that prefix. See [quests.md](../quests/README.md) |
| `quest_prefix` | `quest_` | Live. Objectives, complete mechanics, loot entry rewards |
| `waypoint_prefix` | `waypoint_` | Live. Placed spots share the id. See [travel.md](../travel.md) |
| `entity_config` | `entity_` | Live. Piece prefixes below also start with `entity_`. An `entity_` list must skip those names |
| `entityai_prefix` | `entityai_` | Live. Targeting, cast pattern, reactions, companion, notify_allies |
| `entityanimation_prefix` | `entityanimation_` | Live. Model Engine state for `megstate` (delay, lock, invuln) |
| `entitymodel_prefix` | `entitymodel_` | Live. Model Engine blueprint, scale, hitbox |
| `entityskill_prefix` | `entityskill_` | Live. MELEE / CAST / FOLLOW_UP / HURT wrap around a `skillmove_` |
| `entityprofile_prefix` | `entityprofile_` | Live. Stat multiplier template |
| `mount_config` | `mount_` | Reserved. The ride is `entity_.mount`. See [mounts.md](../mounts.md) |
| `castset_prefix` | `castset_` | Contract. Hotbar overlay set. See [mounts.md](../mounts.md) |
| `npc_config` | `npc_` | Contract |
| `dialogue_config` | `dialogue_` | Contract |
| `class_config` | `class_` | Frontend menu catalog. Progress is pack stats. Do not use `data.classes` |
| `skillmove_config` | `skillmove_` | Live (`RUN_SKILLMOVE`) |
| `mechanic_config` | `mechanic_` | Live (`RUN_MECHANIC`, inherit script names) |
| `itemskill_config` | `itemskill_` | Live (`RUN_ITEMSKILL`) |
| `cosmetic_config` | `cosmetic_` | Live (`EQUIP_COSMETIC` / `CLEAR_COSMETIC` / `SPAWN_COSMETIC`) |
| `seasonpass_config` | `seasonpass_` | Live (`GRANT_SEASON_XP` / `SET_SEASON_TRACK` / `REDEEM_SEASON_REWARD` / `OPEN_SEASON_PASS`) |
| `spray_config` | `spray_` | Live (`PLACE_SPRAY` / `OPEN_SPRAY_MENU`, `peimagemap` filled_map) |
| `poster_config` | `poster_` | Live (`/packposter`, `peimagemap` filled_map, map ids 1 to 10) |
| `title_config` | `title_` | Live (`OPEN_TITLE_MENU`, `EQUIP_TITLE`, ChatPrefix lists) |
| `chatrow_prefix` | `chatrow_` | Live. Crew, rank, and extra chat strings. See [chat.md](../chat.md) |
| `chatwords_prefix` | `chatwords_` | Live. Optional word list. See [chat.md](../chat.md) |
| `general_transcript` | `general_transcript_` | Live |
| `menu_prefix` | `menu_` | Live |
| `hud_prefix` | `hud_` | Live. Layout of `hudpart_` rows. See [HUD](../hud/README.md) |
| `hudpart_prefix` | `hudpart_` | Live. One actionbar glyph piece. See [HUD](../hud/README.md) |
| `dailyreset_prefix` | `dailyreset_` | Live. Clocked wipe/grant rows. See [resets.md](../resets.md) |
| `triggerable_prefix` | `triggerable_` | Live |
| `levelcap_prefix` | `levelcap_` | Live (shared VALUE minlevel/maxlevel) |
| `area_prefix` | `area_` | Live. Optional area template. Instances are `area_index` notes. See [areas.md](../areas/README.md) |
| `areagroup_prefix` | `areagroup_` | Live. Optional group template. Live rows are `area_group_index`. See [areas.md](../areas/README.md) |
