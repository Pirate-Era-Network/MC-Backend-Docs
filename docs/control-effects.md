---
sidebar_position: 7
---

# Control effects (world-lock ops and Frontend templates)

**Live.** World locks are **mechanic operations**, same as `PLAY_SOUND`. `type: NO_WALK` runs a Backend task that zeros walk. It does not `SET_STAT` a matching stat id.

`SET_STAT` is for **verbal flags** other YAML can require (`BOOLEAN` on `stat_stunned`, `stat_no_cast`, `stat_casting_mode`). Those flags do not `adjust` Minecraft.

Named gameplay effects (stun, silence, slowness) are Frontend templates that list ops: `NO_WALK`, `NO_JUMP`, `BAN_CATEGORY`, `SET_STAT` stunned, `CAST_VANILLA_EFFECT`.

Internal expire flags live under `flag_saves.world_locks`. The player loop reads them so walk/hide stay applied until duration ends. Pack YAML never names those flags.

```yaml
operations:
    1:
        type: NO_WALK
        target: TARGET
        duration: 8s
    2:
        type: SET_STAT
        target: TARGET
        stat: stat_stunned
        value: 1
        duration: 8s
```

`SET_STAT` `value: 0` clears overlay for that verbal stat, then persist 0. `CLEAR_STAT_OVERLAY` with no `stat` clears world locks, category bans, and `presentation.cleansed` pack overlays.

## World-lock ops (Backend)

Types come from `rules.dsc` `world_lock_operations`. Hooks stay in `utils/control_effects/`, `player_utils.dsc`, and `Events/global_events.dsc`.

| Type | What the task does |
| --- | --- |
| `NO_WALK` | Entity speed 0 and player `walk_speed` / `fly_speed` 0 until duration ends. Restore uses `player_vanilla_walk_speed` (0.2) |
| `NO_JUMP` | `on player jumps` cancelled while the lock flag is present |
| `NO_MELEE_DAMAGE` | Attacker skips custom melee (`ENTITY_ATTACK`, `ENTITY_SWEEP_ATTACK`). Skill `CUSTOM` is not blocked |
| `INVULNERABLE` | Victim skips custom damage |
| `NO_KNOCKBACK` | `apply_knockback` and `APPLY_VELOCITY` return before velocity. `DASH` still moves the dasher |
| `HIDDEN` | `hide_from_players`. Mobs drop you. No vanilla invisibility potion |
| `UNTARGETABLE` | LOOK and AOE skip the entity. Mobs drop it. Explicit `TARGET` lists are not filtered |

`duration:` is the lock expire. Omit it to keep the lock until cleanse.

## Generic ops

| Op | Use |
| --- | --- |
| `SET_STAT` | Verbal persist / timed overlay / session overlay. Requirements, not walk lock |
| `TOGGLE_STAT` | Flip effective on/off through `SET_STAT`. Not enter/exit with different cues |
| `RUN_MECHANIC` | Run a `mechanic_*` template, then continue this mechanic |
| `CAST_VANILLA_EFFECT` | Potion type + duration + amplifier |
| `BAN_CATEGORY` | Timed string list. `RUN_SKILLMOVE` no-ops if banned |
| `NARRATE` | Chat to each resolved player. Optional `format:` key from `global_format_config` (`command_format`, `command_text_format`) |
| `CLEAR_STAT_OVERLAY` | No `stat`: world locks, bans, `cleansed` overlays. Vanilla `CAST_VANILLA_EFFECT` potions keep their own duration |

## Pack verbal stats (Frontend)

List them on the living entity. File: `pirate-era-core-frontend/Stats/control_effect_stats.dsc`.

| Goal | What to ship |
| --- | --- |
| Silence | `SET_STAT` `stat_no_cast` with `duration:`, plus `BOOLEAN` `mode: NOT` on the cast. Or inherit `mechanic_silence` |
| Stun | Inherit `mechanic_stun` (`NO_WALK` + `NO_JUMP` + `BAN_CATEGORY` mobility + `SET_STAT` `stat_stunned`) |
| Casting mode | `SET_STAT` `session: true` `value: 1`. Exit is `value: 0`. Hotbar uses `BOOLEAN` |
| Class | persist `SET_STAT` on `stat_class_example`. Skills use `BOOLEAN` `HAS` |
| In combat | `SET_STAT` `stat_in_combat` with `duration:` |
| Skill slot | persist `SET_STAT` on `stat_skillmove_1` (and other Global Build slot stats) plus `RUN_SKILLMOVE` |
| Mobility skills | SkillMove `categories: [mobility]` plus `BAN_CATEGORY` |

## Named-effect templates

File: `pirate-era-core-frontend/Mechanics/mechanic_templates.dsc`. Child scripts set `inherit:` and `duration:` (named specialization). `RUN_MECHANIC` runs a template then continues the caller. `mechanic_stun` is `SELF` (the caster). Silence, slowness, and ocean weakness stay `TARGET`.

