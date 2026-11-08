---
sidebar_position: 1
---

# Commands

Every Backend `type: command` script lives in its own file. Related commands for one system share a file. Engine tasks stay in the system file. A task moves with the command only when that command is the only caller.

Player chat lines come from the transcript. These pages describe what the command does.

## Player

| Command | Use | Page |
| --- | --- | --- |
| `/balance` | Wallet and coin counts for currencies you hold | [balance](balance.md) |
| `/withdraw` | Turn wallet currency into a coin item | [withdraw](withdraw.md) |
| `/redeem` | Turn a coin item back into wallet currency | [withdraw](withdraw.md) |
| `/pay` | Send wallet currency to another player when the pack allows it | [pay](pay.md) |
| `/stats` | Effective stat levels, consumable bars, and regen | [stats](stats.md) |
| `/language` | Cycle transcript language and restamp items | [language](language.md) |
| `/packtitle` | Open the title equip menu | [packtitle](packtitle.md) |
| `/packwiki` | Open the in-game wiki | [packwiki](packwiki.md) |
| `/packseasonpass` | Open the season track. Staff can edit XP and the track | [packseasonpass](packseasonpass.md) |
| `/packquest status` | Read your quest progress. Other actions are staff | [packquest](packquest.md) |
| `/packwaypoint go` | Travel to a waypoint. Other actions are staff | [packwaypoint](packwaypoint.md) |
| `/hidecosmetics` | Hide your cosmetic displays on your own client | [cosmetics](cosmetics.md) |

## Staff

Ops, or the console when the page says console works. A linked player who is not op is ignored.

| Command | Use | Page |
| --- | --- | --- |
| `/packchat` | Preview the assembled chat line. Any player can run this one | [packchat](packchat.md) |
| `/packitem` | Give a pack Item Config | [packitem](packitem.md) |
| `/packarea` | Place, edit, and list world areas. Needs a player | [packarea](packarea.md) |
| `/packentity` | Spawn, list, and clear indexed combat mobs | [packentity](packentity.md) |
| `/packmount` | Summon, put away, or list mount rows | [packmount](packmount.md) |
| `/packreset` | List or force daily reset rows | [packreset](packreset.md) |
| `/staticloot` | Bind a loot table to the container you look at | [staticloot](staticloot.md) |
| `/packhologram` | Place, list, or remove persistent holograms. Needs a player | [packhologram](packhologram.md) |
| `/packgps` | List or clear GPS arrows, or point one at a waypoint | [packgps](packgps.md) |
| `/packhud` | List online players and the HUD layout each one is drawing | [packhud](packhud.md) |
| `/packprojectile` | List or clear tracked shots | [packprojectile](packprojectile.md) |
| `/packspray` | List or clear spray frames | [packspray](packspray.md) |
| `/packcosmetic` | List or clear tracked cosmetic displays | [cosmetics](cosmetics.md) |
| `/packposter` | Place and refresh poster frames | [packposter](packposter.md) |
| `/packtrade` | List or clear live trade sessions | [packtrade](packtrade.md) |
| `/packvault` | List or clear shared vault notes | [packvault](packvault.md) |
| `/packreceipt` | Open Mongo receipt rows, or insert a test row | [packreceipt](packreceipt.md) |
| `/packmongo` | Ping the engine Mongo connection | [packmongo](packmongo.md) |
| `/packapi` | Ping the engine API health route | [packapi](packapi.md) |
