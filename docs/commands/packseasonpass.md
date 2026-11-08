---
sidebar_position: 17
---

# /packseasonpass

Opens the season pass, or edits a player's progress. `open` and `scroll` are any player. `xp`, `track`, `redeem`, and `wipe` are op. Console can run the edit actions when a player is named. Opening the menu needs a player.

## System

The active season is the Frontend `seasonpass_` script whose date window contains now. XP, track, and redeem call the same tasks as `GRANT_SEASON_XP`, `SET_SEASON_TRACK`, and `REDEEM_SEASON_REWARD`.

| Piece | Where |
| --- | --- |
| Command | [SeasonPass/season_pass_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/SeasonPass/season_pass_command.dsc) |
| Menu | [SeasonPass/season_pass_menu.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/SeasonPass/season_pass_menu.dsc) |
| Option catalog | [season pass](../season-pass.md) |

## Use

```text
/packseasonpass
/packseasonpass open
/packseasonpass scroll
/packseasonpass xp (amount) (player)
/packseasonpass track <paid|free> (player)
/packseasonpass redeem (player)
/packseasonpass wipe (player)
```

| Action | What it does |
| --- | --- |
| `open` | Open the PAGE track. `list` is the same. |
| `scroll` | Open the SCROLL track. |
| `xp` | Add XP to the active season. Amount defaults to `seasonpass_defaults.amount`. A player name can sit in the amount slot when you want the default amount on someone else. |
| `track` | Set the pass type to the track name you pass (`paid` or `free`). |
| `redeem` | Claim every reward the player has unlocked and not yet taken. |
| `wipe` | Clear that player's progress for the active season. |

An expired or missing season refuses `xp`, `track`, `redeem`, and `wipe`.

## What can go wrong

- Editing progress while no season date window is active.
- A normal player running `xp` or `wipe`. Those actions stop with no message when the sender is not op.
