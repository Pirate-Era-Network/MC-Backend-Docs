---
sidebar_position: 1
---

# SHOW_HUD_PART

`SHOW_HUD_PART` belongs in a mechanic `operations:` map. A skill move, an item skill, a triggerable, or `RUN_MECHANIC` all run that map. The same mechanic can show a part and play a sound as two numbered entries.

On a `hudpart_` script the same type means something narrower. The part list only reads `SHOW_HUD_PART` and `HIDE_HUD_PART`. It decides whether a failed requirement omits the part or draws its pad. Other op types on a part do nothing.

## In a mechanic

| Key | What to write |
| --- | --- |
| `part` | `hudpart_` script. The prefix on the value is optional. |
| `duration` | How long the show lasts, such as `5s`. When the time ends, the show ends. |
| `session` | `true` keeps the show until a hide, a clear, or a layout change. |
| `target` | Who sees it. Default is the caster (`SELF`). |

Omit both `duration` and `session` and the show lasts one hour.

A part already in the layout is forced on for that time. A part that is not in the layout is drawn after the base row, in `priority` order. Leave that extra on `PAIR`. See [layout](../layout.md).

```yaml
mechanic_show_stunned_text:
    type: data
    debug: false
    data:
        operations:
            1:
                type: SHOW_HUD_PART
                part: hudpart_stunned_text
                duration: 5s
                target: SELF
```

## On the part

Write the op under the part when a failed requirement should omit the piece.

| Requirements | What draws |
| --- | --- |
| Pass | The on-state |
| Fail | Nothing. The part is left out of the bar |

Use that omit on the last layout slot, or on an extra that is not in the base row. A middle slot that disappears slides every later offset. For a middle slot, leave the presence op off so a failed requirement draws the pad.

```yaml
hudpart_blind_frame:
    type: data
    debug: false
    data:
        kind: GLYPH
        font: scaled
        glyph: r
        off_glyph: R
        priority: 20
        requirements:
            1:
                type: BOOLEAN
                stat: stat_blind
                mode: HAS
        operations:
            1:
                type: SHOW_HUD_PART
```

Requirement types are on [requirements](../../mechanics/requirements.md).

## Tips

- Put `PLAY_SOUND` on the mechanic, as the next number in `operations:`. On the part it is ignored.
- `session: true` stays up across the fight. End it with [HIDE_HUD_PART](hide-hud-part.md), [CLEAR_HUD_PARTS](clear-hud-parts.md), or [SET_HUD_LAYOUT](set-hud-layout.md).
- An extra needs `priority` on the part. Higher paints later.
