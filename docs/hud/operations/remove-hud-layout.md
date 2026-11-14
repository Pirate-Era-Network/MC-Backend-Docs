---
sidebar_position: 6
---

# REMOVE_HUD_LAYOUT

`REMOVE_HUD_LAYOUT` drops one `hud_` script from the session stack. The saved base id stays. Show and hide overlays stay. The extra row leaves the actionbar. A remove of a layout that is not in the stack does nothing. Quit drops session rows even if this op never ran. A layout with `persist: true` stays until this op runs, or until its requirements fail. This op is for mechanics. A `hudpart_` `operations:` list only reads `SHOW_HUD_PART` and `HIDE_HUD_PART`, so a remove on a part does nothing.

| Key | What to write |
| --- | --- |
| `layout` | `hud_` script to drop. The prefix on the value is optional. Same key as `SET_HUD_LAYOUT`. |
| `target` | Who loses the row. Default is the caster (`SELF`). |

```yaml
mechanic_remove_quest_hud:
    type: data
    debug: false
    data:
        operations:
            1:
                type: REMOVE_HUD_LAYOUT
                layout: hud_quest
                target: SELF
```

Add the row with [ADD_HUD_LAYOUT](add-hud-layout.md). The base id is still [SET_HUD_LAYOUT](set-hud-layout.md).

## Tips

- This does not replace the base id and does not clear overlays.
- A missing layout does not write. The bar stays as it was.
- Quit clears session rows. A `persist: true` layout stays, so disconnect does not need a remove for that row.
- `hud_quest` and `quest` both resolve to the `hud_` script.
