---
sidebar_position: 26
---

# ITEM_COOLDOWN

`ITEM_COOLDOWN` plays the vanilla gray sweep on a material. The sweep is keyed by material, so two scripts that share a material share the overlay. It does not write the triggerable cooldown flag. That flag is the skill gate. Omit `duration` and the op does nothing. There is no default of one second. Prefer `target: SELF` on the player who clicked, because the cooldown command uses the queue's linked player.

Task: `operation_item_cooldown`. Vanilla gray sweep (`itemcooldown`). Per **material**, not per `item_script`. Does not write the triggerable cooldown flag. Omit `duration` is a no-op (no magic 1s).

`itemcooldown` uses the queue linked player. Prefer `target: SELF` on the clicker.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `ITEM_COOLDOWN` |
| `duration` | yes | Sweep length. Flat `1s`, or a `NUMBER` / `VALUE` stat (seconds) |
| `material` | no | Bukkit material. Omit to use the target's item in `hand` |
| `hand` | no | `MAIN` (default) or `OFFHAND` when reading the item for material |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `self_item_cooldown`. Weapon path: `triggerable_item_use_shift`.
