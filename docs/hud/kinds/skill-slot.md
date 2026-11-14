---
sidebar_position: 9
---

# SKILL_SLOT

A skill slot line reads one row of `global_build_config` `skill_slots`. The number is the row, not a stat name. No row, or a row with no `skillmove_` saved, draws the locked word. A saved move draws its `display_name`. While `flag_saves.cooldowns` holds that skillmove id, the line is the cooldown word plus the seconds left.

The words are transcript keys on `hud_skill_slot_texts` in `rules.dsc`. The casting font is lowercase, so those transcript values stay lowercase. Shared row keys are on the [layout](../layout.md) page.

| Key | What to write |
| --- | --- |
| `skill_slot` | `skill_slots` row number. `1` is the first slot. |
| `font` | Short name from [appearance](../appearance.md), such as `casting_1`. |
| `maxchars` | Width of the line. Shorter text is padded. |
| `pad` | Pad letter. `Z` is the usual invisible pad. |
| `counter` | Left-side twin. `Z` holds the width. |

```yaml
hudpart_casting_move_1:
    type: data
    debug: false
    data:
        kind: SKILL_SLOT
        font: casting_1
        skill_slot: 1
        maxchars: 13
        pad: Z
        counter: Z
```

## Tips

- A slot past the end of `skill_slots` stays on the locked word.
- The cooldown id is the `skillmove_` script name. A triggerable cooldown uses that triggerable's script name, so it does not replace this line unless the cast stamps the skillmove id.
- Seconds refresh while that cooldown flag is up, the same way an effect countdown does.
