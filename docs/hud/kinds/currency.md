---
sidebar_position: 5
---

# CURRENCY

A currency part prints a wallet amount. `currency` is the pack `currency_` script, such as `currency_belly`. Amounts at or above a cutoff use the short suffixes from [appearance](../appearance.md). `1000` prints as `1k`, then `m`, `b`, and `t` as the amount grows. The part does not list those cutoffs. A hidden currency line keeps `currency_pad` characters of `pad_char`, so the hole stays the same width. `counter: Z` cancels the belly text so the line does not shove the bar. Shared row keys are on the [layout](../layout.md) page.

| Key | What to write |
| --- | --- |
| `font` | Short name of the digit font, such as `hotbar_alphabet`. |
| `currency` | Pack `currency_` id, such as `currency_belly`. |
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
        counter: Z
```

## Tips

- Change the suffixes in [appearance](../appearance.md). The part only names the currency.
- `counter: Z` cancels the belly text. Leave `balance` on `PAIR`.
- `currency` is the pack currency script, such as `currency_belly`.
