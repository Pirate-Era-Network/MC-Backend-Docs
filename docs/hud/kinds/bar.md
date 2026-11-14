---
sidebar_position: 2
---

# BAR

A bar reads a consumable stat and picks one letter from the empty-to-full alphabet. Current against max decides the letter. The hidden state is the empty letter. In this pack that letter is `j`, the first entry of `bar_alphabet` on [appearance](../appearance.md). That empty letter is the pad, so a bar does not add a second pad character. Point `stat` at a consumable. A stat whose current and max are the same number stays on the full letter. A bar can set its own `bar_alphabet` when that one bar uses different letters. Shared row keys are on the [layout](../layout.md) page.

| Key | What to write |
| --- | --- |
| `font` | Short name from [appearance](../appearance.md), such as `hp` or `stam`. |
| `stat` | Pack `stat_` whose current value is compared with its max. Used when `current_flag` and `max_flag` are omitted. |
| `current_flag` | Copy key for the current number. Set this with `max_flag` instead of `stat`. |
| `max_flag` | Copy key for the max number. A missing number draws the empty bar. |
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

`current_flag` and `max_flag` read two numbers from the same copy map as a [text](text.md) `flag`. The bar does not read `stat` on that path. A missing number, or a max that is not above zero, draws the empty letter. Write the keys with `set_player_hud_copy`. That task marks the HUD dirty.

```yaml
hudpart_party_hp:
    type: data
    debug: false
    data:
        kind: BAR
        font: party_hp
        current_flag: party_1_hp
        max_flag: party_1_hp_max
```

## Tips

- Leave `bar_alphabet` off unless this bar uses a different empty-to-full set. The shared list is on [appearance](../appearance.md).
- Use `stat` for a pack consumable. Use `current_flag` and `max_flag` together when the two numbers are written onto the copy map.
- A failed requirement in the middle of a row draws the empty letter. The slot stays, so the next offset holds.
- The empty letter is the pad. You do not add a second pad character for a bar.
