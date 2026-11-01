---
sidebar_position: 19
---

# Language

**Live.** Transcript scripts use prefix `general_transcript_`. Example: `pirate-era-core-frontend/language/english_transcript.dsc`. Add `general_transcript_spanish` (same keys) for a second language. Missing keys fall back to `registry_gamerules.language.default`.

```yaml
general_transcript_english:
    type: data
    data:
        stats_checking_text: Stats<&co>
        language_changed: You changed your language to <proc[get_targets_current_language].context_map[<map[target=<player>]>]>
        gps_menu_header: gps arrows
```

Player language flag: `flag_saves.activelanguage` → `runtime_data.language`. Missing flag uses `registry_gamerules.language.default` (`english` on Pirate Era). Get/set: `get_targets_current_language` / `set_targets_current_language`. Look up a line with `get_target_transcript_key`. That proc returns **raw** YAML. Call `.parsed` on the queue that has the defs (`<[amount]>`, `<[owner_name]>`). Do not parse inside the getter.

`/language` cycles registered transcript languages, restamps inventory Item Configs, and reloads an open engine menu.

Formats come from `global_format_config` / Frontend `formats/`.

## Simple pack rule

YAML `displayname`, `lore`, `header_text`, `dialogue`, `npc_name`, scroll `title` / `sub_title`, and quest box copy may be a **snake_case key** or a literal.

- `displayname: item_my_wand_name` looks up that key for the viewing player
- `displayname: <&a>Skill Wand` stays literal (spaces, color tags, caps)
- Overlay `header_text` values stay lowercase (custom fonts). Keys are already lowercase

Menus resolve at open for that player. Inventory lore is NBT, so `/language` rebuilds stamped items. Generated admin list lore (GPS, projectiles) is built at menu open. Reopen `/packgps list` after a language change if that menu was already open.

`NARRATE` can use `transcript: pay_sent_text` instead of hardcoding `text:`. `text:` remains the fallback.

## What can go wrong

- Key missing in the player's language. Fallback is the default transcript, then the raw YAML if that key is also missing
- Hardcoding English in Backend. Put player-facing chat, menu overlay, and lore in the transcript
- Parsing transcript strings inside `get_target_transcript_key`. The getter queue does not have pay or list defs
