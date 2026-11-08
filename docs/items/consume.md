---
sidebar_position: 3
---

# Consume

Eat is Item Config `consume:` plus the `ON_CONSUME` triggerable (`on player consumes item`). It is not `RUN_ITEMSKILL`, and it is not an `itemskill_` body. Do not add `RUN_CONSUME`.

Failed requirements or the envelope cooldown cancel the right-click so the bite never starts, and cancel the consume event if it still fires. Vanilla never removes the item. `take: true` removes one `item_script` after the effects. `take: false` or omitting `take` keeps the item.

```yaml
item_example_steak:
    type: data
    data:
        display:
            displayname: item_example_steak_name
            material: cooked_beef
        consume:
            cooldown: 2s
            requirements:
                1:
                    type: BOOLEAN
                    stat: stat_consume_cooldown
                    mode: NOT
            mechanics:
                1:
                    operations:
                        1:
                            type: MODIFY_STAT
                            stat: stat_stamina
                            stat_operation: ADD_FLAT
                            amount: 5
```

| Key | Status | Notes |
| --- | --- | --- |
| `cooldown` | Live | Per `item_script` expire flag under `flag_saves.cooldowns` (`consume_<script>`). Not a global `consumecooldown` |
| `requirements` | Live | Same maps as mechanic requirements. Shared eat-lock is a Frontend `BOOLEAN` or `ITEM_COOLDOWN` |
| `mechanics` | Live | Heal is `MODIFY_STAT`. Potions are `CAST_VANILLA_EFFECT`. Class unlock is persist `SET_STAT` `BOOLEAN` |
| `take` | Live | `true` removes 1 after the effects. `false` or omit keeps the item. Vanilla does not remove it either way |
| `dip_food` | Live | Omit means true. Right click at full food sets the bar one point down so the eat can start. `false` leaves a full bar, so vanilla will not start |

Clickable `commanddata` items stay an [item skill](item-skill.md). Do not put eat logic on `itemskill_*`.

`/packitem item_example_steak` then eat, including when the food bar is already full. `/packitem item_example_class_fruit` then eat. A second fruit eat cancels because `stat_class_example` is already on. Steak and fruit share `stat_consume_cooldown`.

Hunger drain is `registry_gamerules` `hunger.lose`. `false` (this pack) forces food level full, same as legacy `determine 20`. `true` lets vanilla drain. A successful eat still fills the bar when `lose` is false.

The rest of the item script is on [Items](README.md).
