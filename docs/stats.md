---
sidebar_position: 6
---

# Stats

**Live** for value, regen, consumable, affects, linear equation. **Partial** for combat-state regen (PAUSE/SLOWED), percent-loss on death, extra equations.

Prefix: `stat_`. Pack stats live on Frontend (`StatConfig.dsc`, `Stats/control_effect_stats.dsc`, `Stats/event_stat_examples.dsc`). World-lock ops live on Backend (`NO_WALK`, `HIDDEN`, …). Hidden hook: `utils/control_effects/control_effect_hidden.dsc`. See [control-effects.md](control-effects.md).

A script is a stat because its name starts with `stat_` and it is `type: data`. Shape under `data:`:

```yaml
stat_stamina:
    type: data
    data:
        stat_config:
            kind: VALUE
            ondeath: keep
            operator: +
            affects:
                - stat_player_maximum_health
        value_config:
            basevalue: 20
            maxvalue: 1000
            level_cap: levelcap_player
            equation_config:
                type: linear
        stat_consumable_config:
            depletes_to: 0
            onspawn:
                type: MAX
        stat_regen_config:
            affects:
                - stat_stamina
            combat_stat:
                type: NORMAL
```

## How Backend classifies a stat

| Block present | Kind |
| --- | --- |
| `stat_consumable_config` | Consumable (current value on `data.consumed_stats`) |
| `stat_regen_config` | Regen (feeds other stats each second) |
| `stat_event_config` | Eventstat (world events fire Mechanics). See [triggers.md](triggers.md) |
| neither of the above | Plain value stat |

`stat_config.kind` is required on Frontend (stay whole, do not omit it on VALUE rows). Options in `rules.dsc` `stat_kinds`:

| kind | What is stored | Equations | `/stats` | On-check |
| --- | --- | --- | --- | --- |
| `VALUE` | level | `value_config` | shown | `STAT` min/max on level |
| `BOOLEAN` | persist 0, overlay or persist `> 0` is on | no | skipped | `BOOLEAN` / `FLAG` (effective). `HAS_STATUS_EFFECT` is overlay-present or vanilla potion |
| `NUMBER` | a number, no leveling curve | no | shown as the stored number | `STAT` min/max |
| `REFERENCE` | script/id string (`skillmove_example`) | no | skipped | not a boolean. Read with `get_target_stat_stored` |

`FLAG` is an alias of `BOOLEAN`. Overlay is not a kind. Overlay is the timed or session apply path (`runtime_data.stat_level_overlays`, optional `duration`). Persist is the saved row (`SET_STAT` without duration/session, `MODIFY_STAT_LEVEL`). `SET_STAT` `value: 0` clears overlay then persist.

```yaml
stat_casting_mode:
    type: data
    data:
        stat_config:
            kind: BOOLEAN
            ondeath: keep

stat_skillmove_1:
    type: data
    data:
        stat_config:
            kind: REFERENCE
            default: skillmove_example
            ondeath: keep
```

Global Build skill slots are more REFERENCE stats (`stat_skillmove_2`, `stat_skillmove_3`, `stat_skillmove_passive_1`). Titles persist as ChatPrefix id lists, not a REFERENCE slot (see [titles.md](titles.md)). Class membership is a BOOLEAN (`stat_class_example`), same as casting mode. See [skills.md](skills.md).

`stat_config.affects` lists other stats this one modifies. Reload builds `server.flag[utils.stat_lookup_table]` from that.

## Keys

**stat_config**

| Key | Status | Notes |
| --- | --- | --- |
| `kind` | Live | `VALUE` / `BOOLEAN` / `NUMBER` / `REFERENCE` (`FLAG` = `BOOLEAN`) |
| `default` | Live | Init persist for `NUMBER` (else 0) and `REFERENCE` (else `none`) |
| `ondeath` | Partial | `keep` used. PERCENT_LOSS not finished |
| `operator` | Live | `+` `*` etc. for how it affects others |
| `affects` | Live | List of `stat_*` names |
| `presentation` | Live | World push from overlay / effective values. See below |

**presentation** (inside `stat_config`)

Keys: `rules.dsc` `stat_presentation_keys`. This is how buffs and debuffs reach Minecraft without a buff engine.

