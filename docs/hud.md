---
sidebar_position: 31
---

# HUD

**Live** for reload compile, cache assemble, persist layout, runtime overlays, and `requirements` plus presence ops.

Prefixes: `hud_` (layout of parts) and `hudpart_` (one piece). Player-facing configs live in Frontend. Glyph letters and pack font ids live in `hud_appearance`. Backend compiles pairing scraps on reload, concatenates them when the HUD is dirty, and paints the actionbar.

This is not a menu. Do not use `create_text_offset` (`=` / `_` / space / `!`). HUD spacing is Negative Space Font `<&translate[key=space.N]>` in the space font. GPS is a world marker, not a HUD part. Regen stays in `regenerate_all_target_stats`. The composer only reads getters.

Shake and bleed are mechanic VFX (`PLAY_EFFECT` `SCREEN_SHAKE` / `BLOODY_SCREEN`). They are not HUD kinds. Full-screen overlays (blind, freeze, HP bleed frames) are `GLYPH` letters plus `requirements` and `SHOW_HUD_PART`.

## Files

| Piece | Path |
| --- | --- |
| Prefix, kinds, runtime flags, defaults | [rules.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/rules.dsc) |
| Getters (fonts, bar glyph, currency pad, stat current/max) | [HUD/hud_utils.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/HUD/hud_utils.dsc) |
| Persist layout plus runtime overlays | [HUD/hud_runtime.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/HUD/hud_runtime.dsc) |
| Reload compiler (space, font, pairing scraps) | [HUD/hud_compile.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/HUD/hud_compile.dsc) |
| Cache assemble and actionbar send | [HUD/hud_composer.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/HUD/hud_composer.dsc) |
| Join initialize | [HUD/hud_world.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/HUD/hud_world.dsc) |
| Ops | [Mechanics/Individual_operations/hud_operation.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/hud_operation.dsc) |
| Draw after regen | [Loops/player_game_loop.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Loops/player_game_loop.dsc) |
| Pack catalog | `pirate-era-core-frontend/HUD/hud_appearance.dsc` |
| Smoke layouts and parts | `pirate-era-core-frontend/HUD/hud_examples.dsc` |
| Smoke ops | `pirate-era-core-frontend/Mechanics/mechanic_examples.dsc` `mechanic_example_hud` |

## How the pack and shaders work

PirateEraV4 HUD fonts:

| Namespace | Use |
| --- | --- |
| `pehud_fontpack` | Hotbar row (`pehud`, `pehud_hotbar_alphabet`) |
| `pehud_scaled_fontpack` | Shader-ascent HUD (hp, stam, haki, casting, effects) |
| `space` | Negative Space Font offsets (`space.N`) |

`rendertype_text.vsh` treats large negative ascent (about `-10000`, pack offset `10470`) as HUD text. It recenters and scales to `TARGET_SCALE 2` on a 1920x991 canvas. `rendertype_text.fsh` discards marker color `#8CFFFF`.

The vanilla actionbar is **centered**. A glyph drawn on the right must be balanced by the same width on the left, or later offsets slide. Pack uppercase letters are transparent (or `ascent: -32768`) counters. `Z` pads generated numbers so the width never jitters. The first hotbar glyph is the center anchor: `balance: RAW` so it does not add a left-side `A`.

Bar alphabet is empty-to-full `j` through `a`. Pack `hp_0.png` is `j`. `hp_9.png` is `a`.

Harvest: `DrawHUD.dsc` `add_hud_element` / `add_hud_text` / `space`, `HUDStats.dsc` bar and currency pad, `HUDcastinghandling.dsc` BOOLEAN glyphs.

## Compile and assemble

`compile_all_hud_layouts` runs from `reload_all_server_flags` after the prefix lists exist. It writes `utils.hud_compiled_cache`:

| Cache path | What it holds |
| --- | --- |
| `layouts.<hud_>.slots.<n>` | One compiled row per layout slot, in layout order |
| `parts.<hudpart_>` | The same part with an empty layout row. Tier-2 SHOW extras read this |

Each entry stores already-parsed scraps: offset spaces, font tags, active and pad tuples, bar steps, boolean on/off, and effect-strip letters. `<&co>` is the colon inside a font id. Hex color is applied after that parse. Do not `.parsed` the finished actionbar. A colon in `pehud_fontpack:pehud` inside one big `.parsed` is tag syntax.

