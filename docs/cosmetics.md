---
sidebar_position: 22
---

# Cosmetics and gear

**Live.** Gear is items. Cosmetics are stands. Frontend may run both on one click. Backend does not spawn a stand because a gear id was set.

Gear persist is `item_*` ids on `flag_saves.gear.<slot>` from `EQUIP_GEAR`. Cosmetic persist is one passenger armor stand per channel from `flag_saves.cosmetic_persist.<channel>` after `EQUIP_COSMETIC`. Session VANILLA/HELD slots overlay the real inventory cell so glide heads follow pose. Overlay backup: `flag_saves.cosmetic_overlays`. Runtime entities: `runtime_data.cosmetics`.

Prefix: `cosmetic_`. Gear slot ids: Frontend `global_build_config` `gear_slots`. Cosmetic channels: `cosmetic_channels`. Vanilla armor cells (`equipment_slots`) are `GIVE_ITEM` dests. They are not gear and they are not persist cosmetics.

## How legacy maps

| Legacy | Engine |
| --- | --- |
| `*_cloak` / `*_back` / `*_sheath` right click, stand passenger | `EQUIP_COSMETIC` persist id on `flag_saves.cosmetic_persist.<channel>`. Visual is the stand |
| `*_hat` right click, inventory slot 40 | Persist hat is a passenger on channel `hat`, or FE `GIVE_ITEM` into helmet. `EQUIP_COSMETIC` does not write slot 40 |
| `SpawnSkillCosmetic` session stand, lifetime, optional spin | `SPAWN_COSMETIC` omit slot or a passenger channel |
| Glide head / zoan chest on the player | `SPAWN_COSMETIC` `slot: helmet` / `chestplate` |
| Extra wearable | new `cosmetic_channels` row, any channel id |

Giveable `item_*` copy material plus `custommodeldata` from the matching `type: item` (`lucci_back` golden_axe 1, `marine_cloak` golden_hoe 7, `chopper_hat` golden_shovel 3). `create_item_from_config` stamps CMD with `ItemTag.with[custom_model_data=N]`, same as `SpawnSkillCosmetic`.

## Cosmetic Config

`type: data`, name `cosmetic_<id>`. Example: `pirate-era-core-frontend/Cosmetics/cosmetic_examples.dsc`.

```yaml
cosmetic_example_cloak:
    type: data
    debug: false
    data:
        slot: cloak
        display:
            displayname: cosmetic_cloak_name
            material: golden_hoe
            custommodeldata: 7
            lore:
                - cosmetic_cloak_lore
        wiki: cosmetic_cloak_wiki
```

| Key | Status | Notes |
| --- | --- | --- |
| `slot` | Live | Cosmetic channel id (`cloak`) or overlay cell (`helmet`). Persist channels are `cosmetic_channels` |
| `display` | Live | Same shape as Item Config display. Transcript keys allowed |
| `wiki` | Live | Longer wiki body. Same lookup as items |
| `lifetime` | Live | Default for `SPAWN_COSMETIC` when the op omits `lifetime` / `duration` |
| `spin` | Live | Per remount pulse yaw `{axis, degrees}`. `rotation:` is an alias |
| `swimming_modeldata` | Live | Pose CMD. Persist hides when this matches default |
| `gliding_modeldata` | Live | Pose CMD. Phoenix-style wings use a second CMD |
| `swimming_item` | Live | Optional pose ItemTag / script. Persist stays visible when set |
| `gliding_item` | Live | Optional pose ItemTag / script. Same rule as swimming_item |

`triggerable_equip_cloak` right-clicks `item_example_cloak` (legacy `marine_cloak`, `golden_hoe` 7). That click is FE composition: `EQUIP_GEAR` `slot: cloak` (relic) then `EQUIP_COSMETIC` `channel: cloak` (stand). Back is `triggerable_equip_back` (`item_example_back`, `lucci_back`, `golden_axe` 1) with `EQUIP_COSMETIC` `channel: back` only. Hat is `triggerable_equip_hat` (`item_example_hat`, `chopper_hat`, `golden_shovel` 3) with `GIVE_ITEM` `slot: helmet`. Copy material and `custommodeldata` from `legacy_examples` CosmeticStands / SkillCosmetics / fruit heads. Do not invent CMD integers.

## Ops

`EQUIP_COSMETIC` persist plus passenger on a `cosmetic_channels` id. `channel:` on the op, else `slot:` as an alias, else the script `slot:`. Always a passenger stand. Does not write vanilla armor.

`SPAWN_COSMETIC` session lifetime. Omit `slot:` for a passenger stand. `slot: helmet` / `chestplate` / hands overlay that inventory cell.

`CLEAR_COSMETIC` drop persist channel or `session: true`. See [mechanics/operations.md](mechanics/operations.md).

## Gear persist

Worn armor is not copied into `flag_saves.gear`. Use `EQUIP_GEAR` / `CLEAR_GEAR`. Gear persist is `item_*` ids on named `gear_slots` (`ring`, `backpack`, `cloak`). Cosmetic persist is `flag_saves.cosmetic_persist`. Vanilla armor cells are not gear.

Passenger cloak/back/sheath ids belong on cosmetic channels, not this map. Getters: `Builds/gear_utils.dsc` and `get_target_cosmetic_persist_id`. Slot list: `list_global_build_gear_slot_ids`. Channel list: `list_global_build_cosmetic_channel_ids`.

`equipment.slot` on an `item_*` is which `gear_slots` id that relic belongs to. `EQUIP_GEAR` reads it when the op omits `slot:`. It does not auto-equip from wearing pants. Cosmetics use `channel:` / script `slot:`, not `equipment.slot`.

