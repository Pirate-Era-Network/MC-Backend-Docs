---
sidebar_position: 12
---

# Living entities

This script is the body. `stats` lists which pack stats it carries. `damage_routing` decides how incoming damage is applied, redirected, or split across those stats.

**Partial.** Player bind and stat init work. Damage routing (APPLY / REDIRECT / SPLIT, conditions, OnSuccess / OnDeplete / OnFail) is Live. `deal_damage` is Live. Combat and resistance profiles use Vanilla Adjustifier `FLAT` `+` `-` `*` `/` on the vanilla intercept.

Prefix: `livingentity_`. Default player config is `rules.player_entity` → `livingentity_player`. Example: `pirate-era-core-frontend/LivingEntities/player_living_entity.dsc`.

```yaml
livingentity_player:
    type: data
    data:
        stats:
            - stat_stamina
            - stat_player_maximum_health
        triggerables:
            - triggerable_cast_offhand
        damage_routing:
            1:
                mode: APPLY
                target: stat_player_maximum_health
        combat_profile:
            ENTITY_ATTACK:
                mode: "+"
                value: stat_stamina
        resistance_profile:
            FALL:
                mode: "+"
                value: 0.5
```

`damage_routing` is a **keyed map** (`1`, `2`, …) in script order, same as mechanic operations. A leftover named map (`base_health:`) still walks in script order. Do not use a YAML list of maps.

| Key | Status |
| --- | --- |
| `stats` | Live (list of `stat_*` to init) |
| `triggerables` | Live (list of `triggerable_*` to bind on join). See [triggers.md](triggers/README.md) |
| `damage_routing` | Live. Ordered routes. Modes in `rules.dsc` `damage_routing_modes` |
| `combat_profile` | Live on vanilla intercept. `mode` from `vanilla_adjustifiers`: `FLAT` overwrites the packet (use a Strength `stat_*` here). `+` `-` `*` `/` apply onto vanilla. `value` is a number or a `stat_*`. Missing `mode`, or a bare stat name, is `FLAT` |
| `resistance_profile` | Live on vanilla intercept. Same adjustifier modes |

Join binds the player to this script (`data.living_entity`) and inits listed stats and triggerables. A regen stat on this list ticks once a second through `regenerate_all_target_stats`. Players use `player_game_loop`. Indexed mobs use the entity one-second walk. The same task, and only stats that target actually has. World locks are mechanic ops (`NO_WALK`), not join-inited stats. See [control-effects.md](control-effects.md). Vanilla damage is cancelled and sent into `request_vanilla_damage` (combat then resistance adjustifiers) → `core_custom_damage_event`. That event injects `apply_living_entity_damage_routing`.

Skills and ops that deal damage must `run deal_damage` (`attacker`, `target`, `type`, `value`). That task only fires `core_custom_damage_event`. It does not `hurt`, `adjust health`, or run vanilla adjustifiers. Living entities stay on routing. Non-living targets still use vanilla HP in that event. Default `type` is `CUSTOM`.

`FLAT` replaces the vanilla amount with `value`. That is how a Strength (or any) stat becomes the hit, with no leftover vanilla. `+` `-` `*` `/` keep vanilla and change it. Quote the operator modes in YAML (`"+"`). `FLAT` is a word and stays unquoted.

```yaml
ENTITY_ATTACK:
    mode: FLAT
    value: stat_strength
```

Living entities do not use vanilla hearts as real HP. Non-living targets still use vanilla health.

Vanilla `on entity damaged` is **cancelled** after `request_vanilla_damage` when the victim or the attacker is a living entity. `determine 0` still flashed the original victim. Custom HP (routing) or vanilla `adjust health` (non-living target) already ran in that custom event. I-frames are applied with `no_damage_duration` so cancel does not let melee or fire tick every tick. Fights where neither side is a living entity stay vanilla.

After a packet actually lands, `play_damage_feedback` flashes red (`play_hurt_animation:0`) and plays `damage_feedback_sounds`. It also runs `spawn_damage_hologram` (`text_display` via `SPAWN_HOLOGRAM`). Knockback is `run apply_knockback` one tick later. Setting velocity inside the cancelled damage event is wiped. No attacker (fall) skips knockback. Strength is `damage_feedback_knockback`. Amount is scaled by `1 - clamp(get_knockback_resistance, 0, 1)`. It does not call `hurt`. One flash and shove per packet on the victim. A full REDIRECT applies that to the destination, not you.

