# Docs Publishing Policy

This document defines what gets committed to the public repository.

## What is public

Everything in `docs/` is public **except** the files listed under "What is private" below.
The goal is transparency: this project is built in public.

| Path | Purpose |
|------|---------|
| `docs/build-log.md` | Development diary — source for case study on notjustsasha.com |
| `docs/research/` | UX research, competitive audit, market analysis |
| `docs/adr/` | Architecture Decision Records |
| `docs/PLAN.md` | Research sprint plan and status |
| `docs/product-spec.md` | Product decisions and feature list |
| `docs/component-spec.md` | Component design specifications |
| `docs/day-11-usability-findings.md` | AI persona usability testing results |
| `docs/day4-demo/`, `docs/day5-demo/` | Prototype code from research sprint |

## What is private (gitignored)

| Path | Reason |
|------|--------|
| `docs/README.md` | Internal Obsidian note — project tracking, wiki links, internal status |
| `docs/sessions/` | Internal session logs — Obsidian artifacts with workflow details |

## Rule

If a file in `docs/` has YAML frontmatter with `tags:` or `type:` fields, or contains
Obsidian wiki links (`[[...]]`), it is an internal Obsidian note and must NOT be committed.

Add it to `.gitignore` before the first commit.
