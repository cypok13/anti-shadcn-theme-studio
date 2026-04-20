# Component Spec: RadioGroup

> Fill this out COMPLETELY before writing any implementation code.
> Source: ARIA APG → Radix UI → shadcn/ui

---

## Usage Guidelines

### When to use RadioGroup

- Use when: user must choose **exactly one** option from a small set (2–6 options)
- Use when: options are mutually exclusive (selecting one deselects all others)
- Do NOT use when: user can select multiple options — use Checkbox instead
- Do NOT use when: >6 options — use Select/Combobox instead
- Do NOT use when: a binary on/off toggle — use Switch instead

### State decision tree

```
Does the user need to pick one from several mutually exclusive options?
└── YES, 2–6 options → RadioGroup ✓

Can the user select multiple options?
└── YES → Checkbox (not RadioGroup)

Is it a binary on/off that takes immediate effect?
└── YES → Switch (not RadioGroup)

More than 6 options or space is tight?
└── YES → Select/Combobox (not RadioGroup)

Disabled pattern:
├── Entire group unavailable → disabled on Root (all items disabled)
└── Individual option unavailable → disabled on that Item only
```

### Common patterns

```tsx
// Controlled group (most common)
<RadioGroup value={plan} onValueChange={setPlan} label="Choose a plan">
  <RadioItem value="free">Free</RadioItem>
  <RadioItem value="pro">Pro</RadioItem>
  <RadioItem value="enterprise">Enterprise</RadioItem>
</RadioGroup>

// With default value (uncontrolled)
<RadioGroup defaultValue="pro" label="Choose a plan">
  <RadioItem value="free">Free</RadioItem>
  <RadioItem value="pro">Pro</RadioItem>
</RadioGroup>

// Disabled individual item
<RadioGroup value={plan} onValueChange={setPlan} label="Choose a plan">
  <RadioItem value="free">Free</RadioItem>
  <RadioItem value="enterprise" disabled>Enterprise (contact sales)</RadioItem>
</RadioGroup>
```

### Anti-patterns

- Never use RadioGroup for multi-select — use Checkbox
- Never use for binary toggle — use Switch
- Never omit the group label — `aria-labelledby` on radiogroup is required by ARIA APG
- Never use `pointer-events-none` on items — breaks cursor rendering (Error Log E-006)
- Never use more than ~6 options — use Select instead

---

## Identity

