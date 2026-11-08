---
sidebar_position: 1
---

# GLYPH

A glyph is one pack letter. Use it for the hotbar anchor, an outline, or a full-screen frame.

Shared row keys (`offset`, `balance`, `requirements`, `priority`) are on the [layout](../layout.md) page.

| Key | What to write |
| --- | --- |
| `font` | Short name from [appearance](../appearance.md), such as `hotbar` or `scaled`. |
| `glyph` | The letter while the part is on. |
| `on_glyph` | Same job as `glyph`. Use this when you also set an off letter. |
| `off_glyph` | The letter while the part is off. If you omit it, the off letter is the uppercase twin of the on letter. |

The letter has to exist in that font.

```yaml
hudpart_hotbar:
    type: data
    debug: false
    data:
        kind: GLYPH
        font: hotbar
        glyph: a
        balance: RAW
```

`balance: RAW` is here because this letter is the center anchor. A normal glyph leaves `balance` off so it stays `PAIR`. See [layout](../layout.md).

A full-screen frame uses `glyph` plus `off_glyph`, then [SHOW_HUD_PART](../operations/show-hud-part.md) on the part. Requirement types are on [requirements](../../mechanics/requirements.md).

## Tips

- Copy the letter from that font's character list.
- `off_glyph` is the width twin. Uppercase `R` cancels lowercase `r` when the frame is off.
- The first hotbar letter uses `balance: RAW`. Any later glyph stays `PAIR`.
