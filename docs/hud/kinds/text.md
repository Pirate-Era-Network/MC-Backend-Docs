---
sidebar_position: 4
---

# TEXT

A text part prints words. `text` is a transcript key such as `hud_stunned_text`, or a literal when the string will not be translated. Put the words in the transcript under that key. Custom-font copy stays lowercase, because that font has no capital glyphs for words. Width keys (`maxchars`, `pad`, `counter`, `color`) work the same way as on a [stat](stat.md) part. This part is usually an extra: leave it out of the base row and show it with [SHOW_HUD_PART](../operations/show-hud-part.md), and keep `balance` on `PAIR`. Shared row keys are on the [layout](../layout.md) page.

| Key | What to write |
| --- | --- |
| `font` | Short name from [appearance](../appearance.md). |
| `text` | A transcript key such as `hud_stunned_text`, or a literal. Used when `flag` is omitted. |
| `flag` | Copy key, such as `move_1`. The line reads that key, lowercases it, cuts it to `maxchars`, and pads with `Z`. An empty key draws pads. |
| `maxchars` | Width of the line. |
| `pad` | Fill character. `Z` keeps the width. |
| `counter` | Left-side twin. `Z` matches the pad. |
| `color` | Optional. Quote a value that contains `#`. |

```yaml
hudpart_stunned_text:
    type: data
    debug: false
    data:
        kind: TEXT
        font: hotbar_alphabet
        text: hud_stunned_text
        maxchars: 8
        pad: Z
        counter: Z
        priority: 10
```

Put the words in the transcript under that key, in lowercase:

```yaml
hud_stunned_text: stunned
```

A line that changes during play sets `flag` instead of `text`. The value lives on the player's copy map, next to the HUD runtime data, so changing the base layout does not wipe it. Write that key with `set_player_hud_copy`. That task marks the HUD dirty. An empty or missing key draws pads. `text` still works when `flag` is left off.

```yaml
hudpart_move_1:
    type: data
    debug: false
    data:
        kind: TEXT
        font: casting_1
        flag: move_1
        maxchars: 13
        pad: Z
        counter: Z
```

## Tips

- Store fixed player-facing words as a transcript key. A literal still works for a string you will not translate.
- Use `flag` for a line another system writes, such as a move name. Omit `flag` to keep `text`.
- Keep custom-font words lowercase.
- This part is usually an extra. Leave it out of the base row and show it with [SHOW_HUD_PART](../operations/show-hud-part.md). Keep `balance` on `PAIR`.
