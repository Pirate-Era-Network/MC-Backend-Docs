---
sidebar_position: 42
---

# Title operations

`OPEN_TITLE_MENU`, `EQUIP_TITLE`, `UNEQUIP_TITLE`, and `CLEAR_TITLES` edit the chat title lists. Unlock is a Frontend `BOOLEAN` plus `SET_STAT`. Equip appends the script id onto `flag_saves.chat_prefix.prefixes` and/or `.suffixes`, using the catalog `placement`. A duplicate id does nothing. Unequip drops that id from both lists. `CLEAR_TITLES` with `placement` wipes one side. Omit `placement` and it wipes both. The prefix and suffix strings live on the `title_` script. Crew, rank, and the word filter are the chat rows, not this op. Do not use a ShowTitle operation for this. Chat format is on [titles](../../titles.md) and [chat](../../chat.md).

Tasks: `operation_open_title_menu`, `operation_equip_title`, `operation_unequip_title`, `operation_clear_titles`. PAGE of `title_` rows. Unlock is Frontend BOOLEAN plus `SET_STAT`. Equip **appends** the script id onto `flag_saves.chat_prefix.prefixes` and/or `.suffixes` from catalog `placement:` (`PREFIX` / `SUFFIX` / `BOTH`). Duplicate id is a no-op. Unequip drops that id from both lists. `CLEAR_TITLES` with `placement:` wipes one side. Omit `placement` to wipe both.

Prefix and suffix strings live on the `title_` script. Chat format (crew, rank, word filter) is not this op. Do not use ShowTitle.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `OPEN_TITLE_MENU`, `EQUIP_TITLE`, `UNEQUIP_TITLE`, or `CLEAR_TITLES` |
| `title` | EQUIP / UNEQUIP | `title_*` script id |
| `placement` | CLEAR | `PREFIX` / `SUFFIX` / `BOTH`. Omit to wipe both lists |
| `menu` | OPEN | Override `menu_title_equip` |
| `target` | yes | Who. Overlay `ENTITY` |

`title_` data keys: `prefix`, `suffix`, `placement`, `unlock_stat`, `display_name`, `wiki`, `icon_material`, `icon_custommodeldata` (PAGE icon, harvest name_tag).

```yaml
operations:
    1:
        type: EQUIP_TITLE
        target: SELF
        title: title_example
```

```yaml
operations:
    1:
        type: OPEN_TITLE_MENU
        target: SELF
```

Smoke: `mechanic_example_title`. `/packtitle` opens the PAGE. Unlock two prefixes then both `self_equip` rows to stack.

Harvest: `PEfamilynames.dsc` (unlock flags, prefix text). Leave `/PEtitle` and hardcoded family lists out of Backend.
