---
sidebar_position: 1
---

# Mechanics

**Partial.** Dispatcher, context, targeting, requirements, inherit, PLAY_SOUND, PLAY_EFFECT, APPLY_VELOCITY, PROJECTILE, DASH, SPAWN_NOTABLE, SPAWN_HOLOGRAM, START_GPS, STOP_GPS, SHOW_HUD_PART, HIDE_HUD_PART, CLEAR_HUD_PARTS, SET_HUD_LAYOUT, PLACE_SPRAY, OPEN_SPRAY_MENU, OPEN_TITLE_MENU, EQUIP_TITLE, UNEQUIP_TITLE, CLEAR_TITLES, OPEN_WIKI_MENU, REVEAL_WIKI_LORE, EQUIP_GEAR, CLEAR_GEAR, EQUIP_COSMETIC, CLEAR_COSMETIC, SPAWN_COSMETIC, NARRATE, GIVE_ITEM, GRANT_LOOT, START_QUEST, ADVANCE_QUEST, COMPLETE_QUEST, GRANT_SEASON_XP, SET_SEASON_TRACK, REDEEM_SEASON_REWARD, OPEN_SEASON_PASS, APPLY_TRANSACTION, OPEN_LOOT_CRATE, TELEPORT, TRAVEL_TO_WAYPOINT, ITEM_COOLDOWN, SWING, DEAL_DAMAGE, world-lock ops (`NO_WALK`, …), MODIFY_STAT, MODIFY_STAT_LEVEL, OVERLAY_STAT_LEVEL, CLEAR_STAT_OVERLAY, SET_STAT, TOGGLE_STAT, RUN_SKILLMOVE, RUN_ITEMSKILL, RUN_MECHANIC, CAST_VANILLA_EFFECT, BAN_CATEGORY, OPEN_MENU, CLOSE_MENU, OPEN_CONFIRM, OPEN_DIALOGUE, OPEN_TYPING, OPEN_STORAGE, and OPEN_TRADE are Live. Other ops are missing.

Live entity ops: `SPAWN_ENTITY`, `SET_ENTITY_MODEL`, `ANIMATE_ENTITY`, `MYTHIC_PATH`, `MYTHIC_SIGNAL`, `MYTHIC_THREAT`, `SET_ENTITY_AI`, `RESET_MYTHIC_TARGET`, `SET_COMPANION_STATE`, `PLAY_BOSS_MUSIC`. Names live in `rules.dsc` `mechanic_entity_operations`.

Ops never invent targeting. They call `resolve_mechanic_operation_targets`. Values go through `resolve_mechanic_value`. Duration and `SET_STAT` `value` do too. MODIFY_STAT also accepts `mechanic_event_values` keys as `amount`.

## Pages

- [Targeting](targeting.md)
- [Context](context.md)
- [Requirements](requirements.md)
- [Operations](operations.md) (includes locked display vs physics for spawn ops)

## Mechanic config (Frontend)

`type: data`. Operations is a **keyed map** (`1`, `2`, …). Denizen data scripts do not use a list of maps.

```yaml
some_mechanic:
    type: data
    data:
        delay: 0t
        repeat:
            amount: 1
            delay: 1t
        requirements:
            1:
                type: STAT
                stat: stat_stamina
                min: 1
        operations:
            1:
                type: PLAY_SOUND
                target: SELF
                target_type: LOCATION
                sound: BLOCK_NOTE_BLOCK_PLING
```

Smoke tests: `pirate-era-core-frontend/Mechanics/mechanic_examples.dsc`.

| Key | Status |
| --- | --- |
| `operations` | Live |
| `delay` | Live |
| `repeat.amount` / `repeat.delay` | Live |
| `requirements` | Live (see [requirements.md](requirements.md)) |
| `inherit` | Live (parent mechanic script name, see [operations.md](operations.md)) |
| `duration` | Live (after inherit merge, stamps ops that omitted duration. Op duration wins. Omit means until cleanse or persist) |
| chance (scalable) | Missing |

## How to fire

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_sound].data_key[data].get[self_location_sound]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_effect].data_key[data].get[self_dust]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_apply_velocity].data_key[data].get[self_look_knockback]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_display]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_dash].data_key[data].get[self_look]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_dash].data_key[data].get[self_cloud_trail]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_dash].data_key[data].get[self_bounce]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_dash].data_key[data].get[self_wall_bounce]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_dash].data_key[data].get[self_step_bounce]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spawn_notable].data_key[data].get[self_zone]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spawn_hologram].data_key[data].get[self_text]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_gps].data_key[data].get[self_cursor]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spray].data_key[data].get[self_place]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_cosmetics].data_key[data].get[self_equip]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_gear].data_key[data].get[self_equip_ring]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_menu].data_key[data].get[open_cosmetics]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_modify_stat].data_key[data].get[self_heal_stamina]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_modify_stat_level].data_key[data].get[self_add_stamina_level]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_overlay_stat_level].data_key[data].get[self_overlay_stamina_level]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_apply_no_cast]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_requirements].data_key[data].get[self_sound_if_grounded]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_menu].data_key[data].get[open_hub]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_storage].data_key[data].get[open_private]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_trade].data_key[data].get[look_partner]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_grant_loot]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_grant_belly]>
```

Pass `def.targets:` and `def.placeholders:` as in [targeting.md](targeting.md). Production code uses `build_mechanic_context` then `run_mechanic_config`. Control-effect key names (`self_sound_if_can_cast`, `look_sound`) are explained in [control-effects.md](../control-effects.md).

## Numbers in ops

Flat number, or a `stat_*` script name. Default source is the caster. See `mechanic_value_sources` in [rules.md](../rules.md). MODIFY_STAT `amount` may also be an event_values key (`damage`, `value`, …). Full Scalable Value Config (exp/log, min/max level on the op itself) is not wired for mechanics. Stat value_config linear math is used when you pass a `stat_*` ref.

## What can go wrong

- Writing `operations:` as a YAML list of maps. Use `1:`, `2:`.
- Copying target logic into a new op instead of `resolve_mechanic_operation_targets`.
- Hardcoding `SELF` or `LOCATION`. Read `get_rule_value`.
