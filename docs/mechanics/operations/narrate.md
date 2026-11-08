---
sidebar_position: 24
---

# NARRATE

`NARRATE` sends chat to each resolved player. `transcript` is a key in `general_transcript_*` for that player, which is the pack path. `text` is the literal used when `transcript` is omitted or the key is empty. One of those two is required. `format` is a key in `global_format_config`. Non-players are skipped.

Task: `operation_narrate`. Chat to each resolved player.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `NARRATE` |
| `transcript` | no | Key in `general_transcript_*` for each resolved player. Preferred for pack chat |
| `text` | no | Literal fallback if `transcript` is omitted or the key is empty. One of `transcript` or `text` is required |
| `format` | no | Key in `global_format_config` (`command_format`, `command_text_format`) |
| `target` | no | Who. Overlay `ENTITY`. Non-players are skipped |
