---
sidebar_position: 3
---

# DIALOGUE

`DIALOGUE` is the NPC talk chest. The title carries the NPC glyph and the wrapped lines. Next, previous, and close are kind buttons. [OPEN_DIALOGUE](../../mechanics/operations/open-dialogue.md) opens this kind. `dialogue` is a string or a list, wrapped to `characters_per_line`. `on_finish` is the mechanic map on the last-page close button.

The current page index is `runtime_data.menu.kind.dialogue_page`. This is not a narrate loop. Shared slot keys are on [Menus](../README.md).
