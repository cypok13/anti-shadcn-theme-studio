# Component Pipeline — theme-studio

> Every UI component goes through this pipeline. No exceptions.
> "Done" = all gates passed. Skipping a gate = not Done.

---

## The Problem We Solved

Previous approach: grab what's visible in reference → implement → ship.
Result: missing states, hardcoded values, wrong interaction zones, static components.

New approach: **Research (internet + specs) → SPEC → implement → automated gates → visual gate.**

Key insight from Session A retrospective: the pipeline must be autonomous — Claude fixes all gate failures before presenting results to CEO. A "tests pass" status that hasn't been verified with a live browser is not a valid status.

---

## Pipeline Steps

### 0. Ticket + Branch
- Linear ticket created
- Branch: `ale-NNN/theme-studio-[component-name]`
- Scope: 1 component per session

---

### 0.5. RESEARCH PHASE (mandatory, before spec)

**Launch researcher subagent** before writing a single line of spec or code.

```
Agent(subagent_type="researcher", prompt="""
Research best practices for [ComponentName] component:

1. ARIA APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/[pattern-name]/
   - Required keyboard interactions
   - Required ARIA roles/attributes/states
   
2. Radix UI primitive: https://www.radix-ui.com/primitives/docs/components/[name]
   - Keyboard behavior
   - Data attributes for state

3. shadcn/ui docs: https://ui.shadcn.com/docs/components/[name]
   - Variants available
   - Known edge cases

4. Search GitHub for: "[ComponentName] accessibility implementation site:github.com"
   - Find 2-3 real implementations in production component libraries
   - Extract: keyboard handlers, ARIA attributes, token patterns

5. Common bugs for this component type (search: "[ComponentName] accessibility bug OR common mistake")

6. **Industry variant parity check** — compare against 4+ of these design systems:
   - Material Design 3 (Google)
   - Carbon Design System (IBM)
   - Spectrum (Adobe)
   - Fluent Design 2 (Microsoft)
   - Atlassian Design System
   - shadcn/ui

   For each system find: what props, slots, and visual variants does their [ComponentName] expose?
   Return a gap table: feature | how many DS have it | we have it?
   Flag anything present in 3+ systems as REQUIRED for spec.

Return: variant matrix, state matrix, required keyboard interactions, required ARIA, 
3 most common implementation bugs, industry gap table.

Also return: **component-specific Playwright assertions** — the exact DOM properties or
computed values to check in Playwright tests. These are unique to this component's behavior.
Examples of what to include:
- Overlay/modal: scrollHeight > clientHeight for scrollable variants; focus trap assertion
- Interactive disclosure: aria-expanded before/after click; Portal content visible
- Exclusive selection: aria-checked="false" on previously selected item after new selection
- Touch targets: getBoundingClientRect().height >= 44 for small controls
- Animation: computed opacity/transform after state change (catches missing CSS packages)
DO NOT include: cursor:pointer, no-hex-color, axe-core — these are universal gates already.
""")
```

**Researcher output is the input to the SPEC.** Do not write the spec until researcher returns.

**ARIA APG quick reference by component:**

| Component | APG URL |
|-----------|---------|
| Button | https://www.w3.org/WAI/ARIA/apg/patterns/button/ |
| Checkbox | https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/ |
| Radio Group | https://www.w3.org/WAI/ARIA/apg/patterns/radio/ |
| Switch | https://www.w3.org/WAI/ARIA/apg/patterns/switch/ |
| Tabs | https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ |
| Select/Combobox | https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ |
| Date Picker | https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/ |
| Dialog | https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ |
| Accordion | https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ |
| Tooltip | https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/ |
| Slider | https://www.w3.org/WAI/ARIA/apg/patterns/slider/ |

---

### 1. SPEC (mandatory artifact, written after research)

Create `docs/specs/[component-name]-spec.md` from template.
Fill from researcher output + APG + Radix docs:
- All variants (no "etc.")
- All states (hover, focus, active, disabled, error, loading if applicable)
- Interaction zones (full-row click zone for checkbox/radio/switch)
- Keyboard interactions per APG
- Token mapping (every CSS property → var(--token))
- ARIA requirements (role, aria-checked/expanded/selected, aria-label, aria-disabled)
- Test plan written BEFORE implementation — each item in `Given / When / Then` format with the exact DOM property or computed value to assert (see template § "Test Plan")

