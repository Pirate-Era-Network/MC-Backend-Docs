---
sidebar_position: 24
---

# Currencies and costs

Cost rows, transactions, currency forms, and player pay. Wallets are [currencies](../currencies.md).

| Key | Role | Page |
| --- | --- | --- |
| `skillmove_cost_keys` | `type` / `id` / `stat` / `amount` / `action` | [skills.md](../skills.md), [currencies.md](../currencies.md) |
| `cost_types` | CURRENCY / ITEM / STAT | [currencies.md](../currencies.md) |
| `cost_actions` | TAKE / GIVE | [currencies.md](../currencies.md) |
| `cost_component_keys` | Cost row field names | [currencies.md](../currencies.md) |
| `transaction_parties` | PLAYER / SYSTEM / VOID | [currencies.md](../currencies.md) |
| `transaction_context_keys` | Source, destination, costs | [currencies.md](../currencies.md) |
| `transaction_op_keys` | APPLY_TRANSACTION YAML names including `onsuccess` / `onfail` / `analytics` | [mechanics/operations.md](../mechanics/operations/README.md) |
| `player_pay_modes` | ALLOW / TRADE_ONLY | [currencies.md](../currencies.md) |
| `currency_data_keys` | `display` / `rules` / `withdraw_item` / `form` | [currencies.md](../currencies.md) |
| `currency_forms` | WALLET / ITEM / BOTH | [currencies.md](../currencies.md) |
| `currency_rules_keys` | Init, tradeable, redeemable, player_transfer, death, cap, min | [currencies.md](../currencies.md) |
| `currency_loss_on_death` | NONE / ALL / PERCENT | [currencies.md](../currencies.md) |
| `currency_runtime_flags` | Death-loss debounce | [currencies.md](../currencies.md) |
| `currency_death_loss_flag_expire` | `2s` | [currencies.md](../currencies.md) |
| `currency_convert_directions` | WITHDRAW / REDEEM | [currencies.md](../currencies.md) |
