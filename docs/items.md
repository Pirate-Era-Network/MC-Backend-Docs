---
sidebar_position: 15
---

# Items and Item Skills

**Partial.** Create/give stamps display plus `item_script` / `level` (and optional tier / set flags). Item Skills are `itemskill_*` envelopes loaded by `RUN_ITEMSKILL`. Eat is Item Config `consume:` plus `ON_CONSUME`. World click is a Frontend triggerable, same idea as SkillMove on hotbar. RepairProfile / LevelProfile YAML is still Contract. Spend itself is `APPLY_TRANSACTION`. Worn set-piece counting is not an engine.

Prefixes: `item_`, `itemskill_`. Pointer: `rules.dsc` `global_item_config` → Frontend script `global_item_config`.

## Item Config

`type: data`, name `item_<id>`. Example: `pirate-era-core-frontend/items/generic_items.dsc`.

```yaml
item_example_skill_wand:
    type: data
    data:
        display:
            displayname: <&a>Skill Wand
            material: stick
            custommodeldata: 0
            lore:
            - <gray>Right click to fire the item skill
        level: 1
        grip: ONE_HANDED
        skills:
            - itemskill_example_use
            - itemskill_example_gated
```

| Key | Status | Notes |
| --- | --- | --- |
| `display` | Live | `material`, `displayname`, `custommodeldata`, `lore`. Create looks for `custommodeldata`. `displayname` / `lore` may be a transcript key (`item_my_wand_name`) or a literal. See [language.md](language.md) |
| `level` | Live | Stamped on the ItemTag. `ITEM_IN_HAND_LEVEL` reads it |
| `skills` | Live | List or keyed map of `itemskill_*` ids. `RUN_ITEMSKILL` with no `skill:` reads this via `item_script` |
| `grip` | Live | Pack data (`ONE_HANDED` / `TWO_HANDED`). Not an occupy engine |
| `categories` | Live | List of names (`hat`). Reload index for `ITEM_CATEGORY` loot |
| `loot_crate` | Live | `lootcrate_*` id. `OPEN_LOOT_CRATE` with no `crate:` reads this |
| `unvaultable` / `soulbound` | Live | Stamped on the ItemTag. `OPEN_STORAGE` cancels deposit. See [vaults.md](vaults.md) |
| `untradable` | Live | Stamped on the ItemTag. `OPEN_TRADE` cancels deposit. See [trades.md](trades.md) |
| `consume` | Live | Eat envelope. `ON_CONSUME` runs it. Not `RUN_ITEMSKILL`. See Consume envelope below |
| `requirements` | Live | Same maps as mechanic requirements. Packs can also gate on the triggerable |
| `tier` / `set_id` | Live | Stamped as item flags. Set bonuses stay skill ids on Global Item YAML |
| `durability` | Partial | Applied with `adjust durability` when the value is a number |
| `value` / `repair_cost` / `level_cost` | Contract | Stored on the script. Spend with `APPLY_TRANSACTION`. RepairProfile YAML is still Contract |
| `equipment.slot` | Live | Global Build `gear_slots` id this relic belongs to (`ring`, `cloak`). `EQUIP_GEAR` writes `flag_saves.gear` when the op omits `slot:`. Not a cosmetic channel. Not a vanilla armor cell |
| `wiki` | Live | Longer player-wiki body. Transcript key or literal. See [wiki.md](wiki.md) |
| `notinwiki` | Live | `true` hides this script from `OPEN_WIKI_MENU` |
| `events` | Unused | Do not subscribe here. World event belongs on a triggerable |

`create_item_from_config` writes `item_runtime_flags` (`item_script`, `level`, optional `item_tier`, `item_set`, `unvaultable`, `soulbound`, `untradable`). Map-only items (no script name) skip `item_script`. Pack `withdraw_item` coins also get `currency_amount` and optional `currency_created_by` / `currency_created_by_name` from `Currencies/currency_item_utils.dsc`.

