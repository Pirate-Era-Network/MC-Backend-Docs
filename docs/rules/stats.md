---
sidebar_position: 19
---

# Stats and world locks

Stat kinds, level views, presentation, world-lock operations, and level caps. The pack script is [stats](../stats.md). Locks are [control effects](../control-effects.md).

## Control effect stats

`world_lock_operations` maps lock keys (`no_walk`) to mechanic types (`NO_WALK`). Pack YAML uses the type. Runtime flags: `flag_saves.world_locks`. Silence, stunned, and casting mode are pack BOOLEAN stats. `control_effect_melee_damage_types` is the vanilla cause list `NO_MELEE_DAMAGE` blocks. `control_effect_forget_target_range` is how far `attack cancel` searches when hidden or untargetable is applied.

`stat_kinds` is `VALUE` (equations), `BOOLEAN` (on/off), `NUMBER` (stored number), `REFERENCE` (script/id). `FLAG` aliases `BOOLEAN`. Overlay is the timed apply, not a kind. Same `stat_` prefix.

## Stat presentation

`stat_presentation_keys` is the FE `stat_config.presentation` map (`vanilla_effect`, `movement`, `knockback`, `cleansed`, …). Sprint and knockback use those keys on listed stats. There is no `default_stats` name lookup. `stat_presentation_movement` is `NONE` / `WALK` / `SPRINT` / `BOTH`. `stat_presentation_effect_duration` is the potion recast window (`2s`) for presentation-driven potions. `stat_presentation_vanilla_flag` is the runtime flag for potions we applied that way. `player_vanilla_walk_speed` and `player_vanilla_fly_speed` restore those PlayerTag values after `NO_WALK` (legacy stun used `0.2`). See [control-effects.md](../control-effects.md) and [stats.md](../stats.md).

## Stat level views

`stat_level_views` in [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc). Pass the value into `get_target_stat_level`, `get_all_target_stats`, and `get_stat_value_of_target`.

| View | Meaning |
| --- | --- |
| `PERSISTED` | `data.stats` only. Default for `get_all_target_stats` |
| `EFFECTIVE` | Overlay flag if present, else persisted. Default for `get_target_stat_level` and `get_stat_value_of_target` |
| `OVERLAY` | Overlay flag if present, else persisted |

Unknown view names become `EFFECTIVE`. Add a new row here when a new layer lands. Gear persist is `flag_saves.gear`, not a stat view.

| Key | Role | Page |
| --- | --- | --- |
| `world_lock_operations` | `NO_WALK` / `NO_JUMP` / `HIDDEN` / … | [control-effects.md](../control-effects.md) |
| `stat_kinds` | VALUE / BOOLEAN / NUMBER / REFERENCE (`FLAG` = BOOLEAN) | [stats.md](../stats.md) |
| `stat_value_config_keys` | `level_cap` / minlevel / maxlevel / equation | [stats.md](../stats.md) |
| `levelcap_data_keys` | Template minlevel / maxlevel | [stats.md](../stats.md) |
| `control_effect_melee_damage_types` | Vanilla causes `NO_MELEE_DAMAGE` blocks | [control-effects.md](../control-effects.md) |
| `stat_presentation_keys` | FE `stat_config.presentation` field names | [stats.md](../stats.md), [control-effects.md](../control-effects.md) |
| `stat_presentation_movement` | `NONE` / `WALK` / `SPRINT` / `BOTH` | [stats.md](../stats.md) |
| `stat_presentation_effect_duration` | Potion recast window | [control-effects.md](../control-effects.md) |
| `stat_presentation_vanilla_flag` | Runtime flag for applied potions | [control-effects.md](../control-effects.md) |
