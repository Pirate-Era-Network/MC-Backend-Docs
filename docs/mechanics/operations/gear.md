---
sidebar_position: 43
---

# EQUIP_GEAR and CLEAR_GEAR

`EQUIP_GEAR` stores an `item_*` id on `flag_saves.gear.<slot>`. `CLEAR_GEAR` removes one slot, or the whole map when `slot` is omitted. There is no entity and no inventory scan. A diamond helmet is not `gear.helmet`. That dest is [GIVE_ITEM](give-item.md). Slot ids come from Frontend `gear_slots`. `dummy` on that list is unused. `take: true` removes one from the bag or hand and gives the previous id back on replace. A cloak that should also appear on the player runs [EQUIP_COSMETIC](cosmetics.md) on the same mechanic. This op does not spawn a stand, and it does not copy worn armor into the gear flag.

Tasks: `operation_equip_gear`, `operation_clear_gear`. Persist `item_*` ids on `flag_saves.gear.<slot>`. Slot ids come from Frontend `global_build_config` `gear_slots` (`ring`, `backpack`, `cloak`, or any extra row). No entity. No inventory scan. A diamond helmet is not `gear.helmet`. `GIVE_ITEM` `slot: helmet` stays an inventory helper.

Gear is items. Cosmetics are stands. `EQUIP_GEAR` does not spawn a passenger. A cloak relic click that also needs a stand runs `EQUIP_COSMETIC` `channel: cloak` on the same Frontend mechanic.

`equipment.slot` on the `item_*` is pack data: which gear slot this relic belongs to. EQUIP reads it when the op omits `slot:`. Omit `item:` to use the held `item_*` script.

Optional `take:` removes 1 from bag/hand and gives the previous id back on replace. Default `false`. CLEAR with `take: true` gives the stored id back.

**CLEAR_GEAR** `slot: ring` clears that key. Omit slot: wipe the whole gear map.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `EQUIP_GEAR` or `CLEAR_GEAR` |
| `item` | EQUIP | Script id (`item_example_ring` or `example_ring`). Omit: held item |
| `slot` | no | `gear_slots` id. EQUIP: else `equipment.slot` on the item. CLEAR: omit means all |
| `take` | no | Take 1 from bag/hand, give old id back on replace or CLEAR. Default `false` |
| `target` | no | Who. Overlay `ENTITY`. Non-players are skipped |

```yaml
operations:
    1:
        type: EQUIP_GEAR
        target: SELF
        item: item_example_ring
        slot: ring
```

```yaml
operations:
    1:
        type: CLEAR_GEAR
        target: SELF
        slot: ring
        take: true
```

Smoke: `mechanic_example_gear`. `/packitem item_example_ring` then right click (`triggerable_equip_ring`). Unequip ring: `menu_example_cosmetics` or `self_clear_ring`.
