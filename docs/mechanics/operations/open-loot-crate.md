---
sidebar_position: 31
---

# OPEN_LOOT_CRATE

`OPEN_LOOT_CRATE` opens the 27-slot crate chest (glass panes, prize on slot 14) and grants when it closes. Omit `crate` to read `loot_crate` from the event item. `consume` overrides the crate YAML. A missing crate does nothing. A chest in the world that refills on a cooldown is `/staticloot`, not this op. Crate keys are on [loot](../../loot/README.md).

Task: `operation_open_loot_crate`. Opens `PETreasurechestMenu`-style 27 chest (glass panes, prize slot 14), then grants on close. Missing crate is a no-op.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_LOOT_CRATE` |
| `crate` | no | `lootcrate_example`. Omit to read `loot_crate` from the event item |
| `consume` | no | Override the crate YAML `consume` |
| `target` | no | Who. Overlay `ENTITY` |

Smoke: `self_open_loot_crate`. Item: `item_treasure_chest` plus `triggerable_loot_crate_item`. World containers are `/staticloot`, not this op.