`PAIR` (default) stores a left counter and a right visible. The counter is the uppercase twin, `off_glyph`, or `counter:` repeated. STAT and TEXT with no `counter` use same-font stars `*` and underscore pads (`add_hud_text`). Smoke STAT rows set `counter: Z`.

`RAW` stores an empty left scrap. Only the first hotbar letter uses it.

`advance_width` compiles a pure `space.N` pad when the part has no twin to copy. Leave it off when `off_glyph`, an uppercase twin, the empty bar letter, or pad `Z` already holds the width.

Runtime assemble (`compose_player_hud_title`) does not walk layout YAML. It concatenates cache scraps:

1. Left stack and right stack start empty.
2. Each base slot picks active or pad (requirements, `enabled: false`, YAML presence, runtime HIDE).
3. `RAW` appends the right scrap only. `PAIR` puts the new counter outside the left stack and the new visible outside the right stack.
4. SHOW overlays that are not already in the layout sort by `priority` ascending and append as `PAIR` on the outer edges.
5. Title is left stack plus right stack. No final `.parsed`.

A mid-layout slot that fails requirements must pad. Omitting it slides every later offset. `SHOW_HUD_PART` on the part omits when requirements fail. Use that only for a tier-2 extra or the last layout slot. `HIDE_HUD_PART` on the part draws the pad when requirements pass.

## Draw loop

Join stamps persist `flag_saves.hud_layout` onto runtime (`hud_engine_events`). Missing persist uses gamerules `hud.default`.

Every second, after regen: `draw_player_hud`.

1. Compose when `runtime_data.hud.dirty` is set, when `last_title` is missing, or while an EFFECT_STRIP timer is live.
2. Store the new title and clear dirty.
3. Always `actionbar` the cached `last_title`. Vanilla fades the bar if the packet stops. Resend it even when the string did not change.

Writers that stamp dirty: consumable change, `SET_STAT` overlay, currency change, SHOW, HIDE, CLEAR, and layout change.

Backend never names HP, stamina, haki, or casting. Those are pack `stat_*` / `currency_*` keys on `hudpart_` rows.

## Kinds

`kind` is a `hud_part_kinds` value. Unknown kind is GLYPH.

| Kind | Job |
| --- | --- |
| GLYPH | One pack letter. Off-state is `off_glyph` or uppercase |
| BAR | Consumable percent into `bar_alphabet`. Hidden draws the empty letter |
| STAT | Current / max / both from a `stat_*`. Pad to `maxchars` |
| TEXT | Transcript key or literal. Lowercase for custom fonts |
| CURRENCY | Wallet amount with `t` / `b` / `m` / `k` dividers, pad `Z` |
| BOOLEAN | `on_glyph` when the pack stat is on. Else `off_glyph` |
| EFFECT_STRIP | Fixed slot count. Unused slots still draw uppercase. `CHARS` is the icon row. `TIMES` is leftover overlay seconds |

`PLAY_EFFECT` `SCREEN_SHAKE` / `BLOODY_SCREEN` stay mechanic VFX. Do not add HUD kinds for them. Blind, freeze, and HP-bleed frames are `GLYPH` (or `BAR`) plus `requirements` and `SHOW_HUD_PART`.

## HUD layout (Frontend)

`type: data`. Script name starts with `hud_`. Keys sit under `data:`.

```yaml
hud_example_default:
    type: data
    debug: false
    data:
        id: example_default
        parts:
            1:
                part: hudpart_example_hotbar
                offset: 0
                balance: RAW
            2:
                part: hudpart_example_hp_bar
                offset: -280
```

| Key | Required | Notes |
| --- | --- | --- |
| `id` | no | Pack id. Engine keys off the script name |
| `parts` | yes | Numbered map (`1:`, `2:`). Order is compose order |

Each part row:

