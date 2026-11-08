---
sidebar_position: 5
---

# Effect operations

Dispatcher: `handle_mechanic_operations` in `Mechanics/Core/mechanic_utils.dsc`. Each `operations.<n>.type` is a case. New ops get a file under `Mechanics/Individual_operations/` and a case here.

Always resolve targets with `resolve_mechanic_operation_targets`. Consumable current goes through `set_consumable_stat_value`. Persisted levels go through `set_stat`. Temporary levels go through `set_stat_level_overlay`.

## Display vs physics (locked)

Cross-cutting for every spawn op (Projectile, hologram, cosmetics, GPS, debris, notable). Harvest first. Do not invent a new entity type per skill.

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

### Harvest (leave the `while` behind)

- `Core/SkillSystem/Skills/SpawnArmorstand/static_armorstand.dsc` already spawns **`item_display`**. The task name is leftover. `static_armorstand_old` is the armor_stand path. Do not restore that as the default.
- `Core/Commands/PEhologram.dsc` used armor_stand for `/PEhologram` and `pedamageindicator`. **`create_textdisplay` is wired.** `SPAWN_HOLOGRAM` and damage numbers spawn `text_display` (pivot center, transparent background). `/packhologram` is the admin wrapper. Do not keep marker armor stands for text.
- `static_armorstand_gravity.dsc` proves displays have **no gravity**. It fakes fall with `gravity_simulation` (`adjust move` until solid). That loop is `- while`. The rewrite is counted `repeat`, not a physics entity just to get fall.
- `basicprojectile.dsc` default is `static_armorstand` (`item_display`) then `pushentity`. `snowball:true` is the vanilla-hit fallback.
- `Core/GPS system/GpsSystem.dsc` used armor_stand, `attach`, and `- while`. **START_GPS is wired.** `item_display`, teleport-follow, counted `repeat`. Attach to the owner is not visible to that player.

Do not write fruit or class skill bodies that spawn world entities until those ops exist and follow this page. Class membership stays Frontend `BOOLEAN` plus `inherit:`. This section is only entity type and pulse.

### Pulse (`repeat`, never `while`)

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

## Live

### PLAY_SOUND

Task: `operation_play_sound`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `PLAY_SOUND` |
| `sound` | yes | Bukkit sound name |
| `target` | no | Who. See [targeting.md](targeting.md) |
| `origin` | no | AOE search center. Default CASTER |
| `target_type` | no | Default LOCATION |
| `range` | no | LOOK / CURSOR ray, or AOE radius around origin |
| `origin_range` | no | LOOK / CURSOR ray when those are origin |
| `offset` | no | Locations |
| `volume` | no | Number or `stat_*` |
| `pitch` | no | Number or `stat_*` |
| `custom` | | Board field. Not read |

Plays to each resolved entity, or at each resolved location.

### PLAY_EFFECT

Task: `operation_play_effect`. Smoke: `mechanic_example_play_effect`. Templates: `pirate-era-core-frontend/Mechanics/effect_templates.dsc`.

Particles, local lightning, blockcrack overlay, screen shake, bleed worldborder, falling_block debris, drop bursts, or EffectLib shapes. Default `target_type` is LOCATION except `SCREEN_SHAKE` / `BLOODY_SCREEN` (those overlay ENTITY). Entities become feet locations unless `follow: true` (EffectLib origin is the entity).

`SCREEN_SHAKE` and `BLOODY_SCREEN` are mechanic VFX, not the HUD composer. `BLOCK_EXPLOSION` / `DEBRIS` spawn flagged falling_block that must not place. Explosion searches solid blocks around the cell **under** the target (`below[1]`), same as legacy quake. `DROP_BURST` is dropped items (hana/snow).

Harvest: `screenshakeeffect`, `bloodyscreeneffect`, `blockexplosioneffect`, `hanahanaflowereffect`, `fallingblockdropprevention` in `generalmovetasks.dsc`. Quake fruit calls `blockexplosioneffect`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `PLAY_EFFECT` |
| `kind` | no | `PARTICLE` (default), `LIGHTNING`, `BLOCK_CRACK`, `SCREEN_SHAKE`, `BLOODY_SCREEN`, `BLOCK_EXPLOSION`, `DEBRIS`, `DROP_BURST`, `HELIX`, `SPHERE`, `CIRCLE`, `CONE`, `CYLINDER`, `EQUATION`, `LINE`, `ATOM`. Omit kind if `effect:` is a particle, or if `x_equation` is set (EQUATION), or `effect: LIGHTNING` |
| `effect` | for PARTICLE | Particle name (`DUST`, `CLOUD`). Legacy `REDSTONE` / `block_crack` / `crit_magic` are aliased |
| `quantity` | no | Default `10`. Number or `stat_*` |
| `offset` | no | Particle spread. Default `0.5,0.5,0.5`. Targeting offset is separate (feet shift) |
| `visibility` | no | Default `50` |
| `special_data` | no | Map (`size` / `color` / `material`), or legacy `2|#C2B280`, or a bare material for BLOCK |
| `data` | no | PlayEffect `data:` number |
| `follow` | no | EffectLib only. Origin is the entity so the shape tracks them |
| `size` | no | BLOCK_CRACK search radius. Default `2`. Also EffectLib redstone size |
| `progress` | no | BLOCK_CRACK 1-10. Default `8` |
| `duration` | no | BLOCK_CRACK overlay, shake/bleed length, debris/drop lifetime |
| `amount` | no | SCREEN_SHAKE look nudge. Default `0.1` |
| `velocity` | no | BLOCK_EXPLOSION / DEBRIS fling, or particle velocity vector |
| `velocity_x` / `velocity_y` | no | DROP_BURST fling. Default `0.3` |
| `materials` | no | BLOCK_EXPLOSION / DEBRIS type list. Random per spawn. Else `material:` else the world block |
| `volume` | no | LIGHTNING replay volume. Default `3` |
| `effect_data` | no | Raw EffectLib map. Merged with the snake_case keys below |
| `particle` / `particles` / `color` / `iterations` / `period` / `radius` | no | Copied into `effect_data` |
| `x_equation` / `y_equation` / `z_equation` | for EQUATION | EffectLib `xEquation` etc. Quote YAML values that start with `-` or `#` |
| `relative_offset` | no | EffectLib `relative-offset` |
| `radius_increase` / `length_grow` / `angular_velocity` / `radius_grow` / `particles_cone` | no | Sphere / cone grow keys |
| `strands` / `curve` / `height` / `material` / `pitch` / `rotation` / `randomize` | no | Shape extras |
| `target` | no | Who. See [targeting.md](targeting.md) |
| `origin` | no | AOE search center |
| `range` | no | LOOK / AOE |

`LINE` origin is the resolved location. The other end is context TARGET when that is an entity.

Named fruit-style bursts are Frontend `mechanic_effect_*` templates. `RUN_MECHANIC` them. Overlay quantity or color with `inherit:`.

```yaml
operations:
    1:
        type: PLAY_EFFECT
        target: SELF
        effect: DUST
        quantity: 20
        special_data:
            size: 1.5
            color: red
```

```yaml
operations:
    1:
        type: RUN_MECHANIC
        mechanic: mechanic_effect_equation_slash
```

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_effect].data_key[data].get[self_dust]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_effect].data_key[data].get[self_lightning]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_effect].data_key[data].get[self_equation_slash]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_effect].data_key[data].get[self_screen_shake]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_play_effect].data_key[data].get[self_block_explosion]>
```

### MODIFY_STAT

Task: `operation_modify_stat`. Smoke: `mechanic_example_modify_stat` in `pirate-era-core-frontend/Mechanics/mechanic_examples.dsc`.

Consumable current only (heal / damage / fill). Skips stats that have no `stat_consumable_config`. Does not write levels.

This op always overlays `target_type` to `ENTITY`. Location-only rules (CURSOR) resolve to nobody. Targeting keys still go through `resolve_mechanic_operation_targets`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `MODIFY_STAT` |
| `stat` | yes | Consumable stat script name (`stat_stamina` or `stamina`) |
| `amount` | yes | Flat number, `stat_*` via `resolve_mechanic_value`, or a `mechanic_event_values` key (`damage`, `value`, …) |
| `stat_operation` | no | Default `ADD_FLAT`. Values from `mechanic_stat_operations` |
| `value_base` | no | Default `CURRENT`. `CURRENT` is the pool. `MAX` is the computed stat max. Used by `ADD_PERCENT` and `MULTIPLY` |
| `value_source` | no | `caster` or `target` when `amount` is a `stat_*` ref |
| `target` | no | Who. See [targeting.md](targeting.md) |
| `origin` | no | AOE search center. Default CASTER |
| `range` | no | LOOK ray, or AOE radius around origin |
| `origin_range` | no | LOOK / CURSOR ray when those are origin |

`stat_operation` values (`rules.dsc` `mechanic_stat_operations`):

| Value | Result |
| --- | --- |
| `ADD_FLAT` | current + amount (negative amount is damage). Ignores `value_base` |
| `ADD_PERCENT` | current + reference * amount. `CURRENT`: 2 and `0.5` gives 1. `MAX`: max 20 and `0.5` gives 10 |
| `MULTIPLY` | reference * amount |
| `SET` | amount. Ignores `value_base` |

Unknown `stat_operation` skips the write. Clamp (floor `depletes_to`, cap the computed stat max) happens inside `set_consumable_stat_value`.

Full Scalable Value Config (base/max/minLevel/maxLevel/equation on the op) is not wired. Use a number, a `stat_*` ref, or an event value key.

```yaml
self_heal_stamina:
    operations:
        1:
            type: MODIFY_STAT
            target: SELF
            stat: stat_stamina
            stat_operation: ADD_FLAT
            amount: 5
```

Percent of max (current 2, max 20, amount `0.5` restores 10):

```yaml
self_heal_stamina_percent_max:
    operations:
        1:
            type: MODIFY_STAT
            target: SELF
            stat: stat_stamina
            stat_operation: ADD_PERCENT
            value_base: MAX
            amount: 0.5
```

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_modify_stat].data_key[data].get[self_heal_stamina]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_modify_stat].data_key[data].get[self_damage_stamina]>
```

Check `/stats` for `Currently` on stamina.

### MODIFY_STAT_LEVEL

Task: `operation_modify_stat_level`. Smoke: `mechanic_example_modify_stat_level`.

Persisted level only (`set_stat` / `data.stats`). For menus, rewards, admin. Reads `get_target_persisted_stat_level` so a buff overlay cannot change the saved level. Skips entities that have no persisted level (`-1`).

Same keys as MODIFY_STAT except `stat` is any stat with a saved level. Default `stat_operation` is `ADD_FLAT`. Same targeting overlay (ENTITY).

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_modify_stat_level].data_key[data].get[self_add_stamina_level]>
```

Check `/stats` for `LvL` on that stat. This is progression. Do not put this on a combat skill.

### OVERLAY_STAT_LEVEL

Task: `operation_overlay_stat_level`. Smoke: `mechanic_example_overlay_stat_level`.

Temporary level. Writes `runtime_data.stat_level_overlays.<stat>` through `set_stat_level_overlay` with optional `expire:`. `get_target_stat_level` reads that flag first, then the persisted level. True `data.stats` is unchanged.

Math starts from the persisted level, then replaces the overlay (one overlay per stat). Default `stat_operation` is `SET`.

| Extra key | Required | Notes |
| --- | --- | --- |
| `duration` | no | DurationTag (`10s`), or a `NUMBER` / `VALUE` stat (seconds). Omit it to keep the overlay until `CLEAR_STAT_OVERLAY` |

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_overlay_stat_level].data_key[data].get[self_overlay_stamina_level]>
```

`/stats` `LvL` follows the overlay until it expires, then the true level.