**Gate:** Spec file exists and complete before any .tsx is written.

> **Test Plan format rule:** вместо `- [ ] dropdown closes` писать:
> `- [ ] Given dropdown is open, When user clicks item B, Then [role="listbox"] not visible + trigger text = "B" + item B aria-selected="true"`
> Это и есть скрипт для qa-engineer субагента — без него тест написать невозможно.

---

### 2. IMPLEMENT

> **MANDATORY DELEGATION RULE (enforced via hook since 2026-04-24):**
> The orchestrator MUST NOT implement components directly.
> Direct implementation produces hallucinated values: non-standard px, invented spacing,
> visual decisions without design reference (incident: h-3.5=14px in a 16px box, Select 30 iterations).
>
> **Enforcement:** PreToolUse hook `theme-studio-delegation-guard.sh` blocks `Edit|Write`
> on `src/components/ui/*.tsx` unless the `designer` subagent has touched
> `apps/theme-studio/.claude/designer-active` within the last 15 minutes.
> Bypass: branch `hotfix/*` for genuine emergencies only.
>
> **Implementation → `designer` subagent** (Design System specialist, token-aware):
> ```
> Agent(subagent_type="designer", prompt="""
> Implement [ComponentName] component for theme-studio.
>
> FIRST ACTION (mandatory): run `mkdir -p apps/theme-studio/.claude && touch apps/theme-studio/.claude/designer-active`
> This marks the designer session active so the delegation guard hook permits edits.
>
> Spec: docs/specs/[name]-spec.md — read it entirely before writing any code.
> Pipeline rules: docs/COMPONENT-PIPELINE.md § 2 — mandatory.
> Design system tokens: src/app/globals.css
>
> Deliverables:
> 1. src/components/ui/[name].tsx — the component
> 2. Update src/components/preview/ComponentGallery.tsx — replace any existing
>    [Name]Demo with one that renders EVERY state from the spec § "Demo States" table.
>    Each state must have a label string so CEO can identify it visually.
>
> Rules (non-negotiable):
> - All colors via var(--token) — no hsl() literals, no hex
> - All spacing on 4px scale (--space-0…--space-12) — no arbitrary px
> - Icons inside 16px indicator: h-3 w-3 (--icon-indicator) — never h-3.5 or h-4
> - No new npm dependencies without explicit CEO approval
> - Read Error Log E-001–E-010 in COMPONENT-PIPELINE.md before implementing
> """)
> ```
>
> **Visual validation (after implementation) → two steps:**
> 1. `/audit` skill — technical: token compliance, a11y, theming hardcoded values
> 2. `ux-reviewer` subagent — visual quality via Playwright: proportions, states, dark mode
>
> **Acceptance criteria verification → `qa-engineer` subagent**
> (runs `npm run test:components` + verifies spec Done When checklist)

---

### HITL — Layout Composition Gate (БЛОКИРУЕТ реализацию)

**Trigger:** любой demo-блок с табличным или grid-контентом, несколькими колонками, или элементами
с фиксированной шириной (кнопки, теги, таблицы).

**Правило:** перед реализацией composer ДОЛЖЕН:
1. Оценить, поместится ли контент в `max-w-3xl` (768px) без горизонтального скролла
2. Если есть риск — остановиться и предложить CEO **3 варианта** композиции:
   - вариант A (убрать столбцы/уменьшить)
   - вариант B (компактные элементы)
   - вариант C (сменить layout: flex-wrap, стек, etc.)
3. Дождаться явного подтверждения CEO перед тем как писать код

**Не делать:** молча добавлять `overflow-x-auto` и считать задачу решённой — это маскирует проблему.

Инцидент: ButtonSizesGrid — 5 колонок радиусов → горизонтальный скролл. Правильное решение: убрать ось радиусов и показывать только размеры.

---

Rules (non-negotiable — see Error Log below for why each exists):

**Element semantics:**
- `<button>` for all clickable controls — never `<div onClick>`
- `<label>` wraps full checkbox/radio/switch row — click zone = entire row
- `role="switch"` + `aria-checked` for toggle switches (not `role="button"`)
- `<input>` always has `id` + matching `<label htmlFor>` — no orphan inputs

