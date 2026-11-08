---
sidebar_position: 25
---

# GIVE_ITEM

`GIVE_ITEM` builds an Item Config and gives it. Omit `slot` and the item takes the first empty storage cell. Named armor and hand slots write that cell with `inventory set` or `equip`. Denizen `give` cannot fill a helmet or an offhand, so those dests do not use it. `occupied` decides what happens when the dest cell is full. Default is `DISPLACE`. A missing script or air does nothing. Gear relics that should persist an id without touching inventory are [gear](gear.md).

Task: `operation_give_item`. Builds the Item Config through `create_item_from_config` and gives it with `give_target_item_from_config`. Missing script or air is a no-op. Non-players are skipped. Omit `slot:` for the first empty storage cell. Named `helmet` / `chestplate` / `leggings` / `boots` / `main_hand` / `off_hand` write that dest cell. A storage number still uses `give`. Occupied dest cells use `occupied:` (`DISPLACE` kick to bag, `REPLACE` overwrite, `SKIP` leave occupier and bag the new item). Default `DISPLACE`. Player armor is `inventory set` on 40/39/38/37. Offhand is `equip`. Denizen `give` cannot fill those cells. `equip head:` is the passenger stand, not the player hat.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `GIVE_ITEM` |
| `item` | yes | Script id (`item_example_skill_wand` or `example_skill_wand`) |
| `quantity` | no | Integer. Default `1` |
| `slot` | no | Dest cell. VANILLA / HELD id or inventory number. Omit: first empty storage |
| `occupied` | no | Dest cell only. `DISPLACE` / `REPLACE` / `SKIP`. Default `DISPLACE` |
| `target` | no | Who. Overlay `ENTITY` |

Admin chat: `/packitem [item] (quantity) (player)`. See [items.md](../../items/README.md).

Smoke: `self_give_skill_wand` / `self_give_skill_wand_slot` in `mechanic_example_control_effects`.
