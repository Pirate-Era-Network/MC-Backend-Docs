---
sidebar_position: 10
---

# Event receipts

**Live** for TRADE inserts and staff `/packreceipt`. TRANSACTION is reserved for shops. Analytics counters stay numbers only. See [analytics.md](analytics.md).

This is not player `flag_saves` join/quit persist.

## Split

| Piece | Where |
| --- | --- |
| Denizen connection id | Backend `rules.dsc` `mongo_connection_id` (`engine`) |
| Secrets key name | Backend `rules.dsc` `mongo_secret_key` (`mongo_uri`) |
| FE field names | Backend `rules.dsc` `mongo_config_keys` |
| Database and collection names | Frontend `global configs/global_mongo_config.dsc` |
| URI, user, password | `plugins/Denizen/secrets.secret` only |
| Connect / ping | `Persistence/mongo_utils.dsc`. Start/reload is `mongo_engine_events`, not `global_events` |
| Insert / find | `Analytics/receipt_store.dsc` (`record_receipt`, `/packreceipt`) |
| TRADE writer | `Trade/trade_session.dsc` `complete_trade_session` |
| Staff PAGE | Frontend `Menus/menu_receipt_list.dsc`. Overlay `header_text` is `receipt_menu_header` |

Same pattern as `global_trade_config` and `global_vault_config`. Pack names stay off Backend.

## Denizen config

`Allow Mongo` must be true in Denizen config. Then `/ex reload config`. `/packmongo ping` is the round trip.

## Operator URI

```
!SECRETS_FILE
mongo_uri: mongodb://pirate_era_user:PASSWORD@172.18.0.1:27017/pirate_era_data?authSource=pirate_era_data
```

User, password, database path, and `authSource=pirate_era_data` are required. `global_mongo_config.database` must be that same db.

The **host** cannot be:

- `0.0.0.0` (bind only, driver rewrites to `127.0.0.1`)
- `127.0.0.1` (localhost inside the Paper container)
- The node's public IP from Paper (hairpin). Log stays `CONNECTING` with no `Connection refused`

Use the docker gateway on the same node: `172.18.0.1` or `172.17.0.1`, Mongo's allocated port.

Wings containers cannot reach a new private port until UFW allows the Docker net, the same way Bungee reaches Paper on `25566:25570`. Mongo needed:

```
/usr/sbin/ufw allow from 172.18.0.0/16 to 172.18.0.1 port 27017 proto tcp
```

Do not open `27017` on `0.0.0.0` or the public node IP. The poster API is `172.18.0.1:8000` with the same UFW pattern. See [api.md](api.md).

Then `/ex reload config` and `/packmongo ping`. Credentials in the driver log (`userName='pirate_era_user'`, `source='pirate_era_data'`) means the secret parsed. That is not a successful socket. `Connect timed out` is UFW DROP. Success is `state=CONNECTED` plus chat `mongo ok`.

## Ping

`/packmongo ping` (and `reconnect`) drops the client without `~`, waits until the id is gone, connects, then sends `ping: 1` without `~`. Start/reload can list the id while the socket is closed. Java `~mongo disconnect` never finishes the hold, so disconnect is not waitable.

A down host must not hold the tick for 30s. Chat fail after about 3s is the answer. A later console `Timed out after 30000 ms` or `state should be: open` is the leftover driver thread.

## record_receipt

Other systems `run` this task. Do not `inject`. It uses `- stop`. If Mongo is down, it returns quietly. The caller still finishes.

Pass `def.kind:` from `receipt_kinds` (`TRADE` live, `TRANSACTION` reserved) and `def.receipt_map:` built with `.with`. Nested MapTags cannot go inside `<map[k=v]>`. Extra keys pass through if they are scalars or lists of scalars.

`complete_trade_session` is the first writer. Cancelled trades write nothing. Do not hook `APPLY_TRANSACTION` yet.

## Document fields

`receipt_kinds` and `receipt_data_keys` are the event schema for every writer. They are not trade-only.

| Key | TRADE today |
| --- | --- |
| `id` | UUID (filled if omitted) |
| `kind` | `TRADE` |
| `time` | Insert time if omitted |
| `day` | `yyyy-MM-dd` (same helper as analytics) |
| `session` | Trade session id |
| `menu` | Layout script |
| `world` | Player one's world |
| `player_one_uuid` / `player_one_name` | Side one |
| `player_two_uuid` / `player_two_name` | Side two |
| `from_one` / `from_two` | Item `id:qty` tokens |

History stays in Mongo. Nothing on `flag_saves`.

## Staff

Op-only PAGE. Overlay header is lowercase (`receipts` in `english_transcript.dsc`).

```
/packreceipt
/packreceipt trade
/packreceipt trade 2026-09-21
/packreceipt player Name
/packreceipt player Name trade 2026-09-21
/packreceipt test
/packreceipt test trade
```

Find is `kind` plus `day`. Player uuid/name is filtered in script after find. Console gets usage. If Mongo is down, chat is `mongo_down_text`.

`/packreceipt test (kind)` writes one dummy row through `record_receipt` (tokens from `receipt_test_values`). Default kind is TRADE. No second player. A new receipt kind ships this path in the same change.

## What can go wrong

- Putting the URI or password in YAML or git
- Putting `pirate_era_data` in Backend `rules.dsc`. That name is Frontend `global_mongo_config`
- Using the public node IP from Paper. Hairpin. Try `172.18.0.1`
- Missing UFW allow from `172.18.0.0/16` to `172.18.0.1` port `27017`. Game ports were already allowed. Timeout is DROP
- Treating this connection as player persist
- Writing YAML under `/Trades/`. Use `record_receipt` plus analytics counts
- Injecting `record_receipt` into a SkillMove or trade click queue. Always `run`
