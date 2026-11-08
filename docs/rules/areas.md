---
sidebar_position: 11
---

# Areas

Area rules, the area index, and mob spawn keys. How a placed area resolves is [areas](../areas/README.md).

| Key | Role | Page |
| --- | --- | --- |
| `area_rule_ids` | PVP, OPEN_CHESTS, INTERACT_NPCS, TRAVEL, BUILD_HEIGHT, MOUNT_SPEED_CAP, PUBLIC_ACCESS, NO_CAST | [areas.md](../areas/README.md) |
| `area_rule_modes` | ALLOW / DENY | [areas.md](../areas/README.md) |
| `area_data_keys` | Area Config YAML names, including `entity_level` | [areas.md](../areas/README.md) |
| `area_defaults` | Priority, shape, radius, height, respawn | [areas.md](../areas/README.md) |
| `area_index_flag` | Server map of world area payloads | [areas.md](../areas/README.md) |
| `area_group_index_flag` | Server map of area group rows | [areas.md](../areas/README.md) |
| `area_behavior_keys` | Keys inherited from a group or template, including `entity_level` | [areas.md](../areas/README.md) |
| `area_mob_spawn_keys` | `mob_spawn` names: mobs, max, radii, cooldown, leash, level, use_area_level, heal_on_leash, combat_reset_on_leash, patrol | [areas.md](../areas/README.md) |
| `area_mob_spawn_defaults` | max `4`, radii, cooldown `10s`, leash `16`, level `5`, leash flags false | [areas.md](../areas/README.md) |
| `area_mob_spawn_runtime_flag` | Server gate `runtime_data.area.mob_spawn.<area_id>.spawn_gate` for spawn cooldown | [areas.md](../areas/README.md) |
| `area_list_menu` | `menu_area_list` | [areas.md](../areas/README.md) |
| `area_note_prefix` | Note name prefix `area_` | [areas.md](../areas/README.md) |
| `area_payload_keys` | Index row field names | [areas.md](../areas/README.md) |
| `area_area_flags` | Note flags `area_id` and `notable_kind` | [areas.md](../areas/README.md) |
| `area_chest_inventory_types` | Inventories OPEN_CHESTS can cancel | [areas.md](../areas/README.md) |
