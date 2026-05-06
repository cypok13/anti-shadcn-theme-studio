---
name: theme-studio mobile 375px audit 2026-05-06
description: Two systemic CRITICAL issues found blocking all API and States tabs on mobile
type: project
---

Audit of https://theme-studio-beta.vercel.app at 375px (2026-05-06).

**Why:** Mobile layout was never tested. DocPropsTable uses fixed-px grid columns that overflow on small screens.

**Key findings:**

1. DocPropsTable: `grid-cols-[140px_minmax(0,1.2fr)_100px_minmax(0,1.5fr)]` — fixed cols require 288px, only 235px available after padding chain (px-4 outer + p-8 section + p-6 panel + px-1.5 inner). Overflow=53px. Combined with `overflow-x-clip` on panel — content is clipped, not scrollable. Fix: responsive stacked card layout below `sm:` breakpoint.

2. Tab nav in ComponentSection: `flex gap-1` with no `overflow-x-auto` or `flex-wrap`. 5-tab components overflow 24–33px. Rightmost tab clipped. Fix: add `overflow-x-auto` to tablist div.

3. Do/Dont grid: `grid-cols-2` in all 11 docs files — no responsive breakpoint. Cards compress to 112px/80px text area. Fix: `sm:grid-cols-2` (1 col on mobile).

4. Header Customize button: slightly clipped at 375px (extends ~4px beyond pill).

**How to apply:** Before marking any mobile QA pass on theme-studio — verify these 4 issues are fixed first.