## Presentation

Sprint and walk come from listed stats that set `presentation.movement` (`SPRINT` / `WALK` / `BOTH`). Floor is gamerules `base_movement_speed`. Knockback comes from listed stats that set `presentation.knockback: true`. Temporary speed is `OVERLAY_STAT_LEVEL` / `SET_STAT` `duration:` on a movement-opted VALUE, or `CAST_VANILLA_EFFECT` `SPEED`. Do not look up a script named `stat_sprint_speed`.

| Goal | What to ship |
| --- | --- |
| Stun / root | Frontend `mechanic_stun` |
| Stealth | Op `HIDDEN` |
| Blindness / slowness | `CAST_VANILLA_EFFECT` |
| Cleanse | `CLEAR_STAT_OVERLAY` with no `stat` |

## Smoke tests

Script: `pirate-era-core-frontend/Mechanics/mechanic_examples.dsc` → `mechanic_example_control_effects`. Reload. Rejoin.

`/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_control_effects].data_key[data].get[KEY]>`

| KEY | What it does | What you should see |
| --- | --- | --- |
| `self_apply_no_cast` | Verbal silence overlay 8s | Next row is the proof |
| `self_sound_if_can_cast` | Pling if not silenced | After apply: no sound |
| `self_ban_mobility` | Ban `mobility` 8s | Next row is the proof |
| `self_sound_if_can_mobility` | Mobility skillmove | After ban: no sound. `self_run_skillmove` still works |
| `self_apply_no_walk` | Op `NO_WALK` | Cannot walk or fly. Jump still works |
| `self_apply_no_jump` | Op `NO_JUMP` | Cannot jump. Walk still works |
| `self_apply_silence` | Inherit silence onto SELF | Silence plus fruit ban |
| `self_apply_stun` | Inherit stun 8s onto SELF | No walk, no jump, mobility banned, `stat_stunned` on |
| `self_apply_stun_heavy` | Inherit 10s stun | Same, longer |
| `self_apply_no_melee_damage` | Op `NO_MELEE_DAMAGE` | Punch should not deal custom melee |
| `self_apply_invulnerable` | Op `INVULNERABLE` | Incoming custom HP should not drop |
| `self_apply_no_knockback` | Op `NO_KNOCKBACK` | Hits should not shove you |
| `self_apply_hidden` | Op `HIDDEN` | Other players lose your model. Mobs drop you |
| `self_apply_untargetable` | Op `UNTARGETABLE` | LOOK/AOE skip you. Mobs drop you |
| `self_narrate` | Op `NARRATE` | Chat line with `command_text_format` |
| `self_apply_blindness` | Potion | Screen goes dark |
| `self_apply_haste` | Potion SPEED | Vanilla speed |
| `self_apply_slowness` | Inherit slowness | Vanilla slowness |
| `look_apply_untargetable` | `UNTARGETABLE` on LOOK | That entity is skipped by LOOK |
| `look_sound` | Pling on LOOK | After look untargetable: no pling |
| `self_cleanse` | Strip locks, bans, cleansed overlays | Locks end. Potions keep vanilla duration |
| `self_bind_skillmove_1` | Persist slot | Slot 1 binding |
| `self_run_skillmove` | Run example skillmove | Orb pickup |
| `self_run_skillmove_cost` | Stamina cost skillmove | Pickup sound, stamina down 5 |
| `self_grant_belly` | APPLY_TRANSACTION mint | `/balance` shows 50 |
| `self_pay_belly` | TAKE 10 belly | Chat `paid 10 belly`, or `not enough belly` |
| `self_withdraw_belly` | Wallet to `item_belly_coin` | 5 coins |
| `self_redeem_belly` | Coins to wallet | Reverse of withdraw |
| `self_run_skillmove_currency` | SkillMove CURRENCY cost | After grant, 5 belly |
| `self_grant_class_example` | Persist class BOOLEAN | Then the class skill can run |
| `self_run_skillmove_class` | Class-gated skillmove | No-op until `self_grant_class_example` |
| `self_run_mechanic_stun` | `RUN_MECHANIC` stun 8s then narrate | Stun plus chat |
| `self_run_mechanic_stun_3s` | Same at 3s | Shorter stun plus chat |
| `self_toggle_casting_mode` | `TOGGLE_STAT` session on `stat_casting_mode` | Run twice. On then off |

## What can go wrong

- `SET_STAT` `stat_no_walk` expecting a walk lock. There is no such pack stat. Use `type: NO_WALK`.
- Growing a Backend named-effect enum (stun, freeze, root). Add an op or a Frontend template.
- `SET_STAT` persist 1 for casting mode. Use `session: true`.
- Expecting category bans to block a SkillMove with no `categories:` list.
- Porting legacy `passivebuff` as an engine.
