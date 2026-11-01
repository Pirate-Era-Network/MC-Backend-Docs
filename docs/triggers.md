---
sidebar_position: 29
---

# Triggerables and Eventstats

**Partial.** Player-bound `triggerable_*` configs init on join. World events dispatch through `fire_stat_event`. Eventstat is a `stat_*` with `stat_event_config`. A SkillMove is a `skillmove_*` data script with `mechanics`. An Item Skill is an `itemskill_*` data script listed on an Item Config. Hotbar 1 with casting mode runs `RUN_SKILLMOVE` on `stat_skillmove_1`.

Prefix: `triggerable_`. Vocabulary: `rules.dsc` `stat_event_triggers` and `triggerable_cast_events`.

Casting mode is not a Backend flag. Frontend `SET_STAT` `session: true` on `stat_casting_mode` plus `BOOLEAN` on the hotbar triggerable. See [stats.md](stats.md) `kind: BOOLEAN`.

## Player triggerables

Frontend `type: data`, name `triggerable_<id>`. List them on the living entity (`triggerables:`) the same way as stats. Join runs `initialize_player_triggerables` and stores the script names on `runtime_data.triggerables.bound`.

```yaml
triggerable_hotbar_slot:
    type: data
    data:
        event: ON_HOTBAR_SLOT
        slot: 1
        requirements:
            1:
                type: BOOLEAN
                stat: stat_casting_mode
                mode: HAS
        mechanics:
            1:
                operations:
                    1:
                        type: RUN_SKILLMOVE
                        stat: stat_skillmove_1
```

A pack with no casting mode omits that requirement (or omits the triggerable). `bind_on_join: true` also binds the script even when it is not on the living entity list.

| Key | Status | Notes |
| --- | --- | --- |
| `event` | Live | One name from the vocabulary |
| `events` | Live | Keyed map of rows (`type` plus filters) |
| `cooldown` | Live | Duration string (`1s`). Expire flag under `flag_saves.cooldowns` |
| `requirements` | Live | Same maps as mechanic requirements (`BOOLEAN`, `SNEAKING`, `FLAG`, `STAT`, `HAS_STATUS_EFFECT` for potions, …) |
| `mechanics` | Live | Keyed mechanic configs (or a root `operations` map) |
| `cancel_vanilla` | Live | Offhand swap and `ON_INVENTORY_CLICK` can cancel the vanilla move |
| `slot` / `hand` / `damage_type` / `item` / `block` / `ability` / `enemy` | Live | Filters on an event row. `hand` is `MAIN` or `OFFHAND` on clicks. `enemy: ENEMY` means the victim is not a player. `ANY` matches anyone |

Do not add `requires_casting_mode` or `toggle_casting_mode`. Those are Frontend overlay ops plus requirements.

## Snapshot then run

`fire_bound_triggerables` is two-pass. One world event is one snapshot of player state.

1. **Collect.** Walk the bind list. Event and filter match, then triggerable-root `requirements`, then each listed mechanic’s `requirements`. Every check uses flags as they were when the event fired. Bind-list order only decides the order of the collected set.
2. **Run.** Only that list. `run_mechanic_config` does not re-qualify siblings against writes from this same event.

That is why enter/exit can stay two Frontend triggerables with different `NARRATE` / `PLAY_SOUND`. Offhand enter (`BOOLEAN` `mode: NOT` on `stat_casting_mode`) and exit (`mode: HAS`) both bind `ON_OFFHAND_SWAP`. Enter’s `SET_STAT` must not make exit’s `HAS` pass in the same swap. The complementary pair is safe because exit is never collected while casting mode is off.

Do not use `wait 1t` to split complementary triggerables. Both still run after the write if you collect-and-run per script. `wait 1t` stays for inventory settle (menus, fakeitem). `ratelimit 1t` on the world hook stays as spam debounce.

`execute_mechanic` still checks requirements at run time for delayed or repeat mechanics. That is a later moment. The sibling race is solved in pass 1.

Smoke: `pirate-era-core-frontend/Triggerables/triggerable_examples.dsc` (`triggerable_cast_offhand_enter` / `triggerable_cast_offhand_exit`). One swap: one narrate and one sound.

## Stat-Event-Triggers

| Event | Wired from |
| --- | --- |
| `ON_DAMAGE_DEALT` / `ON_DAMAGE_TAKEN` / `ON_HIT_ENEMY` | `core_custom_damage_event` after routing (value `> 0`) |
| `ON_CRIT` | Same packet when `deal_damage` passes `crit: true`. No crit math yet |
| `ON_ABILITY_USED` | Contract. Fire from a SkillMove consumer later |
| `ON_ABILITY_DAMAGE` | `deal_damage` optional `ability:` |
| `ON_KILL` | `after entity death`. Cancelled vanilla hits use `damage_last_attacker_flag` because the death has no damager |
| `ON_CONSUME` | player consumes item. Item Config `consume:` envelope runs first. Failed gate cancels the eat |
| `ON_BLOCK_PLACE` / `ON_BLOCK_BREAK` | place / break. Material goes in event_values `type` |
| `ON_SPRINT_START` / `ON_SPRINT_STOP` | Existing sprint handlers, plus movement speed |
| `ON_LEFT_CLICK` / `ON_RIGHT_CLICK` / `ON_SHIFT_*` | Clicks block or air, and right-click entity. Shift also fires the unshifted event. `event_values.hand` is `MAIN` or `OFFHAND`. Split standing vs sneak with requirement `SNEAKING` `HAS` / `NOT` on the same event (legacy sneak+right). Or bind `ON_SHIFT_RIGHT_CLICK` and put `SNEAKING` `NOT` on the unshifted sibling so both do not run |
| `ON_EQUIP` | `after player equips armor` (Paper) |

