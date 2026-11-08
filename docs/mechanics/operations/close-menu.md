---
sidebar_position: 12
---

# CLOSE_MENU

`CLOSE_MENU` closes the engine chest for each resolved player. The close dispatcher then runs that menu's `on_close`. It uses the same entity targeting as [OPEN_MENU](open-menu.md), and only a player has a chest to close.

Task: `operation_close_menu`. Closes the engine chest for each resolved player. `on_close` runs from the close dispatcher.

Same targeting overlay as OPEN_MENU (`ENTITY`).

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `CLOSE_MENU` |
| `target` | no | Who. Default SELF |