**Spacing tokens (added 2026-04-17):**
- ALL spacing must land on the 4px scale: 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 48, 64, 80px
- Token names: `--space-0` through `--space-12` (defined in globals.css)
- Tailwind equivalent classes are acceptable: `gap-2`=8px, `p-3`=12px, `p-4`=16px etc.
- FORBIDDEN: arbitrary px values like `p-[10px]`, `p-[13px]`, `h-3.5` (14px is NOT on scale)
- Icon sizes inside indicators: use `--icon-indicator` (12px = `h-3`) for 16px containers
- FORBIDDEN: sizing an icon to match its container (0px visual gap looks broken)

**CSS tokens:**
- All colors via `var(--token)` — never hardcoded hex, rgb(), or hsl() with literal values
- Never `bg-white`, `bg-black`, `text-gray-500` etc. — use `bg-[hsl(var(--primary-foreground))]`
- Never Tailwind color utilities (green-100, yellow-800) for semantic states — add `--success`/`--warning` tokens
- SVG stroke/fill: use `stroke="currentColor"` + set `className="text-[hsl(var(--token))]"` on the `<svg>` — never `stroke="hsl(var(...))"` as an SVG attribute (Safari doesn't resolve CSS vars in SVG presentation attributes)

**Cursor / pointer events:**
- Interactive elements: `cursor-pointer` mandatory
- Disabled buttons: `cursor-not-allowed` + `disabled` HTML attribute — NO `pointer-events-none` (it defeats cursor rendering)
- Non-interactive decorative elements: `cursor-default select-none`

**Focus:**
- Never `outline-none` without a `focus-visible:ring-*` replacement
- `focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2`

**Tailwind v4 syntax:**
- CSS var opacity: `hsl(var(--token) / 0.5)` — space before `/` required, e.g. `bg-[hsl(var(--muted)/0.1)]` works but `hsl(var(--token)/0.5)` (no space) is Safari <15 risk

---

### 3. LINT GATE (automated, blocking)

```bash
npm run lint:ui
```

Checks `src/components/ui/**/*.tsx` for hardcoded hex/color values.
**Blocks commit if fails.**

---

### 4. PLAYWRIGHT GATE (automated, blocking)

```bash
npm run test:components
```

Playwright starts the dev server automatically via `webServer` in `playwright.config.ts` (port 3005). If a dev server is already running on 3005 it is reused.

**Universal gates (Gates 0–7, `component-qa.spec.ts`):**

| Gate | What it catches |
|------|-----------------|
| Gate 0: Runtime integrity | JS errors, React hydration failures, `<div>` inside `<button>` |
| Gate 1: CSS & ARIA form | cursor, user-select, disabled cursor, no inline hex, axe-core critical |
| Gate 2: Interaction smoke | Real state changes on click across all components |
| Gate 3: Keyboard | Tab reaches semantic interactive elements |
| Gate 4–6: Component-specific | Badge, Separator, Tabs deep assertions |
| Gate 7: Overlay positioning | Select/Popover/Tooltip appear near trigger, not at (0,0) |

**БЛОКИРУЮЩЕЕ ПРАВИЛО — Spec-Driven Tests:**

> Каждый `- [ ]` в разделе `## Test Plan` спецификации компонента ДОЛЖЕН иметь
> соответствующий `test()` в `component-qa.spec.ts`. Без этого компонент не Done.

**Процесс для нового компонента (делегировать `qa-engineer` субагенту):**
```
Agent(subagent_type="qa-engineer", prompt="""
Read docs/specs/[name]-spec.md § "Test Plan".
For every unchecked item (- [ ]) write a Playwright test in tests/component-qa.spec.ts.
Add as test.describe('Gate N — [ComponentName] Scenarios', ...).
Each test must have: Given (precondition), When (action), Then (DOM/computed assertion).
Run: npx playwright test --grep "[ComponentName]"
Fix all failures before returning.
Report: N tests added, all passing.
""")
```

**If any gate fails:** fix the underlying component before coming to CEO. Pipeline is autonomous.

**Critical rule:** passing tests ≠ working UI unless you've verified with a real browser. Gate 0 catches hydration failures that prevent JS from attaching — always run tests against live dev server, never static build.

**Blocks merge if fails.**

---

### 5. VISUAL GATE (mandatory — two sub-steps, in order)

**Blocks merge if either sub-step fails or is skipped.**

#### 5a. ux-reviewer субагент (automated visual QA — mandatory first)

```
Agent(subagent_type="ux-reviewer", prompt="""
Visual QA for [ComponentName] at http://localhost:3005/preview?tab=components.

Required checks:
1. Screenshot the [ComponentName] section — confirm ALL demo states from
   docs/specs/[name]-spec.md § "Demo States" are visible and labelled.
2. Visual proportions:
   - Icon/indicator breathing room: icon must NOT touch container edges
   - Gap between control and label text: visually comfortable
   - Border radius consistent with design system
3. State rendering:
   - Unchecked/off: border visible, background transparent
   - Checked/on: primary background, icon clearly visible
   - Disabled: opacity-50, cursor-not-allowed on hover
   - Focus-visible: ring visible on Tab
4. **[EXCLUSIVE-SELECTION components — RadioGroup, Tabs, any mutual-exclusion pattern]**
   Mutual exclusivity transition test (MANDATORY — static screenshot is NOT sufficient):
   - Click item A → assert item A selected
   - Click item B → assert item B `aria-checked/aria-selected="true"` AND item A `aria-checked/aria-selected="false"`
   - A visual snapshot of "B selected" CANNOT confirm A deselected. Must check both.
5. WCAG contrast: text on background ≥ 4.5:1; icon on filled background ≥ 3:1
6. Dark mode: navigate to `/preview?tab=components&mode=dark` (NOT `classList.add('dark')` or `data-theme` — this app uses URL-based dark mode via `?mode=dark` query param, which triggers `resolveCSS(preset, 'dark')` server-side). Screenshot the same component section. Verify token colors visibly differ from light mode (darker backgrounds, lighter text).

Output format:
- PASS or FAIL per check above
- Annotated screenshot paths
- FAIL on any check = merge is blocked
""")
```

`ux-reviewer` output is the sole input to CEO review. CEO does NOT re-verify from scratch — only reviews the ux-reviewer report and screenshots.

#### 5b. CEO explicit approval (after ux-reviewer PASS)

CEO visual checklist:
- [ ] Hover state visible (cursor changes, bg changes)
- [ ] Focus ring visible on Tab
- [ ] All states render correctly (use demo that shows every state)
- [ ] Dark mode renders correctly (verified via `/preview?tab=components&mode=dark`, NOT CSS class toggle)
- [ ] No text selection on interactive elements
- [ ] Disabled state: cursor-not-allowed + reduced opacity

**GATE:** Ticket moves to Done ONLY after CEO says "апрув" or equivalent explicit confirmation.

---

### 6. DOCUMENTATION SYNC (mandatory, before merge)

Runs AFTER Visual Gate approval, BEFORE `git merge → main`.

**Commands:**
```bash
npm run docs:sync        # регенерирует TOKEN-INDEX.md и COMPONENT-INDEX.md
npm run docs:validate    # exit 1 если есть нарушения — фиксить до merge
```

**Manual checklist:**
- [ ] `docs/specs/[name]-spec.md` — `Spec complete: YES` проставлен
- [ ] `docs/IMPLEMENTATION-TRACKER.md` — строка компонента обновлена: `❌ → ✅`
- [ ] `docs/COMPONENT-INDEX.md` — новый компонент появился (проверить git diff)
- [ ] `docs/TOKEN-INDEX.md` — новые CSS vars из globals.css попали в индекс
- [ ] Error Log — если в сессии найдена новая ошибка, E-0NN добавлен в COMPONENT-PIPELINE.md
- [ ] Memory — `theme_studio_component_pipeline.md` обновлён если изменился Error Log

**Gate:** `npm run docs:validate` → exit 0. При exit 1 — фиксить до merge.

---

### 7. RETROSPECTIVE (mandatory, blocking before merge)

Runs AFTER docs sync, BEFORE close. Purpose: convert painful iterations into enforced rules so the next component takes fewer.

**Mandatory actions:**

1. **Log `iterations_to_done`** in `docs/build-log.md` — the number of full generate→validate cycles the component took from first implementation to CEO approval. Example: `iterations_to_done: 4`.

2. **If `iterations_to_done > 5`** — add a new entry to § "Error Log — Do Not Repeat These" below. Format:
   ```
   ### E-0NN: [short title]
   **Symptom:** what went wrong
   **Root cause:** why (one sentence)
   **Fix:** concrete rule or code change
   **Prevention:** can this be automated (ESLint / hook / Playwright gate)? If yes → create Linear ticket and link here.
   ```

3. **If root cause is automatable** — create a child Linear ticket for the enforcement (ESLint rule, Playwright test, PreToolUse hook) and link it in the build-log entry + Error Log entry. Do not merge without this link.

4. **Update `memory/theme_studio_component_pipeline.md`** — mirror any new Error Log entry into the memory file.

**Success target:** each next component should take ≤5 iterations. If the number goes UP across consecutive components — pipeline is regressing, stop and investigate.

---

### 8. CLOSE

```bash
npm run build  # must pass
git merge → main
vercel --prod
```

Linear ticket → Done only after retrospective logged + visual gate approved.

---

## Error Log — Do Not Repeat These

Documented failures from Session A. Each rule above has a reason. Read before implementing.

### E-001: Stale `.next` cache causes React to never hydrate

**Symptom:** All clicks silently ignored. `__reactFiber` key missing from DOM nodes. React chunks return 404.
**Root cause:** Dev server restarted with new chunk versions; old HTML references stale hashes.
**Fix:** `npx rimraf .next` + restart dev server when chunk 404s appear in browser network tab.
**Prevention:** Gate 0 test "no JS errors" catches hydration failures. Always run tests against freshly started server.

### E-002: `<div>` inside `<button>` causes React hydration error

**Symptom:** Hydration warning in console. Clicks silently ignored on affected button.
**Root cause:** `<div>` is block-level; `<button>` only accepts phrasing content per HTML5 spec.
**Fix:** Replace all block children of `<button>` with `<span>`. The `<span>` can still use `flex flex-col`.
**Prevention:** Gate 0 test "no block elements inside button".

### E-003: Fake interaction tests — always green, never catch regressions

**Symptom:** Test passes even when component is completely broken.
**Root cause:** Tests only checked visibility (`isVisible()`) or trivial type checks (`typeof x === 'boolean'`) — never actual state changes.
**Fix:** Gate 2 tests verify real state change: `aria-checked` attribute changes, `backgroundColor` changes, content text changes.
**Prevention:** Every Gate 2 test must have a BEFORE state and AFTER state comparison. If the test can pass without the component doing anything — it's not a test.

### E-004: Coordinate-based `page.mouse.click(x*0.85, y)` is brittle

**Symptom:** Test passes locally but fails in CI or after layout changes.
**Root cause:** Absolute coordinates depend on exact rendered layout. Font size changes, container width changes = test breaks.
**Fix:** Click semantic child elements directly: `textSpan.click()`, not coordinate math.
**Prevention:** In Playwright tests, prefer element selectors over `page.mouse.click(x, y)`.

### E-005: Nested `<html><body>` in nested layout causes hydration warning

**Symptom:** React warning "In HTML, `<html>` cannot be a child of `<body>`".
**Root cause:** `preview/layout.tsx` had its own `<html><body>` wrapper but is nested inside root `app/layout.tsx`.
**Fix:** Nested layouts must return a fragment `<>` or a `<div>` — never `<html>` or `<body>`.
**Prevention:** App Router rule: only the root layout (`app/layout.tsx`) provides `<html>` and `<body>`.

### E-006: `pointer-events-none` defeats `cursor-not-allowed`

**Symptom:** Disabled buttons show default arrow cursor, not `not-allowed`.
**Root cause:** `pointer-events: none` causes OS to ignore the element for cursor rendering. The cursor value from the element is never displayed.
**Fix:** Remove `pointer-events-none` from disabled buttons. The `disabled` HTML attribute prevents clicks natively.
**Prevention:** Never combine `pointer-events-none` + `cursor-*` on the same element.

### E-007: SVG presentation attribute `stroke="hsl(var(...))"` fails in Safari

**Symptom:** Checkmark/icon invisible in Safari browsers.
**Root cause:** CSS custom properties are not resolved inside SVG presentation attributes (only in CSS properties or `style=`).
**Fix:** Set `className="text-[hsl(var(--token))]"` on `<svg>` and use `stroke="currentColor"` on `<path>`.
**Prevention:** Never use CSS variables inside SVG attributes. Always `currentColor` + CSS class.

### E-008: Hardcoded `bg-white` on switch thumbs breaks all non-white themes

**Symptom:** Switch thumb stays white regardless of active theme.
**Root cause:** `bg-white` is a hardcoded Tailwind utility, not a token.
**Fix:** `bg-[hsl(var(--primary-foreground))]` for switch thumb (white in light themes, correct in dark/custom).
**Prevention:** `lint:ui` check + `grep -r "bg-white\|bg-black\|text-white\|text-black" src/components/preview/`.

### E-009: Hardcoded Tailwind color utilities (green-100, yellow-800) break theme consistency

**Symptom:** Success/Warning badges always green/yellow regardless of theme.
**Root cause:** Used `bg-green-100 text-green-800` directly instead of semantic tokens.
**Fix:** Add `--success` and `--warning` CSS variables to `globals.css`. Use `bg-[hsl(var(--success)/0.1)]`.
**Prevention:** For any new semantic state (success, warning, info, loading): add a CSS variable first, then reference it.

### E-010: Inputs without label association fail axe-core audit

**Symptom:** `input-label` critical violation in axe-core. Screen reader users can't identify the field.
**Root cause:** `<label>` element present visually but not associated via `htmlFor` + `id`.
**Fix:** Always: `<label htmlFor="field-id">Label</label>` + `<input id="field-id" .../>`.
**Prevention:** Gate 1 axe-core test catches this. Also: any orphan `<input>` (no `htmlFor`/`aria-label`) should fail lint.

### E-011: Dark mode border tokens too low contrast — passes CI but fails visually

**Symptom:** Components "work in dark mode" (tokens applied, no CI failures), but borders are invisible — `--border` at 16% lightness on `--background` at 4% = 1.34:1 contrast (WCAG 1.4.11 requires ≥3:1 for UI components).
**Root cause:** Preset files define `dark.border` lightness too close to `dark.background`. CI tests don't compute contrast ratios — they only check that tokens are applied. ux-reviewer was testing wrong dark mode mechanism (`data-theme` class toggle) instead of correct URL param (`?mode=dark`), so visual gate never caught it.
**Fix (two parts):**
1. Preset files: increase `dark.border` lightness to ≥38% (vs background at 4%). Formula: contrast ≥ 3:1 requires lightness delta ≥ ~34 points at these values.
2. Visual gate: always verify dark mode via `?mode=dark` URL param — NOT `classList.add('dark')`, NOT `data-theme`, NOT `prefers-color-scheme`.
**Prevention:** Step 5 (Visual Gate) instructions must explicitly say: "Navigate to `/preview?tab=components&mode=dark`". Never accept "dark mode verified" without a screenshot from this URL.

---

## Component Spec Template

See `docs/specs/component-spec-template.md` for the full template.

Required sections:
1. Variants & States matrix
2. Keyboard interactions (from APG)
3. ARIA requirements table
4. Token mapping table
5. Acceptance criteria checklist (visual + keyboard + ARIA + token discipline)
6. Not in scope
7. Open questions

---

## Automated Enforcement Summary

| What | Tool | When | Blocks what |
|------|------|------|-------------|
| Hardcoded hex in ui/ components | `eslint-plugin-tailwindcss` | On write | Commit |
| cursor, user-select, click zones, runtime integrity | Playwright Gate 0+1 | Before merge | Merge |
| Real interaction smoke tests | Playwright Gate 2 | Before merge | Merge |
| ARIA violations (axe-core) | Playwright Gate 1 | Before merge | Merge |
| Keyboard accessibility | Playwright Gate 3 | Before merge | Merge |
| **Overlay positioning** (Select/Popover/Tooltip not at 0,0) | Playwright Gate 7 | Before merge | Merge |
| **Spec Test Plan coverage** — every `- [ ]` in spec has a `test()` | qa-engineer Gate 8+ | Before merge | Merge |
| Docs: specs exist, indexes generated, no TODOs | `docs:validate` | Before merge | Merge |
| Build passes | `npm run build` | Before deploy | Deploy |

---

## Why One Component Per Session

- A component with 5 variants × 8 states = 40 combinations
- Each combination needs visual verification
- 3 components = 120 combinations = impossible to verify properly
- Result: junior-level output that misses 60% of states

One component done right > three components done wrong.
