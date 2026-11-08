---
sidebar_position: 3
---

# PLAY_SOUND

`PLAY_SOUND` plays a Bukkit sound to each resolved player, or at each resolved location. `sound` is the Bukkit name. `volume` and `pitch` can be a number or a `stat_*`. The `custom` field is on the board and is not read. Who hears it is a targeting choice, documented on [targeting](../targeting.md).

Task: `operation_play_sound`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `PLAY_SOUND` |
| `sound` | yes | Bukkit sound name |
| `target` | no | Who. See [targeting.md](../targeting.md) |
| `origin` | no | AOE search center. Default CASTER |
| `target_type` | no | Default LOCATION |
| `range` | no | LOOK / CURSOR ray, or AOE radius around origin |
| `origin_range` | no | LOOK / CURSOR ray when those are origin |
| `offset` | no | Locations |
| `volume` | no | Number or `stat_*` |
| `pitch` | no | Number or `stat_*` |
| `custom` | | Board field. Not read |

Plays to each resolved entity, or at each resolved location.
