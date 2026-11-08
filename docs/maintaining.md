---
sidebar_position: 35
---

# Keeping this wiki honest

Update `docs/` in the **same change** as the engine or `rules.dsc`. This folder is the option list. The architecture plan is the roadmap. Do not let them drift.

## When you add something

| You changed | Update |
| --- | --- |
| A key in `rules.dsc` | [rules.md](rules.md) and the page that uses that key |
| A new script prefix | [framework.md](framework.md) prefix table and [content-contracts.md](content-contracts.md) if there is no engine yet |
| A `flag_saves` path | [flags.md](flags.md) plus getters/setters note |
| Mechanic targeting | [mechanics/targeting.md](mechanics/targeting.md) |
| A new effect-operation | [mechanics/operations.md](mechanics/operations.md) |
| Mechanic config shape (delay, repeat, requirements) | [mechanics/README.md](mechanics/README.md) |
| Menu config / prefix | [menus.md](menus.md) |
| HUD layout / part / prefix | [HUD](hud/README.md) |
| Daily reset prefix / clocks | [resets.md](resets.md) |
| Chat prefix rows / word filter | [chat.md](chat.md) |
| A stat / currency / item / living-entity key | that domain page |
| Status Live / Partial / Contract / Stub | the page header and [README.md](README.md) if a new page is needed |

## Page rules

- Say what it is, how to write the Frontend config, and what fails.
- Mark unimplemented keys as Contract or Partial. Never imply they run.
- Use `rules.dsc` names (`SELF`, `stat_`, `data.consumed_stats`). Do not invent aliases.
- No em dashes or semicolons. Short sentences.
- Point at Backend files and Frontend examples by path.

## Hosting later

These files are already wiki pages: one topic per file, relative links, a README index. A GitHub wiki or static site can publish `docs/` as-is.