### CLEAR_STAT_OVERLAY

`CLEAR_STAT_OVERLAY` with no `stat` drops every world-lock overlay, every overlay whose FE `presentation.cleansed` is true, and `runtime_data.banned_categories`. An explicit `stat` can be any overlay.

Same targeting overlay as the other stat ops (`ENTITY`).

Smoke keys live in `mechanic_example_control_effects`. What each key means: [control-effects.md](../control-effects.md) (Smoke tests).

### OPEN_MENU

Task: `operation_open_menu`. Smoke: `mechanic_example_open_menu` and `menu_example_hub` in Frontend.

Opens a `menu_*` data script as a virtual chest. Slot clicks run that slot's `mechanics` through `run_mechanic_config`. Full config: [menus.md](../menus.md).

This op always overlays `target_type` to `ENTITY`. Only players get a chest.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_MENU` |
| `menu` | yes | Menu script name (`menu_example_hub` or `example_hub`) |
| `target` | no | Who. Default SELF. See [targeting.md](targeting.md) |

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_menu].data_key[data].get[open_hub]>
/ex run open_menu_test def.menu_script:menu_example_hub
```

### CLOSE_MENU

Task: `operation_close_menu`. Closes the engine chest for each resolved player. `on_close` runs from the close dispatcher.

Same targeting overlay as OPEN_MENU (`ENTITY`).

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `CLOSE_MENU` |
| `target` | no | Who. Default SELF |

### OPEN_CONFIRM

Task: `operation_open_confirm`. Opens a DECISION kind chest (yes slot 21, no slot 25). Esc clears the payload and does not run `yes`. Never chat.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_CONFIRM` |
| `menu` | no | Default `menu_kind_decision` |
| `yes` | no | Mechanic map for Accept |
| `no` | no | Mechanic map for Deny |
| `previous_menu` | no | Return button and payload |
| `accept_lore` | no | Lore list written onto slot 21 |
| `target` | no | Who. Default SELF. Overlay `ENTITY` |

### OPEN_DIALOGUE

Task: `operation_open_dialogue`. Chest NPC talk (title glyph plus paging). Not a narrate loop.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_DIALOGUE` |
| `menu` | no | Default `menu_kind_dialogue` |
| `npc` | no | Catalog key in `gui_appearance.npc` |
| `npc_name` | no | Name drawn in the NPC box |
| `dialogue` | no | String or list. Wrapped to `characters_per_line` |
| `on_finish` | no | Mechanic map on the last-page close button |
| `with_villager_sound` | no | Plays on page buttons |
| `target` | no | Who. Overlay `ENTITY` |

### OPEN_TYPING

Task: `operation_open_typing`. In-chest keyboard. Confirm Mechanics get `event_values.text`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_TYPING` |
| `menu` | no | Default `menu_kind_typing` |
| `confirm` | no | Mechanic map. Receives `text` |
| `previous_menu` | no | Opened after confirm. Else the chest closes |
| `target` | no | Who. Overlay `ENTITY` |

### OPEN_STORAGE

Task: `operation_open_storage`. Real item chest. PRIVATE writes `flag_saves.vaults`. SHARED is a noted inventory. Not `OPEN_MENU`. Full config: [vaults.md](../vaults.md).

This op overlays `target_type` to `ENTITY`. Only players get a chest.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_STORAGE` |
| `vault` | no | Page id. Default `global_vault_config.default_private_id` |
| `kind` | no | `PRIVATE` (default) or `SHARED` |
| `size` | no | 9 to 54 in steps of 9 |
| `size_stat` | no | NUMBER/VALUE for size. Else pack `size_stat` |
| `target` | no | Who. Default SELF |

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_storage].data_key[data].get[open_private]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_storage].data_key[data].get[open_shared]>
```

### OPEN_TRADE

Task: `operation_open_trade`. Shared 54 chest, ready handshake, swap, cancel return. Caster is player one. First other resolved player is the partner. Not `OPEN_MENU`. Full config: [trades.md](../trades.md).

This op overlays `target_type` to `ENTITY`. Only players get a chest.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_TRADE` |
| `target` | no | Partner. `LOOK` at a player |
| `menu` | no | Layout script. Default `menu_trade` |
| `max_distance` | no | Omit here and in `global_trade_config` for unlimited |

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_trade].data_key[data].get[look_partner]>
/packtrade list
```

### SET_STAT

Task: `operation_set_stat`. One op, two layers.

| Keys | Meaning |
| --- | --- |
| `value: 1` or a number/id, no `duration`, no `session` | Persist (`data.stats`). Menus bind REFERENCE slots here |
| same + `duration: 10s` | Overlay expire (timed on) |
| same, `session: true`, no duration | Overlay until `SET_STAT` `value: 0` or `CLEAR_STAT_OVERLAY` |
| `value: 0` | Clear overlay for that stat, then persist 0 |

Flip without a fixed 0/1 is `TOGGLE_STAT`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `SET_STAT` |
| `stat` | yes | `stat_skillmove_1` or any stat |
| `value` | yes | Number, 0/1, script id, or `stat_*` (`NUMBER` / `VALUE` / `REFERENCE`) |
| `duration` | no | Overlay expire. Flat `10s`, or a `NUMBER` / `VALUE` stat (seconds) |
| `value_source` | no | `caster` (default) or `target` when `value` or `duration` is a `stat_*` ref |
| `session` | no | Overlay with no expire |
| `target` | no | Who. Overlay `ENTITY` |

### RUN_SKILLMOVE

Task: `operation_run_skillmove`. Loads a `skillmove_*` data script and runs its `mechanics` with the current caster/targets. Envelope gates run first: banned categories, skill `requirements`, then Cost Component `costs` (check then take into Void). Class is a `BOOLEAN` requirement on the skill, not a loader filter. Failed gate is a no-op. This is still a loader, not a cast engine.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `RUN_SKILLMOVE` |
| `skill` | no | Script id (`skillmove_example` or `example`) |
| `stat` | no | REFERENCE stat whose stored value is the script id |

One of `skill` or `stat` is required. Missing script or unbound `none` is a no-op.

### RUN_ITEMSKILL

Task: `operation_run_itemskill`. Loads `itemskill_*` data and runs `mechanics` with the current caster/targets. Same envelope as `RUN_SKILLMOVE` (banned categories, skill `requirements`, Cost Component `costs`). Failed gate is a no-op. World click is a Frontend triggerable (`ON_ITEM_USE` plus `SNEAKING` / `ITEM_HAS_SKILLS`). This is still a loader, not a cast engine.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `RUN_ITEMSKILL` |
| `skill` | no | One script id (`itemskill_example_use` or `example_use`). Omit to load `skills:` from the click/held Item Config |
| `hand` | no | `MAIN` or `OFFHAND`. When set, `skills:` come from that slot on the caster. Ignore click item. |

Missing script is a no-op. Unlocks are `BOOLEAN` on the skill, not a Backend map.

### RUN_MECHANIC

Task: `operation_run_mechanic`. Loads a `mechanic_*` data script and runs it with the current caster/targets. Overlay this op's `duration` as that child's root `duration`, then inherit-resolve (op duration still wins). Nested `RUN_MECHANIC` stops after depth 8 (same as inherit). Missing script is a no-op.

`inherit:` is template specialization (`mechanic_stun_heavy`). `RUN_MECHANIC` is runtime composition (a skill lists stun, then narrate).

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `RUN_MECHANIC` |
| `mechanic` | yes | Script id (`mechanic_stun` or `stun`) |
| `duration` | no | Becomes the child's root duration. Omit to keep the child's own root duration, or omit on both for until-cleanse / persist |

```yaml
operations:
    1:
        type: RUN_MECHANIC
        mechanic: mechanic_stun
        duration: 8s
    2:
        type: NARRATE
        target: TARGET
        transcript: you_were_stunned_text
        text: you were stunned
```

Smoke: `self_run_mechanic_stun` and `self_run_mechanic_stun_3s` in `mechanic_example_control_effects`.

### TOGGLE_STAT

Task: `operation_toggle_stat`. Per resolved entity: if effective on (overlay or persist > 0), same as `SET_STAT` `value: 0`. If off, same as `SET_STAT` `value: 1` with this op's `session:` / `duration:`.

Not the enter/exit replacement. Different sounds and narrates stay two triggerables (or two mechanic blocks with complementary `BOOLEAN`). Use this for menus and a single cue.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `TOGGLE_STAT` |
| `stat` | yes | Any stat (`stat_casting_mode`) |
| `duration` | no | Used only when turning on |
| `session` | no | Used only when turning on |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `self_toggle_casting_mode` in `mechanic_example_control_effects`.

### CAST_VANILLA_EFFECT

Task: `operation_cast_vanilla_effect`. Vanilla potion. Named blindness/slowness are Frontend templates that call this.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `CAST_VANILLA_EFFECT` |
| `effect` | yes | Potion type (`BLINDNESS`, `SLOW`, `SPEED`) |
| `duration` | no | Potion duration |
| `amplifier` | no | Default 0 |
| `target` | no | Who. Overlay `ENTITY` |

### BAN_CATEGORY

Task: `operation_ban_category`. Timed flags under `flag_saves.banned_categories`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `BAN_CATEGORY` |
| `category` | no | One string (`mobility`) |
| `categories` | no | List of strings |
| `duration` | no | Flag expire |
| `target` | no | Who. Overlay `ENTITY` |

### inherit (mechanic data)

Not an op. On a mechanic map or script `data:`:

```yaml
mechanic_stun_heavy:
    type: data
    data:
        inherit: mechanic_stun
        duration: 10s
```

Resolver: load parent `data`, overlay child keys, merge operation maps (extra keys append), then stamp root `duration` once onto ops that omitted it. An op that already has `duration` keeps it. Omit duration on both root and op: world locks and overlays last until cleanse, `SET_STAT` without duration or session persists. Smoke: `self_apply_stun` in `mechanic_example_control_effects`. Runtime composition of a finished template is `RUN_MECHANIC`, not another inherit.

### NO_WALK / NO_JUMP / HIDDEN / …

Task: `operation_world_lock`. Same pattern as `PLAY_SOUND`. Writes `flag_saves.world_locks` then runs the Minecraft hook. Not `SET_STAT`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `NO_WALK`, `NO_JUMP`, `NO_MELEE_DAMAGE`, `INVULNERABLE`, `NO_KNOCKBACK`, `HIDDEN`, `UNTARGETABLE` |
| `duration` | no | Lock expire. Omit to keep until cleanse |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `self_apply_no_walk`. See [control-effects.md](../control-effects.md).

### NARRATE

Task: `operation_narrate`. Chat to each resolved player.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `NARRATE` |
| `transcript` | no | Key in `general_transcript_*` for each resolved player. Preferred for pack chat |
| `text` | no | Literal fallback if `transcript` is omitted or the key is empty. One of `transcript` or `text` is required |
| `format` | no | Key in `global_format_config` (`command_format`, `command_text_format`) |
| `target` | no | Who. Overlay `ENTITY`. Non-players are skipped |

### TELEPORT

Task: `operation_teleport`. Moves each resolved player to `location:`. Missing or non-location is a no-op.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `TELEPORT` |
| `location` | yes | LocationTag (Backend-built maps, not pack YAML strings) |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `/staticloot list` row click.

### TRAVEL_TO_WAYPOINT

Task: `operation_travel_to_waypoint`. A placed row on `waypoint_index` is the live spot. A `waypoint_` script with the same id adds requirements and `travel_cost`. Full page: [travel.md](../travel.md).

`ignore_cost` and `ignore_requirements` skip those two gates. Area `TRAVEL: DENY` still blocks the move. A failed pay does not teleport. Arrival calls `fire_quest_waypoint`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `TRAVEL_TO_WAYPOINT` |
| `waypoint` | yes | `waypoint_example_dock` or `example_dock`. `waypoint_id` is the same field |
| `ignore_cost` | no | `true` skips `travel_cost` |
| `ignore_requirements` | no | `true` skips `requirements` |
| `target` | no | Who. Overlay `ENTITY`. Non-players are skipped |

```yaml
operations:
    1:
        type: TRAVEL_TO_WAYPOINT
        target: SELF
        waypoint: waypoint_example_dock