| Key | Status | Notes |
| --- | --- | --- |
| `vanilla_effect` | Live | Potion type (`BLINDNESS`, `NIGHT_VISION`, …). Applied with `cast` while a **presentation overlay** is present. Prefer `CAST_VANILLA_EFFECT` for named blindness/slowness. Amplifier is effective level minus 1 |
| `vanilla_effect_particles` | Live | Default false |
| `vanilla_effect_icon` | Live | Default true |
| `movement` | Live | `WALK` / `SPRINT` / `BOTH` on any listed stat. Highest matching computed value is pushed to `adjust speed`. Floor is gamerules `base_movement_speed`. Persist 0 with no overlay is ignored (temporary haste). The script name does not matter. There is no `default_stats` lookup. |
| `knockback` | Live | When true, the listed stat is scanned for the knockback attribute (highest wins). Same persist-0 skip as movement. The script name does not matter. |
| `cleansed` | Live | `CLEAR_STAT_OVERLAY` with no `stat` also drops this overlay (plus world locks and category bans) |

Do not put `vanilla_effect: SPEED` on the same stat you also drive with `movement`. Pick potion visuals or `adjust speed`, not both.

Temporary potions: `CAST_VANILLA_EFFECT`. Temporary world locks: `NO_WALK` / `HIDDEN` / other world-lock ops. See [control-effects.md](control-effects.md).

**value_config**

| Key | Status |
| --- | --- |
| `basevalue` | Live |
| `maxvalue` | Live |
| `minlevel` / `maxlevel` | Live. Optional on the stat. Else from `level_cap` |
| `level_cap` | Live. `levelcap_*` script (`levelcap_player`). Inline min/max on the stat still win |
| `equation_config.type` | Partial (`linear` only) |

**stat_consumable_config**

| Key | Status |
| --- | --- |
| `depletes_to` | Live (clamp floor) |
| `onspawn.type` | Partial (`MAX` used. ZERO / PRESERVED / FACTOR incomplete) |

**stat_regen_config**

| Key | Status |
| --- | --- |
| `affects` | Live |
| `combat_stat.type` | Partial (`NORMAL` used. PAUSE / SLOWED missing) |

**stat_event_config**

| Key | Status |
| --- | --- |
| `chance` | Live (`0` to `1`, or percent if greater than `1`) |
| `trigger_mode` | Live (`ALL` / `ONE`) |
| `target` | Live (`SELF` / `VICTIM` / `AOE`) |
| `events` | Live (rows with `type` from `stat_event_triggers`) |
| `mechanics` | Live |
| `requirements` | Live |

Item-hosted eventstats are Contract. Living-entity list is Live. See [triggers.md](triggers.md).

## Runtime

- Level: `get_target_stat_level` with a `stat_level_views` value (`PERSISTED`, `EFFECTIVE`, `OVERLAY`). Default `EFFECTIVE`. `OVERLAY` falls back to persisted when that flag is missing
- True saved level: `get_target_persisted_stat_level` (wrapper for `PERSISTED`) or `set_stat`
- Full map: `get_all_target_stats` (default `PERSISTED`). Pass `EFFECTIVE` for UI
- Computed max / value: `get_stat_value_of_target` (4th arg `view`, default `EFFECTIVE`). `forced_level` still wins when set
- Temporary apply (overlay): `set_stat_level_overlay` / `clear_stat_level_overlay` (`runtime_data.stat_level_overlays`)
- Stored as-is (including REFERENCE ids): `get_target_stat_stored`
- Consumable current: `set_consumable_stat_value` / `get_target_consumable_stat_value` (clamps to max value and `depletes_to`)
- Regen tick: `regenerate_all_target_stats` each second. Players from `player_game_loop`. Indexed living entities from `tick_entity_ai_for_index_row`. A regen stat or affected bar that is not on that target is skipped. Full bars skip the write. `sync_all_stat_presentation` stays on the player loop. `heal_on_target_loss` and area `heal_on_leash` still refill the health route to max once. That is not this tick.
- `/stats` prints `get_all_target_stats` with `EFFECTIVE`
- Health bar fill is consumable current. Bar max is `get_stat_value_of_target` (`EFFECTIVE` while buffed, `PERSISTED` for the true cap)

A living entity lists pack stats it uses. World locks are not listed. See [living-entities.md](living-entities.md) and [control-effects.md](control-effects.md).

## What can go wrong

- Omitting `stat_` on the script name. It will not register.
- Putting `affects: stamina` instead of `stat_stamina`.
- Putting player min/max in `registry_gamerules`. VALUE stats use `levelcap_*` or inline `minlevel` / `maxlevel`.
- Setting consumable current with a raw flag. Regen and clamp will disagree.
- Writing `data.stats` from a skill. Use `SET_STAT` (persist, or `duration:` / `session:` for overlay). Use `OVERLAY_STAT_LEVEL` when you need ADD_FLAT math on the overlay.
- Calling `get_all_target_stats` with no view and expecting overlay. Default is `PERSISTED`. Pass `EFFECTIVE` for UI.
