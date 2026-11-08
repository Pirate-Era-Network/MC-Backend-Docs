---
sidebar_position: 29
---

# Persistence

Mongo, the poster API, receipts, and analytics counters. See [receipts](../receipts.md), [API](../api.md), and [analytics](../analytics.md).

| Key | Role | Page |
| --- | --- | --- |
| `analytics_server_flag` | Server totals/days parent | [analytics.md](../analytics.md) |
| `analytics_kinds` | `currency` / `item` / `sink` / `trade` | [analytics.md](../analytics.md), [trades.md](../trades.md) |
| `analytics_directions` | `obtained` / `spent` | [analytics.md](../analytics.md) |
| `analytics_server_keys` | `totals` / `days` | [analytics.md](../analytics.md) |
| `analytics_day_flag_expire` | Day bucket expire | [analytics.md](../analytics.md) |
| `mongo_connection_id` | Reused Mongo id (`engine`) | [receipts.md](../receipts.md) |
| `mongo_secret_key` | Secrets file key (`mongo_uri`). Not the URI | [receipts.md](../receipts.md) |
| `api_host` | API engine host (`172.18.0.1`). Not the token | [api.md](../api.md) |
| `api_port` | Poster API port (`8000`) | [api.md](../api.md) |
| `api_secret_key` | Secrets file key (`api_handshake_token`). Not the token | [api.md](../api.md) |
| `poster_index_flag` | Server index `poster_index` | [api.md](../api.md) |
| `poster_list_menu` | `menu_poster_list` | [api.md](../api.md) |
| `poster_entity_flag` | Frame flag `poster_id` | [api.md](../api.md) |
| `poster_file_root` | `../PEUtils/mapImages/` | [api.md](../api.md) |
| `poster_data_keys` | Template field names | [api.md](../api.md) |
| `poster_payload_keys` | Index row: location, map id, template, subject uuid | [api.md](../api.md) |
| `mongo_config_keys` | FE `database` / `collections` / `receipts` | [receipts.md](../receipts.md) |
| `receipt_kinds` | `TRADE` live. `TRANSACTION` reserved | [receipts.md](../receipts.md) |
| `receipt_data_keys` | Event receipt field names | [receipts.md](../receipts.md) |
| `receipt_list_menu` | `menu_receipt_list` PAGE for `/packreceipt` | [receipts.md](../receipts.md) |
| `receipt_test_values` | Dummy session/menu/name/token for `/packreceipt test` | [receipts.md](../receipts.md) |
