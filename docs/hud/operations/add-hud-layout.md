---
sidebar_position: 5
---

# ADD_HUD_LAYOUT

`ADD_HUD_LAYOUT` appends a `hud_` script onto the session stack. The saved base id from [SET_HUD_LAYOUT](set-hud-layout.md) stays. Show and hide overlays stay. The extra row is drawn into the same actionbar, and its offsets are measured from the center pin. A later add of the same layout does nothing. [REMOVE_HUD_LAYOUT](remove-hud-layout.md) drops it. Quit drops the row unless that `hud_` script sets `persist: true`. A persist row stays through quit, and join removes it when the layout `requirements` fail. This op is for mechanics. A `hudpart_` `operations:` list only reads `SHOW_HUD_PART` and `HIDE_HUD_PART`, so an add on a part does nothing.

| Key | What to write |
| --- | --- |
| `layout` | `hud_` script. The prefix on the value is optional. Same key as `SET_HUD_LAYOUT`. |
| `target` | Who receives the row. Default is the caster (`SELF`). |

```yaml
mechanic_add_quest_hud:
    type: data
    debug: false
    data:
        operations:
            1:
                type: ADD_HUD_LAYOUT
                layout: hud_quest
                target: SELF
```

The row shape is on the [layout](../layout.md) page. Keep the extra on `PAIR`.

## Tips

- This does not replace the base id and does not clear overlays.
- Offsets on this row start from the center pin again. They are not added onto the end of the base row.
- `RAW` on an extra is drawn as `PAIR`, so it cannot shove the base bar off center.
- A second add of the same script does not write.
- The stack leaves when [REMOVE_HUD_LAYOUT](remove-hud-layout.md) runs, or when the player quits. `persist: true` on the layout keeps that one row across quit. See [layout](../layout.md).
