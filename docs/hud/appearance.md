---
sidebar_position: 3
---

# Appearance

Write `hud_appearance` once for the pack. It is the nickname list parts use, so a new font, a new empty-bar letter, or a new belly cutoff (`1k`, then `m`, `b`, and `t`) is one edit here. A part then writes `font: hp` instead of a long id such as `pehud_scaled_fontpack:pehud_hp`. The id contains a colon. YAML treats a bare colon as a nested key, so every `namespace:file` value has to be quoted or the part never receives the font.

```yaml
hud_appearance:
    type: data
    debug: false
    data:
        space_font: "space:default"
        fonts:
            hotbar: "pehud_fontpack:pehud"
            hp: "pehud_scaled_fontpack:pehud_hp"
            hp_alphabet: "pehud_scaled_fontpack:pehud_hp_alphabet"
        bar_alphabet:
            - j
            - i
            - h
            - g
            - f
            - e
            - d
            - c
            - b
            - a
        pad_char: Z
        currency_pad: 6
        currency_dividers:
            1:
                amount: 1000000000000
                suffix: t
            2:
                amount: 1000000000
                suffix: b
            3:
                amount: 1000000
                suffix: m
            4:
                amount: 1000
                suffix: k
```

| Key | What it is |
| --- | --- |
| `fonts` | Short name to a pack font id. A part writes `font: hp`, and `hp` is the short name. |
| `space_font` | Font used for offsets. This pack uses `space:default`. Quote it. |
| `bar_alphabet` | Empty-to-full letters for a [bar](kinds/bar.md). In this pack `j` is empty and `a` is full. |
| `pad_char` | Width lock. `Z` is a transparent letter of the same width, so a number can change without the bar sliding. |
| `currency_pad` | How many pad letters a hidden [currency](kinds/currency.md) line keeps. |
| `currency_dividers` | Belly shorthand. `1000` becomes `1k`, then `m`, `b`, and `t` as the amount grows. List the largest amount first. |
| `char_advances` | Pixel width of one letter in that font, in the same units as `space.N`. The layout cursor uses this so one slot's offset does not drag the next slot. |
| `glyph_advances` | Per-letter width when letters in one font are different sizes, such as the hotbar icon and the dash icon. |

A [bar](kinds/bar.md) can set its own `bar_alphabet` when that one bar uses different letters. Every other part uses the list here.

## Tips

- Quote every `namespace:file` value, including `space_font`.
- Pick letters that already exist in that font file. A new letter needs a pack glyph first.
- Keep `bar_alphabet` in empty-to-full order. The first letter is the hidden bar.
- `pad_char: Z` matches the transparent counter in this pack. A visible pad letter shows up in the bar.
