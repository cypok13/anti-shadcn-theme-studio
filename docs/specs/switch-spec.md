# Component Spec: Switch

> Fill this out COMPLETELY before writing any implementation code.
> Source: ARIA APG → Radix UI → shadcn/ui

---

## Usage Guidelines

### When to use Switch

- Use when: user toggles a setting that takes **immediate effect** (no submit button needed)
- Use when: binary on/off system preference (e.g. "Enable notifications", "Dark mode")
- Do NOT use when: form field that submits later — use Checkbox instead
- Do NOT use when: one of several mutually exclusive options — use RadioGroup instead

### State decision tree

```
Does toggling immediately affect the system (no form submit needed)?
└── YES → Switch ✓

Is the user selecting/deselecting one item in a multi-select list?
└── YES → Checkbox (not Switch)

Is the user choosing one of several mutually exclusive options?
└── YES → RadioGroup (not Switch)

Disabled pattern:
├── Setting unavailable in current context → disabled attr (opacity-50, cursor-not-allowed)
└── Setting requires permission → aria-disabled="true" (stays in tab order, add tooltip)
```

### Common patterns

```tsx
// Most common — label wraps full row (click zone = entire row)
<label className="flex items-center gap-2 cursor-pointer">
  <Switch checked={enabled} onCheckedChange={setEnabled} />
  <span className="text-sm">Enable notifications</span>
</label>

// With description
<label className="flex items-center justify-between gap-4 cursor-pointer">
  <div>
    <p className="text-sm font-medium">Dark mode</p>
    <p className="text-xs text-muted-foreground">Switch between themes</p>
  </div>
  <Switch checked={dark} onCheckedChange={setDark} />
</label>

// Disabled
<label className="flex items-center gap-2 cursor-not-allowed opacity-50">
  <Switch disabled />
  <span className="text-sm">Unavailable option</span>
</label>
```

### Anti-patterns

- Never use Switch for form fields that require a submit — use Checkbox
- Never change the label text when the switch toggles (ARIA APG rule)
- Never make only the track/thumb the click zone — wrap with `<label>` for full-row hit target
- Never use `bg-white` or `bg-black` for thumb — use `hsl(var(--primary-foreground))` (Error Log E-008)
- Never use `pointer-events-none` on root — breaks cursor rendering (Error Log E-006)

---

## Identity

- **Component name:** Switch
- **File:** `src/components/ui/switch.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/switch/
- **Reference:** https://www.radix-ui.com/primitives/docs/components/switch | https://ui.shadcn.com/docs/components/switch
- **Ticket:** ALE-765

---

## Variants

| Prop | Values | Default |
|------|--------|---------|
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` |
| `checked` | `boolean` | `false` (uncontrolled) |
| `disabled` | `boolean` | `false` |
| `required` | `boolean` | `false` |

No visual `variant` prop — single style. Size variants only.

---

## States

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| unchecked | default | `data-[state=unchecked]`: track uses `bg-[hsl(var(--input))]`; thumb at left |
| checked | `checked={true}` | `data-[state=checked]:bg-[hsl(var(--primary))]`; thumb at right via `translate-x-*` |
| hover (unchecked) | wrapping `<label>` hover | cursor-pointer on label |
| hover (checked) | wrapping `<label>` hover | cursor-pointer; track subtle opacity |
| focus-visible | Tab navigation | `focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]` |
| disabled (unchecked) | `disabled` attr on Root | `disabled:cursor-not-allowed disabled:opacity-50` |
| disabled (checked) | `disabled` attr on Root | Same; track retains `--primary` color at reduced opacity |
| loading | N/A — switches have no loading state | — |
| error | N/A — form validation at wrapper level | — |
| indeterminate | N/A — switch is strictly binary (ARIA spec) | — |

---

## Interaction Zones

- **Clickable area:** entire `<label>` row (wraps Switch.Root + label text) — not just the track
- **Trigger:** click anywhere on label → toggles on/off
- **Tab:** focus goes to `Switch.Root` (`<button role="switch">`)
- **Space:** toggles state (ARIA APG required)
- **Enter:** toggles state (Radix provides; APG lists as optional)
- **Escape:** N/A
- **Arrow keys:** N/A

