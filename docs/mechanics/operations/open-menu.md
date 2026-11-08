---
sidebar_position: 11
---

# OPEN_MENU

`OPEN_MENU` opens a `menu_*` script as a virtual chest. Slot clicks run that slot's mechanics. Only players receive a chest, so the op forces entity targeting. Item storage and player trade are different ops ([OPEN_STORAGE](open-storage.md), [OPEN_TRADE](open-trade.md)). The chest shape, title stack, and kinds are on [menus](../../menus/README.md).

Task: `operation_open_menu`. Smoke: `mechanic_example_open_menu` and `menu_example_hub` in Frontend.

Opens a `menu_*` data script as a virtual chest. Slot clicks run that slot's `mechanics` through `run_mechanic_config`. Full config: [menus.md](../../menus/README.md).

This op always overlays `target_type` to `ENTITY`. Only players get a chest.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_MENU` |
| `menu` | yes | Menu script name (`menu_example_hub` or `example_hub`) |
| `target` | no | Who. Default SELF. See [targeting.md](../targeting.md) |
