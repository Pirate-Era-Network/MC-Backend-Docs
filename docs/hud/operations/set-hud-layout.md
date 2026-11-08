---
sidebar_position: 4
---

# SET_HUD_LAYOUT

`SET_HUD_LAYOUT` belongs in a mechanic `operations:` map. A skill move uses the same map. It switches the player to another `hud_` script and keeps that choice.

A layout change also clears show and hide overlays, including a `session: true` overlay. The new row starts from the layout script alone.

This op is for mechanics. A `hudpart_` `operations:` list only reads `SHOW_HUD_PART` and `HIDE_HUD_PART`, so a layout change on a part does nothing.

| Key | What to write |
| --- | --- |
| `layout` | `hud_` script. The prefix on the value is optional. |
| `target` | Who receives the layout. Default is the caster (`SELF`). |

```yaml
mechanic_set_combat_hud:
    type: data
    debug: false
    data:
        operations:
            1:
                type: SET_HUD_LAYOUT
                layout: hud_combat
                target: SELF
```

`hud_combat` is a layout of parts. The row shape is on the [layout](../layout.md) page.

## Tips

- Show and hide overlays from the previous layout end here. Put a new show in a later operation if the new row still needs it.
- The layout name is the script name. `hud_combat` and `combat` both resolve to the `hud_` script.
- Swap layouts from a mechanic. The part itself cannot change which row it sits in.
