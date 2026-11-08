---
sidebar_position: 3
---

# CLEAR_HUD_PARTS

`CLEAR_HUD_PARTS` drops show and hide overlays, including a `duration` that is still running and a `session: true` overlay. The layout script stays as it is. Leave the filter off to drop every overlay. `filter`, `part`, or `kind` limits that drop to one part id or one kind, and those three are one choice. This op is for mechanics. A `hudpart_` `operations:` list only reads `SHOW_HUD_PART` and `HIDE_HUD_PART`, so clear on a part does nothing.

| Key | What to write |
| --- | --- |
| `filter` | Optional. A `hudpart_` id, or a kind name such as `GLYPH`. Only those overlays drop. |
| `part` | Same filter as `filter`, when you mean one part id. |
| `kind` | Same filter as `filter`, when you mean every part of that kind. |
| `target` | Who it applies to. Default is the caster (`SELF`). |

```yaml
mechanic_clear_hud:
    type: data
    debug: false
    data:
        operations:
            1:
                type: CLEAR_HUD_PARTS
                target: SELF
```

One part:

```yaml
operations:
    1:
        type: CLEAR_HUD_PARTS
        part: hudpart_stunned_text
        target: SELF
```

## Tips

- Clear ends a `session: true` show or hide. A `duration` still running ends too.
- The base [layout](../layout.md) row is unchanged. To swap the whole row, use [SET_HUD_LAYOUT](set-hud-layout.md).
- `filter`, `part`, and `kind` are one choice. Set one of them.
