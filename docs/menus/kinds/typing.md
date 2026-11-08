---
sidebar_position: 4
---

# TYPING

`TYPING` is the in-chest keyboard. Confirm writes what was typed onto `event_values.text` and runs the confirm mechanic. Player chat is not this input. [OPEN_TYPING](../../mechanics/operations/open-typing.md) opens this kind. `previous_menu` opens after confirm. Omit it and the chest closes.

While the chest is open, the character list is `runtime_data.menu.kind.typing_text`, caps lock is `typing_caps`, and the history cursor is `typing_history_index`. Confirmed strings are kept on `runtime_data.menu.typing_history`, which sits beside `kind`, so close does not wipe them. Shared slot keys are on [Menus](../README.md).
