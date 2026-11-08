---
sidebar_position: 47
---

# World locks

`NO_WALK`, `NO_JUMP`, `NO_MELEE_DAMAGE`, `INVULNERABLE`, `NO_KNOCKBACK`, `HIDDEN`, and `UNTARGETABLE` are mechanic operations. Each one writes `flag_saves.world_locks` and then runs its Minecraft hook. They are not pack stats, and `SET_STAT` does not apply them. Omit `duration` and the lock stays until cleanse. The types, the flag, and the cleanse path are on [Control effects](../../control-effects.md).
