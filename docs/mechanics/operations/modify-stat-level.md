---
sidebar_position: 6
---

# MODIFY_STAT_LEVEL

`MODIFY_STAT_LEVEL` writes the saved level on `data.stats`. Use it for a menu, a reward, or an admin grant. It reads the persisted level, so a temporary overlay cannot change what gets saved, and it skips an entity that has no persisted level. This is progression. A combat skill that should spend stamina uses [MODIFY_STAT](modify-stat.md).

Task: `operation_modify_stat_level`. Smoke: `mechanic_example_modify_stat_level`.

Persisted level only (`set_stat` / `data.stats`). For menus, rewards, admin. Reads `get_target_persisted_stat_level` so a buff overlay cannot change the saved level. Skips entities that have no persisted level (`-1`).

Same keys as MODIFY_STAT except `stat` is any stat with a saved level. Default `stat_operation` is `ADD_FLAT`. Same targeting overlay (ENTITY).

Check `/stats` for `LvL` on that stat. This is progression. Do not put this on a combat skill.
