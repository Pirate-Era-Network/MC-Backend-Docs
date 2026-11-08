---
sidebar_position: 27
---

# SWING

`SWING` plays the arm swing animation. `hand: MAIN` is `ARM_SWING`. `hand: OFFHAND` is `ARM_SWING_OFFHAND`. Non-players are skipped. The animation is not a second weapon engine. An offhand punch is still a Frontend triggerable that calls this op.

Task: `operation_swing`. Player `animate` ARM_SWING / ARM_SWING_OFFHAND. Not dual-wield logic.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `SWING` |
| `hand` | no | `MAIN` (default) or `OFFHAND` |
| `target` | no | Who. Overlay `ENTITY`. Non-players are skipped |

Smoke: `self_swing_main` / `self_swing_offhand`. Offhand weapon: `triggerable_item_use_offhand`.
