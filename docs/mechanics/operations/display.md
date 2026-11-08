---
sidebar_position: 2
---

# Display and pulse

A spawn operation does not pick a new entity type for each skill. The choice is what the thing has to do. A projectile model, a GPS marker, or debris is an `item_display`. Floating text is a `text_display`. A wearable or a skill cosmetic is a marker armor stand passenger, with the model on the helmet. A physics entity is only for collision, a vanilla hit, AI, or real gravity. Displays have no gravity. A fall is a counted `repeat` of `adjust move`, not a physics entity and not `- while`. Projectile, hologram, GPS, debris, notable, spray, and cosmetic pages link here instead of copying this table. Harvest the legacy task before adding a spawn path. Do not invent a new entity type per skill.

**Default:** `item_display` / `text_display` / `block_display` for projectiles, holograms, GPS, and debris.

**Wearable cosmetics and skill cosmetic VFX** use a marker `armor_stand` passenger (`CosmeticStands.dsc` `SpawnCosmetic`, `SkillCosmeticLogic.dsc` `SpawnSkillCosmetic`). The stand wears the model on its helmet. Persist EQUIP is always that passenger. Pose-following hats and chests are `SPAWN_COSMETIC` overlays of a VANILLA cell. Cloak/back/sheath do not occupy chest/legs/boots.

**Physics entity only** when collision, vanilla hit, AI, or real gravity matter. Marker armor stands are not the text or hologram path.

| Need | Entity |
| --- | --- |
| Projectile model, GPS marker, debris | `item_display` |
| Hologram, damage number, floating text | `text_display` |
| Block-shaped VFX | `block_display` |
| Skill projectile travel (scripted collision) | `item_display` plus `pushentity` and solid/barrier checks |
| Vanilla projectile hit | optional `snowball` (`basicprojectile.dsc` `snowball:true`) |
| Real falling debris | `falling_block` |
| Flower burst / drop | dropped `item` |
| Combat pet / minion AI | MythicMob (`SPAWN_MINION`) |
| Player dash | the **player** (`DASH` / `APPLY_VELOCITY` on the caster) |
| Cloak / back / sheath / extra passenger slot | marker `armor_stand` passenger, item on stand helmet |
| Skill cosmetic VFX (wings, quake ring) | marker `armor_stand` passenger, same as `SpawnSkillCosmetic` |
| Hat | player inventory slot 40 |
| Glide head / zoan chest | real VANILLA overlay (`SPAWN_COSMETIC` `slot: helmet` / `chestplate`) |
| GPS follow marker | `item_display` teleported each pulse to a look-relative offset. Not armor stand |
| Spray on a block face | `item_frame` (or `item_display` on that face if pairing prefers it). Not armor stand |

## Harvest (leave the `while` behind)

- `Core/SkillSystem/Skills/SpawnArmorstand/static_armorstand.dsc` already spawns **`item_display`**. The task name is leftover. `static_armorstand_old` is the armor_stand path. Do not restore that as the default.
- `Core/Commands/PEhologram.dsc` used armor_stand for `/PEhologram` and `pedamageindicator`. **`create_textdisplay` is wired.** `SPAWN_HOLOGRAM` and damage numbers spawn `text_display` (pivot center, transparent background). `/packhologram` is the admin wrapper. Do not keep marker armor stands for text.
- `static_armorstand_gravity.dsc` proves displays have **no gravity**. It fakes fall with `gravity_simulation` (`adjust move` until solid). That loop is `- while`. The rewrite is counted `repeat`, not a physics entity just to get fall.
- `basicprojectile.dsc` default is `static_armorstand` (`item_display`) then `pushentity`. `snowball:true` is the vanilla-hit fallback.
- `Core/GPS system/GpsSystem.dsc` used armor_stand, `attach`, and `- while`. **START_GPS is wired.** `item_display`, teleport-follow, counted `repeat`. Attach to the owner is not visible to that player.

Do not write fruit or class skill bodies that spawn world entities until those ops exist and follow this page. Class membership stays Frontend `BOOLEAN` plus `inherit:`. This section is only entity type and pulse.

## Pulse (`repeat`, never `while`)

`- while` is forbidden in this repo (unbounded). Pulse count is lifetime ticks divided by tickrate ticks. Convert both to ticks (`20t` = `1s`). If the entity is gone, `- repeat stop`.

Example: lifetime `3s` (60t), tickrate `5t`. `60 / 5 = 12`. That is `- repeat 12` with `- wait 5t`. Same idea as mechanic `repeat.amount` plus `repeat.delay`.

Wrong (legacy `gravity_simulation`, GPS pulse, projectile until-despawn):

```
- while <[entity].is_spawned>:
    - run aoe_pulse
    - wait 5t
```

Right:

```
- define loop_count <[lifetime_ticks].div[<[tickrate_ticks]>]>
- repeat <[loop_count]>:
    - if !<[entity].is_spawned>:
        - repeat stop
    - run aoe_pulse
    - wait <[tickrate_ticks]>t
```

One file per op under `Mechanics/Individual_operations/`. One dispatcher case. Frontend smoke. Then add a Live section on this page. Do not add eleven Backend skill engines.
