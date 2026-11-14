---
sidebar_position: 1
---

# GLYPH

A glyph draws one letter from a pack font. The hotbar pin, an outline, and a full-screen frame are this kind. `glyph` (or `on_glyph`) is the letter while the part is on. `off_glyph` is the letter while it is off. If you omit the off letter, the engine uses the uppercase twin, which is the same width in this pack, so the rest of the row stays put. The letter has to exist in that font. The first hotbar letter sets `balance: RAW` because it is the pin. Any later glyph leaves `balance` off so it stays `PAIR`. Row placement is on the [layout](../layout.md) page.

| Key | What to write |
| --- | --- |
| `font` | Short name from [appearance](../appearance.md), such as `hotbar` or `scaled`. |
| `glyph` | The letter while the part is on. |
| `on_glyph` | Same job as `glyph`. Use this when you also set an off letter. |
| `off_glyph` | The letter while the part is off. If you omit it, the off letter is the uppercase twin of the on letter. |
| `flag` | Optional copy key. A non-empty value draws the on letter. An empty key draws the off letter. Omit it and the glyph does not read the copy map. |

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

A full-screen frame uses `glyph` plus `off_glyph`, then [SHOW_HUD_PART](../operations/show-hud-part.md) on the part. Requirement types are on [requirements](../../mechanics/requirements.md).

## Tips

- Copy the letter from that font's character list.
- `off_glyph` is the width twin. Uppercase `R` cancels lowercase `r` when the frame is off.
- The first hotbar letter uses `balance: RAW`. Any later glyph stays `PAIR`.
- Two frames on one slot: `on_glyph` when the requirement passes, `off_glyph` when it fails. Leave off `SHOW_HUD_PART`, or a failed requirement removes the slot instead of drawing the other frame.
- `flag` on a glyph is the same copy map as a text line. An empty name draws the off frame and keeps the width.
