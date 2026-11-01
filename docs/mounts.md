---
sidebar_position: 14
---

# Mounts

**Live for the mount ops and the sit, quit, death, and reload save hooks.** `Mounts/` and the `SUMMON_MOUNT` through `SET_MOUNT_ROW` tasks read these keys. Area rule `MOUNT_SPEED_CAP` is registered. `none` means no scale.

A mount is an `entity_` with a `mount` block. `castset_` is a hotbar overlay set that block can list. `mount_` is a reserved prefix. Do not add a `mount_` script for physics or stats.

Owner is `entity_runtime_flags.owner` (`runtime_data.entity.owner`). Do not put the owner inside the mount flag.

## Mount block

`entity_data_keys.mount`. Absent means this entity is not a mount. Child names are `mount_block_keys`.

```yaml
entity_example_mount:
    type: data
    data:
        mythic: base_land_mob_tamed
        living_entity: livingentity_example_mount
        model: entitymodel_example_mount
        mount:
            physics:
                landSpeed: 0.3
                canFly: false
            passenger_bones:
                - seat
            passenger_policies:
                - NONE
                - ANYONE
            seat_cap: 1
            rider_can_damage: false
            cast_sets:
                - castset_example_mount_fly
                - castset_example_mount_driver
            restore:
                delay: 5m
            stat_converters:
                1:
                    field: landSpeed
                    stat: stat_agility
                    min_percent: 80
                    max_percent: 120
                    points: stat_mount_speed
```

| Key | Status | Notes |
| --- | --- | --- |
| `physics` | Contract | Map of `mount_physics_keys`. The only map copied onto the entity flag |
| `passenger_bones` | Contract | Bone ids for a passenger seat. Not the driver bone |
| `passenger_policies` | Contract | Allow-list. Values are `mount_passenger_policies` |
| `passenger_requirements` | Contract | Mechanic requirement maps. Caster is the sitter. Target is the owner |
| `seat_cap` | Contract | Passengers already seated. One more than this is refused. Omit and the bone list is the only cap |
| `rider_can_damage` | Contract | Hits from the driver or a passenger onto this mount. Default `false` cancels those hits |
| `cast_sets` | Contract | `castset_` ids in order. First requirements pass wins |
| `restore` | Contract | `mount_restore_keys` |
| `on_passenger` | Contract | Mechanics after a passenger is allowed to sit |
| `stat_converters` | Contract | Keyed rows of `mount_stat_converter_keys` |

The model uses controller `pemount` (`mount_controller`) and a driver bone named `mount` (`mount_driver_bone`). Pack YAML does not set those. A passenger seat is an extra bone. If the model only has the driver bone, a passenger cannot be seated.

`mount_defaults.passenger_policy` is `NONE`. `mount_defaults.rider_can_damage` is `false`.

## Physics

`mount_physics_keys` are the `MountSettings` field names, in camel case. Spawn stamps those names on the entity flag parent `mount_entity_flag` (`mount`). Omitted fields keep the Java defaults. Any other name on that flag is logged and skipped. Do not stamp `passenger_bones`, policies, or `flagPrefix`.

| Key | Kind |
| --- | --- |
| `movementMultiplier` | float |
| `turnSpeed` | float |
| `backwardsMultiplier` | float |
| `landSpeed` | float |
| `waterSpeed` | float |
| `waterYSpeed` | float |
| `airSpeed` | float |
| `airYSpeed` | float |
| `jumpHeight` | float |
| `canMove` | boolean |
| `canDive` | boolean |
| `canFly` | boolean |
| `sinks` | boolean |
| `waterLocation` | float |
| `ySwimStop` | float |
| `maxY` | int |
| `manualRotation` | boolean |
| `walkAnimationSpeed` | float |
| `swimAnimationSpeed` | float |
| `flyAnimationSpeed` | float |

`entityai_.movement_speed` is the zombie attribute. Ride speed is `landSpeed`, `waterSpeed`, and `airSpeed`. Area rule `MOUNT_SPEED_CAP` scales those three at the mount's location. `none` means no scale.

### Stat converter

One row writes one physics field, or one living stat. Living stats still use the entity profile formula (`row level * multiplier`) through `SET_STAT`. Mythic level is not adjusted.

| Key | Notes |
| --- | --- |
| `field` | A `mount_physics_keys` name, or a living stat id |
| `stat` | Rider stat that scales the field |
| `min_percent` | Low end of the scale |
| `max_percent` | High end of the scale |
| `points` | Row stat id whose level is the points |

