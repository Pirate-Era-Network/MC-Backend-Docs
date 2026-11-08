---
sidebar_position: 27
---

# /packreceipt

Opens Mongo receipt rows, or inserts a dummy row so you can prove the collection without two players trading. Op only. The list menu needs a player.

## System

`record_receipt` in `receipt_store.dsc` is the insert used by a finished trade. This command's `test` action builds a dummy map and calls that same task. `TRADE` is the live kind. `TRANSACTION` is reserved for shops. Analytics counters are not these documents.

| Piece | Where |
| --- | --- |
| Command and test insert | [Analytics/receipt_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Analytics/receipt_command.dsc) |
| Insert and find | [Analytics/receipt_store.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Analytics/receipt_store.dsc) |
| Connection | [commands/packmongo](packmongo.md) |
| Option catalog | [receipts](../receipts.md) |

## Use

```text
/packreceipt
/packreceipt <kind> (day)
/packreceipt player <name> (kind) (day)
/packreceipt test (kind)
```

| Action | What it does |
| --- | --- |
| kind | Open that day's receipts. The first argument defaults to `TRADE`. `day` is optional. |
| `player` | Same list, filtered to that name. An offline match still supplies the uuid. |
| `test` | Insert one dummy row through `record_receipt`, then open the list when the sender is a player. Kind defaults to `TRADE`. |

Console on `player` or a kind list gets the usage line, because the PAGE needs a player.

## What can go wrong

- Mongo is not connected. Run `/packmongo ping` first. `test` tries to connect, then says mongo is down.
- An unknown kind. Kinds are the `receipt_kinds` values.
- Expecting `test` to be a real trade. The session name is `packreceipt_test`.
