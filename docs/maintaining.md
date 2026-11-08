---
sidebar_position: 35
---

# Keeping this wiki honest

Update `docs/` in the **same change** as the engine or `rules.dsc`. This folder is the option list. The architecture plan is the roadmap. Do not let them drift.

## When you add something

| You changed | Update |
| --- | --- |
| A key in `rules.dsc` | the category page under [rules](rules/README.md), and the domain page that uses that key |
| A new script prefix | [framework.md](framework.md) prefix table and [content-contracts.md](content-contracts.md) if there is no engine yet |
| A `flag_saves` path | [flags.md](flags.md) plus getters/setters note |
| Mechanic targeting | [mechanics/targeting.md](mechanics/targeting.md) |
| A new effect-operation | that operation's page under [operations](mechanics/operations/README.md) |
| Mechanic config shape (delay, repeat, requirements) | [mechanics/README.md](mechanics/README.md) |
| Menu config / prefix | [menus](menus/README.md) |
| HUD layout / part / prefix | [HUD](hud/README.md) |
| Daily reset prefix / clocks | [resets.md](resets.md) |
| Chat prefix rows / word filter | [chat.md](chat.md) |
| A stat / currency / item / living-entity key | that domain page |
| Status Live / Partial / Contract / Stub | the page header and [README.md](README.md) if a new page is needed |

## Page rules

Write each page for the job it has, in full sentences a reader can learn from without the chat that produced it. A shared outline pasted onto every page is a low standard. An index, an operation, and a rules category do not open the same way.

Match the page:

- A section index tells the reader how the child pages differ and links them. It carries a limit only when that limit belongs to the whole section.
- An author config page says when to write that script, which keys are specific to it, and shows one example that uses those keys. Shared keys stay on the parent, with a link.
- A kind or operation page explains that kind or that operation. A fact about one operation stays on that operation's page.
- A rules category is a locator. The paragraph above the table says which keys were grouped there and which domain page explains what they do. A new `rules.data` key is documented on that category page.
- A lifecycle page follows what happens, because the order is the content.
- A page that is a table explains how to read the table and the misread that table causes.

Leave out a section that would only exist to match another page. Do not stack definitions. State the fact the reader needs, with the reason when the reason changes what they write. Define a term on the page where it is first needed. If the explanation already lives on another page, link it.

- Mark unimplemented keys as Contract or Partial. Never imply they run.
- Use `rules.dsc` names (`SELF`, `stat_`, `data.consumed_stats`). Do not invent aliases.
- No em dashes or semicolons.
- Point at Backend files and Frontend examples by path. Keep those pointers off the first paragraph of a page a pack author uses to write YAML. `/ex` smoke blocks stay off those writer pages. Name the Frontend example file once, in a sentence.

## Hosting later

These files are already wiki pages: one topic per file, relative links, a README index. A GitHub wiki or static site can publish `docs/` as-is.
