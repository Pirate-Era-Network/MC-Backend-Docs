---
sidebar_position: 7
---

# EFFECT_STRIP

An effect strip is a fixed row of slots you list yourself. Unused slots still draw, which is what keeps the row the same width when a stat is off. `CHARS` draws `on_glyph` while that slot's stat is on, and `off_glyph` while it is off or the slot has no stat. `TIMES` prints the seconds left on that stat, and `step` is the gap between those countdown cells. Default mode is `CHARS`, and `step` is only read by `TIMES`. One part is one mode, so icons and a countdown are two parts. Shared row keys are on the [layout](../layout.md) page.

| Key | What to write |
| --- | --- |
| `font` | Short name from [appearance](../appearance.md), such as `scaled`. |
| `strip_mode` | `CHARS` is the icon row. `TIMES` is leftover seconds for each slot. Default is `CHARS`. |
| `slots` | Numbered map. Each slot can set `on_glyph`, `off_glyph`, and `stat`. |
| `step` | Space between leftover-time cells. Only `TIMES` reads it. Default is `11`. |
| `counter` | Left-side twin for the whole row. `Z` holds the width. |

```yaml
hudpart_effects:
    type: data
    debug: false
    data:
        kind: EFFECT_STRIP
        font: scaled
        strip_mode: CHARS
        counter: Z
        slots:
            1:
                on_glyph: d
                off_glyph: D
            2:
                on_glyph: e
                off_glyph: E
                stat: stat_no_cast
            3:
                on_glyph: f
                off_glyph: F
                stat: stat_stunned
```

A leftover-time row uses the same slots and sets `strip_mode: TIMES`. Add `step` only on that row:

```yaml
strip_mode: TIMES
step: 11
```

## Tips

- The slot count is the width. Keep the off letter on every slot you want to reserve.
- `step` does nothing on `CHARS`. Set it on the `TIMES` row when the countdown cells need a gap.
- One part is one mode. Use two parts when you want icons and a countdown.
