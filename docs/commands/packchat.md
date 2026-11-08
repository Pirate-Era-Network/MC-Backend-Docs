---
sidebar_position: 7
---

# /packchat

Shows the chat line this player would send, including prefix and suffix. It does not broadcast, and it does not run the word filter. Any player can run it. Console stops.

## System

The prefix is `assemble_player_chat_prefix`. The suffix is `build_player_chat_suffix`. Those read equipped titles and `chatrow_` scripts. The live chat event is `chat_world.dsc`, which cancels vanilla chat and narrates the baked line.

| Piece | Where |
| --- | --- |
| Command | [Chat/chat_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Chat/chat_command.dsc) |
| Assembler and filter | [Chat/chat_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Chat/chat_utils.dsc) |
| Option catalog | [chat](../chat.md) |

## Use

```text
/packchat
```

Chat prints `prefix + your name + suffix + : + preview message`. The preview message is the transcript key named in `chat_filter_transcripts.preview`.

## What can go wrong

- Treating this as a mute or filter test. Blocked words are only checked when a real chat message is sent.
- Expecting other players to see the preview. Only you get the line.
