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

Return: variant matrix, state matrix, required keyboard interactions, required ARIA, 
3 most common implementation bugs specific to this component.
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
- Test plan written BEFORE implementation

**Gate:** Spec file exists and complete before any .tsx is written.

---

### 2. IMPLEMENT

> **MANDATORY DELEGATION RULE (added 2026-04-17):**
> The orchestrator MUST NOT implement components directly.
> Direct implementation produces hallucinated values: non-standard px, invented spacing,
> visual decisions without design reference (incident: h-3.5=14px in a 16px box).
>
> **Implementation → `designer` subagent** (Design System specialist, token-aware):
> ```
> Agent(subagent_type="designer", prompt="""
> Implement [ComponentName] component for theme-studio.
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

**Must be run with dev server running** (`npm run dev -- --port 3099`).

**18-test suite, 4 gates:**

| Gate | Tests | What it catches |
|------|-------|-----------------|
| Gate 0: Runtime integrity | 4 | JS errors, React hydration failures, `<div>` inside `<button>` |
| Gate 1: CSS & ARIA form | 6 | cursor, user-select, disabled cursor, no inline hex, axe-core critical violations |
| Gate 2: Interaction smoke | 7 | Real state changes on click — checkbox toggles, switch toggles, tabs switch, select opens, cards work |
| Gate 3: Keyboard | 1 | Tab reaches semantic interactive elements (button/input/switch/checkbox) |

**If any gate fails:** fix the underlying component before coming to CEO. Pipeline is autonomous.

**Critical rule:** passing tests ≠ working UI unless you've verified with a real browser. Gate 0 catches hydration failures that prevent JS from attaching — always run tests against live dev server, never static build.

**Blocks merge if fails.**

---

### 5. VISUAL GATE (mandatory — two sub-steps, in order)

**Blocks merge if either sub-step fails or is skipped.**

#### 5a. ux-reviewer субагент (automated visual QA — mandatory first)

```
Agent(subagent_type="ux-reviewer", prompt="""
Visual QA for [ComponentName] at http://localhost:3099/preview?tab=components.

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
4. WCAG contrast: text on background ≥ 4.5:1; icon on filled background ≥ 3:1
5. Dark mode: navigate to a dark preset and screenshot same section

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
- [ ] Dark mode renders correctly
- [ ] No text selection on interactive elements
- [ ] Disabled state: cursor-not-allowed + reduced opacity

**GATE:** Ticket moves to Done ONLY after CEO says "апрув" or equivalent explicit confirmation.

---

### 6. CLOSE

```bash
npm run build  # must pass
git merge → main
vercel --prod
```

Linear ticket → Done only after visual gate approved.

---

### 7. DOCUMENTATION SYNC (mandatory, before merge)

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
| Docs: specs exist, indexes generated, no TODOs | `docs:validate` | Before merge | Merge |
| Build passes | `npm run build` | Before deploy | Deploy |

---

## Why One Component Per Session

- A component with 5 variants × 8 states = 40 combinations
- Each combination needs visual verification
- 3 components = 120 combinations = impossible to verify properly
- Result: junior-level output that misses 60% of states

One component done right > three components done wrong.