```

Smoke: `mechanic_example_travel`. `/packwaypoint go waypoint_example_dock`.

### GIVE_ITEM

Task: `operation_give_item`. Builds the Item Config through `create_item_from_config` and gives it with `give_target_item_from_config`. Missing script or air is a no-op. Non-players are skipped. Omit `slot:` for the first empty storage cell. Named `helmet` / `chestplate` / `leggings` / `boots` / `main_hand` / `off_hand` write that dest cell. A storage number still uses `give`. Occupied dest cells use `occupied:` (`DISPLACE` kick to bag, `REPLACE` overwrite, `SKIP` leave occupier and bag the new item). Default `DISPLACE`. Player armor is `inventory set` on 40/39/38/37. Offhand is `equip`. Denizen `give` cannot fill those cells. `equip head:` is the passenger stand, not the player hat.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `GIVE_ITEM` |
| `item` | yes | Script id (`item_example_skill_wand` or `example_skill_wand`) |
| `quantity` | no | Integer. Default `1` |
| `slot` | no | Dest cell. VANILLA / HELD id or inventory number. Omit: first empty storage |
| `occupied` | no | Dest cell only. `DISPLACE` / `REPLACE` / `SKIP`. Default `DISPLACE` |
| `target` | no | Who. Overlay `ENTITY` |

Admin chat: `/packitem [item] (quantity) (player)`. See [items.md](../items.md).

Smoke: `self_give_skill_wand` / `self_give_skill_wand_slot` in `mechanic_example_control_effects`.

### EQUIP_GEAR / CLEAR_GEAR

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

### GRANT_LOOT

Task: `operation_grant_loot`. Resolves a `loottable_*` for each player (`Loot/loot_utils.dsc`) then `grant_loot_results`. Missing table is a no-op. Non-players are skipped. Party split is not this op.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `GRANT_LOOT` |
| `table` | yes | `loottable_example` or `example` |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `self_grant_loot`. Also `/ex run loot_test def.loot_table:loottable_example`. Shape: [loot.md](../loot.md).

### START_QUEST / ADVANCE_QUEST / COMPLETE_QUEST

Tasks: `operation_start_quest`, `operation_advance_quest`, `operation_complete_quest`. Progress is `flag_saves.quests`. Full page: [quests.md](../quests.md).

`START_QUEST` writes `ACTIVE` and zero objectives. A listed `previous` quest must already be `COMPLETE`. Already active or complete does nothing.

`ADVANCE_QUEST` adds `amount` (default `1`) to one objective on an active quest. Typed objectives advance themselves. This op is the manual bump.

`COMPLETE_QUEST` turns in when every objective is full and `requirements` pass. It does not skip those gates. Staff skip is `/packquest force`.

Autocomplete uses the same complete task. A skill gate is `SET_STAT` on a Frontend BOOLEAN inside `complete_mechanics`. These ops do not read a quest id as a requirement.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `START_QUEST`, `ADVANCE_QUEST`, or `COMPLETE_QUEST` |
| `quest` | yes | `quest_example` or `example` |
| `objective` | ADVANCE | Objective key on that quest |
| `amount` | no | ADVANCE only. Default `1` |
| `target` | no | Who. Overlay `ENTITY`. Non-players are skipped |

```yaml
operations:
    1:
        type: START_QUEST
        target: SELF
        quest: quest_example
```

Smoke: `/packquest start quest_example`, kill two (or `/packquest advance quest_example defeat_anyone 2`), then `/packquest complete quest_example_turnin`.

### GRANT_SEASON_XP

Task: `operation_grant_season_xp`. Adds progress on the in-window `seasonpass_`. Converts to levels with counted `repeat`. Missing season or closed window is a no-op. Non-players are skipped. XP sources are triggerables (`ON_KILL` smoke: `triggerable_seasonpass_kill_xp`). Do not add a kill world script.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `GRANT_SEASON_XP` |
| `amount` | no | XP to add. Default `1`. Number or `stat_*` |
| `season` | no | `seasonpass_example` or `example`. Omit: first in-window file |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `mechanic_example_seasonpass` `self_xp`. `/packseasonpass xp 10`. Wiki: [season-pass.md](../season-pass.md).

### SET_SEASON_TRACK

Task: `operation_set_season_track`. Persist `FREE` or `PAID` on that season. Shop `APPLY_TRANSACTION` `onsuccess` calls this.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `SET_SEASON_TRACK` |
| `track` | yes | `FREE` or `PAID` |
| `season` | no | Same as GRANT_SEASON_XP |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `self_paid` / `self_free`. `/packseasonpass track paid`.

### REDEEM_SEASON_REWARD

Task: `operation_redeem_season_reward`. Stamps `redeemed` then runs that row's `rewards` ops (`GRANT_LOOT` / `GIVE_ITEM` / `SET_STAT`). Paid rows require `PAID`. Omit `level` and `track` to mass redeem. Omit `track` with a `level` to claim both rows for that level.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `REDEEM_SEASON_REWARD` |
| `level` | no | Track row. Omit: every eligible row |
| `track` | no | `FREE` or `PAID`. Omit: both |
| `season` | no | Same as GRANT_SEASON_XP |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: PAGE click, SCROLL row click, `self_redeem_all`, `/packseasonpass redeem`.

### OPEN_SEASON_PASS

Task: `operation_open_season_pass`. Opens `menu_seasonpass` (PAGE) or `menu_seasonpass_scroll` (SCROLL) with a Backend overlay. New menu id each open so PAGE recopies `itemlist`. Closed window shows a barrier row.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_SEASON_PASS` |
| `view` | no | `PAGE` (default) or `SCROLL` |
| `menu` | no | Override the rules menu script |
| `season` | no | Same as GRANT_SEASON_XP |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: hub slots, `self_open` / `self_open_scroll`, `/packseasonpass` / `/packseasonpass scroll`.

### OPEN_LOOT_CRATE

Task: `operation_open_loot_crate`. Opens `PETreasurechestMenu`-style 27 chest (glass panes, prize slot 14), then grants on close. Missing crate is a no-op.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_LOOT_CRATE` |
| `crate` | no | `lootcrate_example`. Omit to read `loot_crate` from the event item |
| `consume` | no | Override the crate YAML `consume` |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `self_open_loot_crate`. Item: `item_treasure_chest` plus `triggerable_loot_crate_item`. World containers are `/staticloot`, not this op.

### ITEM_COOLDOWN

Task: `operation_item_cooldown`. Vanilla gray sweep (`itemcooldown`). Per **material**, not per `item_script`. Does not write the triggerable cooldown flag. Omit `duration` is a no-op (no magic 1s).

`itemcooldown` uses the queue linked player. Prefer `target: SELF` on the clicker.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `ITEM_COOLDOWN` |
| `duration` | yes | Sweep length. Flat `1s`, or a `NUMBER` / `VALUE` stat (seconds) |
| `material` | no | Bukkit material. Omit to use the target's item in `hand` |
| `hand` | no | `MAIN` (default) or `OFFHAND` when reading the item for material |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `self_item_cooldown`. Weapon path: `triggerable_item_use_shift`.

### SWING

Task: `operation_swing`. Player `animate` ARM_SWING / ARM_SWING_OFFHAND. Not dual-wield logic.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `SWING` |
| `hand` | no | `MAIN` (default) or `OFFHAND` |
| `target` | no | Who. Overlay `ENTITY`. Non-players are skipped |

Smoke: `self_swing_main` / `self_swing_offhand`. Offhand weapon: `triggerable_item_use_offhand`.

### DEAL_DAMAGE

Task: `operation_deal_damage`. Calls `deal_damage` on each resolved entity. Not a dual-wield engine. Offhand punch is Frontend `LOOK` plus `range: 3`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `DEAL_DAMAGE` |
| `value` | yes | Packet amount. Number or `stat_*` |
| `damage_type` | no | Packet `type`. Default `CUSTOM`. Use `ENTITY_ATTACK` for melee-style events |
| `ability` | no | Feeds `ON_ABILITY_DAMAGE` |
| `crit` | no | Feeds `ON_CRIT` |
| `value_source` | no | `caster` or `target` when `value` is a `stat_*` |
| `target` | no | Who. Overlay `ENTITY`. Skips the caster |

Smoke: `self_deal_damage_look`. Offhand weapon: mechanic 2 on `triggerable_item_use_offhand`.

### APPLY_VELOCITY

Task: `operation_apply_velocity`. Sets `EntityTag.velocity` on each resolved entity. Overlay `ENTITY`. `NO_KNOCKBACK` skips the victim. Hit-feedback knockback stays `apply_knockback` (that path waits 1t because cancelled vanilla damage wipes motion). This op does not wait on a one-shot.

`origin` is the other end of AWAY / TOWARD (default CASTER). Same origin rules as AOE. `target` is who moves.

| `mode` | What it does |
| --- | --- |
| `KNOCKBACK` (default) | One shove. Default direction AWAY. Default `amount` / `y` match hit knockback |
| `PULL` | One shove toward origin. Default `amount` 1, `y` omitted so the 3D vector keeps its pitch |
| `GUIDE` | Counted `repeat` toward a live origin. Recasts each pulse. Stops at `stop_distance`, despawn, or `NO_KNOCKBACK`. Default duration `2s` at `1t` (40 pulses, same cap as `entitypullwhile`) |
| `GROUND` | Slam until `entity_is_grounded` or duration. Default facing * 0.1 with `y: -4` (`floorpushtarget`) |

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `APPLY_VELOCITY` |
| `mode` | no | `KNOCKBACK`, `PULL`, `GUIDE`, `GROUND` |
| `direction` | no | `AWAY`, `TOWARD`, `LOOK` (caster facing), `FORWARD` (victim facing). Omit to use the mode default |
| `amount` | no | Horizontal scale. Number or `stat_*` |
| `y` | no | Replaces the vector Y when set. KNOCKBACK and GROUND always set Y (defaults `0.35` and `-4`) |
| `allow_knockback_resistance` | no | Default `true`. Scales amount and Y by `1 - clamp(get_knockback_resistance, 0, 1)` |
| `stop_distance` | no | GUIDE AWAY / TOWARD. Default `3` |
| `duration` | no | GUIDE / GROUND loop length. Defaults `2s` / `5s` |
| `tickrate` | no | GUIDE / GROUND wait between pulses. Default `1t` |
| `origin` | no | Vector source for AWAY / TOWARD. Default CASTER |
| `target` | no | Who. Overlay `ENTITY` |

Self knockback: `target: SELF`, `direction: LOOK`. Pull a LOOK entity: `target: LOOK`, `mode: PULL`. Do not use this as player dash travel (`DASH` is that). Do not use this as projectile travel (`pushentity` is PROJECTILE).

Harvest: `dealknockback.dsc`, `entitypullwhile` in `basicprojectile.dsc`, `floorpushtarget` in `generalmovetasks.dsc`.

```yaml
operations:
    1:
        type: APPLY_VELOCITY
        target: LOOK
        mode: KNOCKBACK
        amount: 0.8
        y: 0.4
        allow_knockback_resistance: true
```

Smoke: `mechanic_example_apply_velocity`.

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_apply_velocity].data_key[data].get[self_look_knockback]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_apply_velocity].data_key[data].get[look_knockback]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_apply_velocity].data_key[data].get[look_pull]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_apply_velocity].data_key[data].get[look_guide]>
```

