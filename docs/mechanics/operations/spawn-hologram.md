---
sidebar_position: 38
---

# SPAWN_HOLOGRAM

`SPAWN_HOLOGRAM` spawns a `text_display`. There is no armor stand path. `hologram.offset` is world XYZ added after targeting. Targeting `offset` stays look-relative, so a lift belongs under `hologram:`. Omit `lifetime` and the op `duration` and the text persists on the hologram index, the same way an admin sign does. A skill line that should disappear sets `lifetime`. Damage numbers are timed and are not on that index, so `/packhologram list` will not show them, and they only appear when the hit actually changes health. Deleting the display by hand leaves the index row, and restore will put the text back. Use `/packhologram remove`. Entity type and pulse are on [Display and pulse](display.md).

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
/packhologram hello
/packhologram 2 hello
/packhologram list
/packhologram remove
```

Harvest: `PEhologram.dsc` `create_textdisplay` (text, pivot center, transparent background). `pedamageindicator` (1s, above 2, random offset, type colors). Do not port marker armor stands.
