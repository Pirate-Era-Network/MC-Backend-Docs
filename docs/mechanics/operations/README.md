---
sidebar_position: 1
slug: /mechanics/operations
---

# Effect operations

An operation is one numbered entry in a mechanic `operations:` map. It runs beside the other numbers, in order. A skill, an item skill, a triggerable, or `RUN_MECHANIC` is what starts that map. An unknown `type` is ignored. An operation does not invent targeting. It asks `resolve_mechanic_operation_targets` for who or where, then does its own job.

Anything these ops spawn uses one entity rule, and a counted `repeat` instead of `- while`. That rule is [Display and pulse](display.md).

## Sound and particles

- [PLAY_SOUND](play-sound.md)
- [PLAY_EFFECT](play-effect.md)

## Stats

- [MODIFY_STAT](modify-stat.md) writes consumable current. `ADD_PERCENT` is a fraction.
- [MODIFY_STAT_LEVEL](modify-stat-level.md)
- [OVERLAY_STAT_LEVEL](overlay-stat-level.md)
- [CLEAR_STAT_OVERLAY](clear-stat-overlay.md)
- [SET_STAT](set-stat.md)
- [TOGGLE_STAT](toggle-stat.md)

## Menus

- [OPEN_MENU](open-menu.md)
- [CLOSE_MENU](close-menu.md)
- [OPEN_CONFIRM](open-confirm.md)
- [OPEN_DIALOGUE](open-dialogue.md)
- [OPEN_TYPING](open-typing.md)
- [OPEN_STORAGE](open-storage.md)
- [OPEN_TRADE](open-trade.md)

## Loaders

- [RUN_SKILLMOVE](run-skillmove.md)
- [RUN_ITEMSKILL](run-itemskill.md)
- [RUN_MECHANIC](run-mechanic.md)
- [inherit](inherit.md) is a script key, not an operation.

## Other single ops

- [CAST_VANILLA_EFFECT](cast-vanilla-effect.md)
- [BAN_CATEGORY](ban-category.md)
- [NARRATE](narrate.md)
- [GIVE_ITEM](give-item.md)
- [ITEM_COOLDOWN](item-cooldown.md)
- [SWING](swing.md)
- [DEAL_DAMAGE](deal-damage.md)
- [APPLY_TRANSACTION](apply-transaction.md) keeps going after a failed pay. The purchase belongs in `onsuccess`.
- [GRANT_LOOT](grant-loot.md)
- [OPEN_LOOT_CRATE](open-loot-crate.md)
- [TELEPORT](teleport.md)
- [TRAVEL_TO_WAYPOINT](travel-to-waypoint.md)
- [APPLY_VELOCITY](apply-velocity.md)
- [PROJECTILE](projectile.md)
- [DASH](dash.md)
- [SPAWN_NOTABLE](spawn-notable.md)
- [SPAWN_HOLOGRAM](spawn-hologram.md)
- [PLACE_SPRAY and OPEN_SPRAY_MENU](spray.md)

## Families

- [Quest operations](quests.md)
- [START_GPS and STOP_GPS](gps.md)
- [Title operations](titles.md)
- [EQUIP_GEAR and CLEAR_GEAR](gear.md)
- [Cosmetic operations](cosmetics.md)
- [Season pass operations](season-pass.md)
- [Wiki operations](wiki.md)

## Linked, not rewritten here

- [World locks](world-locks.md) point at the control-effects page.
- [HUD operations](hud.md) point at the HUD pages.
- [Entities and mounts](entities.md) stay one table and point at the entity and mount pages.

## Not wired yet

ModifyEventValue, SpawnMinion, ShowHudElement, ShowTitle, OverwriteCastPress, ExecuteTask, and AI ops have no page. Add the page when the op lands.

## Engine

`handle_mechanic_operations` in `Mechanics/Core/mechanic_utils.dsc` switches on `operations.<n>.type`. A new op gets a file under `Mechanics/Individual_operations/` and a case there. Consumable current goes through `set_consumable_stat_value`. Persisted levels go through `set_stat`. Temporary levels go through `set_stat_level_overlay`.
