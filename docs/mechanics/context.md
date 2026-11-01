---
sidebar_position: 3
---

# Mechanic context

**Live.** Keys are `rules.dsc` `mechanic_context`. Build with `build_mechanic_context`. Read with `get_mechanic_*`. Do not hardcode field names.

| Slot | Meaning |
| --- | --- |
| `caster` | Who caused the mechanic. Falls back to linked player |
| `targets` | Always a list. Entity or list in, normalized |
| `event_values` | Map from the initiator (damage, item, …) |
| `placeholders` | Extra Location/Entity (or other) keys. A value may be a List of Locations (`notable_shell`) |
| `source_id` | Optional id |
| `source_type` | See `mechanic_source_types` |

Parent context: pass `parent_context` to merge maps (parent first, overlay wins) when chaining mechanics.

## source_type values today

`MANUAL` `SKILLMOVE` `ITEM_SKILL` `CONSUME` `EVENTSTAT` `AREA` `DAMAGE` `QUEST` `NPC` `ENTITY_SKILL` `PROJECTILE` `DASH` `NOTABLE` `MENU` `TRIGGERABLE` `DAILY_RESET`

Do not add chat-input types.

## event_values keys (common)

`damage` `value` `ability` `item` `count` `type` `slot` `click` `text` `hand`. Initiators may add more. Menu clicks set `slot`, `click`, and `item`. Typing confirm also sets `text`. Clicks set `hand` to `MAIN` or `OFFHAND`.

## What can go wrong

- Passing a single entity as targets and then assuming it is not a list. Getters always return a list.
- Reading `context.caster` instead of `get_mechanic_caster`.
