---
sidebar_position: 23
---

# BAN_CATEGORY

`BAN_CATEGORY` writes a timed flag under `flag_saves.banned_categories`. `category` is one string, or `categories` is a list. `RUN_SKILLMOVE` and `RUN_ITEMSKILL` read that flag in their envelope and no-op when the skill's category is banned. `duration` is the flag expire.

Task: `operation_ban_category`. Timed flags under `flag_saves.banned_categories`.

| Key | Required | Notes |
| --- | --- | --- |
| `type` | yes | `BAN_CATEGORY` |
| `category` | no | One string (`mobility`) |
| `categories` | no | List of strings |
| `duration` | no | Flag expire |
| `target` | no | Who. Overlay `ENTITY` |