- **Component name:** RadioGroup + RadioItem
- **File:** `src/components/ui/radio-group.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- **Reference:** https://www.radix-ui.com/primitives/docs/components/radio-group | https://ui.shadcn.com/docs/components/radio-group
- **Ticket:** ALE-753

---

## Variants

| Prop | Values | Default | Level |
|------|--------|---------|-------|
| `size` | `"sm"` \| `"md"` | `"md"` | RadioGroup |
| `value` | `string` | `undefined` | RadioGroup |
| `defaultValue` | `string` | `undefined` | RadioGroup |
| `disabled` | `boolean` | `false` | RadioGroup (disables all items) |
| `required` | `boolean` | `false` | RadioGroup |
| `label` | `string` | required | RadioGroup (group accessibility label) |
| `value` | `string` | required | RadioItem |
| `disabled` | `boolean` | `false` | RadioItem (per-item disable) |

No visual `variant` prop — single style. Size affects indicator dimensions only.

---

## States

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| unselected | default | `data-[state=unchecked]`: border only, no inner dot |
| selected | value matches item value | `data-[state=checked]`: border `--primary` + inner dot `bg-[hsl(var(--primary))]` |
| hover (unselected) | CSS `:hover` on label | cursor-pointer; border darkens slightly |
| hover (selected) | CSS `:hover` on label | cursor-pointer |
| focus-visible | keyboard Tab / Arrow | `focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]` on the button |
| disabled (item) | `disabled` prop on RadioItem | `opacity-50 cursor-not-allowed` on item; label `cursor-not-allowed` |
| disabled (group) | `disabled` prop on RadioGroup | all items get `opacity-50 cursor-not-allowed` |
| loading | N/A | — |
| error | N/A — form validation at wrapper level | — |

---

## Interaction Zones

- **Clickable area:** entire `<label>` row (wraps button + label text) — not just the circle indicator
- **Trigger:** click → selects that item, deselects all others
- **Tab:** enters the group; focus lands on the currently selected item, or first item if none selected
- **Shift+Tab:** exits the group
- **ArrowRight / ArrowDown:** move to next item AND select it (wraps last→first)
- **ArrowLeft / ArrowUp:** move to previous item AND select it (wraps first→last)
- **Space:** selects the focused item (no-op if already selected)
- **Enter:** N/A (not in APG spec for radio)
- **Escape:** N/A

**Roving tabindex:** Only ONE item has `tabindex="0"` at any time (selected item, or first if none). All others: `tabindex="-1"`.

---

## Visual Design

> All values on the 4px base scale. No arbitrary px. No hardcoded colors.

### Dimensions

| Size | Outer circle | Inner dot | Tailwind |
|------|-------------|-----------|----------|
| `sm` | 16px | 6px | `h-4 w-4` outer / no standard 6px Tailwind → use `h-1.5 w-1.5` (6px) |
| `md` | 20px | 8px | `h-5 w-5` outer / `h-2 w-2` (8px) inner dot |

Min touch target: 44×44px — wrapping `<label>` handles via full row.

### Internal proportions

| Property | Value | Class | Notes |
|----------|-------|-------|-------|
| Outer border width | 2px | `border-2` | Visible in both states |
| Inner dot position | centered | `flex items-center justify-center` on outer | Dot inside outer via flex |
| Label gap | 8px | `gap-2` | Between circle and label text |
| Item gap (vertical list) | 8px | `space-y-2` | Between RadioItem rows |

### Border & shape

| Property | Value | Token |
|----------|-------|-------|
| Outer radius | full circle | `rounded-full` |
| Inner dot radius | full circle | `rounded-full` |
| Border width | 2px | `border-2` |

---

## Token Compliance (NO hardcoded values)

| CSS property | Token used |
|-------------|-----------|
| outer border (unselected) | `hsl(var(--border))` via `border-[hsl(var(--border))]` |
| outer border (selected) | `hsl(var(--primary))` via `data-[state=checked]:border-[hsl(var(--primary))]` |
| inner dot bg (selected) | `hsl(var(--primary))` via `bg-[hsl(var(--primary))]` |
| focus ring | `hsl(var(--ring))` |
| focus ring offset | `hsl(var(--background))` |
| disabled opacity | `opacity-50` |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** `radiogroup` on container `<div>`; `radio` on each item `<button>`
- **aria-labelledby:** on `<div role="radiogroup">` pointing to group label element (required)
- **aria-checked:** `"true"` / `"false"` on each `<button role="radio">` (managed by React state)
- **aria-disabled:** on disabled items and on group when disabled
- **tabindex:** roving — selected item (or first) gets `tabindex="0"`, all others `tabindex="-1"`
- **aria-hidden on decorative icons:** N/A — no icons
- **aria-live:** N/A

---

## Animation

- Inner dot appear/disappear: `transition-opacity duration-150` or conditional render
- Border color change: `transition-colors duration-150`
- `prefers-reduced-motion:` use `motion-safe:` prefix

---

## Dark Mode

- [x] All tokens semantic (auto-switch via CSS vars)
- [x] No hardcoded colors

---

## Demo States (required in ComponentGallery — written BEFORE implementation)

| State | Label in demo | Notes |
|-------|--------------|-------|
| Default group (md) | "Choose a plan" — 3 options, "Pro" pre-selected | Interactive — user can change selection |
| Disabled individual item | Same group, "Enterprise" disabled | Third option grayed out, non-clickable |
| Disabled entire group | Separate group "Disabled group", "Basic" selected | All items 50% opacity |
| Size sm | Group with 2 options, sm indicators | Interactive |

> **GATE:** ComponentGallery must render all 4 demo groups before Visual Gate.

---

## Test Plan (written BEFORE implementation)

- [ ] RadioGroup renders without JS errors (Gate 0)
- [ ] No hydration warnings (Gate 0)
- [ ] No `<div>` inside `<button>` (Gate 0)
- [ ] `cursor:pointer` on label rows (Gate 1)
- [ ] `cursor:not-allowed` on disabled item label (Gate 1)
- [ ] No inline hex in component (Gate 1 — lint)
- [ ] axe-core: 0 critical violations (Gate 1)
- [ ] Clicking label text (not circle) selects that item (Gate 2)
- [ ] Selecting one item deselects the previously selected item (Gate 2)
- [ ] `aria-checked="true"` on selected item (Gate 2)
- [ ] Space key selects focused item (Gate 3)
- [ ] Tab enters group, focuses selected/first item (Gate 3)
- [ ] ArrowDown moves focus AND selects next item (Gate 3)
- [ ] Disabled item: click does not change selection (Gate 2)
- [ ] `npm run lint:ui` passes

---

## Spec Sign-off

- [x] Variants complete
- [x] All states addressed (N/A cases documented)
- [x] Visual Design filled with token-based values (no arbitrary px)
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Demo states listed
- [x] Test plan written

**Spec complete:** YES