### PROJECTILE

Task: `operation_projectile`. Nested Projectile Config (`projectile:`). Default world entity is `item_display` with scripted travel (`pushentity` harvest). Optional snowball for vanilla projectile physics. `travel: LINE` is `instantbeam` (one step per block of range, same tick unless `tickrate` is set). Pulse is `repeat`, never `while`.

`range` / `speed` belong under `projectile:` so they are not the LOOK targeting range. Start is `target` as a LOCATION (default SELF), then op `offset` (`left,up,forward`), then pack `start_height` (default `1`, `0` is feet). Facing is the caster look. `follow_pitch: false` zeros pitch at spawn only. `aimed: true` aims at caster look `forward[range]` even if spawn is offset (barrage). `y` lifts that destination. Snowball `height` > 0 is Shoot arc. `height` 0 is direct `speed`. `spread` is Shoot spread. `homing: true` locks a victim at spawn (LOOK, else a non-caster TARGET).

Visuals match `static_armorstand`. `model.rotation` / `pose` is spawn orientation. Root `rotation:` / `spin:` is per-pulse axis spin (`vector: 1,0,0` is X, like murakumogiri). `attached` extra displays teleport with the shot (`attached_spin` for their own axis). `controllable` steers with caster look. `invertible` flags the shot so a recast can set `projectile_inverted` (moves backward). `inverted: true` starts already reversed. `priority` removes other players' projectiles in 2 blocks. `bounce` is wall reflects (`true` = 1, or a count). `chain: true` uses `maxchain`. Barriers are noted areas with flag `projectile_barrier_flag` (`barrier`). Snapshot at spawn. A different set stops travel (`collision: NONE` skips this). `stay_alive` is linger duration (trail plus flying entity). `stay_alive_model` is the parked leftover display at the last point for that duration.

Live shots are indexed on `server.flag[projectile_index]` (one row per shot). Trails, attached models, and parked stay displays stamp the same `projectile_shot` id. Reload and start wipe them. Do not restore a shot after reboot. Admin: `/packprojectile list` opens `menu_projectile_list` (PAGE, remaining lifetime, leftover/ghost, teleport click). `/packprojectile prune` drops leftover, ghost, and orphans. `/packprojectile clear` removes every tracked shot.

Pack compose (not PROJECTILE keys): knockback and pushback are `hit` APPLY_VELOCITY. Sounds and particles are `loop` / `hit` / `end`. Pull-to-target is APPLY_VELOCITY GUIDE. Barrage amount/interval is mechanic `repeat`. End AOE is `end`. Venom-mob turrets are a later entity op, not this shot.

`loop` / `hit` / `end` are nested mechanic configs. `hit` sets context TARGET to the victim. All three set placeholder `projectile_end`. `source_type` is `PROJECTILE`.

| `travel` | What it does |
| --- | --- |
| `DISPLAY` (default) | Spawn `item_display`, teleport `speed` blocks per pulse until range, lifetime, solid, or pierce |
| `SNOWBALL` | Spawn snowball, `shoot` to the resolved end (`aimed` / `y`). `height` > 0 is arc. Else direct `speed`. Optional `spread`. Vanilla snowball damage is cancelled |
| `LINE` | No entity. `points_between` start and `start.forward[range]` (instantbeam). Default `tickrate` `0t` |

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `PROJECTILE` |
| `projectile` | no | Nested config. Overlay onto the op |
| `range` | no | Travel distance. Default `20`. Prefer under `projectile:` |
| `speed` | no | DISPLAY blocks per pulse (default `2`). SNOWBALL shoot speed (default `1.5` if omitted). LINE ignores it |
| `pierce` | no | Unique living hits before travel ends. Default `1`. `0` never ends from hits |
| `start_height` | no | Blocks above the resolved start. Default `1`. `0` skips |
| `aimed` | no | Destination is caster look `forward[range]`. Default `false` (spawn forward) |
| `y` | no | Extra up on the destination. Default `0`. Direct snowball lift without arc |
| `height` | no | Snowball Shoot arc height. Default `0` (direct). Do not use a tiny destination |
| `spread` | no | Snowball Shoot spread. Default `0` |
| `homing` | no | DISPLAY. Lock LOOK (not the caster) at spawn, then re-aim. Default `false` |
| `model` | no | Map: `item`, `scale`, `translation`, `type` (billboard), `rotation` (pose). Flattened if those keys are omitted at root |
| `scale` | no | Display scale. Default `1,1,1` |
| `translation` | no | Display translation. Default `0,0,0` |
| `billboard` | no | item_display `display=`. Default `fixed` |
| `pose` | no | Spawn orientation. `{axis` or `vector`, `degrees}` |
| `spin` | no | Per pulse. `{axis` or `vector`, `degrees}`. Root `rotation:` maps here |
| `trail` | no | Loopmodel. Map with `item`, `scale`, `skip` (default 3) |
| `attached` | no | Extra display maps glued to the shot. Legacy `attachedmodels` |
| `attached_spin` | no | Spin for attached. Map or list. Legacy `attachedmodelrotation` |
| `controllable` | no | DISPLAY follows caster look while within `range` |
| `invertible` | no | Flag the shot `projectile_invertible`. Recast sets `projectile_inverted` |
| `inverted` | no | Start already reversed. Default `false` |
| `priority` | no | Remove other casters' projectiles within 2 |
| `bounce` | no | Wall reflects. `true` or a count. Default `0` |
| `stay_alive` | no | After travel, keep displays and run `loop` on trail pieces |
| `stay_alive_model` | no | Parked leftover display at last location for `stay_alive`. Legacy `stayalivemodel` |
| `multi_hit` | no | Clear unique-hit list each pulse. Default `false` |
| `return` | no | DISPLAY flies back to the caster |
| `hit_on_return` | no | Wipe unique hits before return |
| `chain` | no | Extra DISPLAY segments toward the next living in range. Default `0` |
| `travel` | no | `DISPLAY` / `SNOWBALL` / `LINE` |
| `snowball` | no | `true` forces `SNOWBALL` (legacy `snowball:true`) |
| `collision` | no | `BOTH` (default), `ENTITIES`, `BLOCKS`, `NONE` |
| `item` | no | Display / snowball item. Material name or `item_*`. Default `snowball` |
| `hitbox` | no | Living search radius. Default `1` |
| `tickrate` | no | DISPLAY / SNOWBALL default `1t`. LINE default `0t` |
| `lifetime` | no | DISPLAY / SNOWBALL pulse cap. Default `15s`. Op `duration:` also sets this |
| `offset` | no | Start LOCATION vector `left,up,forward` (after `target`) |
| `follow_pitch` | no | Default `true`. `false` zeros pitch at spawn. Homing does not flatten pitch |
| `loop` | no | Mechanic each pulse at `projectile_end` |
| `hit` | no | Mechanic per new victim |
| `end` | no | Mechanic at last location after travel |
| `target` | no | Start location who-rule. Default SELF |

```yaml
operations:
    1:
        type: PROJECTILE
        target: SELF
        projectile:
            range: 20
            speed: 2
            pierce: 1
            travel: DISPLAY
            collision: BOTH
            item: snowball
        loop:
            operations:
                1:
                    type: PLAY_EFFECT
                    target: projectile_end
                    effect: CRIT
                    quantity: 4
        hit:
            operations:
                1:
                    type: DEAL_DAMAGE
                    target: TARGET
                    value: 5
                    damage_type: ENTITY_ATTACK
        end:
            operations:
                1:
                    type: PLAY_SOUND
                    target: projectile_end
                    sound: ENTITY_ARROW_HIT
```

Smoke: `mechanic_example_projectile`.

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_display]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_line]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_snowball]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_homing]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_aimed]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_trail]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_gomu_trail]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_return]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_chain]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_bounce]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_invertible]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_projectile].data_key[data].get[self_parked]>
/packprojectile list
/packprojectile prune
/packprojectile clear
```

Harvest: `poisonpoison.dsc` hydra, `gomugomu.dsc` trail, `WanoWeapons.dsc` murakumogiri (`rotation.vector`, `attachedmodels`), `CyborgMenu.dsc` strongright (`chain`, `maxchain`, attached trail), `pushentity` (`controllable`, invert flag, attach teleport), `basicprojectileloop` (`priority`). Barriers: noted AreaObject plus `flag barrier` (`return_barriers`). Parked leftover: `stayalivemodel` / `stayalivetime`. Bounce is wall reflect (not a legacy projectile key). Pull and knockback stay other ops. Recast that *sets* invert is still a pack mechanic, not this op.

### DASH

Task: `operation_dash`. Nested Dash Config (`dash:`). Physics stays on the living dasher. There is no display entity. Overlay `ENTITY`. Default `target: SELF`.

One look-direction impulse, then coast. The pulse `repeat` is hit sweep and `loop` FX, not a new shove each tick. Count is lifetime ticks / tickrate, plus a bounce linger if `bounce` is set. Never `while`. Stop early on standstill, water (when bounce is 0), optional `range`, or grounded after `grounded_after` pulses (default 5).

`speed` is the impulse scale (legacy `velocity`). Put it under `dash:` so it is not the LOOK targeting range. `LOOK` uses current facing at shove time. `FORWARD` locks spawn yaw. `UP` / `DOWN` keep look XZ and set Y (`slamaoe` used look `mul[1]` with `y: 1.5` then `y: -1`). `DOWN` also stops when grounded after the first pulse.

Default `continue: false` zeros the dasher after the first unique hit (one victim per pulse). `continue: true` keeps coasting. `pierce` only caps unique hits when continue is true. `multi_hit` clears the unique list every `multi_hit_interval` pulses (default 8). `pullwith` drags already-hit victims along the look vector, then zeros them if still within `pull_stop` at end.

`bounce` is a shared charge count. `bounce_modes` picks which spenders are on: `PUNCH` (left-click reverse), `STEP` (step-on-block hop), `WALL` (yaw 180 reflect). Omit `bounce_modes` to enable all three. `bounce_wall` is a nested map: `hop` (add `bounce_y` after a wall reflect, default true), `floor` (allow the ground to count as a wall, default false), `max_pitch` (look-down degrees that skip wall unless `floor` is true, default 45). `bounce_sound` plays on every spend. `collision: NONE` skips wall reflect. `BOTH` / `BLOCKS` only stop on a wall when charges are gone. Non-player casters hop `y: 0.5` and wait `3t` before the look impulse.

`slamaoe` is `DASH` LOOK with `y: 1.5` and `duration: 15t`, nested `end` `DASH` DOWN (look XZ, negative Y) until land, nested `end` AOE. Not a second Backend engine. Sibling ops do not wait. `NO_KNOCKBACK` does not skip this op.

`loop` / `hit` / `end` are nested mechanic configs. `hit` sets context TARGET to the victim. All three set placeholder `dash_end`. `source_type` is `DASH`. Barriers use the same noted-area flag as PROJECTILE. Default `collision` is `ENTITIES` (legacy had no wall stop). A particle trail is `loop` `PLAY_EFFECT` `target: dash_end`. A geppo-style cloud **model** is nested `SPAWN_COSMETIC`. See EQUIP_COSMETIC / SPAWN_COSMETIC below.

| `direction` | What it does |
| --- | --- |
| `LOOK` (default) | One impulse along current facing, then coast |
| `FORWARD` | Same, spawn yaw locked |
| `UP` | Look XZ `mul[1]`, Y = `speed`. Slam hop |
| `DOWN` | Look XZ `mul[1]`, Y = `-speed`. Stops on ground after the first pulse |

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `DASH` |
| `dash` | no | Nested config. Overlay onto the op |
| `direction` | no | `LOOK` / `FORWARD` / `UP` / `DOWN` |
| `speed` | no | Impulse scale. Default `1.5`. Prefer under `dash:` |
| `range` | no | Optional max distance. Default `0` (off). Legacy stop is time / standstill / ground |
| `pierce` | no | Unique living hits before travel ends when `continue: true`. Default `1`. `0` never ends from hit count |
| `continue` | no | Default `false`. First hit zeros the dasher. `true` keeps going |
| `pullwith` | no | Default `false`. Drag hit victims with look velocity |
| `pull_range` | no | Pull search. Default `3` |
| `pull_stop` | no | End brake if still this close. Default `5` |
| `collision` | no | `ENTITIES` (default), `BOTH`, `BLOCKS`, `NONE` |
| `hitbox` | no | Living search radius. Default `1.5` |
| `bounce` | no | Charge count. `true` or a number. Default `0` |
| `bounce_modes` | no | List `PUNCH` / `STEP` / `WALL`. Omit for all three |
| `bounce_wall` | no | Nested wall options. `hop` / `floor` / `max_pitch` |
| `bounce_y` | no | Punch/step hop Y, and wall hop add. Default `0.5` |
| `bounce_impulse` | no | Punch/step look scale. Default `3` |
| `bounce_recent` | no | Debounce after a spend. Default `5t` |
| `bounce_sound` | no | Sound on punch, step, or wall bounce |
| `y` | no | Extra Y added to LOOK / FORWARD. Default `0` |
| `follow_pitch` | no | Default `true`. `false` zeros pitch on LOOK |
| `multi_hit` | no | Clear unique-hit list every interval. Default `false` |
| `multi_hit_interval` | no | Default `8` |
| `tickrate` | no | Default `1t` |
| `lifetime` | no | Coast cap. Default `1s` (20 pulses). Op `duration:` also sets this |
| `loop` | no | Mechanic each pulse at `dash_end` |
| `hit` | no | Mechanic per new victim |
| `end` | no | Mechanic at last location after travel |
| `target` | no | Who dashes. Overlay `ENTITY`. Default SELF |

```yaml
operations:
    1:
        type: DASH
        target: SELF
        dash:
            direction: LOOK
            speed: 1.5
            continue: false
            collision: ENTITIES
        loop:
            operations:
                1:
                    type: PLAY_EFFECT
                    target: dash_end
                    effect: CLOUD
                    quantity: 4
        hit:
            operations:
                1:
                    type: DEAL_DAMAGE
                    target: TARGET
                    value: 5
                    damage_type: ENTITY_ATTACK
        end:
            operations:
                1:
                    type: PLAY_SOUND
                    target: dash_end
                    sound: ENTITY_PLAYER_ATTACK_SWEEP
