---
sidebar_position: 23
---

# /hidecosmetics and /packcosmetic

Two cosmetic commands, one file. Hide is for the owner. The pack command is the staff index.

Script: [Mechanics/Individual_operations/cosmetic_command.dsc](https://github.com/Pirate-Era-Network/mc-denizen-core-backend/blob/main/Mechanics/Individual_operations/cosmetic_command.dsc).

Option catalog: [cosmetics](../cosmetics.md).

## /hidecosmetics

Hides or shows your equipped cosmetic displays on your client only. Other players still see them. Any player can run it. Real armor overlays are not affected.

```text
/hidecosmetics
```

Aliases: `/packcosmetics`, `/pehidecosmetics`, `/petogglecosmetics`, `/PEtogglecosmetics`.

The toggle flips `cosmetic` shown, then remounts passengers. Run it again to show them.

## /packcosmetic

Lists or clears tracked cosmetic displays. Ops and the console can run it.

Displays live on `cosmetic_index`. Start and reload wipe them, then join respawns persist rows from equipped ids.

```text
/packcosmetic
/packcosmetic list
/packcosmetic prune
/packcosmetic clear
```

| Action | What it does |
| --- | --- |
| `list` | Player opens `menu_cosmetic_list`. Console narrates the same rows. |
| `prune` | Drop leftover session rows. Live displays stay. |
| `clear` | Remove every tracked display. |

## What can go wrong

- Expecting `/hidecosmetics` to hide the cloak from other players. Only your client hides it.
- Expecting `/packcosmetic` to unequip the saved cosmetic id. It clears displays. The equipped id is a separate flag.
