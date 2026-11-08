---
sidebar_position: 27
---

# Living entities and damage

Damage routing modes, hooks, and vanilla adjustifiers. The body is [living entities](../living-entities.md).

| Key | Role | Page |
| --- | --- | --- |
| `damage_routing_modes` | REDIRECT / APPLY / SPLIT | [living-entities.md](../living-entities.md) |
| `damage_routing_hooks` | onsuccess / ondeplete / onfail FE keys | [living-entities.md](../living-entities.md) |
| `damage_routing_redirect_targets` | REDIRECT tokens `attacker`, `mount` (the mount a player victim is sitting on), `rider` (that mount's driver) | [living-entities.md](../living-entities.md) |
| `damage_routing_default_split_share` | Default SPLIT `share` (`0.5`) | [living-entities.md](../living-entities.md) |
| `damage_routing_max_depth` | Max nested REDIRECT hops (`8`) | [living-entities.md](../living-entities.md) |
| `damage_last_attacker_flag` | Attacker stamped before a killing HP write. Death reads it when vanilla damager is empty | [triggers.md](../triggers/README.md) |
| `damage_feedback_sounds` | Hurt replay sounds (player vs other entity) | [living-entities.md](../living-entities.md) |
| `damage_feedback_knockback` | Hit knockback `amount` and `y` | [living-entities.md](../living-entities.md) |
| `vanilla_adjustifiers` | Combat and resistance `mode`: `FLAT` (overwrite) `+` `-` `*` `/` | [living-entities.md](../living-entities.md) |
