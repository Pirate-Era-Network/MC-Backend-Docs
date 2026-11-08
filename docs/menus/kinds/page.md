---
sidebar_position: 5
---

# PAGE

`PAGE` fills 54 items per page from `itemlist`. `open_menu_for_target` can pass `config_overlay` to replace that list. Static loot, holograms, the season pass track, spray equip, the spray admin list, and player wiki categories all open this way. The current page and the list in use are `runtime_data.menu.kind.page_index` and `page_items`. A new menu id on each open recopies `itemlist`.

`itemlist` is a numbered map, same as `slots`. Shared slot keys are on [Menus](../README.md).
