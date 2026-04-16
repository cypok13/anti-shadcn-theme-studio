# Docs Publishing Policy

Defines what is allowed in this public repository.

## What belongs here

| Path | Purpose |
|------|---------|
| `src/` | Application source code |
| `docs/PUBLISHING.md` | This policy document |
| Root config files | `package.json`, `tsconfig.json`, `next.config.ts`, etc. |

## What does NOT belong here

- Internal build logs, development diaries, session notes
- Planning documents, sprint plans, research notes
- Any file containing internal project identifiers (Linear tickets, branch names)
- Any file written in Russian or other non-English languages
- Obsidian notes (files with YAML frontmatter `tags:` / `type:` or `[[wiki links]]`)

## Rule for contributors

All documentation committed to this repository must be:
1. Written in English
2. Relevant to end users or contributors of the project
3. Free of internal project management references

If a doc is internal (planning, research, personal notes) — keep it out of this repo.
