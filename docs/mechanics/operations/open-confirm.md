---
sidebar_position: 13
---

# OPEN_CONFIRM

`OPEN_CONFIRM` opens the decision chest: accept on slot 21, deny on slot 25. Esc clears the payload and does not run `yes`. The answer is a slot click. Player chat is not this input. `yes` and `no` are mechanic maps. `previous_menu` is the return button.

Task: `operation_open_confirm`. Opens a DECISION kind chest (yes slot 21, no slot 25). Esc clears the payload and does not run `yes`. Never chat.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_CONFIRM` |
| `menu` | no | Default `menu_kind_decision` |
| `yes` | no | Mechanic map for Accept |
| `no` | no | Mechanic map for Deny |
| `previous_menu` | no | Return button and payload |
| `accept_lore` | no | Lore list written onto slot 21 |
| `target` | no | Who. Default SELF. Overlay `ENTITY` |
