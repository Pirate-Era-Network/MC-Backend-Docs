---
sidebar_position: 2
---

# Pointers

These keys are script names the engine looks up. The domain page is where that script is written.

| Key | Value today | Notes |
| --- | --- | --- |
| `player_entity` | `livingentity_player` | Default living-entity config for players |
| `gamerules` | `registry_gamerules` | Frontend pack policy. [gamerules.md](../gamerules.md) |
| `allowed_damage_types_gamerules` | `allowed_vanilla_damage_types` | Contract until that registry exists |
| `global_build_config` | `global_build_config` | Live schema (skill/passive slot stats, gear slot ids, cosmetic persist channels, GIVE_ITEM dest cells) |
| `global_vault_config` | `global_vault_config` | Live schema (vault size, pages, combat BOOLEAN pointer). See [vaults.md](../vaults.md) |
| `global_trade_config` | `global_trade_config` | Live schema (cooldown, blocked_flags, optional max_distance). See [trades.md](../trades.md) |
| `global_mongo_config` | `global_mongo_config` | Pack database and collection names. URI stays in secrets. See [receipts.md](../receipts.md) |
| `global_item_config` | `global_item_config` | Live schema (tiers, max level, skill slot lists, sets). Set piece counting is not an engine |
| `global_format_config` | `global_format_config` | Live via format lookup |
