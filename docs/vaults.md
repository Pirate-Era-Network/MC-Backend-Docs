---
sidebar_position: 16
---

# Vaults

**Live.** Private pages persist on `flag_saves.vaults`. Shared banks are Denizen noted inventories plus `vault_index`. Not `gui: true` info menus. Not a crew engine.

Op: `OPEN_STORAGE`. Harvested from `VaultRenewed.dsc` (slot maps, size, combat lock, backup ring) and `vaultInventory.dsc`. Legacy `CrewVault.dsc` was a shared server list. That is `kind: SHARED` plus a pack BOOLEAN on the mechanic that opens it.

## Backend vs Frontend

| Layer | Owns |
| --- | --- |
| Backend | Chest open/close, slot maps, noted shared inventories, unvaultable/soulbound deposit cancel, getters/setters |
| Frontend `global_vault_config` | Default size, allowed sizes, default page count, backup ring length, optional `size_stat` / `pages_stat` / `combat_stat` |
| Frontend stats | `stat_vault_size` (NUMBER, chest rows), `stat_vault_pages` (NUMBER, how many PRIVATE ids). Extra pages are `SET_STAT`, not a Backend unlock table |
| Frontend items | `unvaultable: true` / `soulbound: true` on Item Config |
| Frontend mechanics | Which id to open, PRIVATE vs SHARED, BOOLEAN gates (crew rank, quest). Combat can also be a mechanic `BOOLEAN` `NOT` |

There is no `flag_saves.crews`. A later party/plot script opens `kind: SHARED` `vault: <instance_id>` when its own membership check passes.

## Kinds

| `kind` | Storage | Who sees it |
| --- | --- | --- |
| `PRIVATE` (default) | `data.vaults.<id>.slots` on the player | That player |
| `SHARED` | Noted inventory `vault_shared_<id>` | Everyone who can run the op |

PRIVATE integer ids above `pages_stat` (or `default_pages`) refuse. Named ids (`personal`) skip that count.

## OPEN_STORAGE

Task: `operation_open_storage`. Overlay `ENTITY`. Smoke: `mechanic_example_open_storage`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_STORAGE` |
| `vault` | no | Page id (`1`, `example_bank`). Default `global_vault_config.default_private_id` |
| `kind` | no | `PRIVATE` or `SHARED` |
| `size` | no | 9/18/27/36/45/54. Snaps down to a listed size |
| `size_stat` | no | NUMBER/VALUE whose effective value is the size. Else config `size_stat` |
| `target` | no | Who. Default SELF |

```text
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_storage].data_key[data].get[open_private]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_open_storage].data_key[data].get[open_shared]>
/packitem item_example_unvaultable
/packvault list
```

Unlock a second private page: `unlock_page_2` then `open_page_2`. Grow the chest: `set_size_54` then reopen.

## Item flags

`create_item_from_config` stamps `unvaultable` and `soulbound` when the Item Config sets those keys true. Clicks that would deposit those items cancel. Taking them out is allowed.

## Admin

`/packvault list` PAGE of SHARED notes. `clear` removes notes and items. `prune` drops index rows whose note is gone. `remove [id]` drops one. PRIVATE pages are player flags, not this list.

## What can go wrong

- Opening a vault with `OPEN_MENU`. That is a fakeitem GUI. Storage is `OPEN_STORAGE`.
- Expecting a Backend crew vault. Use SHARED plus a pack BOOLEAN.
- Putting LuckPerms groups in Backend for size. Size is `size:` or `size_stat`.
- Hardcoding `stat_in_combat` in an op. Combat lock is `global_vault_config.combat_stat` (this pack points it at `stat_in_combat`) or a mechanic `BOOLEAN`.
- Skipping `unvaultable` on the Item Config and expecting a lore line to block deposit.