## Route keys

| Key | Required | Notes |
| --- | --- | --- |
| `mode` | no | `APPLY` (default), `REDIRECT`, `SPLIT`. `type` is read if `mode` is missing (old example configs) |
| `target` | yes for APPLY/SPLIT | Consumable `stat_*`. For REDIRECT, a token if `redirect_to` is omitted |
| `redirect_to` | REDIRECT | Token from `damage_routing_redirect_targets`. `attacker` is the damager. `mount` is the mount a player victim is sitting on. `rider` is the driver of a mount victim. A missing mount or driver is OnFail. |
| `share` | SPLIT, optional on REDIRECT | 0 to 1. SPLIT default is `damage_routing_default_split_share` (`0.5`). APPLY ignores this and uses 1 |
| `requirements` | no | Same maps as mechanic `requirements`. Empty passes. Default `source` is the attacker (caster). Use `source: target` for the victim |
| `onsuccess` | no | Mechanic config (or keyed map of them) after a bar still has pool, or after a successful REDIRECT |
| `ondeplete` | no | After this hit brings the consumable to `depletes_to`. Shield break is usually a sound hook here. True HP on a **player** or **combat mob** also runs engine death (`try_finalize_living_entity_health_deplete` in `Entities/entity_living_death.dsc`) after wallet loss on players |
| `onfail` | no | Non-consumable APPLY/SPLIT target, or REDIRECT with a bad destination / depth cap |

Unknown `mode` is APPLY. There is no ABSORB mode. A shield is APPLY onto a shield consumable, listed **above** the health APPLY so leftover overflow hits HP.

```yaml
damage_routing:
    1:
        mode: APPLY
        target: stat_shield
        ondeplete:
            operations:
                1:
                    type: PLAY_SOUND
                    target: TARGET
                    target_type: ENTITY
                    sound: ITEM_SHIELD_BREAK
    2:
        mode: APPLY
        target: stat_player_maximum_health
        ondeplete:
            operations:
                1:
                    type: PLAY_SOUND
                    target: TARGET
                    target_type: ENTITY
                    sound: ENTITY_WITHER_DEATH
```

APPLY (and SPLIT) take as much as the pool can. An empty bar is skipped with no hook. Leftover remaining walks the next matching route.

REDIRECT sends `remaining * share` (share default 1) to another entity through `core_custom_damage_event`. Self-redirect and missing entities fire OnFail and leave remaining on this entity. Nested hops stop at `damage_routing_max_depth`.

Hook context: `source_type` DAMAGE. Caster is the attacker when it is an entity, else the victim. Targets are the entity whose bar changed (the redirect destination on REDIRECT success). `event_values` has `damage`, `value`, and `type`.

`get_living_entity_damage_route` is the first route whose requirements pass. `get_living_entity_health_route` is the last APPLY/SPLIT consumable (true HP under stacked shields). HEALTH requirements use the health route. Currency `loss_on_death` runs when that health bar hits `depletes_to`.

## What can go wrong

- Listing a stat that is not a `stat_` script. Init will fail or skip.
- Treating Minecraft health as survival. It is display/fallback only for living_entity targets.
- Putting a YAML list under `damage_routing`. Use numbered keys.
- Checking a route requirement on the victim without `source: target`.
- APPLY `target` that is not consumable. The route OnFails and leftover goes to later routes.
- OnDeplete with a `wait` on the same thought as leftover APPLY. Hooks `run` on a new queue so routing can finish.
- Expecting vanilla hurt from a cancelled damage event or `adjust health`. Feedback is `play_damage_feedback` only.
- Calling `hurt` or `adjust health` on a living entity from a skill. Use `deal_damage`.
- Using an operator when you meant overwrite. Strength (or any stat as the whole hit) is `mode: FLAT`.
- Unquoted `+` `-` `*` `/` as YAML map values. Quote them. Unquoted `-` in `rules.dsc` prevents `rules` from loading. `FLAT` does not need quotes.
