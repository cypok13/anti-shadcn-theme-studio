# Feature Spec: Colors Section in ThemeSidebar

> Created 2026-04-30 before implementation.

---

## Context

`OklchPicker` (ALE-721) exists but has no entry point in the active product UX.

The active product experience lives at `/preview` (ComponentGallery + ThemeSidebar right sidebar, 280px sticky).
`ThemeSidebar` controls: Theme presets, Light/Dark, Radius, Shadow, Typography, Export.
Color editing is absent. `TokenEditor` (AppShell left sidebar) is the legacy path — deprecated.

`/preview/page.tsx` already consumes color overrides from URL params (`COLOR_PARAM_KEYS` — 27 tokens).
`ThemeSidebar` already has `setParam(key, value)` via `useSearchParams` + `useRouter`.
The plumbing is complete — only the UI section is missing.

---

## Usage Guidelines

### When to use
- Editing any color token in the component gallery preview

### Anti-patterns
- Do NOT add color inputs to AppShell/TokenEditor (deprecated)
- Do NOT use `<input type="color">` — OklchPicker replaces it entirely

### Common pattern
```tsx
<OklchPicker
  hsl={searchParams.get('primary') ?? preset.light.primary}
  pairHsl={searchParams.get('primaryForeground') ?? preset.light.primaryForeground}
  label="primary"
  onChange={(hsl) => setParam('primary', hsl)}
/>
```

---

## Identity

- **Feature:** Colors section in ThemeSidebar
- **File:** `src/components/preview/ThemeSidebar.tsx`
- **Picker:** `src/components/tokens/OklchPicker.tsx` (reuse as-is)

---

## Color Groups (Priority Order)

| Group | Tokens | Contrast pairs |
|-------|--------|----------------|
| BASE | background, foreground | background↔foreground |
| PRIMARY | primary, primaryForeground | primary↔primaryForeground |
| SECONDARY | secondary, secondaryForeground | secondary↔secondaryForeground |
| ACCENT | accent, accentForeground | accent↔accentForeground |
| MUTED | muted, mutedForeground | muted↔mutedForeground |
| DESTRUCTIVE | destructive, destructiveForeground | destructive↔destructiveForeground |
| BORDER | border, input, ring | — (no contrast pair) |

Chart (chart1–5) and Sidebar tokens — **Out of Scope** for this ticket.

---

## State Architecture

```
URL param ?primary=262+83%25+57%25
    ↓ read
searchParams.get('primary') ?? currentPreset.light.primary
    ↓ display in OklchPicker
OklchPicker.onChange(hsl)
    ↓
setParam('primary', hsl)  →  router.push(?primary=...)
    ↓
/preview/page.tsx reads param → applies to CSS vars → preview re-renders
```

No additional React state needed — ThemeSidebar is already URL-param-driven.

---

## Visual Design

### Section placement
Below Typography, above Export.

### Section header
Same pattern as existing sections:
```tsx
<p className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-2">Colors</p>
```

### Group row
```
[GROUP LABEL ▼]           ← collapse toggle, same style as existing groups in TokenEditor
  label    [●] [×]        ← token name (monospace xs) + OklchPicker swatch + reset button
  label-fg [●] [×]
```

| Property | Value | Token |
|----------|-------|-------|
| Swatch size | 24×24px | w-6 h-6 |
| Row height | 32px | h-8 |
| Label width | 96px | w-24 (monospace xs) |
| Gap between rows | 4px | gap-1 |
| Reset button | 16×16 icon button, visible only on hover | opacity-0 group-hover:opacity-100 |
| Modified indicator | 2px dot (●) before label | w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] |

### Group collapse
- Default open: BASE, PRIMARY
- Default closed: SECONDARY, ACCENT, MUTED, DESTRUCTIVE, BORDER
- Chevron icon rotates on open (same pattern as TokenEditor accordion)

---

## Token Compliance

