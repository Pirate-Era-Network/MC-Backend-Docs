---
sidebar_position: 2
---

# BAR

A bar turns a consumable stat into one letter from the empty-to-full alphabet. Current and max come from that stat. The letter is the fill.

Shared row keys are on the [layout](../layout.md) page.

| Key | What to write |
| --- | --- |
| `font` | Short name from [appearance](../appearance.md), such as `hp` or `stam`. |
| `stat` | Pack `stat_` whose current value is compared with its max. |
| `bar_alphabet` | Optional. A list of letters for this bar only. Omit it to use the appearance list. |

The hidden state is the empty letter. In this pack that letter is `j`, the first entry of `bar_alphabet`.

```yaml
hudpart_hp_bar:
    type: data
    debug: false
    data:
        kind: BAR
        font: hp
        stat: stat_player_maximum_health
```

Point `stat` at a consumable. A stat whose current and max are the same number stays on the full letter.

## Tips

- Leave `bar_alphabet` off unless this bar uses a different empty-to-full set. The shared list is on [appearance](../appearance.md).
- A failed requirement in the middle of a row draws the empty letter. The slot stays, so the next offset holds.
- The empty letter is the pad. You do not add a second pad character for a bar.
