---
sidebar_position: 8
---

# Currencies

**Live.** Frontend `currency_*` scripts are the registry. The engine does not pick a default currency.

Prefix: `currency_`. Example: `pirate-era-core-frontend/currencies/main_currencies.dsc`.

```yaml
currency_belly:
    type: data
    data:
        display:
            name: belly
            material: paper
            custom_model_data: 0
        form: BOTH
        withdraw_item: item_belly_coin
        rules:
            initialise_on_player: true
            tradeable: true
            redeemable: true
            player_transfer: true
            loss_on_death: NONE
            cap: -1
            min_value: 0
```

## Flow

1. Reload lists every `currency_*` script. That is what exists.
2. `form` says how it is stored.
3. Shops always pay `type: CURRENCY` against the wallet for `BOTH` / `WALLET`. They do not eat coins.
4. `/withdraw` / `/redeem` convert wallet \<-> `withdraw_item` when FE allows each direction. Shared task: `convert_currency_between_forms`.

SkillMove `costs:` are usually STAT (stamina). CURRENCY on a skill is optional Cost Component, not the default meaning of skill costs.

| `form` | Stored where | Shop `type: CURRENCY` | Convert |
| --- | --- | --- | --- |
| `WALLET` | Player flag | Wallet | No |
| `ITEM` | Pack `withdraw_item` stacks | Those items | No |
| `BOTH` | Wallet, plus optional coins | Wallet | `/withdraw` if `tradeable`, `/redeem` if `redeemable` |

Missing `form`: `BOTH` when `withdraw_item` is set, else `WALLET`.

| Block / key | Status |
| --- | --- |
| `display.name` | Live (id stays the script name) |
| `display.material` / `custom_model_data` | Player wiki icon. Coin item is `withdraw_item` |
| `wiki` / `notinwiki` | Live. Player wiki. See [wiki.md](wiki.md) |
| `form` | Live. `WALLET` / `ITEM` / `BOTH` |
| `withdraw_item` | Live. Pack `item_*` |
| `rules.initialise_on_player` | Live on join for wallet forms |
| `rules.min_value` | Live in `set_currency` |
| `rules.cap` | Live. `-1` means no cap |
| `rules.tradeable` | Live. Wallet to coins (`/withdraw`) |
| `rules.redeemable` | Live. Coins to wallet (`/redeem`). Missing means true |
| `rules.player_transfer` | Live. Wallet P2P (`/pay` or a later trade menu) |
| `rules.loss_on_death` | Live on wallet forms. `NONE` / `ALL` / `PERCENT` |
| `rules.loss_on_death_amount` | Live with `PERCENT` (fraction, `0.5` is half) |
| `rules.loss_on_death_text` | Live when amount is taken. Tags: `<[lost_amount]>`, `<[currency_display_name]>` |
| `rules.loss_on_death_format` | Live. Key in `global_format_config`. Default `command_format` |

Wallet path: `flag_saves.currencies` → `data.currencies`.

Death loss runs when the living-entity health bar hits `depletes_to`. Vanilla `after player death` is a fallback. A 2s flag stops both from applying twice. `ITEM` form skips wallet death loss. If any amount is taken, the player gets `loss_on_death_text` or transcript `currency_death_loss_text`.

## Player pay vs trade

Frontend `registry_gamerules.data.economy.player_pay`:

| Value | What players see |
| --- | --- |
| `TRADE_ONLY` | `/pay` tells them this server does not use `/pay`. Use `OPEN_TRADE` for items. Default for Pirate Era |
| `ALLOW` | `/pay <player> <amount> (currency)` sends wallet currency when `player_transfer` is true |

The command always exists so a guessed `/pay` is not a silent unknown command. Set `ALLOW` only when you want `/pay` as a real tool.

P2P `APPLY_TRANSACTION` still uses `player_transfer` so a shop or later wallet-in-trade can move currency without enabling `/pay`. Item swap is `OPEN_TRADE`.

## Cost Component

Shops and travel: `APPLY_TRANSACTION` ([operations.md](mechanics/operations.md)). Optional `analytics:` tag for sink counters.

`TAKE` hits source. `GIVE` hits destination. Put the purchase in `onsuccess`.

## Commands

| Command | What it does |
| --- | --- |
| `/balance` | Wallet, plus flagged coin value when `withdraw_item` is in inventory |

Withdraw items are **not** vanilla stacks of 1. One ItemTag holds `item_runtime_flags.currency_amount` (legacy `moneyamount`) so `/withdraw 1000` is one coin. `currency_created_by` / `currency_created_by_name` is who minted it (legacy `handmade`). `/balance` sums those amounts. Missing flags still count as vanilla quantity (loot stacks of 1).

Item display tags on this queue: `<[currency_amount]>`, `<[currency_display_name]>`. Transcript `coin_minted_by_text` is appended when a name is set.
| `/withdraw <amount> (currency)` | `tradeable` BOTH. TAKE wallet, GIVE coins |
| `/redeem <amount> (currency)` | `redeemable` BOTH. TAKE coins, GIVE wallet |
| `/pay ...` | Only when gamerules `player_pay: ALLOW` |

Convert is Cost Component. It does not count as obtain/spend ([analytics.md](analytics.md)).

One-way example: `tradeable: false`, `redeemable: true`. Players can bank found coins. They cannot mint coins from the wallet again.

## What can go wrong

- Hardcoding `currency_belly` in Backend. Packs own the ids.
- Expecting SkillMove `costs` to be currency. The usual row is STAT.
- `player_pay: ALLOW` while `player_transfer` is false. `/pay` then refuses the currency.
- Putting `GIVE_ITEM` as the next mechanic op after a failed pay. Use `onsuccess`.
