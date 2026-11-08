---
sidebar_position: 16
---

# OPEN_STORAGE

`OPEN_STORAGE` opens a real item chest. `PRIVATE` writes `flag_saves.vaults`. `SHARED` is a noted inventory, which is the bank when a pack BOOLEAN says the player may use it. There is no separate crew-vault flag. This is not [OPEN_MENU](open-menu.md), which builds a fake-item GUI. Items flagged `unvaultable` or `soulbound` stay out. The create path has to stamp those flags. Chest size, pages, and the combat gate are on [vaults](../../vaults.md).

Task: `operation_open_storage`. Real item chest. PRIVATE writes `flag_saves.vaults`. SHARED is a noted inventory. Not `OPEN_MENU`. Full config: [vaults.md](../../vaults.md).

This op overlays `target_type` to `ENTITY`. Only players get a chest.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_STORAGE` |
| `vault` | no | Page id. Default `global_vault_config.default_private_id` |
| `kind` | no | `PRIVATE` (default) or `SHARED` |
| `size` | no | 9 to 54 in steps of 9 |
| `size_stat` | no | NUMBER/VALUE for size. Else pack `size_stat` |
| `target` | no | Who. Default SELF |