Season pass XP uses `ON_KILL` from Frontend (`triggerable_seasonpass_kill_xp` → `GRANT_SEASON_XP`). Quest or boss XP is another triggerable. Do not add a Backend kill listener for the pass. See [season-pass.md](season-pass.md).

## World entrypoints (not a cast engine)

| Event | Wired from |
| --- | --- |
| `ON_OFFHAND_SWAP` | `on player swaps items` |
| `ON_HOTBAR_SLOT` | `after player holds item` (keys 1-9 and scroll). `slot` is `context.new_slot`. Not a letter-N key. Pressing the same slot again often does not fire |
| `ON_ITEM_USE` | Right click with a non-air item. Main: `on player right clicks block using:hand ignorecancelled:true` (block or air). Sneak cancels interact, so `after` never ran. Offhand: `hand: OFFHAND`. Vanilla often skips `using:off_hand` when main used the click, so main dispatch also starts the offhand path. Filter with `hand: MAIN` or `hand: OFFHAND` |
| `ON_INVENTORY_CLICK` | `on player clicks item in inventory` (not while an engine menu is open). `item` is the clicked ItemTag. `slot` is `helmet` / `chestplate` / `leggings` / `boots` for armor cells, else the raw inventory slot. Overlay-flagged items do not fire. `cancel_vanilla: true` stops vanilla from taking the item. Persist cosmetic unequip smoke is `menu_example_cosmetics`. A pack that plants an inventory handle uses this event plus `CLEAR_COSMETIC` itself |
| `ON_MOUNT` | Player enters a vehicle |

Optional SkillMove bind: `/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_bind_skillmove_1]>`

`fire_stat_event` fires bound triggerables, then Eventstats, then area `on_event`, then KILL quest objectives. Item Skills run when a triggerable calls `RUN_ITEMSKILL`. Item Config `consume:` runs from `ON_CONSUME` itself, not `RUN_ITEMSKILL`. See [items.md](items.md). Quest counting: [quests.md](quests.md).

A `skillmove_*` script is `type: data` with `mechanics` plus optional `categories`, `requirements`, and `costs`. Class membership is `BOOLEAN` on those requirements. See [skills.md](skills.md). `RUN_SKILLMOVE` with `skill:` runs that list. `stat:` reads a `kind: REFERENCE` row (menu persist `SET_STAT` writes the id). Banned category, failed requirements, or unpaid costs is a no-op.

First hit is Frontend: `ON_DAMAGE_DEALT` plus `BOOLEAN` `mode: NOT` on `stat_in_combat`, then `SET_STAT` `value: 1` with `duration:`. Do not add `ON_FIRST_HIT`.

## Eventstat Config

A normal `stat_*` plus `stat_event_config`. List it on the living entity `stats:` so join inits a level. Level `<= 0` does not fire.

```yaml
stat_event_sprint_start:
    type: data
    data:
        stat_config:
            ondeath: keep
        value_config:
            basevalue: 1
            maxvalue: 1
            level_cap: levelcap_fixed
            equation_config:
                type: linear
        stat_event_config:
            chance: 1
            trigger_mode: ALL
            target: SELF
            events:
                1:
                    type: ON_SPRINT_START
            mechanics:
                1:
                    operations:
                        1:
                            type: PLAY_SOUND
                            target: SELF
                            target_type: ENTITY
                            sound: BLOCK_NOTE_BLOCK_HAT
```

| Key | Status | Notes |
| --- | --- | --- |
| `chance` | Live | `0` to `1`, or `0` to `100` if greater than `1` |
| `trigger_mode` | Live | `ALL` fires every matching event row. `ONE` uses the first match |
| `target` | Live | `SELF` (host), `VICTIM` (dispatcher target list), `AOE` (living around the host) |
| `range` | Live | AOE radius. Default `triggerable_default_aoe_range` |
| `events` | Live | Rows with `type` and the same filters as triggerables |
| `mechanics` | Live | Keyed mechanic configs |
| `requirements` | Live | Mechanic requirement maps. Checked on the host as caster |
| Item-hosted eventstats | Contract | Board allows items. This slice is living-entity stats only |

Smoke: `pirate-era-core-frontend/Stats/event_stat_examples.dsc`.

## How to fire by hand

```text
/ex run fire_stat_event def.event_id:ON_SPRINT_START def.caster:<player>
/ex run initialize_player_triggerables
```

Production code uses `fire_stat_event` with `event_id`, `caster`, optional `targets` / `event_values` / `placeholders`.

## What can go wrong

- Omitting `triggerable_` on the script name. Reload will not register it.
- Forgetting the name on `livingentity_player.triggerables`. Join will not bind it unless `bind_on_join: true`.
- Reloading scripts without rejoining. The bound list is rebuilt on join. `bind_on_join: true` still needs one join after you add it.
- Expecting `ON_HOTBAR_SLOT` when you press 3 while already on slot 3. Vanilla often does not fire.
- Putting Eventstat mechanics in `stat_config`. They belong in `stat_event_config`.
- Using `wait 1t` inside a triggerable to stop a HAS/NOT sibling on the same event. Snapshot collect is the contract. `wait 1t` is for inventory settle only.
- Using `ON_OFFHAND_SWAP` for an offhand weapon swing. Weapon use is `ON_RIGHT_CLICK` with `hand: OFFHAND` (swing) or `ON_ITEM_USE` with `hand: OFFHAND` (item skill). Swap is still casting mode.
- Using `after player right clicks` for sneak+right. Sneak cancels the interact. The hook is `on` plus `ignorecancelled:true`.
- Putting eat logic on `itemskill_*` or `RUN_ITEMSKILL`. Item Config `consume:` plus `ON_CONSUME` is the eat path.
