---
sidebar_position: 4
---

# TEXT

A text part prints a transcript key or a literal string.

Shared row keys are on the [layout](../layout.md) page. Width keys (`maxchars`, `pad`, `counter`, `color`) work the same way as on a [stat](stat.md).

| Key | What to write |
| --- | --- |
| `font` | Short name from [appearance](../appearance.md). |
| `text` | A transcript key such as `hud_stunned_text`, or a literal. |
| `maxchars` | Width of the line. |
| `pad` | Fill character. `Z` keeps the width. |
| `counter` | Left-side twin. `Z` matches the pad. |
| `color` | Optional. Quote a value that contains `#`. |

Custom-font copy stays lowercase. The font has no capital glyphs for words.

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

## Tips

- Store player-facing words as a transcript key. A literal still works for a string you will not translate.
- Keep custom-font words lowercase.
- This part is usually an extra. Leave it out of the base row and show it with [SHOW_HUD_PART](../operations/show-hud-part.md). Keep `balance` on `PAIR`.
