# Component Spec: Checkbox

> Fill this out COMPLETELY before writing any implementation code.
> Source: ARIA APG → Radix UI → shadcn/ui

---

## Usage Guidelines

### When to use Checkbox

- Use when: user must independently toggle one or more binary options (settings, filters, multi-select lists)
- Use when: confirming agreement (terms of service, newsletter opt-in)
- Do NOT use when: mutually exclusive choice (use RadioGroup instead)
- Do NOT use when: immediate action on toggle (use Switch instead — Switch = action, Checkbox = state)

### When is `indeterminate` valid

- Parent of a group with partial child selection (tree-view parent when some children are checked).
- Bulk-select header in a table row when only some rows are selected.
- Settings page with mixed values across a group (e.g. 3 of 5 sub-options enabled).
- Never set `indeterminate` on a leaf checkbox the user can directly toggle — only derived, never input.
- ARIA: renders as `aria-checked="mixed"` (tri-valued). API uses `checked={"indeterminate"}`.

### How `required` is presented

- Mark with an asterisk (`*`) placed after the label text, colored `hsl(var(--destructive))`, `aria-hidden="true"` so SR users don't hear "star".
- Screen readers announce via `aria-required="true"` on the input.
- Required ≠ invalid — do NOT apply error styling until a validation attempt fails.
- Use `required` only when the form's submit handler will block without it. Avoid "required" theater where there is no enforcement.

### How `error` is presented

- Visual: `border-[hsl(var(--destructive))]` on the box + matching ring on focus.
- Text: inline error message below the label, `text-xs text-[hsl(var(--destructive))]`, linked via `aria-describedby`.
- ARIA: `aria-invalid="true"` on the input.
- `required` and `error` are independent props — error appears only after validation.

### State decision tree

```
Is this a binary on/off that takes immediate effect?
└── YES → Switch (not Checkbox)

Is this one of several mutually exclusive options?
└── YES → RadioGroup (not Checkbox)

Is this a standalone option or multi-select filter?
└── YES → Checkbox ✓

Disabled pattern:
├── Form submitting → disabled attr (Radix propagates, opacity-50)
└── Permission gate → aria-disabled="true" (stays in tab order)
```

### Common patterns

```tsx
// Standalone with label (most common)
<label className="flex items-center gap-2 cursor-pointer">
  <Checkbox id="terms" checked={agreed} onCheckedChange={setAgreed} />
  <span className="text-sm">I agree to the terms</span>
</label>

// Disabled
<label className="flex items-center gap-2 cursor-not-allowed opacity-50">
  <Checkbox disabled />
  <span className="text-sm">Unavailable option</span>
</label>

// In a filter list
{options.map(opt => (
  <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
    <Checkbox
      checked={selected.includes(opt.id)}
      onCheckedChange={(v) => toggle(opt.id, v)}
    />
    <span className="text-sm">{opt.label}</span>
  </label>
))}
```

### Anti-patterns

- Never use Checkbox for mutually exclusive choices — use RadioGroup
- Never use Checkbox for immediate actions — use Switch
- Never make only the indicator clickable — entire label row must be the hit target
- Never use `pointer-events-none` on the root — breaks cursor rendering

---

## Identity

