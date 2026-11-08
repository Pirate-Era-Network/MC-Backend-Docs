---
sidebar_position: 1
slug: /items
---

# Items

Write an `item_` script when the pack needs a giveable thing: a wand, a relic, a coin, or food. Create and give stamp the display plus `item_script` and `level`, and optional tier or set flags. Gear is items. Cosmetics are stands. A cloak can list `equipment.slot: cloak` so `EQUIP_GEAR` knows the relic slot, and the same click can run `EQUIP_COSMETIC`. The gear id does not spawn the stand. See [cosmetics](../cosmetics.md).

Repair profiles and level profiles are still Contract. Spend itself is `APPLY_TRANSACTION`. Worn set-piece counting is not an engine. An eat block is [consume](consume.md), not an item skill. A click skill is [Item skill](item-skill.md), and that script has no `event:` key.

Pointer: `rules.dsc` `global_item_config` names the Frontend script `global_item_config`. Give from chat with `/packitem`. Examples: `pirate-era-core-frontend/items/generic_items.dsc`.

## Item Config

`type: data`, name `item_<id>`.

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
| `display` | Live | `material`, `displayname`, `custommodeldata`, `lore`. Create looks for `custommodeldata`. `displayname` and `lore` may be a transcript key (`item_my_wand_name`) or a literal. See [language](../language.md) |
| `level` | Live | Stamped on the ItemTag. `ITEM_IN_HAND_LEVEL` reads it |
| `skills` | Live | List or keyed map of `itemskill_*` ids. `RUN_ITEMSKILL` with no `skill:` reads this via `item_script`. The skill script is [Item skill](item-skill.md) |
| `grip` | Live | Pack data (`ONE_HANDED` / `TWO_HANDED`). Not an occupy engine. `TWO_HANDED` does not block the offhand slot |
| `categories` | Live | List of names (`hat`). Reload index for `ITEM_CATEGORY` loot |
| `loot_crate` | Live | `lootcrate_*` id. `OPEN_LOOT_CRATE` with no `crate:` reads this |
| `unvaultable` / `soulbound` | Live | Stamped on the ItemTag. `OPEN_STORAGE` cancels deposit. See [vaults](../vaults.md) |
| `untradable` | Live | Stamped on the ItemTag. `OPEN_TRADE` cancels deposit. See [trades](../trades.md) |
| `consume` | Live | Eat envelope. See [consume](consume.md) |
| `requirements` | Live | Same maps as mechanic requirements. Packs can also gate on the triggerable |
| `tier` / `set_id` | Live | Stamped as item flags. Set bonuses stay skill ids on Global Item YAML |
| `durability` | Partial | Applied with `adjust durability` when the value is a number |
| `value` / `repair_cost` / `level_cost` | Contract | Stored on the script. Spend with `APPLY_TRANSACTION`. RepairProfile YAML is still Contract |
| `equipment.slot` | Live | Global Build `gear_slots` id this relic belongs to (`ring`, `cloak`). `EQUIP_GEAR` writes `flag_saves.gear` when the op omits `slot:`. Not a cosmetic channel. Not a vanilla armor cell. `helmet` is a `GIVE_ITEM` dest |
| `wiki` | Live | Longer player-wiki body. Transcript key or literal. See [wiki](../wiki.md) |
| `notinwiki` | Live | `true` hides this script from `OPEN_WIKI_MENU` |
| `events` | Unused | Do not subscribe here. The world event belongs on a triggerable |

`create_item_from_config` writes `item_runtime_flags` (`item_script`, `level`, optional `item_tier`, `item_set`, `unvaultable`, `soulbound`, `untradable`). Map-only items (no script name) skip `item_script`. Pack `withdraw_item` coins also get `currency_amount` and optional `currency_created_by` / `currency_created_by_name` from `Currencies/currency_item_utils.dsc`.

`item_example_ring` is relic only. `item_example_back` has no `equipment.slot` (back is a cosmetic channel, not a `gear_slots` id). `item_example_hat` uses `GIVE_ITEM` `slot: helmet`. Do not write a cloak id into `flag_saves.gear` by hand.

The create proc looks for `custommodeldata`. `custom_model_data` in the item data map is not read.

## Global Item Config

Frontend script named `global_item_config`. Keys in `global_item_data_keys`. Getters: `Items/global_item_utils.dsc`.

| Key | Status | Notes |
| --- | --- | --- |
| `max_item_level` | Live | Number getter. `get_global_item_max_level` returns `10` on the example pack |
| `tiers` | Live | Keyed names |
| `skill_slots` | Live | Keyed lists of legal `itemskill_*` ids (loot later). Not a player unlock map |
| `sets` | Live | Row `needed_pieces` plus `skills` ids. Getters only. Do not count armor pieces here |

`sets.needed_pieces` is not a live worn-set fire. That count is not implemented.
