---
sidebar_position: 14
---

# /packhud

Staff readout of the HUD layout a player is drawing. Ops and the console can run it. A player who is not op is ignored.

## System

Each player stores one `hud_` layout id. The live copy is `runtime_data.hud.layout`. The saved copy is `data.hud.layout`. If both are empty, the first draw uses `registry_gamerules` `hud.default`. This command reads that same chain. It does not read offline players, because the live bar only exists while they are on the server.

| Piece | Where |
| --- | --- |
| Command | [HUD/hud_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/HUD/hud_command.dsc) |
| Menu shell | [Menus/menu_hud_list.dsc](https://github.com/Pirate-Era-Network/pirate-era-core-frontend/blob/main/Menus/menu_hud_list.dsc) |
| Layout | [HUD](../hud/README.md) |

## Use

```text
/packhud
/packhud <player>
```

| Action | What it does |
| --- | --- |
| no name | Opens `menu_hud_list`. One paper per online player. The lore line is their layout id. Console has no inventory, so it asks for a name. |
| `<player>` | Narrates that player's layout. Does not open the menu. A partial name uses the same match as the old admin commands. |

## What can go wrong

- The name matches someone who is not on the server. Chat says they have to be online.
- The name matches nobody. Chat says there is no player by that name.
- The flag is still empty because they have not drawn a bar yet. The line shows the gamerules default instead.
