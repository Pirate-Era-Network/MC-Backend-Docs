---
sidebar_position: 39
---

# PLACE_SPRAY and OPEN_SPRAY_MENU

`PLACE_SPRAY` frames a `filled_map` on an invisible item frame. `peimagemap` paints that map from `PEUtils/mapImages/<filename>`. A paper custom model, and an armor stand, are not this visual. The op places the equipped spray. It does not unlock it. Unlock is a Frontend `BOOLEAN` written with `SET_STAT`, and the equipped id is a `REFERENCE`. `OPEN_SPRAY_MENU` builds the page of `spray_` rows. A locked row has no click. The png stays out of the resource pack, because `peimagemap` reads the mapImages folder. Entity choice is on [Display and pulse](display.md).

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
/packspray list
```

Harvest: `spraylogic.dsc` (ray, item_frame, filled_map, one per player, 30s), `sprayutils.dsc` `peimagemap` + `get_spray_rotation`, `sprayequipmenu.dsc` (PAGE). Leave `/PEspray` and `peplayer.unlockedsprays` behind.