```

Smoke: `mechanic_example_dash`.

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_dash].data_key[data].get[self_look]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_dash].data_key[data].get[self_cloud_trail]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_dash].data_key[data].get[self_bounce]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_dash].data_key[data].get[self_wall_bounce]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_dash].data_key[data].get[self_step_bounce]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_dash].data_key[data].get[self_slam]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_dash].data_key[data].get[self_pullwith]>
```

Harvest: `dash.dsc` (one impulse, coast, hitbox, `continue`, `pullwith`, water, 20t / standstill / grounded). Bounce: `bouncetask` in `generalmovetasks.dsc` (left click reverse, step forward) plus wall reflect (yaw 180, new impulse). FE `bounce_modes` / `bounce_wall` interchange those spenders. `slamaoe.dsc` is look+Y up, wait, look+Y down, then `basicaoe` child. Knockback, cosmetics, startvelocity, endscript stay other ops. See the plan DASH compose note.

### SPAWN_NOTABLE

Task: `operation_spawn_notable`. Nested Spawn Notable Config (`notable:`). Notes an ellipsoid or cuboid at a LOCATION (default SELF). Kind is `SKILLMOVE` on the shared notable registry. World islands later write `AREA` into the same flags. There is no display entity. Cage visuals are `showfake`. Op `duration:` also sets lifetime.

Note name is `<player>_<id>` (default id `entrap`), same filter shape as legacy. Recast of that name tears the cage down and does not place a new one. Cast again to place.

`on_enter` / `on_exit` fire from `Events/global_events.dsc` (`entity enters/exits` ellipsoid or cuboid). They are optional nested mechanics. Knockback, pull, and damage belong there as `APPLY_VELOCITY` / `DEAL_DAMAGE`. Omit the keys for a quiet zone. `loop` is occupancy-independent edge VFX (legacy `loopparticles`). PLAY_EFFECT `target: notable_shell` hits the **visual** particle list. Default `particle_mode: EDGE` is the visual shell with even `.y` and air (`entrapmove` `loopparticles`, opeope Room). `SURFACE` is the full shell with no even-Y skip. `inside` is a counted `repeat` pulse on occupants (buffs). `end` fires when the note is removed. Placeholders `notable_center` and `notable_shell` (list of Locations). `source_type` is `NOTABLE`.

`barrier: true` flags the noted area with `projectile_barrier_flag` (`barrier`). PROJECTILE and DASH already snapshot that set. This op does not port a fruit barrier script.

Default despawn is lifetime plus caster outside for `2s`. `IN_AREA` on another mechanic is how packs skip stamina in a zone. Do not bake that into this op. Grounded-before-place is a `GROUNDED` requirement on the mechanic that contains the op.

Reload, server start, quit, and join unnote leftover `SKILLMOVE` rows only.

| `shape` | What it does |
| --- | --- |
| `ELLIPSOID` (default) | `<location.to_ellipsoid[radius,height,radius]>` |
| `CUBOID` | Facing block corners (`backward_flat` / `left` / `forward_flat` / `right`). Glass is that box's faces, not a sphere |

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `SPAWN_NOTABLE` |
| `notable` | no | Nested config. Overlay onto the op |
| `id` | no | Name suffix and `IN_AREA` id. Default `entrap` |
| `shape` | no | `ELLIPSOID` / `CUBOID` |
| `radius` | no | Visual size (glass and dust). Default `5`. Prefer under `notable:` |
| `height` | no | Visual Y radius or cuboid height. Default `5` |
| `inset` | no | Extra blocks on the **note** past the visual. Default `1`. Cuboid adds `inset` on each face (`radius + inset * 2`). `0` matches visual to zone |
| `particle_mode` | no | `EDGE` (default): visual shell, even `.y`, air. Same as `entrapmove` loopparticles. `SURFACE`: full shell, no even-Y skip |
| `barrier` | no | Flag the note for projectile/dash walls. Default `false` |
| `material` | no | Fake block material. `none` (default) skips showfake. CUBOID is a box. ELLIPSOID is a sphere shell |
| `fill` | no | Default `false` (shell). `true` is every block in the volume |
| `one_per_caster` | no | Default `true`. Recast of the live name removes it |
| `exclude_caster` | no | Default `false`. Skip the caster in enter/exit/inside |
| `exclude_original` | no | Default `false`. Skip entities already inside at spawn |
| `tickrate` | no | Loop, inside pulse, and outside-timer. Default `5t` |
| `lifetime` | no | Note cap. Default `8s`. Op `duration:` also sets this |
| `despawn` | no | `DURATION`, `CASTER_OUTSIDE` (default pair), `CASTER_DEAD`, `CASTER_QUIT`, `EMPTY` |
| `on_enter` | no | Mechanic when Denizen fires enter. Optional |
| `on_exit` | no | Mechanic when Denizen fires exit. Optional |
| `loop` | no | Mechanic each pulse at the shell. Optional. Does not need occupants |
| `inside` | no | Mechanic each pulse. TARGET is the occupant list |
| `end` | no | Mechanic when the note is removed |
| `target` | no | Center location who-rule. Default SELF. Overlay LOCATION |

```yaml
operations:
    1:
        type: SPAWN_NOTABLE
        target: SELF
        notable:
            shape: ELLIPSOID
            radius: 4
            height: 3
            lifetime: 8s
            tickrate: 10t
            material: glass
            particle_mode: EDGE
        on_enter:
            operations:
                1:
                    type: NARRATE
                    target: TARGET
                    text: entered zone
        on_exit:
            operations:
                1:
                    type: NARRATE
                    target: TARGET
                    text: left zone
        loop:
            operations:
                1:
                    type: PLAY_EFFECT
                    target: notable_shell
                    effect: DUST
                    quantity: 1
                    offset: 0,0,0
                    special_data:
                        size: 1.2
                        color: aqua
        end:
            operations:
                1:
                    type: PLAY_SOUND
                    target: notable_center
                    sound: BLOCK_GLASS_BREAK
```

Smoke: `mechanic_example_spawn_notable`.

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spawn_notable].data_key[data].get[self_zone]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spawn_notable].data_key[data].get[self_cuboid]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spawn_notable].data_key[data].get[self_cage]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spawn_notable].data_key[data].get[self_barrier]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spawn_notable].data_key[data].get[self_push]>
```

Harvest: `entrapmove.dsc` (named note, fake non-solid shell, recast removes, caster outside 2s, cuboid from facing corners, Denizen enter/exit). `opeope.dsc` Room `loopparticles` plays on that shell, not the volume. Knockback/pull stay nested `APPLY_VELOCITY`. Edge dust is nested `loop` `PLAY_EFFECT` `target: notable_shell` with `particle_mode: EDGE`. Barriers: `flag barrier` (`return_barriers`). Do not port `barrierbarrier.dsc`. Grounded wait is a `GROUNDED` requirement. Stamina exemption is `IN_AREA`.

### SPAWN_HOLOGRAM

Task: `operation_spawn_hologram`. Nested Hologram Config (`hologram:`). Spawns a `text_display` at a LOCATION (default SELF). Billboard is Display `display:` (`center` default, always faces the player). `hologram.offset` is world XYZ added after targeting (default `0,1.75,0`, same as legacy `above[1.75]`). Targeting `offset` stays look-relative.

`lifetime` or op `duration:` removes the entity after that time. Omit both to persist (`spawn` `persistent`, same as admin signs). Persistent rows are stored on `server.flag[hologram_index]` (payload map: location, text, billboard, scale). That is the same idea as `static_loot_index` for chests. If the `text_display` is gone after a reboot, restore respawns it from that payload. Timed damage numbers are not indexed.

`size:` is a uniform scale (`2` means `2,2,2`). `scale:` is a vector and wins when both are set. Default `1`.

Pivot `center` and `background_color: transparent` come from `create_textdisplay`. There is no armor stand path.

Damage pipeline: `play_damage_feedback` runs `spawn_damage_hologram`, which calls the same `spawn_hologram_at_location`. Colors: crit gold, ability id blue, melee cause red, living non-player attacker green, else purple. Amount is `context.value` rounded to 2.

Admin: `/packhologram [text]`. Optional leading size: `/packhologram 2 hello`. `/packhologram list` opens `menu_hologram_list` (PAGE, teleport click). `/packhologram remove` deletes the nearest indexed hologram within `hologram_remove_range`. Ops only.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `SPAWN_HOLOGRAM` |
| `hologram` | no | Nested config. Overlay onto the op |
| `text` | yes | Display text. Parsed on the spawn queue |
| `billboard` | no | `center` (default), `fixed`, `vertical`, `horizontal` |
| `lifetime` | no | DurationTag or seconds. Op `duration:` wins. Omit persists |
| `offset` | no | World XYZ add. Default `0,1.75,0`. Prefer under `hologram:` so it is not targeting offset |
| `size` | no | Uniform scale. Default `1`. `2` is twice as large |
| `scale` | no | Vector `x,y,z`. Wins over `size` |
| `random_offset` | no | `LocationTag.random_offset`. Damage numbers use `0,0.25,1` |
| `pivot` | no | Default `center` |
| `background_color` | no | Default `transparent` |
| `target` | no | Center location who-rule. Default SELF. Overlay LOCATION |

```yaml
operations:
    1:
        type: SPAWN_HOLOGRAM
        target: SELF
        hologram:
            text: hello
            billboard: center
            lifetime: 5s
            offset: 0,1.75,0
            size: 2