- **Component name:** Checkbox
- **File:** `src/components/ui/checkbox.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
- **Reference:** https://www.radix-ui.com/primitives/docs/components/checkbox | https://ui.shadcn.com/docs/components/checkbox
- **Ticket:** ALE-764

---

## Variants

| Prop | Values | Default |
|------|--------|---------|
| `checked` | `boolean \| "indeterminate"` | `false` (uncontrolled) |
| `disabled` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `error` | `boolean` | `false` |
| `errorMessage` | `string` | `undefined` |

No explicit `variant` prop — single visual style. Size is fixed at 16×16px (h-4 w-4).

`checked === "indeterminate"` is set programmatically (via `input.indeterminate = true` in `useEffect`) — there is no HTML attribute for it. The native `:checked` CSS pseudo-class does **not** match; distinguish via `data-state="indeterminate"`.

---

## States

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| unchecked | default | `data-state="unchecked"`: transparent bg, `border-[hsl(var(--border))]` |
| checked | `checked={true}` | `data-state="checked"`: `bg-[hsl(var(--primary))] border-[hsl(var(--primary))]`; check ✓ icon visible |
| indeterminate | `checked="indeterminate"` → React sets `input.indeterminate = true` + `data-state="indeterminate"` | `bg-[hsl(var(--primary))] border-[hsl(var(--primary))]`; horizontal dash `—` icon (lucide `Minus`) instead of ✓ |
| hover | wrapping `<label>` hover | cursor-pointer on label; indicator: subtle border color shift |
| focus-visible | Tab navigation | `focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]` |
| disabled | `disabled` attr on Root | `disabled:cursor-not-allowed disabled:opacity-50`; label gets `cursor-not-allowed` |
| required | `required={true}` | passed to native `<input required>`; parent label renders `*` aria-hidden in `text-[hsl(var(--destructive))]`; sets `aria-required="true"` |
| error | `error={true}` | `data-error="true"`: `border-[hsl(var(--destructive))]`; focus ring `ring-[hsl(var(--destructive))]`; sets `aria-invalid="true"` + `aria-describedby={errorId}` when `errorMessage` provided |
| loading | N/A — checkboxes don't have loading state | — |
| active | N/A — no scale animation needed | — |

---

## Interaction Zones

- **Clickable area:** entire `<label>` row (wraps Checkbox.Root + label text) — not just the 16×16 indicator
- **Trigger:** click anywhere on label → toggles checked state
- **Tab:** focus goes to `Checkbox.Root` (the button element)
- **Space:** toggles checked state (ARIA APG requirement)
- **Enter:** N/A — does not activate (unlike button; Radix handles correctly)
- **Escape:** N/A
- **Arrow keys:** N/A (not a navigable group by itself)

---

## Visual Design

> All values are on the 4px base scale. No arbitrary px.

### Dimensions

| Property | Value | Token / Tailwind class |
|----------|-------|------------------------|
| Indicator box width | 16px | `w-4` (= --space-6) |
| Indicator box height | 16px | `h-4` (= --space-6) |
| Min touch target | 44×44px | wrapping `<label>` handles this via full row |

### Internal proportions

| Property | Value | Token / class | Notes |
|----------|-------|---------------|-------|
| Checkmark icon size | 12px | `h-3 w-3` (= --icon-indicator) | 62.5% of 16px box; leaves 2px gap each side (= --space-1) |
| Visual gap (icon → box edge) | 2px each side | (16 - 12) / 2 | Minimum non-zero step on scale |

### Border & shape

| Property | Value | Token |
|----------|-------|-------|
| Border radius | 2px | `rounded-[2px]` |
| Border width unchecked | 1px | Tailwind default `border` |
| Indicator-to-label gap | 8px | `gap-2` (= --space-4) |

### Anti-patterns (visual)

- DO NOT use `h-3.5` (14px) — not on the 4px scale, produces ~1px visual gap which looks cramped
- DO NOT use `h-4` (16px) icon in a `h-4` box — 0px visual gap, indicator looks like a filled square
- DO NOT use `rounded-full` (circle) — that is radio button shape, not checkbox

---

## Token Compliance (NO hardcoded values)

| CSS property | Token used |
|-------------|-----------|
| indicator background (checked / indeterminate) | `hsl(var(--primary))` |
| indicator icon color (✓ and —) | `hsl(var(--primary-foreground))` via `currentColor` on SVG |
| border (unchecked) | `hsl(var(--border))` → `hsl(var(--primary))` on checked/indeterminate |
| focus ring (default) | `hsl(var(--ring))` |
| focus ring offset | `hsl(var(--background))` |
| disabled opacity | `opacity-50` (Tailwind utility) |
| error border | `hsl(var(--destructive))` |
| error focus ring | `hsl(var(--destructive))` |
| error message text | `hsl(var(--destructive))` |
| required asterisk | `hsl(var(--destructive))` |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** `checkbox` — native `<input type="checkbox">` already has this implicit role
- **aria-checked:** `"true"` / `"false"` / `"mixed"` (mixed when `checked="indeterminate"`)
- **aria-label / aria-labelledby:** provided via wrapping `<label>` (preferred) — no explicit prop needed
- **aria-disabled:** implicit via `disabled` attribute on the native input
- **aria-required:** `"true"` when `required={true}`
- **aria-invalid:** `"true"` when `error={true}`
- **aria-describedby:** set to the error message `id` when `errorMessage` is provided
- **aria-hidden on decorative icons:** `aria-hidden="true"` on the SVG check and dash icons, and on the required `*`
- **aria-live:** N/A (error is not a live region; errors render statically)

---

## Animation

- Enter (check): `Checkbox.Indicator` — fade in via `data-[state=checked]:opacity-100`, transition 150ms
- Exit (uncheck): fade out 100ms
- State change: border color, bg — `transition-colors duration-150`
- `prefers-reduced-motion:` handled via `motion-safe:` prefix if animations added

---

## Dark Mode

- [x] All tokens semantic — dark mode activates via `?mode=dark` URL param (NOT CSS class toggle / NOT `data-theme`)
- [x] No hardcoded colors
- [x] Verified at `/preview?tab=components&mode=dark`

---

## Test Plan (written BEFORE implementation)

- [ ] Checkbox renders without JS errors (Gate 0)
- [ ] `cursor:pointer` on label wrapping checkbox (Gate 1)
- [ ] `cursor:not-allowed` on disabled label (Gate 1)
- [ ] No inline hex in component (Gate 1 — lint)
- [ ] axe-core: 0 critical violations (Gate 1)
- [ ] Clicking label text (not indicator) toggles checked state (Gate 2)
- [ ] Space key toggles checked state (Gate 3)
- [ ] Tab reaches the checkbox root (Gate 3)
- [ ] focus-visible ring visible on keyboard focus (Gate 3)
- [ ] Disabled checkbox: Space does not toggle (Gate 3)
- [ ] `checked="indeterminate"` renders dash icon, sets `input.indeterminate === true`, `aria-checked="mixed"` (Gate 2)
- [ ] `required={true}` renders input with `required` attr and `aria-required="true"` (Gate 2)
- [ ] `error={true}` renders with `aria-invalid="true"` and error-colored border (Gate 2)
- [ ] `errorMessage` renders below label and is linked via `aria-describedby` (Gate 2)
- [ ] Preview Block: tab switching works (Overview/API/Usage/Code/States) (Gate 2)
- [ ] Preview Block: shiki syntax highlighting loads in Code tab (Gate 1)
- [ ] Preview Block: Do/Don't cards visible in Usage tab (Gate 1)
- [ ] `npm run lint:ui` passes

---

## Spec Sign-off

- [x] Variants complete
- [x] All states addressed
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Test plan written

**Spec complete:** YES (extended with indeterminate/required/error per ALE-812, 2026-04-24)

---

## Retrospective (Pipeline v2 Step 7)

- **iterations_to_done:** 2 (initial build + 1 visual QA fix round)
- **Target (≤5):** ✅ HIT — Pipeline v2 validated on first non-trivial API extension.
- **Iteration log:**
  1. *Initial build* — research → spec update → checkbox.tsx API extension → CheckboxDocs.tsx + Gallery wiring → token/DS audit (PASS) → qa-engineer (82/82 PASS) → ux-reviewer (APPROVED-WITH-MINOR: 1 P1 + 2 P2)
  2. *Fix round* — designer fixed: (a) DocPropsTable grid `minmax(0, Nfr)` for type-column overflow (project-wide fix, benefits Button/Badge tables too), (b) Checkbox error border/ring via `!important` to win over `data-state=checked` cascade, (c) DoDontCard `items-baseline` for header alignment. qa re-verify (82/82) PASS.
- **New Error Log entry:** N/A (iterations ≤ 5).
- **Automation child ticket:** N/A (iterations ≤ 5).
- **Key insight:** tri-valued `checked: boolean | "indeterminate"` (Radix pattern) keeps API surface minimal versus separate `indeterminate` prop. `data-state` + `data-error` attrs give tests deterministic hooks without relying on CSS specificity.
- **Carryover:** `DocPropsTable` grid fix improves all future component Preview Blocks (DocPropsTable was the real bottleneck, not the Checkbox itself).
