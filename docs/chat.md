---
sidebar_position: 25
---

# Chat

**Live** as a prefix assembler and a message filter. Harvest: `ChatColor.dsc` `AddChatPrefix` stacked champion, yonko, crew, then family name. `Chatmonitor.dsc` blocked a word list, counted warnings, muted, and rejected a repeat message.

Print order is a number. Lower prints first. Titles are one source. They are not the whole chat system. See [titles.md](titles.md).

Paper `chat.type.text` ignores `FORMAT` / `setFormat` and logs `<displayName> message`. `chat_engine_world` cancels vanilla chat, bakes the line on the speaker, narrates to `context.recipients`, and `announce to_console`.

## Files

| Piece | Path |
| --- | --- |
| Prefixes, kinds, filter durations | [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc) |
| Assembler, filter, `/packchat` | [Chat/chat_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Chat/chat_utils.dsc) |
| `on player chats` | [Chat/chat_world.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Chat/chat_world.dsc) |
| Title string lists | [Titles/title_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Titles/title_utils.dsc) |
| Format script (same order, Paper ignores it) | `pirate-era-core-frontend/formats/formats.dsc` `player_chat_formatting` |
| Smoke rows | `pirate-era-core-frontend/Chat/chat_examples.dsc` |

## Prefix

| Piece | Order |
| --- | --- |
| Equipped `title_` prefixes | `chat_title_order` in [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc). Default `10` |
| Each `chatrow_` | That row's `order` |

`kind` (`CREW`, `RANK`, `EXTRA`) is a label. It does not set position. Change `order` to move a row. A row at `5` prints before titles. A row at `15` prints after them.

`chatrow_` fields: `kind`, `order`, `text` (transcript key or literal), optional `stat`. A BOOLEAN above `0` shows the row. Omit `stat` and the row always shows. Omit `order` and the row uses `0` (before the title block).

Suffix after the name is still title suffixes only.

Each source resets color before the name (`<&r>`), same idea as `AddChatPrefix`.

`/packchat` narrates the baked line with `chat_preview_message`. It does not broadcast and does not run the filter.

## Filter

`chat_filter.enabled` false skips mute, words, and the duplicate window.

| rules key | Default | Job |
| --- | --- | --- |
| `warnings_before_mute` | `3` | Word hits before mute |
| `warning_duration` | `3m` | Warning counter expire |
| `mute_duration` | `30m` | Mute expire |
| `duplicate_window` | `3s` | Same lowercase message blocked |

Word strings are every `chatwords_` `words` list. No script, or an empty list, skips the word check. Match is a lowercase substring.

Flags are `chat_runtime_flags` (`runtime_data.chat.*`). They expire. They are not `flag_saves`.

Player lines: `chat_muted_text`, `chat_foul_text`, `chat_muted_now_text`, `chat_duplicate_text`, `chat_mute_reason_text`.

## Smoke

```text
/ex run set_stat def.target:<player> def.stat:stat_chat_crew_example def.level:1
/packchat
```

Say `examplebadword` three times. The third mute lasts `mute_duration`. Say the same clean line twice inside `duplicate_window`.

## What can go wrong

- A second `on player chats` listener. This world script is the only bake.
- Vault `adjust chat_prefix`. Paper wraps `<prefix name>` and drops the suffix.
- Putting crew or rank strings on `title_`. Those rows are `chatrow_` with `kind`.
- Hardcoding the word list in Backend. Add a `chatwords_` script.
