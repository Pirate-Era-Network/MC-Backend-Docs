---
sidebar_position: 4
---

# Mechanic requirements

**Live.** Missing or empty `requirements` always pass. Unknown `type` values fail.

Types come from `rules.dsc` `mechanic_requirement_types`. Who is checked comes from `source` (`mechanic_value_sources`). Default `caster`. `target` is the primary context target (same as value resolution). Environment helpers (`entity_is_grounded`, `entity_is_in_water`, `entity_is_in_air`) take any entity. Call them from other systems too.

```yaml
requirements:
    1:
        type: GROUNDED
        source: target
```

Use a keyed map (`1`, `2`, …), same as operations.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | A `mechanic_requirement_types` value |
| `source` | no | `caster` (default) or `target` |

| `type` | Extra keys | What it checks |
| --- | --- | --- |
| `STAT` | `stat` (script name), optional `min`, optional `max` | Effective stat **level** (overlay if present), not consumable current |
| `HEALTH` | optional `min`, optional `max` | Last APPLY/SPLIT consumable on `damage_routing` (true HP under shields, `stat_player_maximum_health` on the player config). Vanilla `health` if there is no consumable route |
| `IN_WATER` | none | Feet block name is in `mechanic_requirement_water_materials` (water, kelp, seagrass, coral, …). Not vanilla `is_liquid` |
| `IN_AIR` | none | Not `GROUNDED`, and not `IN_WATER` |
| `GROUNDED` | none | `is_on_ground`, or solid 1 or 2 blocks below |
| `IN_AREA` | optional `id`, optional `kind`, optional `group`, optional `category`, optional `mode` (`HAS` default, or `NOT`) | Feet are inside a noted area this engine stamped. `id` matches `notable_id`, the name suffix (`player_entrap`), an area note id, or an area template name (`area_example_safe`). `group` matches an area whose groups list contains that name (`areagroup_example_safe`). `category` matches the normalized area category (`farm` / `FARM`, `safe`, `gate`). `kind` is `SKILLMOVE` / `AREA` / `PLOT`. Set keys combine. Dash stamina exemption is this row on the cost mechanic, not a key on SPAWN_NOTABLE |
| `HAS_STATUS_EFFECT` | `stat` (id), optional `mode` (`HAS` default, or `NOT`) | Overlay flag (`has_stat_level_overlay`), or vanilla potion `has_effect` if there is no stat script. Pack booleans use `BOOLEAN` |
| `FLAG` / `BOOLEAN` | `stat` (id), optional `mode` (`HAS` / `NOT`) | Effective `> 0` (overlay or persist). Quest unlocks, casting mode, silence. See [stats.md](../stats.md) |
| `ITEM_IN_HAND_LEVEL` | optional `item`, optional `min`, optional `max`, optional `hand` | Item in `hand` (`MAIN` default, or `OFFHAND`). `item` must match `item_runtime_flags.script_name` on the item, or `ItemTag.script.name`. Level is the `item_runtime_flags.level` flag (0 if missing) |
| `ITEM_HAS_SKILLS` | optional `item`, optional `min`, optional `max`, optional `hand` | Same item match as `ITEM_IN_HAND_LEVEL`, then the Item Config `skills:` list is not empty |
| `ITEM_HAS_LOOT_CRATE` | optional `item`, optional `min`, optional `max`, optional `hand` | Same item match, then Item Config `loot_crate` resolves to a `lootcrate_*` script |
| `ITEM_HAS_CONSUME` | optional `item`, optional `min`, optional `max`, optional `hand` | Same item match, then Item Config `consume:` is a map |
| `SNEAKING` | optional `mode` (`HAS` default, or `NOT`) | `PlayerTag.is_sneaking`. Shift+click vs standing click on the same event |
| `MOUNTED` | optional `mode` (`HAS` default, or `NOT`) | `PlayerTag.is_driver` or `PlayerTag.is_passenger`. A mob fails `HAS` |
| `MOUNT_ROLE` | `role` (`driver` or `passenger`) | Matches `mount_roles`. Unseated fails |
| `MOUNT_LOCOMOTION` | `locomotion` (`ground`, `swim`, or `fly`) | `PlayerTag.mount`. Swim is checked before fly. Ground is a seated mount that is not swimming and not flying. Unseated fails |

`create_item_from_config` stamps `item_script` and `level` (and optional tier / set flags). `ITEM_IN_HAND_LEVEL` with `item:` matches that script name.

Smoke: `mechanic_example_requirements` in `pirate-era-core-frontend/Mechanics/mechanic_examples.dsc`.

## What can go wrong

- Checking `STAT` on `stat_stamina` min and expecting current stamina points. That is level. Current pool is `HEALTH` only for the last APPLY/SPLIT damage-route health stat, or `MODIFY_STAT` for other consumables.
- A typo in `type`. The mechanic is cancelled. It does not skip the row.
- Putting requirements on an operation. They belong on the mechanic config.
- `IN_WATER` using vanilla `is_liquid`. Ocean plants (kelp, seagrass) are not liquid. The water list in `rules.dsc` is the check.
- `GROUNDED` using only `is_on_ground`. Custom gravity and flight make that false while you are still near the floor.
- Expecting `IN_AREA` without a stamped note. Skill cages use `SPAWN_NOTABLE`. World areas use `/packarea place`. `group` and `category` only match kind `AREA`.
- `HAS_STATUS_EFFECT` on a pack BOOLEAN. That is `BOOLEAN` `mode: HAS` or `NOT`.
- `ITEM_IN_HAND_LEVEL` on a vanilla item with no flags. Give pack items through `give_target_item_from_config`.
- `source: target` with no context target (or a Location in that slot). The row fails. Pass `def.targets:` in `/ex`.
- Copying `entity_is_grounded` and swapping the entity name. Pass a different entity into the same proc.
- Treating an unseated player as `MOUNT_LOCOMOTION` ground. Ground is only a seated mount that is not swimming and not flying.