Gear is items. Cosmetics are stands. A giveable cloak can list `equipment.slot: cloak` so `EQUIP_GEAR` knows the relic slot, and the same click can run `EQUIP_COSMETIC` `channel: cloak`. Backend does not spawn a stand from the gear id. `item_example_ring` is relic only. `item_example_back` has no `equipment.slot` (back is a cosmetic channel, not a `gear_slots` id). `item_example_hat` uses `GIVE_ITEM` `slot: helmet`. See [cosmetics.md](cosmetics.md).

## Item Skill Config

`type: data`, name `itemskill_<id>`. Body is `mechanics`. Extra envelope keys match SkillMove (`categories`, `requirements`, `costs`, `cost_payer`). There is no `event:` on this script.

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
| `requirements` | Live | Envelope gates for the whole body. Unlocked is `BOOLEAN` / `STAT` here |
| `categories` | Live | Same banned-category list as SkillMove |
| `costs` | Live | Same Cost Component helpers as SkillMove |
| `cost_payer` | Contract | `CASTER` (default) or `MOUNT`. Same payers as SkillMove. See [mounts.md](mounts.md) |

World path: `triggerable_item_use_shift` (`ON_SHIFT_RIGHT_CLICK`, `hand: MAIN`, `ITEM_HAS_SKILLS`, flag `cooldown`) then `SWING`, `RUN_ITEMSKILL` with no `skill:` key, and `ITEM_COOLDOWN`. Standing right click is not a weapon skill.

Offhand: `triggerable_item_use_offhand` (`ON_RIGHT_CLICK`, `hand: OFFHAND`, `SNEAKING` `NOT`). Mechanic 1 is `SWING` plus a sweep sound. Mechanic 2 is `DEAL_DAMAGE` on `LOOK` range 3. Mechanic 3 is `RUN_ITEMSKILL` `hand: OFFHAND` when that item has skills. Casting mode still uses `ON_OFFHAND_SWAP` (F). Those are different inputs.

`RUN_ITEMSKILL` with `skill:` still loads one script (smoke / menus). Missing script or failed gate: no-op.

## Consume envelope

Item YAML `consume:` beside `skills:`. The world hook is `ON_CONSUME` (`on player consumes item`). Failed requirements or envelope cooldown cancel the right-click so the bite never starts, and cancel the consume event if it still fires. Vanilla never removes the item. `take: true` removes one `item_script` after the effects. `take: false` or omitting `take` keeps the item.

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
| `requirements` | Live | Same maps as mechanic requirements. Shared eat-lock is FE `BOOLEAN` / `ITEM_COOLDOWN` |
| `mechanics` | Live | Heal is `MODIFY_STAT`. Potions are `CAST_VANILLA_EFFECT`. Class unlock is persist `SET_STAT` BOOLEAN |
| `take` | Live | `true` removes 1 after the effects. `false` or omit keeps the item. Vanilla does not remove it either way |
| `dip_food` | Live | Omit means true. Right click at full food sets the bar one point down so the eat can start. `false` leaves a full bar, so vanilla will not start |

Clickable `commanddata` items stay Item Skill (`skills:` plus `RUN_ITEMSKILL`). Do not put eat logic on `itemskill_*`. Do not add `RUN_CONSUME`.

Smoke: `/packitem item_example_steak` then eat, including when the food bar is already full. `/packitem item_example_class_fruit` then eat. Second fruit eat cancels (`stat_class_example` already on). Steak and fruit share `stat_consume_cooldown`.

Hunger drain is `registry_gamerules` `hunger.lose`. `false` (this pack) forces food level full, same as legacy `determine 20`. `true` lets vanilla drain. A successful eat still fills the bar when `lose` is false.

## Global Item Config

Frontend script named `global_item_config`. Keys in `global_item_data_keys`. Getters: `Items/global_item_utils.dsc`.

| Key | Status | Notes |
| --- | --- | --- |
| `max_item_level` | Live | Number getter |
| `tiers` | Live | Keyed names |
| `skill_slots` | Live | Keyed lists of legal `itemskill_*` ids (loot later). Not a player unlock map |
| `sets` | Live | Row `needed_pieces` plus `skills` ids. Getters only. Do not count armor pieces here |

