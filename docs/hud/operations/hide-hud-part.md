---
sidebar_position: 2
---

# HIDE_HUD_PART

`HIDE_HUD_PART` belongs in a mechanic `operations:` map. A skill move uses the same map. The hide forces that layout slot to draw its pad, so later offsets stay put.

On a `hudpart_` script the same type is a presence rule. The part list only reads `SHOW_HUD_PART` and `HIDE_HUD_PART`. Other op types on a part do nothing.

## In a mechanic

| Key | What to write |
| --- | --- |
| `part` | `hudpart_` script already in the layout. The prefix on the value is optional. |
| `duration` | How long the pad stays, such as `5s`. When the time ends, the part draws again. |
| `session` | `true` keeps the pad until a clear or a layout change. A later show of that same part also ends it. |
| `target` | Who it applies to. Default is the caster (`SELF`). |

Omit both `duration` and `session` and the hide lasts one hour.

```yaml
mechanic_hide_hp_bar:
    type: data
    debug: false
    data:
        operations:
            1:
                type: HIDE_HUD_PART
                part: hudpart_hp_bar
                duration: 5s
                target: SELF
```

## On the part

Write the op under the part when a passed requirement should draw the pad and keep the slot.

| Requirements | What draws |
| --- | --- |
| Pass | The pad. The slot stays. |
| Fail | The on-state |

```yaml
operations:
    1:
        type: HIDE_HUD_PART
requirements:
    1:
        type: BOOLEAN
        stat: stat_blind
        mode: HAS
```

That pair hides the part while `stat_blind` is on. The empty letter, off glyph, or `Z` pad still occupies the slot. Requirement types are on [requirements](../../mechanics/requirements.md).

## Tips

- Hide a slot you need to keep. Omit a slot only with [SHOW_HUD_PART](show-hud-part.md), and only when it is last or an extra.
- The pad is the off glyph, the empty bar letter, or `pad_char`. The hide does not delete the part from the layout script.
- `session: true` stays until [CLEAR_HUD_PARTS](clear-hud-parts.md) or [SET_HUD_LAYOUT](set-hud-layout.md).
