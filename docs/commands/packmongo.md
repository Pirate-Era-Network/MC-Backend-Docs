---
sidebar_position: 28
---

# /packmongo

Pings the engine Mongo connection. Op or console. This is not player flag save.

## System

The URI lives in `plugins/Denizen/secrets.secret`. Database and collection names come from Frontend `global_mongo_config`. Start and reload call `connect_engine_mongo` from `mongo_utils.dsc`. This command drops that client, connects again, then sends `ping: 1`.

A listed connection id is not proof the socket is open. The ping is.

| Piece | Where |
| --- | --- |
| Command | [Persistence/mongo_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Persistence/mongo_command.dsc) |
| Connect | [Persistence/mongo_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Persistence/mongo_utils.dsc) |
| Option catalog | [receipts](../receipts.md) |

`reconnect` is the same action as `ping`.

## Use

```text
/packmongo
/packmongo ping
/packmongo reconnect
```

Chat says the ping succeeded, the host is down, or the ping failed. Success includes the database name and the receipts collection so you can see which Frontend config answered.

The wait is about 3 seconds. A dead host must not sit on the 30 second driver timeout.

## What can go wrong

- Denizen `Allow Mongo` is false. Reload the Denizen config after turning it on.
- Paper using `127.0.0.1`. On this node the host is `172.18.0.1`, and UFW must allow `172.18.0.0/16`.
- Treating a failed ping as a bad receipt document. Fix the socket before `/packreceipt test`.