## Smoke

```text
/packitem
/packitem item_example_skill_wand
/packitem example_skill_wand 1
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_give_skill_wand]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_give_skill_wand_slot]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_run_itemskill]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_give_offhand_wand]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_give_offhand_wand]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_swing_offhand]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_item_cooldown]>
/packitem item_treasure_chest
/packitem item_example_cloak
/packitem item_example_back
/packitem item_example_hat
/packitem item_example_ring
/packitem item_example_steak
/packitem item_example_class_fruit
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[self_open_loot_crate]>
```

`/packitem` with no args lists registered `item_*` scripts. Quantity and another player name are optional. Linked players must be op. This is the pack-agnostic stand-in for legacy `/peitem`.

Eat `/packitem item_example_steak`. Stamina goes up and cooked_beef grays for 2s. Eat `/packitem item_example_class_fruit`. `stat_class_example` turns on. A second fruit eat cancels and keeps the apple.

Cosmetic giveables: `/packitem item_example_cloak` / `item_example_back` / `item_example_hat`. Relic: `/packitem item_example_ring`. Cloak right click is `EQUIP_GEAR` plus `EQUIP_COSMETIC`. Back is `EQUIP_COSMETIC` `channel: back`. Hat is `GIVE_ITEM` `slot: helmet`. Ring is `EQUIP_GEAR` `slot: ring`. Unequip persist from `menu_example_cosmetics`.

`GIVE_ITEM` does the same give through a mechanic (quest reward, menu confirm, `/ex`). Optional `slot:` plants in a VANILLA / HELD cell or starts `give` at a storage number. Omit it for the first empty bag slot. Optional `occupied:` is `DISPLACE` / `REPLACE` / `SKIP` when that dest cell already has an item.

Right-click the wand while sneaking. `itemskill_example_use` plays. Standing right click does not. `itemskill_example_gated` stays silent until `stat_class_example` is on (`self_grant_class_example`). Belly coin has no `skills:` so `ITEM_HAS_SKILLS` fails and the triggerable does not run.

Give the offhand wand, put it in the offhand slot in the inventory (F is casting mode and cancels the swap), standing right click. You should hear a sweep. Look at a mob within 3 blocks for `DEAL_DAMAGE`. The lower-pitch orb is the offhand item skill. Two sticks would share one overlay (vanilla material cooldown).

`get_global_item_max_level` should return `10`.

## What can go wrong

- Using `custom_model_data` in the item data map. The create proc looks for `custommodeldata`.
- Putting `event: ON_ITEM_USE` on the itemskill. The triggerable owns the click.
- Putting `events:` on the item. `skills:` is the id list. The triggerable owns the click.
- Putting eat logic on `itemskill_*` or calling `RUN_ITEMSKILL` from `ON_CONSUME`. Consume is Item Config `consume:`.
- Adding a Backend `consumecooldown` flag. Shared eat-lock is FE BOOLEAN / `ITEM_COOLDOWN`.
- Adding `runtime_data.item_skills_unlocked`. Gate with `BOOLEAN` on the skill.
- Adding `fire_item_skills` beside the triggerable. Load is `RUN_ITEMSKILL` only.
- Currency `costs` rows with no wallet funds. Grant belly first.
- Treating Global Item `sets.needed_pieces` as live worn-set fire. That count is not implemented.
- Expecting `grip: TWO_HANDED` to block the offhand slot. That occupy hook is not in this slice.
- Putting `ITEM_COOLDOWN` inside `set_trigger_cooldown`. The flag is the gate. The op is only the sweep.
- Putting `equipment.slot: helmet` and expecting `EQUIP_GEAR`. Helmet is a `GIVE_ITEM` dest. Gear ids are `gear_slots` rows.
- Writing a persist cloak id into `flag_saves.gear` by hand. Use `EQUIP_GEAR` for the relic and `EQUIP_COSMETIC` for the stand.
