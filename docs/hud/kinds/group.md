---
sidebar_position: 8
---

# GROUP

A group is a pin plus a list of other parts. The layout row sets that pin once. Each child `offset` is measured from the group, not from the center of the screen. Moving the layout pin moves every child by the same amount. `SHOW_HUD_PART` and `HIDE_HUD_PART` on the group cover the whole widget. A child keeps its own kind, so a bar stays a bar and a text line stays text.

Child order is paint order. Put the bar or the icon before the number that has to sit on top of it. A group can contain a group. Two layers is the limit (`hud_defaults.group_depth`), which is enough for a row whose children are pairs. A part that lists itself is skipped.

| Key | What to write |
| --- | --- |
| `parts` | Numbered map, same shape as a [layout](../layout.md) row. `part` and `offset`. `offset` is from this group's pin. |

```yaml
hudpart_health:
    type: data
    debug: false
    data:
        kind: GROUP
        parts:
            1:
                part: hudpart_health_bar
                offset: 0
            2:
                part: hudpart_health_numbers
                offset: 35
```

The layout then lists `hudpart_health` at `-350`. The bar lands on `-350`. The numbers land on `-315`.

## Tips

- Hide one child by name when only that piece should pad. Hiding the group pads every child.
- A child that is already drawn in this bar is not drawn again.
- Keep the leaves as their own `hudpart_` scripts so another group can reuse them with a different inset.
