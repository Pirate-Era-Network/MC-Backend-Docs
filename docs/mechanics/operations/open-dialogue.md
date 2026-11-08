---
sidebar_position: 14
---

# OPEN_DIALOGUE

`OPEN_DIALOGUE` opens the chest used for NPC talk: a title glyph and paged lines. `dialogue` is a string or a list, wrapped to `characters_per_line`. `on_finish` is the mechanic map on the last-page close button. This is not a [NARRATE](narrate.md) loop.

Task: `operation_open_dialogue`. Chest NPC talk (title glyph plus paging). Not a narrate loop.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_DIALOGUE` |
| `menu` | no | Default `menu_kind_dialogue` |
| `npc` | no | Catalog key in `gui_appearance.npc` |
| `npc_name` | no | Name drawn in the NPC box |
| `dialogue` | no | String or list. Wrapped to `characters_per_line` |
| `on_finish` | no | Mechanic map on the last-page close button |
| `with_villager_sound` | no | Plays on page buttons |
| `target` | no | Who. Overlay `ENTITY` |
