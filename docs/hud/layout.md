---
sidebar_position: 2
---

# Layout

Write a `hud_` script when a whole row should be reusable, such as the combat bar or a shorter bar for a cutscene. The script is `type: data`. The row lives under `data.parts` as `1:`, `2:`, in draw order. Minecraft centers the whole string. The hotbar letter is the pin. Each later slot's `offset` is that part's own left edge, in space pixels from the pin. Moving one slot does not move the slots after it. The player stores one base layout id. [SET_HUD_LAYOUT](operations/set-hud-layout.md) replaces that id, and the previous base row stops drawing. [ADD_HUD_LAYOUT](operations/add-hud-layout.md) stacks another `hud_` row on the same bar for this session. [REMOVE_HUD_LAYOUT](operations/remove-hud-layout.md) drops that row. Quit drops the stack. Join does not bring it back. A temporary icon on the same bar is [SHOW_HUD_PART](operations/show-hud-part.md), which draws an extra piece on that stored row.

The hotbar letter is the pin, then a health bar sits beside it.

```yaml
hud_combat:
    type: data
    debug: false
    data:
        parts:
            1:
                part: hudpart_hotbar
                offset: 0
                balance: RAW
            2:
                part: hudpart_hp_bar
                offset: -280
```

`hudpart_hotbar` is a [glyph](kinds/glyph.md). `hudpart_hp_bar` is a [bar](kinds/bar.md). The kind pages list only the keys that kind draws. The keys below are shared.

## Shared keys

| Key | Where | What to write |
| --- | --- | --- |
| `part` | Row | `hudpart_` script name. The prefix on the value is optional. |
| `offset` | Row or part | Left edge of this slot, in space pixels from the pin. `0` sits on the pin. The row wins when both set it. Other slots keep their own offsets. On a [group](kinds/group.md) child, the offset is from the group pin, and the layout row moves the whole group. |
| `balance` | Row or part | `PAIR` is the default. It draws a matching blank on the left so the pin does not drift. `RAW` means this slot is the pin, and only the first hotbar letter in the base layout uses it. On a session extra, `RAW` is drawn as `PAIR`. The row wins when both set it. |
| `enabled` | Row | `false` still draws the off-state for that slot. To force the pad, use [HIDE_HUD_PART](operations/hide-hud-part.md). |
| `requirements` | Row or part | Numbered map, same shape as a mechanic. The row wins when both set it. Types are on [requirements](../mechanics/requirements.md). |
| `priority` | Part | Draw order for an extra shown on top of the base row. Higher paints later. Default `0`. |

A requirement on the part:

```yaml
requirements:
    1:
        type: BOOLEAN
        stat: stat_haki_unlocked
        mode: HAS
```

With no presence op, a failed requirement draws the pad and the slot stays. That is the right choice in the middle of a row. [SHOW_HUD_PART](operations/show-hud-part.md) on the part omits it when the requirement fails. [HIDE_HUD_PART](operations/hide-hud-part.md) on the part draws the pad when the requirement passes.

## Session stack

The saved id is still one base layout. [ADD_HUD_LAYOUT](operations/add-hud-layout.md) appends another `hud_` row for this session. [REMOVE_HUD_LAYOUT](operations/remove-hud-layout.md) drops that row. Quit drops rows that do not set `persist: true`. Join keeps a persist row when its `requirements` still pass, and removes it when they fail. The same check runs while the player is online, so the frame leaves as soon as the requirement fails. Put it back with `ADD_HUD_LAYOUT`. [SET_HUD_LAYOUT](operations/set-hud-layout.md) still replaces only the base id, and it does not clear the stack.

```yaml
hud_party:
    type: data
    debug: false
    data:
        persist: true
        requirements:
            1:
                type: BOOLEAN
                stat: stat_in_party
                mode: HAS
        parts:
            1:
                part: hudpart_party_frame
```

`persist` belongs on the layout, not on the add operation. Omit it, or set `false`, and quit clears that extra. `requirements` uses the same map as a part. Leave that block off and only `REMOVE_HUD_LAYOUT` drops the row, plus quit when `persist` is off. Prefer `BOOLEAN` or `FLAG` so the check is a flag read.

The composer walks the base row, then each extra, into the same left and right stacks. Each layout starts its cursor at the center pin. An offset of `450` on an extra is `450` from the center, not from the end of the base row. Finished actionbar strings are not glued together.

Extra layouts stay `PAIR`. `RAW` is only the hotbar letter in the base layout. A second add of the same layout does nothing. Remove of a layout that is not in the stack does nothing.

## Tips

- The first hotbar letter is `balance: RAW`. `PAIR` on that letter adds a left counter and shifts the whole bar.
- A session extra measures each offset from the center pin again. Keep that row on `PAIR`.
- A tier-2 extra stays `PAIR`. An extra is a part that is not in this `parts` row. A skill shows it with `SHOW_HUD_PART`. `RAW` on that extra has no left counter, so the base bar slides.
- `SHOW` omit belongs on the last slot, or on an extra that is not in the base row. A middle slot that fails its requirement still draws its pad.
- Reload rebuilds the layout cache and marks each online player dirty. The next draw uses the new offsets. Temporary show and hide parts stay.
