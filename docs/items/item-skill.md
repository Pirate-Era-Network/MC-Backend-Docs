---
sidebar_position: 2
---

# Item skill

An `itemskill_` script is the body a click runs. The world click is a Frontend triggerable, the same idea as a SkillMove on the hotbar. This script has no `event:` key. Do not put `ON_ITEM_USE` here, and do not put `events:` on the item. `skills:` on the item is the id list. Eat is [consume](consume.md), not this script.

`type: data`. The body is `mechanics`. Envelope keys match SkillMove.

```yaml
itemskill_example_use:
    type: data
    data:
        mechanics:
            1:
                operations:
                    1:
                        type: PLAY_SOUND
                        target: SELF
                        target_type: ENTITY
                        sound: ENTITY_EXPERIENCE_ORB_PICKUP
```

| Key | Status | Notes |
| --- | --- | --- |
| `mechanics` | Live | Keyed mechanic configs |
| `requirements` | Live | Envelope gates for the whole body. Unlocked is `BOOLEAN` or `STAT` here. There is no `runtime_data.item_skills_unlocked` |
| `categories` | Live | Same banned-category list as SkillMove |
| `costs` | Live | Same Cost Component helpers as SkillMove. A currency row needs funds in the wallet |
| `cost_payer` | Contract | `CASTER` (default) or `MOUNT`. Same payers as SkillMove. See [mounts](../mounts.md) |

World path: `triggerable_item_use_shift` (`ON_SHIFT_RIGHT_CLICK`, `hand: MAIN`, `ITEM_HAS_SKILLS`, flag `cooldown`) then `SWING`, `RUN_ITEMSKILL` with no `skill:` key, and `ITEM_COOLDOWN`. Standing right click is not a weapon skill. The flag is the gate. `ITEM_COOLDOWN` is only the gray sweep, and it is not unique per script when two items share a material.

Offhand: `triggerable_item_use_offhand` (`ON_RIGHT_CLICK`, `hand: OFFHAND`, `SNEAKING` `NOT`). Mechanic 1 is `SWING` plus a sweep sound. Mechanic 2 is `DEAL_DAMAGE` on `LOOK` range 3. Mechanic 3 is `RUN_ITEMSKILL` `hand: OFFHAND` when that item has skills. Casting mode still uses `ON_OFFHAND_SWAP`. Those are different inputs. Putting the wand in the offhand is an inventory click. F is casting mode and cancels the swap.

`RUN_ITEMSKILL` with `skill:` still loads one script (menus and examples). A missing script or a failed gate does nothing. Do not add `fire_item_skills` beside the triggerable.

The item keys that list these scripts are on [Items](README.md).
