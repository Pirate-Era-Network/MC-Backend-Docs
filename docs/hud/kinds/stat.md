---
sidebar_position: 3
---

# STAT

A stat part prints a number from a pack stat. `view` chooses the current value, the max, or both. `BOTH` is the default and prints `current/max`. `maxchars` is the width, and shorter numbers are padded out to that length so the rest of the bar does not slide when the number changes. `pad` fills the width. `counter` is the left-side twin that cancels it. `Z` is the transparent lock for both, and they stay the same letter. Quote `color` when the value contains `#`, because a bare `#` starts a YAML comment. Shared row keys are on the [layout](../layout.md) page.

| Key | What to write |
| --- | --- |
| `font` | Short name of the digit font, such as `hp_alphabet`. |
| `stat` | Pack `stat_` to read. |
| `view` | `CURRENT`, `MAX`, or `BOTH`. `BOTH` is the default and prints `current/max`. |
| `maxchars` | Width of the text. Shorter numbers are padded out to this length. |
| `pad` | Character used to fill that width. `Z` is the transparent lock. |
| `counter` | Left-side twin that cancels the width. `Z` matches the pad. |
| `color` | Color tag. Quote it. `#` starts a YAML comment when it is bare. |

```yaml
hudpart_hp_text:
    type: data
    debug: false
    data:
        kind: STAT
        font: hp_alphabet
        stat: stat_player_maximum_health
        view: BOTH
        maxchars: 11
        pad: Z
        counter: Z
        color: "<&color[#992929]>"
```

## Tips

- Quote `color` whenever the value contains `#`.
- Set `maxchars` to the longest number you will print, including the slash in `BOTH`.
- `pad` and `counter` stay the same letter so the width does not jump when the number changes.
