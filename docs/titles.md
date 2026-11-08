---
sidebar_position: 24
---

# Titles / ChatPrefix

**Live** as a catalog, ordered persist lists, and chat paint. Word filter and crew/rank rows are not this page.

Frontend `title_*` scripts hold prefix/suffix strings (transcript keys or literals) and `placement:` `PREFIX`, `SUFFIX`, or `BOTH`. Omit `placement` and the engine infers it from which strings exist. Unlock is a BOOLEAN stat. Equip is `EQUIP_TITLE` (append). Clicking an equipped row runs `UNEQUIP_TITLE`. `CLEAR_TITLES` wipes one side or both.

Do not use `ShowTitle` for this. That op is a screen title packet later.

## Prefix

`title_` in [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc) `script_prefixes.title_config`.

## Persist

| rules key | Path | Shape |
| --- | --- | --- |
| `chat_prefix` | `data.chat_prefix` | Map. `prefixes` and `suffixes` are ordered lists of `title_*` ids |

A leftover single `equipped` id still reads as one prefix until the next write.

Getters: `get_target_title_prefix_texts`, `get_target_title_suffix_texts` (lists). `build_player_chat_prefix` / `build_player_chat_suffix` join those lists. The chat assembler calls the prefix join as the TITLE source. See [chat.md](chat.md).

## Chat

Paint, crew, rank, extra rows, and the word filter live in [chat.md](chat.md). This page only stores which `title_` ids are equipped.

## Menu

`OPEN_TITLE_MENU` fills `menu_title_equip` PAGE rows. Locked rows have no click. Equip/unequip then reopens the PAGE so you can stack several in one sitting. `/packtitle` (`Titles/title_command.dsc`) opens the same PAGE. See [commands/packtitle](commands/packtitle.md).

Harvest: `PEfamilynames.dsc` (`peplayer.unlockedfamilynames`, prefix text). Leave `/PEtitle` and hardcoded family strings out of Backend.

Smoke: `mechanic_example_title`.