```

Smoke: `mechanic_example_spawn_hologram`.

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spawn_hologram].data_key[data].get[self_text]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spawn_hologram].data_key[data].get[self_cursor]>
/packhologram hello
/packhologram 2 hello
/packhologram list
/packhologram remove
```

Harvest: `PEhologram.dsc` `create_textdisplay` (text, pivot center, transparent background). `pedamageindicator` (1s, above 2, random offset, type colors). Do not port marker armor stands.

### START_GPS / STOP_GPS

Tasks: `operation_start_gps`, `operation_stop_gps`. Nested GPS Config (`gps:`). Owner is the mechanic caster (must be a player). Destination is targeting LOCATION (CURSOR, LOOK, a placeholder, or TARGET feet) or `waypoint:` / `waypoint_id:` (travel resolution, same ids as `TRAVEL_TO_WAYPOINT`). One GPS per player. Recast START removes the live one first. Smoke: `/packgps waypoint example_dock`.

Marker is `item_display`, not armor stand. Legacy `attach` to the owner is not visible to that player, so each pulse teleports to a look-relative offset. Default is `0,1.5,4` (right, up, forward-flat). `height` / `forward` / `right` overlay one axis. The teleport uses `.face[destination]` (same as PROJECTILE) so the arrow points at the dest. Do not use a compass item. Vanilla compass needles spin on their own. Other players are `hide_entity` each pulse.

Pulse is lifetime ticks / tickrate ticks, then `- repeat`. Never `- while`. Same world shows `distance_text` (`<[distance]>` is the blocks left, parsed on the pulse queue). Wrong world shows `wrong_world_text` and does not stop. Distance under `arrive_range` (default 5) plays `arrive_sound`, narrates `arrive_text`, then stops.

`lifetime` or op `duration:` is the max follow time (default `120s`). Tickrate default `5t`. Arrow model is Frontend: `material` (or `item`) plus `modeldata` (or `custom_model_data` / `custommodeldata`). Default material is `carved_pumpkin`. Smoke uses legacy CMD `182`. Billboard default `fixed` so facing matters.

STOP_GPS resolves ENTITY targets (default SELF) and clears that player's marker. Quit, start, and reload also clear it (`gps_engine_events`). Not a HappyHUD plugin and not the HUD composer.

Live arrows are indexed on `server.flag[gps_index]` keyed by owner uuid. Timed. Do not restore after reboot. Admin: `/packgps list` opens `menu_gps_list` (PAGE, remaining lifetime, leftover/ghost, teleport click). Console narrates the same rows. `/packgps prune` drops leftover, ghost, and orphans. `/packgps clear` removes every arrow. `/packgps remove [player]` stops one owner.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `START_GPS` or `STOP_GPS` |
| `gps` | no | Nested config. Overlay onto the op |
| `target` | yes on START unless `waypoint` is set | Destination who-rule. Overlay LOCATION. SELF is your feet and arrives at once |
| `waypoint` | no | `waypoint_dock` or `dock`. Resolves through travel. `waypoint_id` is the same field |
| `arrive_range` | no | Blocks. Default `5` |
| `lifetime` | no | DurationTag or seconds. Op `duration:` wins. Default `120s` |
| `tickrate` | no | Default `5t` |
| `item` | no | Vanilla material or `item_*`. Alias of `material`. Default `carved_pumpkin` |
| `material` | no | Same as `item` |
| `custom_model_data` | no | Packed model id. Theme arrows stay on Frontend |
| `modeldata` | no | Same as `custom_model_data`. Also `custommodeldata` |
| `offset` | no | Right, up, forward-flat as `x,y,z`. Default `0,1.5,4`. Prefer under `gps:` so it is not targeting offset |
| `height` | no | Blocks above the player. Overlay on offset Y. Alias `up`. Default `1.5` |
| `forward` | no | Blocks in front of the player (yaw only). Overlay on offset Z. Default `4` |
| `right` | no | Blocks to the player's right. Overlay on offset X. Default `0` |
| `scale` | no | Vector. Default `1,1,1` |
| `billboard` | no | Display `display:`. Default `fixed` |
| `distance_text` | no | Nametag. `<[distance]>` is blocks left |
| `wrong_world_text` | no | Nametag when worlds differ |
| `arrive_text` | no | Narrate on arrive. Default `destination reached`. Set `none` to skip |
| `arrive_sound` | no | `playsound` to the owner. Default `ENTITY_PLAYER_LEVELUP`. Set `none` to skip |

```yaml
operations:
    1:
        type: START_GPS
        target: CURSOR
        gps:
            arrive_range: 5
            lifetime: 60s
            material: carved_pumpkin
            modeldata: 182
            height: 1.5
            forward: 4
            distance_text: "<&c><[distance]> blocks left"
            wrong_world_text: "<&c>wrong world"
            arrive_text: destination reached
```

```yaml
operations:
    1:
        type: STOP_GPS
        target: SELF
```

Smoke: `mechanic_example_gps`.

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_gps].data_key[data].get[self_cursor]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_gps].data_key[data].get[self_stop]>
/packgps list
/packgps prune
/packgps clear
```

Harvest: `GpsSystem.dsc` (carved_pumpkin CMD 182 arrow, hide from others, point at dest, distance in name, stop under 5, wrong-world text). Leave dungeon/conquerworld and `/PEgps` behind. Do not port armor stand, compass, or `- while`.

### SHOW_HUD_PART / HIDE_HUD_PART / CLEAR_HUD_PARTS / SET_HUD_LAYOUT

- [SHOW_HUD_PART](../hud/operations/show-hud-part.md)
- [HIDE_HUD_PART](../hud/operations/hide-hud-part.md)
- [CLEAR_HUD_PARTS](../hud/operations/clear-hud-parts.md)
- [SET_HUD_LAYOUT](../hud/operations/set-hud-layout.md)

Layouts and parts: [HUD](../hud/README.md).

### PLACE_SPRAY / OPEN_SPRAY_MENU

Tasks: `operation_place_spray`, `operation_open_spray_menu`. Nested Spray Config (`spray:`). Owner is the mechanic caster (must be a player). Ray is `eye_location.ray_trace` to a solid within `range` (default `10`). An entity in that range blocks the place. Recast replaces the live frame. Lifetime default `30s`. Op `duration:` wins.

World visual is an invisible `item_frame` with a `filled_map`. **`peimagemap` paints that map id from a png.** Harvest `initialize_sprays` in `sprayutils.dsc`. `reload_all_server_flags` walks every `spray_` script after the prefix list is rebuilt, checks `../PEUtils/mapImages/<filename>`, then `peimagemap id:<map_id> filename:<filename> world:<world>`. Missing png skips that row. Default `start_id` is `11` (bounty posters keep `1` to `10`). Explicit `map_id:` on the spray row wins. The framed item is `filled_map[map=<id>]`, not a paper CMD and not an armor stand.

Unlock is Frontend BOOLEAN plus `SET_STAT`. Equipped id is REFERENCE `stat_equipped_spray`. `PLACE_SPRAY` reads `spray:` or that slot. `OPEN_SPRAY_MENU` builds a PAGE of `spray_` rows. Locked rows have no click mechanics.

Live frames are indexed on `server.flag[spray_index]` keyed by owner uuid. Timed. Do not restore after reboot. Admin: `/packspray list` / `prune` / `clear` / `remove [player]`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `PLACE_SPRAY` or `OPEN_SPRAY_MENU` |
| `spray` | no | Nested config, or a `spray_` script id. PLACE uses this over the REFERENCE slot |
| `stat` | no | REFERENCE whose stored value is the script id. Default `stat_equipped_spray` |
| `range` | no | Ray blocks. Default `10` |
| `lifetime` | no | DurationTag or seconds. Op `duration:` wins. Default `30s` |
| `rotation` | no | Item Rotation on `framed` (`AUTO` harvest, or `NONE` / `CLOCKWISE` / …). Not hanging BlockFace. Default `AUTO` |
| `sound` | no | `playsound` at the owner. Default `none` |
| `menu` | OPEN | Override `menu_spray_equip` |
| `target` | OPEN | Who. Overlay `ENTITY` |

`spray_` data keys: `filename` (relative to `mapImages/`), optional `map_id`, `unlock_stat`, `display_name`, `wiki`, `icon_material`, `icon_custommodeldata` (PAGE icon, harvest paper `70`).

```yaml
operations:
    1:
        type: PLACE_SPRAY
        spray: spray_example
        lifetime: 30s
        range: 10
```

```yaml
operations:
    1:
        type: OPEN_SPRAY_MENU
        target: SELF
```

Smoke: `mechanic_example_spray`. File is `PEUtils/mapImages/sprays/queenshocked.png` so `peimagemap` can paint map `11`.

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spray].data_key[data].get[self_unlock]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spray].data_key[data].get[self_equip]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spray].data_key[data].get[self_place]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_spray].data_key[data].get[self_open]>
/packspray list
```

Harvest: `spraylogic.dsc` (ray, item_frame, filled_map, one per player, 30s), `sprayutils.dsc` `peimagemap` + `get_spray_rotation`, `sprayequipmenu.dsc` (PAGE). Leave `/PEspray` and `peplayer.unlockedsprays` behind.

### OPEN_TITLE_MENU / EQUIP_TITLE / UNEQUIP_TITLE / CLEAR_TITLES

Tasks: `operation_open_title_menu`, `operation_equip_title`, `operation_unequip_title`, `operation_clear_titles`. PAGE of `title_` rows. Unlock is Frontend BOOLEAN plus `SET_STAT`. Equip **appends** the script id onto `flag_saves.chat_prefix.prefixes` and/or `.suffixes` from catalog `placement:` (`PREFIX` / `SUFFIX` / `BOTH`). Duplicate id is a no-op. Unequip drops that id from both lists. `CLEAR_TITLES` with `placement:` wipes one side. Omit `placement` to wipe both.

Prefix and suffix strings live on the `title_` script. Chat format (crew, rank, word filter) is not this op. Do not use ShowTitle.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_TITLE_MENU`, `EQUIP_TITLE`, `UNEQUIP_TITLE`, or `CLEAR_TITLES` |
| `title` | EQUIP / UNEQUIP | `title_*` script id |
| `placement` | CLEAR | `PREFIX` / `SUFFIX` / `BOTH`. Omit to wipe both lists |
| `menu` | OPEN | Override `menu_title_equip` |
| `target` | yes | Who. Overlay `ENTITY` |

`title_` data keys: `prefix`, `suffix`, `placement`, `unlock_stat`, `display_name`, `wiki`, `icon_material`, `icon_custommodeldata` (PAGE icon, harvest name_tag).

```yaml
operations:
    1:
        type: EQUIP_TITLE
        target: SELF
        title: title_example
```

```yaml
operations:
    1:
        type: OPEN_TITLE_MENU
        target: SELF
```

Smoke: `mechanic_example_title`. `/packtitle` opens the PAGE. Unlock two prefixes then both `self_equip` rows to stack.

Harvest: `PEfamilynames.dsc` (unlock flags, prefix text). Leave `/PEtitle` and hardcoded family lists out of Backend.

### OPEN_WIKI_MENU

Task: `operation_open_wiki_menu`. Player wiki hub or category PAGE. Category rows are script ids. Click runs `REVEAL_WIKI_LORE` on that cell. Indexer reads `item_`, `skillmove_`, `class_`, `quest_`, `currency_`. Opt-out is `notinwiki: true`. Drop lore comes from the reload map. Not `docs/`. Not a `wiki_` prefix. Full page: [wiki.md](../wiki.md).

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_WIKI_MENU` |
| `category` | no | `ITEMS` `SKILLMOVES` `CLASSES` `QUESTS` `CURRENCIES`. Omit with no `script:` for the hub |
| `script` | no | One content script. Opens the entry PAGE |
| `menu` | no | Override hub / category / entry menu id |
| `target` | yes | Who. Overlay `ENTITY` |

