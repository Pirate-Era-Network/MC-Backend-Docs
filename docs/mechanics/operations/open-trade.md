---
sidebar_position: 17
---

# OPEN_TRADE

`OPEN_TRADE` opens the shared 54 chest, with a ready handshake, a swap, and a cancel return. The caster is player one. The first other resolved player is the partner, usually `target: LOOK`. This is not [OPEN_MENU](open-menu.md). Distance, cooldown, and blocked item flags are on [trades](../../trades.md).

Task: `operation_open_trade`. Shared 54 chest, ready handshake, swap, cancel return. Caster is player one. First other resolved player is the partner. Not `OPEN_MENU`. Full config: [trades.md](../../trades.md).

This op overlays `target_type` to `ENTITY`. Only players get a chest.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_TRADE` |
| `target` | no | Partner. `LOOK` at a player |
| `menu` | no | Layout script. Default `menu_trade` |
| `max_distance` | no | Omit here and in `global_trade_config` for unlimited |

```text
/packtrade list
```
