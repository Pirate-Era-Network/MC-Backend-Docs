---
sidebar_position: 22
---

# CAST_VANILLA_EFFECT

`CAST_VANILLA_EFFECT` applies a vanilla potion. `effect` is the potion type, such as `BLINDNESS`, `SLOW`, or `SPEED`. `amplifier` defaults to 0. Named blindness and slowness that a pack ships are Frontend templates that call this op.

Task: `operation_cast_vanilla_effect`. Vanilla potion. Named blindness/slowness are Frontend templates that call this.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `CAST_VANILLA_EFFECT` |
| `effect` | yes | Potion type (`BLINDNESS`, `SLOW`, `SPEED`) |
| `duration` | no | Potion duration |
| `amplifier` | no | Default 0 |
| `target` | no | Who. Overlay `ENTITY` |
