---
sidebar_position: 21
---

# SkillMoves, classes, Global Build slots

**Partial.** Cast is still `RUN_SKILLMOVE` plus Frontend `kind: REFERENCE` slots. The envelope is categories, requirements, and Cost Component costs. There is no class engine and no second Backend cast runtime. Do not bind `mechanic_*` ids on `stat_skillmove_*`.

Prefixes: `skillmove_`, `class_` (Frontend catalog). Pointer: `rules.dsc` `global_build_config` → Frontend script `global_build_config`.

## SkillMove Config

`type: data`, name `skillmove_<id>`. Body is `mechanics` (same shape as a triggerable). Extra keys live in `skillmove_data_keys`.

```yaml
skillmove_class_example:
    type: data
    data:
        categories:
            - swordsman
        requirements:
            1:
                type: BOOLEAN
                stat: stat_no_cast
                mode: NOT
            2:
                type: BOOLEAN
                stat: stat_class_example
                mode: HAS
        costs:
            1:
                stat: stat_stamina
                amount: 5
        mechanics:
            1:
                operations:
                    1:
                        type: PLAY_SOUND
                        target: SELF
                        target_type: ENTITY
                        sound: ENTITY_PLAYER_ATTACK_SWEEP
```

| Key | Status | Notes |
| --- | --- | --- |
| `mechanics` | Live | Keyed mechanic configs. `RUN_SKILLMOVE` runs them after gates |
| `categories` | Live | String list. `BAN_CATEGORY` no-ops the run if any listed name is banned |
| `requirements` | Live | Same maps as mechanic requirements. Class and silence live here as `BOOLEAN` |
| `costs` | Live | Cost Component. Usual row is STAT TAKE (`stat` + `amount`, stamina). `type: CURRENCY` / `ITEM` are optional. Spend goes to Void |
| `cost_payer` | Contract | `CASTER` (default) or `MOUNT`. Whose consumable is read. See [mounts.md](mounts.md) |
| `display_name` / `wiki` | Live | Player wiki. See [wiki.md](wiki.md) |
| `notinwiki` | Live | `true` hides this SkillMove from `OPEN_WIKI_MENU` |

`STAT` requirements check **level**, not pool current. Stamina spend belongs in `costs`. Silence is `BOOLEAN` `mode: NOT` on `stat_no_cast`. Class is `BOOLEAN` `HAS` on a pack stat (`stat_class_example`). Do not add `classes:` for the loader to read.

`RUN_SKILLMOVE` order: load script, build SKILLMOVE context, banned categories, requirements, can-pay costs, take costs (same queue), then mechanics.

Missing script, unbound REFERENCE, failed gate: no-op. The loader does not narrate.

## Class (Frontend, like casting mode)

Membership is a pack BOOLEAN. `SET_STAT` persist `1`. Skills that need it list `BOOLEAN` `HAS`. Incompatible pick and max binds are menu Mechanics later, not `RUN_SKILLMOVE`.

`class_*` data scripts are a **menu catalog** (which categories that class offers, `max_skills`, `incompatible_with`, plus `display_name` / `wiki` for [wiki.md](wiki.md)). Reload still registers the prefix. Backend does not read those keys at cast time.

Tree nodes and class level are more pack stats (`BOOLEAN` / `VALUE`), same `SET_STAT` path. `flag_saves.classes` / `data.classes` is an unused leftover path. Do not write it. Do not implement a class progression map there.

Grant for smoke: `self_grant_class_example` (`SET_STAT` `stat_class_example` `value: 1`).

## Global Build Config

Frontend script named `global_build_config` (the `rules.dsc` pointer). Keys in `global_build_data_keys`. Getters: `Builds/global_build_utils.dsc`. Does not write `flag_saves.builds` or `activebuild`.

| Key | Status | Notes |
| --- | --- | --- |
| `skill_slots` | Live | Keyed rows. Each row `stat:` is a `kind: REFERENCE` stat (`stat_skillmove_1`) |
| `passive_slots` | Live | Same shape. Smoke uses `stat_skillmove_passive_1` |
| `gear_slots` | Live | Row `id:` only. Relic/item persist on `flag_saves.gear`. No `attach:`. No `dummy:` |
| `equipment_slots` | Live | Row `id:` plus optional `attach: VANILLA`. GIVE_ITEM dest cells. Not gear |
| `cosmetic_channels` | Live | Row `id:` only. Persist passenger stands on `flag_saves.cosmetic_persist` |

Menus persist a `skillmove_*` id onto those REFERENCE stats with `SET_STAT`. Hotbar 1 still runs `RUN_SKILLMOVE` `stat: stat_skillmove_1`. Extra slots are the same pattern on another triggerable.

Item Skills are a separate envelope (`itemskill_*`). See [items.md](items/README.md). Do not bind `itemskill_*` ids on `stat_skillmove_*`. Gear is items (`EQUIP_GEAR`). Cosmetics are stands (`EQUIP_COSMETIC`). Frontend may run both. See [cosmetics.md](cosmetics.md).

## Smoke

Frontend: `SkillMoves/skillmove_examples.dsc`, `Classes/class_examples.dsc`, `global configs/global_build_config.dsc`.

`/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[KEY]>`

| KEY | What it does |
| --- | --- |
| `self_run_skillmove` | Free example skill. Orb pickup |
| `self_run_skillmove_cost` | Takes 5 stamina if not silenced. Pickup sound |
| `self_grant_belly` then `self_run_skillmove_currency` | Takes 5 belly |
| `self_run_skillmove_class` | No-op until class BOOLEAN is on |
| `self_grant_class_example` | Persist `stat_class_example`. Then the class skill runs |

`list_global_build_skill_slot_stats` should return `stat_skillmove_1`, `stat_skillmove_2`, `stat_skillmove_3`.

## What can go wrong

- Putting stamina spend as `type: STAT` `min:` on the skill. That is level, not current.
- Adding a Backend class flag or `RUN_SKILLMOVE` class filter. Membership is `BOOLEAN` on the skill.
- Adding a Backend casting-mode flag or `ON_PRESS_N`. Cast stays triggerable → `RUN_SKILLMOVE`.
- Binding a `mechanic_*` script on a skill slot. Slots are `skillmove_*` ids.
- `stop` inside an injected cost helper. That would skip the skill body. Costs use inject and must not `stop`.
- Currency `costs` rows with no wallet funds. Grant belly first (`self_grant_belly`).
- Writing `flag_saves.classes` / `data.classes`. Unused leftover. Class progress is `stat_*` only.
- Putting `attach:` or `dummy:` on `gear_slots`. Those rows are item ids only. Persist stands are `cosmetic_channels`. Dummy is leftover unused.
