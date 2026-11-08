---
sidebar_position: 15
---

# OPEN_TYPING

`OPEN_TYPING` opens the in-chest keyboard. Confirm runs the `confirm` mechanic map and passes what was typed as `event_values.text`. Player chat is not this input. `previous_menu` opens after confirm. Omit it and the chest closes.

Task: `operation_open_typing`. In-chest keyboard. Confirm Mechanics get `event_values.text`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_TYPING` |
| `menu` | no | Default `menu_kind_typing` |
| `confirm` | no | Mechanic map. Receives `text` |
| `previous_menu` | no | Opened after confirm. Else the chest closes |
| `target` | no | Who. Overlay `ENTITY` |
