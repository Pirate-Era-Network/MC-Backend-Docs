---
sidebar_position: 6
---

# BOOLEAN

A boolean part watches a pack stat. On draws `on_glyph`. Off draws `off_glyph`.

Shared row keys are on the [layout](../layout.md) page.

| Key | What to write |
| --- | --- |
| `font` | Short name from [appearance](../appearance.md). |
| `stat` | Pack boolean `stat_`. On means the effective value is above `0`. |
| `on_glyph` | Letter while the stat is on. |
| `off_glyph` | Letter while the stat is off. If you omit it, the off letter is the uppercase twin. |

```yaml
hudpart_casting:
    type: data
    debug: false
    data:
        kind: BOOLEAN
        font: scaled
        stat: stat_casting_mode
        on_glyph: c
        off_glyph: C
```

Both letters have to exist in that font. The off letter is what holds the width when casting mode is off, so the rest of the row stays put.

## Tips

- Use a pack boolean. Turn it on with `SET_STAT` from a mechanic. This part only reads it.
- `off_glyph` should be the same width as `on_glyph`. Uppercase is that twin in this pack.
- A requirement can hide the whole slot's on-state. With no presence op, a failed requirement still draws `off_glyph`.
