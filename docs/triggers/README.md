---
sidebar_position: 1
slug: /triggers
---

# Triggerables

One world event collects every matching triggerable before any of them run. A `HAS` and a `NOT` on that same click cannot see each other. Collect uses flags as they were when the event fired. Bind-list order only decides the order of that collected set. The run pass does not re-qualify a sibling against a write from this same event. That is why offhand enter (`BOOLEAN` `mode: NOT` on `stat_casting_mode`) and exit (`mode: HAS`) can both bind `ON_OFFHAND_SWAP`. Enter's `SET_STAT` does not make exit's `HAS` pass in the same swap.

Casting mode is not a Backend flag. It is a Frontend `SET_STAT` `session: true` on `stat_casting_mode`, plus `BOOLEAN` on the hotbar triggerable. Do not add `requires_casting_mode` or `toggle_casting_mode`.

A triggerable is `type: data`, name `triggerable_<id>`. List them on the living entity (`triggerables:`) the same way as stats. Join runs `initialize_player_triggerables` and stores the script names on `runtime_data.triggerables.bound`. `bind_on_join: true` also binds a script that is not on that list. Examples: `pirate-era-core-frontend/Triggerables/triggerable_examples.dsc`.

Eventstats, which are a `stat_` with `stat_event_config`, are on [Eventstats](eventstats.md).

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

A pack with no casting mode omits that requirement, or omits the triggerable.

| Key | Status | Notes |
| --- | --- | --- |
| `event` | Live | One name from the vocabulary below |
| `events` | Live | Keyed map of rows (`type` plus filters) |
| `cooldown` | Live | Duration string (`1s`). Expire flag under `flag_saves.cooldowns` |
| `requirements` | Live | Same maps as mechanic requirements |
| `mechanics` | Live | Keyed mechanic configs (or a root `operations` map) |
| `cancel_vanilla` | Live | Offhand swap and `ON_INVENTORY_CLICK` can cancel the vanilla move |
| `slot` / `hand` / `damage_type` / `item` / `block` / `ability` / `enemy` | Live | Filters on an event row. `hand` is `MAIN` or `OFFHAND` on clicks. `enemy: ENEMY` means the victim is not a player. `ANY` matches anyone |

Do not use `wait 1t` to split a `HAS` and a `NOT` on the same event. Both still run after the write if you collect and run per script. `wait 1t` stays for inventory settle. `ratelimit 1t` on the world hook stays as spam debounce. `execute_mechanic` still checks requirements at run time for a delayed or repeat mechanic. That is a later moment.

`fire_stat_event` fires bound triggerables, then Eventstats, then area `on_event`, then `KILL` quest objectives. Item skills run when a triggerable calls `RUN_ITEMSKILL`. Item Config `consume:` runs from `ON_CONSUME` itself. First hit is Frontend: `ON_DAMAGE_DEALT` plus `BOOLEAN` `mode: NOT` on `stat_in_combat`, then `SET_STAT` `value: 1` with `duration:`. Do not add `ON_FIRST_HIT`.

## World entrypoints

These are player inputs. They are not a cast engine.

| Event | Wired from |
| --- | --- |
| `ON_OFFHAND_SWAP` | `on player swaps items`. Casting mode. An offhand weapon swing is `ON_RIGHT_CLICK` with `hand: OFFHAND`, or `ON_ITEM_USE` with `hand: OFFHAND` |
| `ON_HOTBAR_SLOT` | `after player holds item` (keys 1-9 and scroll). `slot` is `context.new_slot`. Not a letter-N key. Pressing the same slot again often does not fire |
| `ON_ITEM_USE` | Right click with a non-air item. Main: `on player right clicks block using:hand ignorecancelled:true` (block or air). Sneak cancels interact, so `after` never ran. Offhand: `hand: OFFHAND`. Vanilla often skips `using:off_hand` when main used the click, so main dispatch also starts the offhand path. Filter with `hand: MAIN` or `hand: OFFHAND` |
| `ON_INVENTORY_CLICK` | `on player clicks item in inventory` (not while an engine menu is open). `item` is the clicked ItemTag. `slot` is `helmet` / `chestplate` / `leggings` / `boots` for armor cells, else the raw inventory slot. Overlay-flagged items do not fire. `cancel_vanilla: true` stops vanilla from taking the item |
| `ON_MOUNT` | Player enters a vehicle |

Shift-click also fires the unshifted event. Split standing versus sneak with requirement `SNEAKING` `HAS` or `NOT` on the same event, or bind `ON_SHIFT_RIGHT_CLICK` and put `SNEAKING` `NOT` on the unshifted sibling so both do not run.

The damage, kill, consume, and block names that Eventstats also use are on [Eventstats](eventstats.md).

## What can go wrong

- Omitting `triggerable_` on the script name. Reload will not register it.
- Forgetting the name on `livingentity_player.triggerables`. Join will not bind it unless `bind_on_join: true`.
- Reloading scripts without rejoining. The bound list is rebuilt on join.
- Expecting `ON_HOTBAR_SLOT` when you press 3 while already on slot 3. Vanilla often does not fire.
- Using `wait 1t` inside a triggerable to stop a `HAS` / `NOT` sibling on the same event.
- Using `ON_OFFHAND_SWAP` for an offhand weapon swing.
- Using `after player right clicks` for sneak plus right click. Sneak cancels the interact. The hook is `on` plus `ignorecancelled:true`.
