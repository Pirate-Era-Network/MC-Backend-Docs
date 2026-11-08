---
sidebar_position: 5
---

# CURRENCY

A currency part prints a wallet amount. `currency` is the pack `currency_` script, such as `currency_belly`. Amounts at or above a cutoff use the short suffixes from [appearance](../appearance.md). `1000` prints as `1k`, then `m`, `b`, and `t` as the amount grows. The part does not list those cutoffs. A hidden currency line keeps `currency_pad` characters of `pad_char`, so the hole stays the same width. `counter: Z` cancels the belly text so the line does not shove the bar. Shared row keys are on the [layout](../layout.md) page.

| Key | What to write |
| --- | --- |
| `font` | Short name of the digit font, such as `hotbar_alphabet`. |
| `currency` | Pack `currency_` id, such as `currency_belly`. |
| `prefix` | Text before the amount. A transcript key or a literal. The alphabet font is lowercase. |
| `suffix` | Text after the amount. Same rules as `prefix`. |
| `pad` | Fill character when you also set a width. `Z` is the transparent lock. |
| `counter` | Left-side twin so the line does not shove the bar. `Z` matches the pad. |

```yaml
hudpart_belly:
    type: data
    debug: false
    data:
        kind: CURRENCY
        font: hotbar_alphabet
        currency: currency_belly
        prefix: hud_belly_prefix
        counter: Z
```

## Tips

- Short amounts (`1k`, `m`, `b`, `t`) come from [appearance](../appearance.md). `suffix` on the part is extra text after the number, not those cutoffs.
- `counter: Z` cancels the belly text. Leave `balance` on `PAIR`.
- `prefix` and `suffix` sit outside the number. The number is still padded to `currency_pad` with uppercase `Z`. That `Z` is invisible. Lowercasing it first draws a visible `z`.
- Write the prefix in lowercase. This alphabet has no visible capitals. `belly: ` is `belly<&co><&sp>` in the transcript.
- `currency` is the pack currency script, such as `currency_belly`.
