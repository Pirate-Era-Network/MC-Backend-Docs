---
sidebar_position: 2
---

# Eventstats

An Eventstat is a normal `stat_` plus `stat_event_config`. List it on the living entity `stats:` so join inits a level. Level `<= 0` does not fire. The mechanics live in `stat_event_config`, not in `stat_config`.

Player triggerables and the snapshot that runs them are on [Triggerables](README.md). This page is the stat that listens.

```yaml
stat_event_sprint_start:
    type: data
    data:
        stat_config:
            ondeath: keep
        value_config:
            basevalue: 1
            maxvalue: 1
            level_cap: levelcap_fixed
            equation_config:
                type: linear
        stat_event_config:
            chance: 1
            trigger_mode: ALL
            target: SELF
            events:
                1:
                    type: ON_SPRINT_START
            mechanics:
                1:
                    operations:
                        1:
                            type: PLAY_SOUND
                            target: SELF
                            target_type: ENTITY
                            sound: BLOCK_NOTE_BLOCK_HAT
```

| Key | Status | Notes |
| --- | --- | --- |
| `chance` | Live | `0` to `1`, or `0` to `100` if greater than `1` |
| `trigger_mode` | Live | `ALL` fires every matching event row. `ONE` uses the first match |
| `target` | Live | `SELF` (host), `VICTIM` (dispatcher target list), `AOE` (living around the host) |
| `range` | Live | AOE radius. Default `triggerable_default_aoe_range` |
| `events` | Live | Rows with `type` and the same filters as triggerables |
| `mechanics` | Live | Keyed mechanic configs |
| `requirements` | Live | Mechanic requirement maps. Checked on the host as caster |
| Item-hosted eventstats | Contract | Board allows items. This slice is living-entity stats only |

Examples: `pirate-era-core-frontend/Stats/event_stat_examples.dsc`.

## Events

| Event | Wired from |
| --- | --- |
| `ON_DAMAGE_DEALT` / `ON_DAMAGE_TAKEN` / `ON_HIT_ENEMY` | `core_custom_damage_event` after routing (value `> 0`) |
| `ON_CRIT` | Same packet when `deal_damage` passes `crit: true`. No crit math yet |
| `ON_ABILITY_USED` | Contract. Fire from a SkillMove consumer later |
| `ON_ABILITY_DAMAGE` | `deal_damage` optional `ability:` |
| `ON_KILL` | `after entity death`. Cancelled vanilla hits use `damage_last_attacker_flag` because the death has no damager |
| `ON_CONSUME` | player consumes item. Item Config `consume:` runs first. A failed gate cancels the eat |
| `ON_BLOCK_PLACE` / `ON_BLOCK_BREAK` | place / break. Material goes in event_values `type` |
| `ON_SPRINT_START` / `ON_SPRINT_STOP` | Existing sprint handlers, plus movement speed |
| `ON_LEFT_CLICK` / `ON_RIGHT_CLICK` / `ON_SHIFT_*` | Clicks block or air, and right-click entity. Shift also fires the unshifted event. `event_values.hand` is `MAIN` or `OFFHAND` |
| `ON_EQUIP` | `after player equips armor` (Paper) |

Season pass XP uses `ON_KILL` from Frontend (`triggerable_seasonpass_kill_xp` runs `GRANT_SEASON_XP`). Quest or boss XP is another triggerable. Do not add a Backend kill listener for the pass. See [season pass](../season-pass.md).

Player-only inputs (`ON_HOTBAR_SLOT`, `ON_OFFHAND_SWAP`, `ON_ITEM_USE`, `ON_INVENTORY_CLICK`, `ON_MOUNT`) are on [Triggerables](README.md).