| Key | Required | Notes |
| --- | --- | --- |
| `part` | yes | `hudpart_*` script (prefix optional) |
| `offset` | no | Negative Space count. Overlay on the part's own `offset` |
| `balance` | no | `PAIR` (default) or `RAW` |
| `enabled` | no | `false` draws the off-state still, unless you meant HIDE. Prefer `HIDE_HUD_PART` |
| `requirements` | no | Same numbered map as mechanics. Overlay on the part. See [requirements](#requirements) |
| `operations` | no | Presence `SHOW_HUD_PART` or `HIDE_HUD_PART`. Overlay on the part |

## HUD part (Frontend)

`type: data`. Script name starts with `hudpart_`.

```yaml
hudpart_example_hp_bar:
    type: data
    debug: false
    data:
        kind: BAR
        font: hp
        stat: stat_player_maximum_health
```

| Key | Required | Notes |
| --- | --- | --- |
| `kind` | no | Default GLYPH |
| `font` | for glyph kinds | Catalog key in `hud_appearance.fonts`, or a full `namespace:file` id |
| `glyph` / `on_glyph` / `off_glyph` | GLYPH / BOOLEAN | Pack `chars` letters. Do not invent a letter |
| `stat` | BAR / STAT / BOOLEAN | Pack `stat_*`. Consumable current vs max is automatic |
| `view` | STAT | `CURRENT` / `MAX` / `BOTH` (default) |
| `currency` | CURRENCY | Pack `currency_*` |
| `text` | TEXT | Transcript key or literal |
| `maxchars` / `pad` / `counter` | STAT / TEXT / CURRENCY | Width lock. Smoke uses `Z` |
| `color` | STAT / TEXT | Quote YAML that contains `#` |
| `bar_alphabet` | BAR | Overlay on `hud_appearance.bar_alphabet` |
| `slots` | EFFECT_STRIP | Numbered map. Each slot may set `stat` plus on/off glyphs |
| `strip_mode` | EFFECT_STRIP | `CHARS` or `TIMES` |
| `step` | EFFECT_STRIP TIMES | Space between leftover-time cells. Default `11` |
| `requirements` | no | Same numbered map as mechanics |
| `operations` | no | Presence `SHOW_HUD_PART` (omit when unmet) or `HIDE_HUD_PART` (pad when met) |
| `offset` | no | Default space count when the layout row omits it |
| `balance` | no | Default PAIR. Tier-2 extras stay PAIR so they do not shove the base bar |
| `advance_width` | no | Pixel pad when no twin glyph exists. Omit it when `off_glyph`, uppercase, the empty bar letter, or `Z` already matches the width |
| `priority` | no | Tier-2 draw order. Higher is concatenated later and paints on top. Default `0` |

Party, quest, and haki parts are pack YAML. Add a `hudpart_` when those engines exist. Do not hardcode them in Backend.

## requirements

Same numbered `requirements:` map as mechanics and triggerables. Empty always passes. `check_mechanic_requirements` runs them against the HUD player. Types are `mechanic_requirement_types`. See [mechanics/requirements.md](mechanics/requirements.md).

`operations:` on the part is presence only. The composer does not fire the mechanic dispatcher each draw.

| Op on the part | Requirements pass | Requirements fail |
| --- | --- | --- |
| none | Draw on-state | Draw pad. Slot stays. Use this in the middle of a layout |
| `SHOW_HUD_PART` | Draw on-state | Omit the part. Last slot or tier-2 extra only |
| `HIDE_HUD_PART` | Draw pad. Slot stays | Draw on-state |

Runtime overlays live on `runtime_data.hud.overlays` (mode `SHOW` or `HIDE`, plus `priority` copied from the part). `SET_HUD_LAYOUT` parent-wipes `runtime_data.hud`, so overlays clear with the layout. Leftover `shown` / `hidden` flags from before that key still paint until they expire or the next SHOW, HIDE, or CLEAR.

Mechanic `SHOW_HUD_PART` on a part already in the layout forces that slot active. The same op on a part that is not in the layout appends it after the base slots, sorted by `priority`. Mechanic `HIDE_HUD_PART` forces the layout slot to pad.

```yaml
hudpart_example_haki_bar:
    type: data
    debug: false
    data:
        kind: BAR
        font: haki
        stat: stat_stamina
        requirements:
            1:
                type: BOOLEAN
                stat: stat_example_hud_gate
                mode: HAS
```

```yaml
hudpart_example_overlay:
    type: data
    debug: false
    data:
        kind: GLYPH
        font: scaled
        glyph: r
        off_glyph: R
        priority: 20
        requirements:
            1:
                type: BOOLEAN
                stat: stat_example_blind
                mode: HAS
        operations:
            1:
                type: SHOW_HUD_PART
```

Hide a layout bar while blinded (slot stays):

```yaml
requirements:
    1:
        type: BOOLEAN
        stat: stat_example_blind
        mode: HAS
operations:
    1:
        type: HIDE_HUD_PART
```

Low-HP overlay. `HEALTH` is current HP from the living-entity route:

```yaml
requirements:
    1:
        type: HEALTH
        max: 10
operations:
    1:
        type: SHOW_HUD_PART
```

Do not add a Backend `stat_blinded` engine. Pack BOOLEAN plus `SET_STAT` is the gate.

## hud_appearance

Same consult-first pairing as `gui_appearance`. Backend reads this script (`global_hud_appearance`). Change letters and font ids here, not in Backend.

| Key | Notes |
| --- | --- |
| `fonts` | Catalog name to pack id. Quote it (`hp: "pehud_scaled_fontpack:pehud_hp"`). Unquoted colon is a nested YAML map |
| `space_font` | Default `space:default` |
| `bar_alphabet` | Empty-to-full list or `j\|i\|...\|a` |
| `pad_char` | Default `Z` |
| `currency_pad` | Character width for belly text. Default `6` |
| `currency_dividers` | Amount plus suffix (`t` / `b` / `m` / `k`) |

## Ops

Entity overlay (default SELF), same as `OPEN_MENU`. Full tables: [mechanics/operations.md](mechanics/operations.md).

| Op | Job |
| --- | --- |
| `SHOW_HUD_PART` | Stamp `runtime_data.hud.overlays` mode SHOW (duration or `session: true`). In-layout slots force on. Other parts append by priority |
| `HIDE_HUD_PART` | Stamp mode HIDE. The layout slot draws its pad so offsets hold |
| `CLEAR_HUD_PARTS` | Drop overlay rows. Optional filter is a part id or kind. Also clears leftover shown and hidden keys |
| `SET_HUD_LAYOUT` | Persist `hud_` id. Parent-wipe `runtime_data.hud` so old overlays cannot shift the new stack |

Duration and session match SET_STAT overlays. Duration stamps expire. `session: true` with no duration lasts until HIDE, CLEAR, or SET_HUD_LAYOUT. Omitting both uses `hud_runtime_flag_expire` (`1h`).

## Smoke

```text
/ex run set_player_hud_layout def.target:<player> def.layout_script:hud_example_default
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_hud].data_key[data].get[set_default]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_hud].data_key[data].get[show_stunned]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_hud].data_key[data].get[show_shake]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_hud].data_key[data].get[show_bleed]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_hud].data_key[data].get[show_blindness]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_hud].data_key[data].get[unlock_gate]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_hud].data_key[data].get[lock_gate]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_hud].data_key[data].get[hide_hp_bar]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_hud].data_key[data].get[clear_overlays]>
/ex run run_mechanic_test def.mechanic_config:<script[mechanic_example_hud].data_key[data].get[set_minimal]>
```

## What can go wrong

- Naming the script without `hud_` / `hudpart_`. Reload will not list it
- Writing `parts` as a YAML list of maps. Use `1:`, `2:`
- Skipping a mid-layout part when it is off. Draw the uppercase twin, empty bar, or pad `Z`. Use `SHOW_HUD_PART` omit only on a tier-2 extra or the last slot
- Pairing the first hotbar `a`. That adds a left `A` and shifts the whole bar. Use `balance: RAW`
- Setting `balance: RAW` on a tier-2 overlay. The right glyph then has no left counter and the base bar slides. Leave overlay parts on PAIR
- Setting `advance_width` when a twin already exists. The twin is the pad. `advance_width` is only the fallback space pad
- Rebuilding font tags inside `draw_player_hud`. That work belongs in `compile_all_hud_layouts`
- Skipping `actionbar` when `last_title` did not change. The vanilla bar fades. Resend the cached string every second
- Using menu `create_text_offset` for HUD. Spacing is `space.N`
- Hardcoding pack letters or `pehud_*` ids in Backend. Change them in `hud_appearance`
- Running `.parsed` on the finished actionbar. Pack ids contain `:`. Parse each pairing scrap. Encode the colon as `<&co>`
- Pointing a BAR at a non-consumable stat. Current and max then match
- Unquoted `color: <&color[#992929]>`. `#` starts a YAML comment. Quote it
- Treating GPS as SHOW_HUD_PART. Use START_GPS
- Using SHOW_HUD_PART for shake or bleed. Those are PLAY_EFFECT `SCREEN_SHAKE` / `BLOODY_SCREEN`
- Adding a Backend `stat_blinded` kind. Gate a GLYPH with pack BOOLEAN plus `requirements` and `SHOW_HUD_PART`
- Regenerating HP inside the composer. Regen already ran in the player loop
- Inventing a glyph that is not in that font's `chars`
