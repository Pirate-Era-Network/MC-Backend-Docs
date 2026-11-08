---
sidebar_position: 2
---

# DECISION

`DECISION` is the yes or no chest. Accept is slot 21. Deny is slot 25. Return is slot 9. [OPEN_CONFIRM](../../mechanics/operations/open-confirm.md) opens this kind. Esc clears the payload and does not run `yes`. The answer is the slot click.

The open stores the `yes` and `no` mechanic maps on `runtime_data.menu.kind.confirm_payload`. Close clears `runtime_data.menu.kind`, which drops that payload. Shared slot keys are on [Menus](../README.md).
