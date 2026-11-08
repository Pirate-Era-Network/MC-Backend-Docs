---
sidebar_position: 1
slug: /hud
---

# HUD

The bar above the hotbar is one string, built from three Frontend scripts that do different jobs. The layout is the row stored on the player: which parts sit in it, and how far each one sits from the hotbar letter that pins the bar in the center. A part is one of those pieces, and its kind decides the letter, number, or icon it draws. Appearance is not a row. It is the pack-wide nickname list, so a part can write `font: hp` instead of the long font id, and so every bar shares the same empty-to-full letters and belly suffixes. The engine keeps a single layout id. [SET_HUD_LAYOUT](operations/set-hud-layout.md) replaces that id, the previous row stops drawing, and any other `hud_` script stays unused until something selects it. A temporary icon uses [SHOW_HUD_PART](operations/show-hud-part.md) from the same mechanic that plays a sound. The part script then only decides what a failed requirement does: keep a blank of the same width, or leave the piece out.

```mermaid
flowchart LR
  skill[SkillMove or triggerable] --> mechanic[Mechanic operations map]
  mechanic --> hudOps[SHOW HIDE CLEAR SET_LAYOUT]
  mechanic --> otherOps[PLAY_SOUND SET_STAT and the rest]
  part[hudpart operations] --> presence[SHOW or HIDE only]
```

## Write these

- [Layout](layout.md) for the `hud_` row and the keys every part shares
- [Appearance](appearance.md) for short font names, the bar letters, and the belly suffixes

## Kinds

- [Glyph](kinds/glyph.md)
- [Bar](kinds/bar.md)
- [Stat](kinds/stat.md)
- [Text](kinds/text.md)
- [Currency](kinds/currency.md)
- [Boolean](kinds/boolean.md)
- [Effect strip](kinds/effect-strip.md)

## Operations

- [SHOW_HUD_PART](operations/show-hud-part.md)
- [HIDE_HUD_PART](operations/hide-hud-part.md)
- [CLEAR_HUD_PARTS](operations/clear-hud-parts.md)
- [SET_HUD_LAYOUT](operations/set-hud-layout.md)

Shake and bleed are `PLAY_EFFECT` with `SCREEN_SHAKE` and `BLOODY_SCREEN`. A full-screen frame, such as a blind or a freeze, is a [glyph](kinds/glyph.md) plus [requirements](../mechanics/requirements.md) and [SHOW_HUD_PART](operations/show-hud-part.md).

## Tips

- Name a layout `hud_` and a part `hudpart_`. Reload lists scripts by that prefix.
- Write `parts:` and `operations:` as numbered maps (`1:`, `2:`).
- Keep every middle slot in the row. When that part is off, draw its pad. Omitting a middle slot slides every later offset. Use a `SHOW_HUD_PART` omit on the last slot, or on an extra that is not in the base row.