| CSS property | Token |
|-------------|-------|
| Section label | `hsl(var(--muted-foreground))` |
| Group header bg | `hsl(var(--muted))` |
| Group header text | `hsl(var(--foreground))` |
| Reset button icon | `hsl(var(--muted-foreground))` |
| Modified dot | `hsl(var(--primary))` |
| Row hover bg | `hsl(var(--muted)/0.5)` |

**Hardcoded values:** NONE.

---

## ARIA

- Group toggle: `<button aria-expanded={open} aria-controls="group-{id}">` 
- Swatch trigger: inherited from OklchPicker (`aria-label="Edit color: {label}"`)
- Reset: `aria-label="Reset {label} to preset"`
- Modified dot: `aria-hidden="true"`

---

## Interaction

- Click group header → collapse/expand
- Click swatch → OklchPicker popover opens (side="left", 8px offset)
- OklchPicker onChange → `setParam(key, hsl)` fires on every slider move
- Click reset → `removeParam(key)` (or `setParam` with preset value)
- ThemeSidebar is scrollable — sticky top-8, max-h calc(100vh-64px) already set

---

## Test Plan

### Universal gates
- [ ] All groups render without errors
- [ ] `cursor:pointer` on swatch triggers
- [ ] axe-core: 0 critical violations
- [ ] `npm run test:components` passes (all 18 gates)

### Feature-specific assertions
- [ ] "Colors" section visible in ThemeSidebar
- [ ] BASE group open by default, SECONDARY closed by default
- [ ] Click PRIMARY swatch → OklchPicker popover opens
- [ ] Drag L slider → URL param updates in real time
- [ ] Reset button → token reverts to preset value, URL param removed
- [ ] Modified indicator appears after editing, disappears after reset
- [ ] Token audit: no hardcoded hex/rgba in changed files

---

## Implementation Plan

### Phase 1 — CONTRAST_PAIR + group config (data layer)
Extract `COLOR_GROUPS` and `CONTRAST_PAIR` constants into `ThemeSidebar` (or shared util if TokenEditor reuses them — check first).

### Phase 2 — Colors section UI
Add `<section>` below Typography in ThemeSidebar:
- Group accordion (useState for openGroups, same as TokenEditor)
- Per-token row: label + OklchPicker + reset
- Modified indicator logic: `searchParams.has(key)`

### Phase 3 — removeParam helper
ThemeSidebar needs `removeParam(key)` (deletes key from URLSearchParams, pushes).

### Phase 4 — Token audit
designer subagent #2: check hardcoded values, spacing off 4px scale, native elements.

### Phase 5 — Playwright + Visual gate
`npm run test:components` → qa-engineer → ux-reviewer CEO sign-off.

---

## Retrospective

- **iterations_to_done:** 2 (implementation session 2026-04-30 + pipeline/fix session 2026-05-01)
- **What went wrong:** Token audit caught 4 DS violations in ThemeSidebar and ComponentGallery — native `<button>` elements and `shadow-md` Tailwind class. These should have been caught during implementation.
- **Root cause:** ALE-858 implementation was done as part of a multi-ticket session (ALE-857, ALE-862 simultaneously) under time pressure — token audit step was deferred to next session. Colors section is new code with accordion pattern that hadn't been through the pipeline before, so native button pattern slipped in.
- **New Error Log entry created?** No — existing E-004 (native elements) covers this case. Reminder: accordion toggles must use DS `Button variant="ghost"`, not `<button>`.
- **Automation ticket:** ALE-858

---

## Spec Sign-off

- [x] Context and architecture documented
- [x] Color groups defined with scope
- [x] State architecture traced end-to-end
- [x] Visual design with token-based values
- [x] ARIA specified
- [x] Test plan written
- [x] Implementation plan (5 phases)

**Spec complete:** YES

## Related
- [[oklch-picker-spec]]
- [[component-spec]]