```yaml
operations:
    1:
        type: OPEN_WIKI_MENU
        target: SELF
        category: ITEMS
```

Smoke: `mechanic_example_wiki`. `/packwiki`. `/packwiki items`.

### REVEAL_WIKI_LORE

Task: `operation_reveal_wiki_lore`. Harvest `itemwiki_generic_wikimenu`: stub lore until click, `ratelimit 1s`, skip if already revealed. Replaces that PAGE cell with wiki body plus drop lines. Does not open a second inventory. Not for combat. Caster must already have the wiki PAGE open.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `REVEAL_WIKI_LORE` |
| `category` | no | `ITEMS` and the other wiki categories. Infer from `script:` if omitted |
| `script` | no | Content script. Else the clicked item `wiki_script` flag |
| `target` | yes | Who. Overlay `ENTITY` |

```yaml
operations:
    1:
        type: REVEAL_WIKI_LORE
        target: SELF
        category: ITEMS
        script: item_example_skill_wand
```

Engine PAGE clicks build this op from the thin row. Pack YAML does not need to fire it by hand.

### EQUIP_COSMETIC / CLEAR_COSMETIC / SPAWN_COSMETIC

Tasks: `operation_equip_cosmetic`, `operation_clear_cosmetic`, `operation_spawn_cosmetic`. Nested Cosmetic Config (`cosmetic:`). Passenger entity is a marker `armor_stand` (`SpawnCosmetic`). The model is the stand helmet item. Persist channel ids come from Frontend `global_build_config` `cosmetic_channels`. Unequip is pack `CLEAR_COSMETIC` from a menu (`menu_example_cosmetics`). Engine does not plant dummy armor handles. A pack that still wants an inventory click uses `GIVE_ITEM` plus `ON_INVENTORY_CLICK` itself.

Gear is items. Cosmetics are stands. Frontend may run `EQUIP_GEAR` and `EQUIP_COSMETIC` on the same click. Backend does not spawn a stand because a gear id was set.

Harvest: `CosmeticStands.dsc` (cloak/back/sheath/hat, mount, `/PEtogglecosmetics` owner hide, swim/glide pose, join respawn) and `SkillCosmeticLogic.dsc` (session lifetime, swimming/gliding modeldata, `head` / `chestplate` / hands overlay). Remount is the player loop plus world hooks. Never `- while`.

**EQUIP_COSMETIC** persists the script id on `flag_saves.cosmetic_persist.<channel>` (not the entity UUID, not `flag_saves.gear`). Channel ids come from Frontend `global_build_config` `cosmetic_channels`. `channel:` on the op, else `slot:` as an alias, else the script `slot:`. Always spawns one passenger stand. Does not write vanilla armor. Pose-following hats stay `SPAWN_COSMETIC` overlays. Chopper hat in this pack is `GIVE_ITEM` `slot: helmet`. Join / 1s loop / world change respawn from `cosmetic_persist`.

**SPAWN_COSMETIC** is skill-time. Session only. `lifetime` or op `duration:` then remove. Else the `cosmetic_*` script `lifetime:`. Omit all three: until `CLEAR_COSMETIC` `session: true`, quit, or reload. Omit `slot:` (or use a persist channel id) for an armor_stand passenger. `slot: helmet` / `chestplate` / `leggings` / `boots` / `main_hand` / `off_hand` overlays that inventory cell. Backup is `flag_saves.cosmetic_overlays`. Passengers cannot follow head or arm pose, so glide heads and zoan chests must use this overlay.

`spin:` is yaw added on the remount pulse (walk `5t`, or the 1s player loop when standing). Legacy `rotation:` on skill cosmetics called `rotate_armorstand_while` (`- while` until despawn). That while is not ported. `rotation:` is an alias of `spin`. A map `{axis: 0,1,0, degrees: 18}` uses the Y degrees. A list `0,5,0` uses the second value as yaw.

**CLEAR_COSMETIC** with `channel:` (or `slot:` as the same key) drops that persist channel. Omit: every persist channel. A VANILLA overlay cell (`slot: helmet`) restores that overlay only. `session: true`: skill VFX and overlays.

Owner hide: `/hidecosmetics` (aliases `/packcosmetics`, `/pehidecosmetics`, `/PEtogglecosmetics`) uses `hide_entity` on you only. Other players still see the cloak. Same job as `/PEtogglecosmetics`. It does not hide real armor overlays. Swim/glide: persist cloaks hide (air item) unless the pack set a different pose modeldata or pose item. Stop-swim waits `1t` so a new glide keeps the hide. Session VFX swap CMD (phoenix wings). Overlay helmets swap CMD on the worn item. HIDDEN / spectator: `hide_from_players` on the passenger. Walk ratelimit `5t` looks and remounts. Spawn waits `1t` then remounts (resetstands). Teleport remounts. World change respawns persist ids. Overlay backups restore on join so a crash cannot keep the glide head as the persist helmet.