This page names the inputs. It does not lock the arithmetic. The refresh task owns the scale.

## Cast sets

Prefix `castset_` (`castset_prefix`). Body keys are `castset_data_keys`.

```yaml
castset_example_mount_driver:
    type: data
    data:
        requirements:
            1:
                type: BOOLEAN
                stat: stat_class_example
                mode: HAS
        slots:
            stat_skillmove_1: skillmove_example_mount_dash
```

| Key | Status | Notes |
| --- | --- | --- |
| `requirements` | Contract | Same maps as mechanic requirements. First passing set on `cast_sets` wins |
| `slots` | Contract | `REFERENCE` stat id to a `skillmove_` id |

Apply is a session overlay (`set_stat_level_overlay` with no duration) on the slots that set names. Clear is `clear_stat_level_overlay` for those slots only. Never `SET_STAT` value `0` on a skill slot. That would wipe the persisted class bind.

List a flying set before a general driver set, or the general set always wins. No sets on the mount means the hotbar stays the player's class skills.

Ride checks are `mechanic_requirement_types`: `MOUNTED`, `MOUNT_ROLE`, and `MOUNT_LOCOMOTION`. `MOUNTED` is driver or passenger, with optional `mode` `HAS` (default) or `NOT`. `MOUNT_ROLE` reads `role` (`driver` or `passenger`, from `mount_roles`). `MOUNT_LOCOMOTION` reads `locomotion` (`ground`, `swim`, or `fly`, from `mount_locomotion_modes`). Swim is read before fly. Ground is a seated mount that is not swimming and not flying. An unseated player fails `MOUNT_ROLE` and `MOUNT_LOCOMOTION`.

`mount_runtime_flags.locomotion` (`runtime_data.mount.locomotion`) stores the last mode so a tick can see a change. `mount_runtime_flags.cast_set` stores the `castset_` id whose slots are overlaid, so a re-pick can clear that set first. The ride state itself stays on the PEmounts tags. Do not add a second flag map for it.

## Restore

`mount_restore_keys` on the mount block. Every key is optional.

| Key | Status | Notes |
| --- | --- | --- |
| `delay` | Contract | Summon and restore fail until this time has passed since `defeated_at` |
| `costs` | Contract | Cost Component. The restore op pays it |
| `requirements` | Contract | Mechanic requirement maps |
| `on_restore` | Contract | Mechanics after a successful restore |

A pack can use a fee, a wait, both, or neither. No training-point shop and no rank cooldown in these keys.

## Passenger policy

`mount_passenger_policies`:

| Value | Who may sit |
| --- | --- |
| `NONE` | No passengers. This is the default on a new row |
| `ANYONE` | Any player |
| `PARTY` | Players who share a party. Denied while that membership flag is absent |
| `CREW` | Players who share a crew. Denied while that membership flag is absent |

The mount block lists the values it allows. The row stores one of them. A write rejects anything else. `PARTY` and `CREW` can still be saved before social membership exists. The sit is what denies.

## Equipped row

`flag_saves.mounts` is `data.mounts`. Each key is an `entity_` script id. A row under that id means the player owns the mount. Summon does not create a row.

`flag_saves.equipped_mount` is `data.equipped_mount`. That is the owned id a summon uses when the call omits an id. It sits beside `data.mounts` so the id is not read as a row key.

`flag_saves.activemount` is `runtime_data.activemount`, the live entity. Empty when no body is out.

Row fields are `mount_row_keys`:

| Key | Status | Notes |
| --- | --- | --- |
| `stats` | Contract | Stat id to level. The first row uses each stat's minimum |
| `consumables` | Contract | Stat id to the saved number. The first row writes profile max for health at those levels. Do not read a consumable off an entity to create the row |
| `passenger_policy` | Contract | One allowed policy. Starts at `NONE` unless the same write sets another allowed value |
| `defeated_at` | Contract | Floor with no Time writes it once. A later floor save keeps that Time. A save above the floor removes the key. Absent means the row is not defeated |

`mount_row_write_keys` are the arguments that edit a row:

| Key | Notes |
| --- | --- |
| `create` | `true` plus `entity` writes the first row when none exists. A row that already exists is left alone |
| `entity` | `entity_` id for that first row |
| `equipped` | An owned id, or the id just created in this same call |
| `passenger_policy` | Only a value the mount block allows |
| `stat` | Stat id to change. Requires an existing row |
| `delta` | Level change for `stat`, inside that stat's cap |