---

## Visual Design

> All values on the 4px base scale. No arbitrary px. No hardcoded colors.

### Dimensions

| Size | Track W | Track H | Thumb | Translate (checked) | Tailwind |
|------|---------|---------|-------|---------------------|----------|
| `sm` | 28px | 16px | 12px | 12px | `w-7 h-4` / `h-3 w-3` / `translate-x-3` |
| `md` | 44px | 24px | 20px | 20px | `w-11 h-6` / `h-5 w-5` / `translate-x-5` |
| `lg` | 56px | 32px | 24px | 28px | `w-14 h-8` / `h-6 w-6` / `translate-x-7` |

Min touch target: 44×44px — wrapping `<label>` spanning full row.

Formula: thumb translate = track width − thumb size − 4px (2px padding each side via `p-0.5`).

### Internal proportions

| Property | Value | Class | Notes |
|----------|-------|-------|-------|
| Track padding | 2px each side | `p-0.5` | Gap between thumb and track edge |
| Label gap | 8px | `gap-2` | Between track and label text |

### Border & shape

| Property | Value | Token |
|----------|-------|-------|
| Track border radius | pill | `rounded-full` |
| Thumb border radius | circle | `rounded-full` |
| Border | none | Track is solid filled |

---

## Token Compliance (NO hardcoded values)

| CSS property | Token used |
|-------------|-----------|
| track bg (unchecked) | `hsl(var(--input))` |
| track bg (checked) | `hsl(var(--primary))` |
| thumb bg | `hsl(var(--primary-foreground))` — E-008 fix, never `bg-white` |
| focus ring | `hsl(var(--ring))` |
| focus ring offset | `hsl(var(--background))` |
| disabled opacity | `opacity-50` |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** `switch` (Radix sets on `<button>` automatically)
- **aria-checked:** `"true"` / `"false"` (managed by Radix)
- **data-state:** `"checked"` / `"unchecked"` on Root and Thumb (Radix sets; use for Tailwind variants)
- **data-disabled:** set by Radix when disabled
- **aria-label / aria-labelledby:** via wrapping `<label>` (preferred) — no explicit prop needed
- **aria-disabled:** propagated by Radix from `disabled` prop
- **aria-live:** N/A — `aria-checked` handles announcements

---

## Animation

- Thumb position: `transition-transform duration-200`
- Track color: `transition-colors duration-200`
- `prefers-reduced-motion:` use `motion-safe:transition-transform`

---

## Dark Mode

- [x] All tokens semantic — dark mode activates via `?mode=dark` URL param (NOT CSS class toggle / NOT `data-theme`)
- [x] No hardcoded colors
- [x] Verified at `/preview?tab=components&mode=dark`

---

## Demo States (required in ComponentGallery — written BEFORE implementation)

| State | Label in demo | Notes |
|-------|--------------|-------|
| unchecked (md) | "Unchecked" | Interactive — user can toggle |
| checked (md) | "Checked" | Interactive — starts checked |
| disabled unchecked | "Disabled (off)" | Non-interactive, opacity-50 |
| disabled checked | "Disabled (on)" | Non-interactive, opacity-50, track purple |
| size sm | "Small" | Interactive |
| size lg | "Large" | Interactive |

> **GATE:** ComponentGallery must render all 6 rows before Visual Gate.

---

## Test Plan (written BEFORE implementation)

- [ ] Switch renders without JS errors (Gate 0)
- [ ] No hydration warnings (Gate 0)
- [ ] No `<div>` inside `<button>` (Gate 0)
- [ ] `cursor:pointer` on label wrapping switch (Gate 1)
- [ ] `cursor:not-allowed` on disabled label (Gate 1)
- [ ] No inline hex in component (Gate 1 — lint)
- [ ] axe-core: 0 critical violations (Gate 1)
- [ ] Clicking label text (not track) toggles state (Gate 2)
- [ ] `data-[state=checked]` applied after toggle (Gate 2)
- [ ] Space key toggles state (Gate 3)
- [ ] Tab reaches the switch root (Gate 3)
- [ ] focus-visible ring visible on keyboard focus (Gate 3)
- [ ] Disabled switch: Space does not toggle (Gate 3)
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
