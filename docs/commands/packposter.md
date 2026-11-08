---
sidebar_position: 24
---

# /packposter

Places, refreshes, lists, and clears bounty poster frames. Op only. Place, remove, and list need a player.

## System

A poster is an invisible item frame with a filled map. The image is rendered by the engine API, saved under the map image folder, then painted with `peimagemap`. Map ids 1 to 10 stay on posters. The index restores missing frames on start and reload. It does not wipe them.

| Piece | Where |
| --- | --- |
| Command | [Posters/poster_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Posters/poster_command.dsc) |
| Frames and paint | [Posters/poster_engine.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Posters/poster_engine.dsc) |
| API | [commands/packapi](packapi.md) and [api](../api.md) |

## Use

```text
/packposter place <template> <player>
/packposter remove
/packposter refresh
/packposter list
/packposter clear
```

| Action | What it does |
| --- | --- |
| `place` | Look at a block. Template is the poster script. The third argument is the subject player whose name and stats fill the fields. |
| `remove` | Remove the frame you are looking at. |
| `refresh` | Repaint every indexed poster from the live subject values. |
| `list` | Open the poster PAGE. |
| `clear` | Remove every indexed poster. |

## What can go wrong

- Place while the API is down. The frame needs a png from the render route. `/packapi ping` checks the socket. A public `/health` page is not that test.
- Place without looking at a block.
- Map ids 1 to 10 used by a spray. Sprays start at 11 so they do not steal a poster map.