`attach` on an `equipment_slots` row is still `VANILLA` for GIVE_ITEM dest cells. Persist cosmetic ids live on `flag_saves.cosmetic_persist.<channel>`. Gear ids live on `flag_saves.gear.<slot_id>`.

Packs pick unequip themselves:

| Pack style | FE |
| --- | --- |
| Custom gear menu | Menu click runs `CLEAR_COSMETIC` `channel: cloak` (and `CLEAR_GEAR` `slot: cloak` if that item is also a relic). Smoke: `menu_example_cosmetics` |
| Inventory handle | `EQUIP_COSMETIC` plus `GIVE_ITEM` `slot: leggings` plus `ON_INVENTORY_CLICK` `CLEAR_COSMETIC`. Engine does not plant that handle |
| Visual over real gear | `SPAWN_COSMETIC` overlay on a VANILLA cell. Persist cosmetic ids stay on `flag_saves.cosmetic_persist`. Gear item ids stay on `flag_saves.gear`. Overlay restore puts the real item back |

Engine does not plant dummy armor handles. Dummy legs axe is not required.

## Session overlay

Passengers do not follow head or arm pose. Phoenix glide heads and zoan chests were a real helmet/chest swap. `SPAWN_COSMETIC` with a VANILLA or HELD slot does that swap for the session.

Backup is the previous ItemTag on `data.cosmetic_overlays.<slot>`. Recast restores first so the backup stays the real item. Restore on `CLEAR_COSMETIC` `session: true`, `CLEAR` that slot, lifetime end, quit, world change, and join (crash recovery). Inventory clicks on overlay-flagged items cancel. Pose swim/glide swaps CMD on the overlay item. `/hidecosmetics` does not hide real armor.

## Hide, swim, glide

`/hidecosmetics` (aliases `/packcosmetics`, `/pehidecosmetics`, `/PEtogglecosmetics`) hides stands on your client. Others still see them. Same job as legacy `/PEtogglecosmetics`. Swim hides persist cloaks (legacy emptied the stand helmet). Stop-swim waits `1t` before restore so a glide that started in that tick keeps the hide. Glide uses the same pose path. Session skill VFX stay visible and swap CMD. HIDDEN / spectator hides passengers from everyone.

Look and remount pulse is `on player walks` ratelimited to `5t` (CosmeticUpdate). After spawn, `resetstands` cancels mount then remounts `1t` later so the passenger sits at the player. Join restores overlay backups then waits `20t` and respawns persist ids (`handle_cosmetics_on_join`). Quit is `kill_cosmetics` (drop stands, keep `cosmetic_persist` ids). Death is the same, then `respawncosmetics` after respawn. Teleport remounts. World change despawns then respawns persist. Reload wipes leftovers then respawns persist for online players.

`CLEAR_COSMETIC` with no `slot:` / `channel:` drops every persist channel (cloak/back/sheath and extra pack rows). `channel: back` is one row. Persist id is cleared on the same queue before the stand is removed so the 1s player loop cannot spawn it again. `session: true` is skill VFX and overlays only.

Admin: `/packcosmetic list` / `prune` / `clear`. Index keys are `uuid_channel` (cloak and back are two rows). A dot nested the flag so list only showed one uuid ghost.

## Smoke

`mechanic_example_cosmetics` `self_equip` / `self_equip_back` / `self_spawn` / `self_spawn_spin` / `self_overlay_helmet` / `self_clear` / `self_clear_back` / `self_clear_session`. `mechanic_example_gear` `self_equip_ring` / `self_clear_ring`. `/packitem item_example_cloak` then right click: relic plus cloak stand. `/packitem item_example_back` then right click: passenger back (golden_axe CMD 1, lucci). `/packitem item_example_hat` then right click: helmet plant. `/packitem item_example_ring` then right click: gear only. Unequip persist: hub slot or `/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_menu].data_key[data].get[open_cosmetics]>`. Overlay helmet is phoenix head (`golden_shovel` 19, glide 20). Wear a real helmet first, then overlay. Confirm the original returns on clear, quit, and relog. Leave and rejoin: one bird. `/packcosmetic list` should show two live persist rows (cloak and back), not one uuid ghost.

## What can go wrong

- Storing the entity UUID in `data.cosmetic_persist`. Store the `cosmetic_*` or `item_*` id.
- Writing persist display ids into `data.gear`. Gear is item relics. Cosmetics are `data.cosmetic_persist`.
- Spawning an `item_display` for a cloak. The passenger is an armor stand. The item is on the stand helmet.
- Expecting `EQUIP_COSMETIC` to write inventory slot 40. Persist EQUIP is a passenger stand. Hats that follow head pose are `SPAWN_COSMETIC` overlays. Chopper hat in this pack is `GIVE_ITEM` `slot: helmet`.
- Putting cloak/back/sheath items in chest/legs/boots and expecting the engine to plant them. Use `GIVE_ITEM` if this pack wants an inventory handle. Unequip is pack `CLEAR_COSMETIC` from a menu.
- `/packitem` giving a vanilla axe. `display.custommodeldata` must be the legacy integer. CMD is stamped with `.with[custom_model_data=N]`.
- Adding a second slot list next to `global_build_config`.
- Using `- while` to remount or spin. Remount and `spin:` use the player loop and the swim/glide/walk hooks.
- Clearing the stand but leaving `flag_saves.cosmetic_persist.<channel>`. The 1s loop respawns it. CLEAR wipes the id first, then the stand.
- Stashing the previous helmet only on a live queue. Overlay backup is persist. Join restores it.
