---
sidebar_position: 6
---

# World static loot

World static loot binds a table to a trapped chest or a barrel. It fills that container. It does not play the [crate](loot-crate.md) animation. Bind stores the parent location flag `static_loot` (`table`, `cooldown`, `mode`). `/staticloot unbind` wipes the parent, including every player snapshot.

`/staticloot list` opens `menu_static_loot_list` (PAGE). Backend overlays `itemlist` from `server.flag[static_loot_index]`. Each row is world, xyz, table, mode, cooldown, and who opened this cycle. Click closes the menu and teleports to that block. Chests bound before the index existed need a rebind to show up. Command page: [staticloot](../commands/staticloot.md).

| Mode | Bind | Open |
| --- | --- | --- |
| `SHARED` | `/staticloot bind loottable_example 5m` or `... 5m shared` | Fills the block inventory. Location `cooleddown` for everyone. Vanilla chest opens. Same leftover for whoever opens next |
| `PLAYER` | `/staticloot bind loottable_example 5m player` | Cancels vanilla. Opens a virtual chest. Roll is per player uuid on that location. Another player gets their own roll |

`PLAYER` snapshot: `static_loot.players.<uuid>.contents` (slot map) and `static_loot.players.<uuid>.cooleddown` with `expire:`. Contents do not expire with the timer. Reopen during the cooldown shows leftovers (close writes the virtual slots back). When that player's cooldown ends, the next open re-rolls and overwrites contents.

`ITEM` results go in the container (shared) or the virtual chest (player). `CURRENCY`, `TEXT`, and `COMMAND` are skipped here. Table `rolls` replace legacy `fillstaticloot` with a random 3-6 extra picks.

Right clicking a `SHARED` chest that is still on cooldown opens the container and does not refill until location `cooleddown` expires. `PLAYER` mode never fills the real chest. Leftovers live on the location's player snapshot. Extra items put into the virtual chest are saved on that snapshot when it closes. The next roll after the cooldown wipes that map.

```text
/staticloot bind loottable_example 5m
/staticloot bind loottable_example 5m player
/staticloot unbind
/staticloot list
```
