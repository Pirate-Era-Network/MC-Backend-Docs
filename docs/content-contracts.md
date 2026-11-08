---
sidebar_position: 28
---

# Skills, classes, NPCs, menus

SkillMoves, classes, and Global Build slots: [skills.md](skills.md). This page keeps prefixes that still have no engine.

When an engine lands, move the topic to its own page and mark Live. Until then this is the option list so names stay stable.

## Skills and classes

Live envelope: [skills.md](skills.md). `RUN_SKILLMOVE` loads `skillmove_*`. Slot binds are Frontend `kind: REFERENCE` stats. Class membership is Frontend BOOLEAN (`stat_class_example`). `class_*` is a menu catalog. Item Skills and consume envelopes: [items.md](items.md).

Runtime used now: `flag_saves.banned_categories`. Class progress is Frontend `stat_*`. Do not use `flag_saves.classes`. Slot binds: persist `SET_STAT`. Hotbar: `ON_HOTBAR_SLOT`. Casting mode: Frontend BOOLEAN. See [triggers.md](triggers.md).

## Quests and travel

Quests are Live. See [quests.md](quests.md). Travel is Live (`waypoint_`, `TRAVEL_TO_WAYPOINT`). See [travel.md](travel.md).

## World and entities

| Prefix | Meaning |
| --- | --- |
| `entity_` | Combat / companion config. Points at a shared Mythic **base** id (`mythic:`), not a per-mob Mythic YAML. Live. A list of these must skip the piece prefixes below, because those names also start with `entity_` |
| `entityai_` | Targeting, idle movement, cast pattern, reactions, companion block, notify_allies. Live |
| `entityanimation_` | Model Engine state name for `megstate` (delay, lock_movement, invulnerable_during). Live |
| `entitymodel_` | Model Engine blueprint, scale, hitbox. Live |
| `entityskill_` | MELEE / CAST / FOLLOW_UP / HURT wrap around a `skillmove_` plus BEFORE/AFTER ops. Live |
| `entityprofile_` | Stat multiplier template. Live |
| `mount_` | Reserved. Unused. The ride is `entity_.mount`. See [mounts.md](mounts.md) |
| `castset_` | Contract. Hotbar overlay set listed on the mount block. See [mounts.md](mounts.md) |
| `npc_` | Static NPC. Left/right click Mechanics |
| `dialogue_` | Node graph. Options fire Mechanics |

`OPEN_DIALOGUE` is Live as a chest NPC-talk kind. Node-graph `dialogue_*` scripts are still Contract.

Combat mobs are Live for the Mythic-first AI shape. Index wipe, clear, prune, mythic death unregister, chunk pending-remove, and owner-quit companion clear are Live (`Entities/entity_index.dsc`, `Entities/entity_world.dsc`). `spawn_entity` in `Entities/entity_spawn.dsc` is Live for mythicspawn of a **shared base type**, index register, living entity init, Mythic AI adjust, profile level apply, nametag init, crew rows, companion roster, optional `boss_music`, patrol stamp before mode, and mode stamp. `SPAWN_ENTITY` and `/packentity spawn` call it. `/packentity list` opens `menu_entity_list`. `/packentity remove` drops one uuid. `SET_ENTITY_MODEL`, `ANIMATE_ENTITY`, `MYTHIC_PATH`, `MYTHIC_SIGNAL`, `MYTHIC_THREAT`, `SET_ENTITY_AI`, `RESET_MYTHIC_TARGET`, `SET_COMPANION_STATE`, and `PLAY_BOSS_MUSIC` are Live dispatcher ops. Level resolve, `entityprofile_` multipliers, and MEG nametag are Live. See [entities.md](entities.md). Cast arsenal is Live for MELEE / CAST / FOLLOW_UP / HURT with WEIGHTED, PRIORITY, SEQUENCE (`repeats`), phases, fallback, `pause_while`, `follow_up_guaranteed`, and `cast_busy` interrupt (`Entities/entity_cast.dsc`). Mode FSM (`IDLE` / `COMBAT` / `PATROL` / `RETURN_HOME` / `FLEE` for combat mobs, `FOLLOW` / `HOLD` for companions), PATROL repath, `notify_allies`, COMBAT-gated movement helpers, behavior `modes` filters, `despawn_after`, and threat tank swap are Live. Area `MOB_SPAWN` activation and patrol offsets are Live. Mythic base ids live in `rules.dsc` `mythic_base_types`. Do not invent a Mythic mob per content row. `companion_cap` is `3` live companions per owner. Companion ownership uses stable instance ids, `OUT` / `RECALLED` / `STORED`, Mythic `gotoowner`, friendly fire, and `when: OWNER` reactions (`Entities/entity_companion.dsc`). Other spawn op names stay in `mechanic_entity_operations`. Area level keys are in [areas.md](areas.md).

## Menus

Player-facing menus are Frontend `menu_*` data scripts. Engine: [menus.md](menus.md).

`OPEN_CONFIRM`, `OPEN_DIALOGUE`, and `OPEN_TYPING` are chest UIs. Do not confirm purchases or collect text in chat.

## HUD

Player-facing HUD layouts are Frontend `hud_*` / `hudpart_*` data scripts. Engine: [HUD](hud/README.md). Optional chrome uses `requirements` plus `SHOW_HUD_PART`. Shake and bleed are PLAY_EFFECT, not HUD kinds.

## Daily reset

Player-facing reset rows are Frontend `dailyreset_` data scripts. Engine: [resets.md](resets.md). Pass, login chest, replay caps, and shop dailies opt in as those rows. The scheduler does not special-case them.

## Areas, builds, triggerables

`triggerable_` is Live. See [triggers.md](triggers.md). Global Build schema is Live. See [skills.md](skills.md). Gear is items (`EQUIP_GEAR`). Cosmetics are stands (`EQUIP_COSMETIC`). See [cosmetics.md](cosmetics.md). Season pass is Live. See [season-pass.md](season-pass.md). Spray is Live (`PLACE_SPRAY`, `spray_`, `peimagemap`). Titles are Live (`title_`, `OPEN_TITLE_MENU`, `flag_saves.chat_prefix`). See [titles.md](titles.md). Vaults are Live (`OPEN_STORAGE`). See [vaults.md](vaults.md). Trade is Live (`OPEN_TRADE`). See [trades.md](trades.md). HUD is Live (`hud_`, `hudpart_`, `SHOW_HUD_PART`). See [HUD](hud/README.md). Daily reset is Live (`dailyreset_`). See [resets.md](resets.md). Chat is Live (`chatrow_`, `chatwords_`, prefix assembler). See [chat.md](chat.md). Areas are Live (`area_`, `areagroup_`, `area_index`, `area_group_index`). See [areas.md](areas.md). Quests are Live (`quest_`, `questcategory_`). See [quests.md](quests.md). Travel is Live (`waypoint_`, `TRAVEL_TO_WAYPOINT`). See [travel.md](travel.md).

## What can go wrong

- Shipping an `itemskill_` pack without listing it on the item `skills:` list and without a triggerable that calls `RUN_ITEMSKILL`.
- Putting eat logic on `itemskill_*`. Item Config `consume:` plus `ON_CONSUME` is the eat path.
- Confirming shop purchases in chat. Use `OPEN_CONFIRM`.
