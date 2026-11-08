---
sidebar_position: 44
---

# Cosmetic operations

`EQUIP_COSMETIC` saves a script id on `flag_saves.cosmetic_persist.<channel>` and spawns a marker armor stand passenger. The id is not the display UUID, and it is not a gear flag. `SPAWN_COSMETIC` is the session form: a passenger, or a vanilla-slot overlay when `slot` is `helmet` or `chestplate`. Passengers cannot follow a head or an arm, so a glide head and a zoan chest use the overlay, and the previous item is backed up on `flag_saves.cosmetic_overlays`. `CLEAR_COSMETIC` drops a channel, an overlay cell, or session VFX when `session: true`. `/hidecosmetics` hides the passenger from the owner only. Other players still see it. Remount uses the player loop. It does not use `- while`. Channel ids come from `global_build_config`. Do not invent a second slot map. The stand, the channels, and the poses are on [cosmetics](../../cosmetics.md). Entity choice is on [Display and pulse](display.md).

Tasks: `operation_equip_cosmetic`, `operation_clear_cosmetic`, `operation_spawn_cosmetic`. Nested Cosmetic Config (`cosmetic:`). Passenger entity is a marker `armor_stand` (`SpawnCosmetic`). The model is the stand helmet item. Persist channel ids come from Frontend `global_build_config` `cosmetic_channels`. Unequip is pack `CLEAR_COSMETIC` from a menu (`menu_example_cosmetics`). Engine does not plant dummy armor handles. A pack that still wants an inventory click uses `GIVE_ITEM` plus `ON_INVENTORY_CLICK` itself.

Gear is items. Cosmetics are stands. Frontend may run `EQUIP_GEAR` and `EQUIP_COSMETIC` on the same click. Backend does not spawn a stand because a gear id was set.

Harvest: `CosmeticStands.dsc` (cloak/back/sheath/hat, mount, `/PEtogglecosmetics` owner hide, swim/glide pose, join respawn) and `SkillCosmeticLogic.dsc` (session lifetime, swimming/gliding modeldata, `head` / `chestplate` / hands overlay). Remount is the player loop plus world hooks. Never `- while`.

**EQUIP_COSMETIC** persists the script id on `flag_saves.cosmetic_persist.<channel>` (not the entity UUID, not `flag_saves.gear`). Channel ids come from Frontend `global_build_config` `cosmetic_channels`. `channel:` on the op, else `slot:` as an alias, else the script `slot:`. Always spawns one passenger stand. Does not write vanilla armor. Pose-following hats stay `SPAWN_COSMETIC` overlays. Chopper hat in this pack is `GIVE_ITEM` `slot: helmet`. Join / 1s loop / world change respawn from `cosmetic_persist`.

**SPAWN_COSMETIC** is skill-time. Session only. `lifetime` or op `duration:` then remove. Else the `cosmetic_*` script `lifetime:`. Omit all three: until `CLEAR_COSMETIC` `session: true`, quit, or reload. Omit `slot:` (or use a persist channel id) for an armor_stand passenger. `slot: helmet` / `chestplate` / `leggings` / `boots` / `main_hand` / `off_hand` overlays that inventory cell. Backup is `flag_saves.cosmetic_overlays`. Passengers cannot follow head or arm pose, so glide heads and zoan chests must use this overlay.

`spin:` is yaw added on the remount pulse (walk `5t`, or the 1s player loop when standing). Legacy `rotation:` on skill cosmetics called `rotate_armorstand_while` (`- while` until despawn). That while is not ported. `rotation:` is an alias of `spin`. A map `{axis: 0,1,0, degrees: 18}` uses the Y degrees. A list `0,5,0` uses the second value as yaw.

**CLEAR_COSMETIC** with `channel:` (or `slot:` as the same key) drops that persist channel. Omit: every persist channel. A VANILLA overlay cell (`slot: helmet`) restores that overlay only. `session: true`: skill VFX and overlays.

Owner hide: `/hidecosmetics` (aliases `/packcosmetics`, `/pehidecosmetics`, `/PEtogglecosmetics`) uses `hide_entity` on you only. Other players still see the cloak. Same job as `/PEtogglecosmetics`. It does not hide real armor overlays. Swim/glide: persist cloaks hide (air item) unless the pack set a different pose modeldata or pose item. Stop-swim waits `1t` so a new glide keeps the hide. Session VFX swap CMD (phoenix wings). Overlay helmets swap CMD on the worn item. HIDDEN / spectator: `hide_from_players` on the passenger. Walk ratelimit `5t` looks and remounts. Spawn waits `1t` then remounts (resetstands). Teleport remounts. World change respawns persist ids. Overlay backups restore on join so a crash cannot keep the glide head as the persist helmet.

Live rows are indexed on `server.flag[cosmetic_index]`. Keys are `uuid` + `_` + channel (a dot nests the flag). Wipe on start and reload. Admin: `/packcosmetic list` / `prune` / `clear`. Wiki: [cosmetics.md](../../cosmetics.md).

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `EQUIP_COSMETIC`, `CLEAR_COSMETIC`, or `SPAWN_COSMETIC` |
| `cosmetic` | no | Nested config, or a `cosmetic_*` / `item_*` script name |
| `item` | no | Script name, ItemTag, or vanilla material |
| `slot` | EQUIP | Alias of `channel:` for persist, or a VANILLA overlay cell for SPAWN / CLEAR |
| `channel` | EQUIP | `cosmetic_channels` id. Else the script `slot:` |
| `take` | no | Take 1 from the hand. Default `false`. The cloak triggerable sets `true` |
| `session` | CLEAR | `true` clears skill-time displays only |
| `lifetime` | SPAWN | DurationTag or seconds. Op `duration:` wins. Else the `cosmetic_*` script `lifetime:` |
| `material` | no | Inline display material |
| `modeldata` | no | Default pose CMD. Aliases `custom_model_data` / `custommodeldata` |
| `swimming_modeldata` | no | Pose CMD. Persist hides instead when this matches default |
| `gliding_modeldata` | no | Pose CMD. Same hide rule as swimming |
| `swimming_item` | no | Pose item instead of CMD. Persist stays visible when set |
| `gliding_item` | no | Pose item instead of CMD |
| `spin` | no | Per remount pulse yaw `{axis, degrees}` or list Y value. `rotation:` is an alias |
| `target` | no | Who wears it. Default SELF. EQUIP needs a player |

```yaml
operations:
    1:
        type: EQUIP_COSMETIC
        target: SELF
        channel: cloak
        cosmetic: cosmetic_example_cloak
```

```yaml
operations:
    1:
        type: CLEAR_COSMETIC
        target: SELF
        channel: cloak
```

```yaml
operations:
    1:
        type: SPAWN_COSMETIC
        target: SELF
        cosmetic: cosmetic_example_wings
        lifetime: 8s
```

```yaml
operations:
    1:
        type: SPAWN_COSMETIC
        target: SELF
        slot: helmet
        cosmetic: cosmetic_example_glide_head
        lifetime: 15s
```

Smoke: `mechanic_example_cosmetics`. Give `item_example_cloak` / `item_example_back` / `item_example_hat` and right click. Cloak is relic plus stand. Back is `channel: back`. Hat is `GIVE_ITEM` into helmet. Overlay helmet swaps the real helmet to phoenix head (`golden_shovel` 19). Unequip persist from `menu_example_cosmetics`.

```text
/hidecosmetics
/packcosmetic list
```

Harvest: `CosmeticStands.dsc` and `SkillCosmeticLogic.dsc`. Port the armor_stand passenger. Do not port `- while`.
