---
sidebar_position: 2
---

# BAR

A bar reads a consumable stat and picks one letter from the empty-to-full alphabet. Current against max decides the letter. The hidden state is the empty letter. In this pack that letter is `j`, the first entry of `bar_alphabet` on [appearance](../appearance.md). That empty letter is the pad, so a bar does not add a second pad character. Point `stat` at a consumable. A stat whose current and max are the same number stays on the full letter. A bar can set its own `bar_alphabet` when that one bar uses different letters. Shared row keys are on the [layout](../layout.md) page.

| Key | What to write |
| --- | --- |
| `font` | Short name from [appearance](../appearance.md), such as `hp` or `stam`. |
| `stat` | Pack `stat_` whose current value is compared with its max. |
| `bar_alphabet` | Optional. A list of letters for this bar only. Omit it to use the appearance list. |

```yaml
hudpart_hp_bar:
    type: data
    debug: false
    data:
        kind: BAR
        font: hp
        stat: stat_player_maximum_health
```

## Tips

- Leave `bar_alphabet` off unless this bar uses a different empty-to-full set. The shared list is on [appearance](../appearance.md).
- A failed requirement in the middle of a row draws the empty letter. The slot stays, so the next offset holds.
- The empty letter is the pad. You do not add a second pad character for a bar.