The first row is this write with `create: true`. Unlock stays Frontend. The unlock menu, quest, or item calls this write. It does not spawn a body.

A defeated row stays blocked until restore succeeds. Depleted health is `defeated_at` plus the saved health at the floor.

## cost_payer

`skillmove_data_keys.cost_payer` and `itemskill_data_keys.cost_payer`. Values are `skillmove_cost_payers`. Omit uses `skillmove_cost_payer_default` (`CASTER`).

| Value | Who is charged |
| --- | --- |
| `CASTER` | The player's transaction, as `RUN_SKILLMOVE` does today |
| `MOUNT` | The consumable on the mount that player is sitting on. Not seated, or the mount has no such consumable, and the cost fails. The skill does not run |

`CURRENCY` and `ITEM` rows fail for `MOUNT`. Those wallets are players. Do not add a transaction party for this. `cost_source` on `APPLY_TRANSACTION` stays the list of cost rows.

A skill that should only work while mounted still uses a requirement. `cost_payer` only chooses whose consumable is read.

Regen is not a mount key. A spawned mount already uses the indexed living-entity regen path. Do not add a mount regen tick.

## Events

A model click and the `MOUNT` op both call `seat_player_on_mount`. A refused sitter is not seated. The owner uses `pemountseat` with `damage:` from `rider_can_damage`. A passenger uses `megmount` and does not pass a controller. `mount_world` on `pemount mounted` uses `context.as_driver`. A refused sit is cancelled. That listener stamps `mount_ridden` for a driver and for a passenger, and wipes goals. It does not pick the cast set on that tick.

`after pemount mounted` waits 5t for a driver and for a passenger. The driver refresh runs after that wait. The cast set is re-picked only when `player_mount_locomotion` is a mode, and that mode is stamped before the re-pick so the next second does not apply it again. A passenger runs `on_passenger` on the mount tick. Speed refresh stays driver only.

`after pemount dismounted` clears that rider's cast set, then clears `mount_ridden` when nobody else is still seated and restores the stamped AI mode. It moves them up one block when they are inside a solid. It does not remove the mount.

`runtime_data.entity.mount_ridden` is set while any player is seated. Combat, goal reapply, and `owner_attacked_target` are cancelled only while that flag is set. An unmounted battle pet still joins the fight.

Quit and rider death (`on player dies`) call `clear_live_mount` before companion recall. Mount death, `/packentity remove`, prune, crew despawn, and the start or reload index wipe save the row before the body goes, including when the owner is offline. The wipe's existing remove runs after the save.

A mount that also has a companion block closes that roster row to `RECALLED` and clears `world_entity` when the body leaves. Join and the 10 second pulse do not spawn it again. `SUMMON_MOUNT` is the way back out. `SET_COMPANION_STATE` `STORED` still wins, because the roster write happens after the remove save.

`area_example_mount_slow` entry and exit refresh the entity that crossed. While riding, that entity is the mount, so the speed cap applies on entry and clears on exit without a remount.

## Admin

`/packmount [summon|unsummon|list] (player)`. Ops or console. A missing player is the sender. `summon` uses the equipped row. `unsummon` saves and removes the live body. `list` narrates each stable row: script id, saved health, `defeated_at` or none, and whether `activemount` is that script and still spawned. Live bodies stay on `/packentity list`. A `RECALLED` companion row is not listed here.

## What can go wrong

- Writing a `mount_` script and expecting it to ride. The block is `entity_.mount`.
- Stamping the whole mount block onto the entity. Only `physics` field names go on flag `mount`.
- Putting `equipped` inside `data.mounts`. That key would be read as a mount id. Use `data.equipped_mount`.
- Listing a general driver cast set before a flying set. The general set wins and the flying set never applies.
- Clearing a cast set with `SET_STAT` value `0`. That wipes the persisted class bind. Clear the overlay.
- A `role` or `locomotion` value outside `mount_roles` or `mount_locomotion_modes`. The check fails.
- Charging `CURRENCY` or `ITEM` with `cost_payer: MOUNT`. The cost fails and the skill does not run.
- Putting the owner uuid inside the `mount` flag. Owner stays on `runtime_data.entity.owner`.
- Calling `clear_live_mount` from the index wipe or from mount death. That removes the body before the index task can read the stamp. Those paths save only.