Live rows are indexed on `server.flag[cosmetic_index]`. Keys are `uuid` + `_` + channel (a dot nests the flag). Wipe on start and reload. Admin: `/packcosmetic list` / `prune` / `clear`. Wiki: [cosmetics.md](../cosmetics.md).

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
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_cosmetics].data_key[data].get[self_equip]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_cosmetics].data_key[data].get[self_equip_back]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_cosmetics].data_key[data].get[self_spawn]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_cosmetics].data_key[data].get[self_spawn_spin]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_cosmetics].data_key[data].get[self_overlay_helmet]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_cosmetics].data_key[data].get[self_clear_session]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_menu].data_key[data].get[open_cosmetics]>
/hidecosmetics
/packcosmetic list
```

Harvest: `CosmeticStands.dsc` and `SkillCosmeticLogic.dsc`. Port the armor_stand passenger. Do not port `- while`.

### APPLY_TRANSACTION


Task: `operation_apply_transaction`. Settles a Cost Component list. `TAKE` hits `source`. `GIVE` hits `destination`. Check-all then apply. No partial spend.

`onsuccess` / `onfail` are nested mechanic configs (same shape as damage-route hooks). Put the purchase (`GIVE_ITEM`, `GRANT_LOOT`, `NARRATE`) in `onsuccess`. Put the “not enough” feedback in `onfail`. Do not put those as sibling `operations.2`. Sibling ops still run after a failed pay.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `APPLY_TRANSACTION` |
| `costs` | yes | Keyed maps. `type` CURRENCY / ITEM / STAT, `id`, `amount`, `action` TAKE / GIVE |
| `source` | no | `SELF` (default), `TARGET`, `SYSTEM` |
| `destination` | no | `VOID` (default), `SELF`, `TARGET`, `SYSTEM` |
| `value_source` | no | `caster` or `target` when a cost `amount` is a `stat_*` |
| `onsuccess` | no | Mechanic config after a full settle |
| `onfail` | no | Mechanic config when can-pay fails |
| `analytics` | no | Sink id for counters (shop name). See [analytics.md](../analytics.md) |

Bare SkillMove rows (`stat` + `amount`) are STAT TAKE (stamina). CURRENCY on a skill is optional. Player-to-player CURRENCY requires `rules.player_transfer`. SYSTEM mints. VOID discards.

Smoke: `self_grant_belly`, `self_pay_belly`, `self_withdraw_belly`, `self_redeem_belly`. Commands: `/withdraw`, `/redeem`, `/pay` when FE `player_pay: ALLOW`. Wiki: [currencies.md](../currencies.md).

## Missing (add a section here when each lands)

ModifyEventValue, SpawnMinion, ShowHudElement, ShowTitle, OverwriteCastPress, ExecuteTask, AI ops.

### Entity ops (Live core)

| Type | Keys | Task |
| --- | --- | --- |
| `SPAWN_ENTITY` | `entity` (or `entity_script`), optional `location` (else LOCATION targeting), `owner`, `area`, `home`, `level`, `use_area_level` | `operation_spawn_entity` → `spawn_entity` |
| `SUMMON_MOUNT` | optional `entity` (owned `entity_` id, else equipped row). Does not create a row | `operation_summon_mount` → `summon_mount_for_player` |
| `UNSUMMON_MOUNT` | none. No body is a no-op | `operation_unsummon_mount` → `clear_live_mount` |
| `MOUNT` | optional `mount` entity, else the target's live mount. Owner uses `pemountseat`. Anyone else uses passenger `megmount` | `operation_mount` |
| `FORCE_DISMOUNT` | none. One seated player. Does not remove the mount | `operation_force_dismount` |
| `RESTORE_MOUNT` | optional `entity` (else equipped). Pays `restore.costs` after delay and requirements | `operation_restore_mount` |
| `REFRESH_MOUNT` | optional `mount` entity, else the live mount | `operation_refresh_mount` → `refresh_mount_entity` |
| `SET_MOUNT_ROW` | `create` + `entity`, `equipped`, `passenger_policy`, `stat` + `delta`. Create stores profile numbers and does not spawn | `operation_set_mount_row` |
| `SET_ENTITY_MODEL` | `model` (`entitymodel_` id, bare blueprint id, or inline map with `blueprint` / `scale` / `hitbox` / `remove_previous`) | `operation_set_entity_model` → `apply_entity_model_at_spawn` |
| `ANIMATE_ENTITY` | `animation` (`entityanimation_` id, bare MEG state, or inline map), optional `li` / `lo` / `speed` / `force` / `delay` / `lock_movement` / `invulnerable_during` | `operation_animate_entity` → `megstate` |
| `MYTHIC_PATH` | `path` (Location list) or LOCATION targeting, optional `speed` / `tolerance` / `duration` / `timeoutdistance` / `timeouttime` | `operation_mythic_path` → `mythicpath` |
| `MYTHIC_SIGNAL` | `signal` (case sensitive), optional `source` (else caster) | `operation_mythic_signal` → `mythicsignal` |
| `MYTHIC_THREAT` | `action` (`ADD` / `SUBTRACT` / `SET`), `amount`, optional `for` (else caster) | `operation_mythic_threat` → `mythicthreat` |
| `SET_COMPANION_STATE` | `state` (`FOLLOW` / `HOLD` for AI, or `RECALLED` / `STORED` for roster). No `target` means every live companion of the caster | `operation_set_companion_state` |
| `SET_ENTITY_AI` | optional `goals`, `targets`, `malus`, `mode` | `operation_set_entity_ai` |
| `RESET_MYTHIC_TARGET` | none. Clears the ActiveMob target only | `operation_reset_mythic_target` |
| `PLAY_BOSS_MUSIC` | `sound`. Also `entity_.boss_music` at spawn. Pulse uses `entity_boss_music_sound_category`. Death/remove calls `stop_entity_boss_music` (`stop_sound`) | `operation_play_boss_music` |

`entity_.mythic` is a shared base id (`base_land_mob`, …), not a unique Mythic mob per content row. See [entities.md](../entities.md). Boss / hurt clips use `ANIMATE_ENTITY`, which calls `megstate` on the first active model. Mythic skill bodies stay off the base shell.

Staff smoke (same op tasks, not `/ex`): spawn `entity_example_boar`, stand near it, `/packentity smoke` or `/packentity smoke model|animate|path|signal|threat`. Nametag refresh: `/packentity smoke nametag`. Defaults: `rules.dsc` `entity_smoke_values`.

Those display spawn ops use **Display vs physics** above. Default is a display entity. Pulse is `repeat` plus lifetime/tickrate.

## What can go wrong

- A `default` choose case that silently skips typos. Unknown `type` is ignored.
- Implementing targeting inside the op file.
- Expecting these stat ops to hit a block (`CURSOR`). They only write entities.
- Using `MODIFY_STAT` when you meant to change a level. That op is consumable current only.
- Using `MODIFY_STAT_LEVEL` on a combat skill. That writes persisted progression.
- Using `ADD_PERCENT` with `25` when you meant 25 percent. Amount is a fraction (`0.25`).
- Using `ADD_PERCENT` without `value_base: MAX` when you wanted a percent of the pool cap. Default is current.
- Passing `amount: damage` when context `event_values.damage` is empty. The write is skipped.
- Using `ITEM_COOLDOWN` as the skill gate. The triggerable `cooldown:` flag is the gate. The op is the gray sweep.
- Expecting `ITEM_COOLDOWN` to be unique per `item_script`. Vanilla keys the overlay by material.
- Using `APPLY_TRANSACTION` with dest `VOID` and `action: GIVE`. That discards the grant.
- Putting `GIVE_ITEM` as the next operation after `APPLY_TRANSACTION`. A failed pay still runs that sibling. Use `onsuccess`.
- Using Denizen `give slot:` for helmet or offhand. That command only fills storage. GIVE_ITEM `slot:` uses `inventory set` / `equip`.
- Player-to-player CURRENCY when `player_transfer` is false. The whole op is a no-op.
- Using `SET_STAT` persist 1 for casting mode. Use `session: true`.
- Using `TOGGLE_STAT` when enter and exit need different sounds. Keep two triggerables.
- Using `inherit:` when you meant to run another mechanic then continue. That is `RUN_MECHANIC`.
- Using PLAY_EFFECT `kind: BLOCK_CRACK` when you wanted sand bits. That overlay is the crack command. Particle bits are `effect: BLOCK` plus `special_data.material`.
- Expecting BLOCK_EXPLOSION to break the floor. It only spawns falling_block copies. The world hook airs those on land.
- Forgetting quotes on equation strings that start with `-`.
- Spawning a marker armor stand for text or a skill model. Use `text_display` / `item_display`. Harvest `create_textdisplay` and `static_armorstand`.
- Copying `- while <[entity].is_spawned>` from legacy gravity, GPS, or projectile loops. Count pulses with `repeat`.
- Using `APPLY_VELOCITY` `target: SELF` `mode: KNOCKBACK` with default AWAY. Origin is you, distance is 0, nothing happens. Use `direction: LOOK`.
- Expecting GUIDE to use `- while`. Pulse count is duration ticks / tickrate ticks.
- Using a snowball or falling_block for VFX that only needs a model. Physics is for vanilla hit, real gravity, collision, or AI.
- Putting PROJECTILE `range` on the op next to `target: LOOK`. Travel range belongs under `projectile:`.
- Expecting PROJECTILE to use `- while`. Pulse count is range/speed or lifetime/tickrate.
- Using APPLY_VELOCITY as projectile travel. That op moves victims. PROJECTILE moves the shot.
- Using APPLY_VELOCITY as a player dash with hit sweep. That is `DASH`.
- Baking knockback into SPAWN_NOTABLE. Push is optional `on_enter` `APPLY_VELOCITY`. Quiet zones omit it.
- Using CUBOID and getting a glass sphere. Legacy square entrap still faked `to_ellipsoid[size+1]`. This op draws cuboid faces. Reload `self_cuboid`.
- Testing push while `material: glass` is set. Client showfake still blocks walking. Use `self_push` (no material).
- Expecting Room-style outline from a 12-edge filter. EDGE is legacy `.shell` plus even `.y`. SURFACE is the full shell.
- Putting edge particles on `inside`. That hook only runs when someone is in the volume. Use `loop`.
- Setting PLAY_EFFECT `offset` on `notable_shell`. Targeting treats `offset` as a location shift. Particle spread still uses the PLAY_EFFECT default when `offset` is omitted.
- Expecting recast to place a second cage. Recast of `<player>_entrap` removes the live one.
- Using `SPAWN_NOTABLE` `fill: true` with a large radius. Shell is the cage. Fill is every block in the volume.
- Porting a fruit barrier script into Backend. `barrier: true` on this op is the wall. PROJECTILE already reads that flag.
- Expecting fake glass to collide on the server. showfake is client-only for projectiles. The client still treats it as a wall, so omit `material` when you need to walk out.
- Listing `EMPTY` on a trap that waits for a victim. Empty despawns on the first pulse if nobody is inside.
- Spawning a marker armor stand for hologram text. Use `SPAWN_HOLOGRAM`.
- Putting the lift in targeting `offset` when you wanted world Y. Use `hologram.offset`.
- Omitting `lifetime` on a skill hologram. That persists like `/packhologram` and is added to the world index.
- Expecting `/packhologram list` to show damage numbers. Those expire and are not indexed.
- Deleting a `text_display` by hand. The index still has the text and restore will put it back. Use `/packhologram remove` or the list after standing next to it.
- Expecting a damage number when INVULNERABLE or NO_MELEE_DAMAGE stopped the packet. Feedback only runs when HP actually lands.
- Using `START_GPS` `target: SELF`. That is your feet and arrives at once. Point at CURSOR, LOOK, or a placeholder.
- Putting GPS `offset` on the op next to `target: CURSOR`. Follow offset belongs under `gps:`. Targeting `offset` shifts the destination.
- Pairing `STOP_GPS` then `START_GPS` as sibling ops. Both `run`. Recast START on the same player.
- Expecting attach-to-player to show the arrow to the owner. Pulse teleport is the follow path.
- Using `item: compass`. Vanilla compass needles glitch. Use `material` plus `modeldata` (legacy smoke is `carved_pumpkin` `182`).
- Spawning an armor stand for GPS. Use `START_GPS`.
- Copying `- while` from `GpsSystem.dsc`. Pulse is `repeat`.
- Treating GPS as a HUD part. It is a world marker, not SHOW_HUD_PART.
- Pairing the first hotbar glyph. That adds a left-side counter and shifts the bar. Use `balance: RAW`.
- Skipping a layout HUD part when it is off. Draw the uppercase / empty bar so later offsets stay. `SHOW_HUD_PART` on the part is only for optional chrome.
- Using menu `create_text_offset` on the actionbar. HUD spacing is `space.N`.
- Regenerating HP inside the HUD composer. Regen already ran in the player loop.
- Using SHOW_HUD_PART for shake or bleed. Those are PLAY_EFFECT `SCREEN_SHAKE` / `BLOODY_SCREEN`.
- Leaving a GPS arrow after a failed pulse. `/packgps list` shows leftover. `/packgps prune` or `clear` removes it.
- Skipping `peimagemap` and putting a paper CMD in the item_frame. PLACE_SPRAY frames `filled_map`. `initialize_registered_sprays` paints the id.
- Spawning an armor stand for a spray. Use `PLACE_SPRAY`.
- Writing unlock maps on `peplayer.unlockedsprays`. Unlock is BOOLEAN `SET_STAT`. Equip is REFERENCE `SET_STAT`.
- Expecting PLACE_SPRAY to unlock the spray. The op only places. Gate the triggerable or the PAGE click.
- Putting the png in the resource pack. `peimagemap` reads `PEUtils/mapImages/<filename>`.
- Copying worn armor into `flag_saves.gear`. Use `EQUIP_GEAR`. Vanilla cells are `GIVE_ITEM`.
- Using `EQUIP_GEAR` `slot: helmet`. That dest is `GIVE_ITEM`. Gear ids are Frontend `gear_slots` rows.
- Spawning an armor stand for a cloak. Use `EQUIP_COSMETIC` / `SPAWN_COSMETIC`.
- Persisting the display UUID. Equipped ids live on `flag_saves.cosmetic_persist`. Join respawns the passenger.
- Writing persist display ids into `flag_saves.gear`. Gear is `EQUIP_GEAR`. Cosmetics are `EQUIP_COSMETIC`.
- Expecting `EQUIP_COSMETIC` to write inventory slot 40. Persist EQUIP is a passenger stand. Hats that follow head pose are `SPAWN_COSMETIC` overlays.
- Copying `- while` from `CosmeticUpdate` or `rotate_armorstand_while`. Remount and `spin:` use the player loop plus swim/glide/walk hooks.
- Expecting `/hidecosmetics` to hide the cloak from other players. That command is client-only for the owner.
- Expecting a passenger helmet to follow head pose. Glide heads and zoan chests use `SPAWN_COSMETIC` with `slot: helmet` or `chestplate`.
- Stashing the previous helmet only on a queue define. Overlay backup is `flag_saves.cosmetic_overlays`. Join restores it.
- Putting cloak items in vanilla chest/legs/boots. Engine does not plant dummy handles. A pack that wants an inventory click uses `GIVE_ITEM` plus `ON_INVENTORY_CLICK` `CLEAR_COSMETIC`. Cloak/back/sheath persist on `cosmetic_channels`. Unequip smoke is `menu_example_cosmetics`.
- Inventing a second slot map. Slot ids come from `global_build_config`.
- Leaving a PROJECTILE display after reload. `/packprojectile list` shows leftover. `/packprojectile prune` or `clear` removes it.
- Indexing each trail piece as its own row. Trails share the shot id. The menu lists shots.
- Putting DASH `range` on the op next to `target: LOOK`. Travel range belongs under `dash:`. `0` means no distance cap (legacy stop is lifetime / standstill / ground).
- Expecting DASH to re-apply velocity every pulse. One impulse, then coast.
- Expecting `bounce` to only punch/step. Default `bounce_modes` is all three. Wall hop is `bounce_wall.hop`. Floor-as-wall is `bounce_wall.floor`.
- Expecting the dash to keep going after a hit. Default `continue: false` zeros motion. Set `continue: true` to pierce.
- Putting slam AOE as sibling `operations.2`. The dash queue is `run`. Put the AOE in `end`.
- Using UP/DOWN as pure vertical. Those keep look XZ and set Y (`slamaoe`).
- Spawning an `item_display` for a dash. Physics stays on the living entity.
- Expecting `invertible` to recast by itself. This op only honors `projectile_inverted` on the live shot.
- Putting `stay_alive_model` without `stay_alive` duration. The parked display is not spawned.
- Wiring pass XP as `on mythicmob mob killed`. Use `GRANT_SEASON_XP` on a triggerable (`ON_KILL` smoke is `triggerable_seasonpass_kill_xp`).
- Unquoted season `start` / `end` dates. Quote them.
- Hardcoding next month's pass rewards in Backend. Ship a new `seasonpass_` file.
- Opening item storage with `OPEN_MENU`. That is a fakeitem GUI. Use `OPEN_STORAGE`.
- Opening player trade with `OPEN_MENU`. That is a fakeitem GUI. Use `OPEN_TRADE`.
- Adding a `wiki_` prefix for player wiki pages. Use `OPEN_WIKI_MENU` and `notinwiki` on existing scripts.
- Building drop lore or full item maps for every wiki row when the PAGE opens. Use `REVEAL_WIKI_LORE` on click.
- Treating `docs/` as the in-game wiki. `docs/` is the engine option catalog.
- Expecting a Backend crew vault. `kind: SHARED` plus a pack BOOLEAN is the bank.
- Depositing `unvaultable` / `soulbound` items. Create must stamp those flags.
- Using `START_GPS` for a named dock. That draws a compass. `TRAVEL_TO_WAYPOINT` teleports.
- Putting `APPLY_TRANSACTION` before `TRAVEL_TO_WAYPOINT` as the pay step. A failed pay still runs the sibling. The travel op pays inside itself.
- Expecting a walk onto waypoint coordinates to fill a `WAYPOINT` quest. Arrival is this op and `/packwaypoint go`.
- Expecting `ignore_cost` to skip an area `TRAVEL: DENY`. That gate always blocks the move.
