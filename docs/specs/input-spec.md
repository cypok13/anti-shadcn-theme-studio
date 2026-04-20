# Component Spec: Input

> Source: ARIA ARIA21 technique → shadcn/ui → Chakra UI → MUI TextField → Material D3 (filled variant).
> v2 additions: icon slots + filled variant (ALE-769).

---

## Industry Parity Check (ALE-769 research — 2026-04-19)

| Feature | Material | Carbon | Spectrum | Fluent | Atlassian | shadcn | **Include?** | Reason if excluded |
|---|---|---|---|---|---|---|---|---|
| Left icon slot | ✅ `leading-icon` | ❌ | ✅ `icon` | ✅ `contentBefore` | ❌ | ✅ `InputGroupAddon` | ✅ `leftIcon` | Present in 4/6 — REQUIRED |
| Right icon slot | ✅ `trailing-icon` | ❌ | ❌ | ✅ `contentAfter` | ❌ | ✅ `InputGroupAddon` | ✅ `rightIcon` | Present in 3/6 — REQUIRED |
| Filled variant | ✅ bg+border-b | ❌ | ✅ `isQuiet` underline | ✅ `appearance=filled` | ❌ bg always | ❌ | ✅ `variant="filled"` | Material D3 pattern A |
| Prefix/suffix text | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | 2/6 — defer to v3 |
| Character count | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | 2/6 — defer to v3 |
| Clear button | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | 1/6 — out of scope |

---

## Usage Guidelines

### When to use this component

- Use when: collecting a single line of text from the user (name, email, search, URL, password)
- Do NOT use when: multi-line text → use Textarea; file upload → use file input; number spinner → use NumberInput

### Variant decision tree

```
Need text input?
├── Default form field → size="md" (default)
├── Compact form (table/toolbar) → size="sm"
├── Prominent / hero search → size="lg"
├── Field has validation failure → isError + errorMessage prop
├── Immutable value that must be readable → readOnly
└── Permanently unavailable field → disabled
```

### State decision tree

```
Which disabled-like pattern?
├── Form submitting → disabled (removed from tab order)
├── Conditionally unavailable → disabled + tooltip
├── Value shown but not editable → readOnly (stays in tab order, submitted with form)
└── After submit with error → isError="true" + errorMessage
```

### Common patterns

```tsx
// Basic labeled input
<Input id="email" label="Email address" type="email" placeholder="you@company.com" />

// With helper text
<Input id="name" label="Full name" helperText="As it appears on your passport" />

// Error state (after validation)
<Input id="email" label="Email" isError errorMessage="Enter a valid email" value={val} />

// Disabled
<Input id="plan" label="Plan" value="Free" disabled />
```

### Anti-patterns

- DO NOT use `placeholder` as the only label — placeholder disappears on focus and fails contrast
- DO NOT set `isError` before the user has interacted (aria-invalid fires on load = false alerts for AT)
- DO NOT use `readOnly` when you mean `disabled` — readonly stays focusable and is submitted with form

---

## Identity

- **Component name:** Input
- **File:** `src/components/ui/input.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA21 (aria-invalid technique)
- **Reference:** shadcn/ui Input, Chakra UI Input, MUI TextField
- **Ticket:** ALE-768

---

## Variants (exhaustive)

| Prop | Values | Default |
|------|--------|---------|
| `variant` | `'outlined'` \| `'filled'` | `'outlined'` |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` |
| `type` | `'text'` \| `'email'` \| `'password'` \| `'url'` \| `'search'` \| `'tel'` | `'text'` |
| `leftIcon` | `ReactNode` | `undefined` |
| `rightIcon` | `ReactNode` | `undefined` |
| `isError` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `readOnly` | `boolean` | `false` |

**Icon slot rules:**
- `leftIcon` / `rightIcon` accept any ReactNode — consumer passes Lucide icon or SVG
- Icon wrapper always has `aria-hidden="true"` and `pointer-events-none` (decorative)
- When icon is present, input padding adjusts: `pl-10` for leftIcon (md), `pr-10` for rightIcon (md)
- Icon inherits color via `currentColor` — wrapper sets `text-[hsl(var(--muted-foreground))]` by default, `text-[hsl(var(--destructive))]` when `isError`

**Filled variant visual (Material D3 Pattern A):**
- `bg-[hsl(var(--muted))]` (no bg for outlined)
- `border-0 border-b-2 border-[hsl(var(--border))]` (no top/side border)
- On focus: `border-b-[hsl(var(--ring))]`
- No `rounded-t-none` — keep full radius, underline is the variant signal

---

## States (ALL required)

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| default | border-[hsl(var(--border))] | — |
| hover | border-[hsl(var(--ring))] | `hover:border-[hsl(var(--ring))]` |
| focus-visible | ring-2 ring-[hsl(var(--ring))] ring-offset-1 | `focus-visible:ring-2` |
| disabled | opacity-50 cursor-not-allowed | native `disabled` attr |
| readonly | bg-[hsl(var(--muted))] cursor-default | native `readOnly` attr |
| error | border-[hsl(var(--destructive))] | `aria-invalid="true"` |
| loading | N/A — Input has no loading state | N/A |
| selected/checked | N/A — not applicable | N/A |

---

## Interaction Zones

- **Clickable area:** entire input field
- **Trigger:** click focuses input
- **Tab:** input element receives focus
- **Enter:** submits form (native behavior)
- **Escape:** N/A (no dropdown)
- **Arrow keys:** cursor movement within text (native)

---

## Visual Design

### Dimensions

| Property | Value | Token / Tailwind class |
|----------|-------|------------------------|
| Width | 100% (full-width by default) | `w-full` |
| sm height | 32px | `h-8` |
| md height | 40px | `h-10` |
| lg height | 48px | `h-12` |
| Min touch target | 44×44px | md/lg satisfy natively; sm wrapped in label row |

### Internal proportions

| Property | Value | Token / class | Notes |
|----------|-------|---------------|-------|
| sm padding x | 8px | `px-2` | |
| md padding x | 12px | `px-3` | |
| lg padding x | 16px | `px-4` | |
| sm font size | 14px | `text-sm` | |
| md font size | 14px | `text-sm` | |
| lg font size | 16px | `text-base` | |
| gap label→input | 4px | `gap-1` | within field wrapper |
| gap input→helper | 4px | `gap-1` | within field wrapper |

### Border & shape

| Property | Value | Token |
|----------|-------|-------|
| Border radius | `var(--radius)` | `rounded-[var(--radius)]` |
| Border width | 1px | `border` |
| Focus ring width | 2px | `ring-2` |
| Focus ring offset | 1px | `ring-offset-1` |

### Anti-patterns (visual)

- DO NOT use `p-[10px]` or `p-[13px]` — not on 4px scale
- DO NOT use `h-3.5` (14px) for icons inside input — use `h-4` (16px)

---

## Token Compliance (NO hardcoded values)

| CSS property | Token used |
|-------------|-----------|
| background | `var(--background)` |
| text | `var(--foreground)` |
| placeholder | `var(--muted-foreground)` |
| border | `var(--border)` |
| ring | `var(--ring)` |
| error border | `var(--destructive)` |
| disabled bg | `var(--muted)` |
| label text | `var(--foreground)` |
| helper text | `var(--muted-foreground)` |
| error text | `var(--destructive)` |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** implicit `textbox` (native `<input>`) — no role attr needed
- **aria-live:** `assertive` on error `<span>` (injected on validation)
- **aria-label / aria-labelledby:** always `<label htmlFor="id">` + `<input id="id">` — never placeholder-only
- **aria-invalid:** `"true"` when `isError=true` — set only after interaction, not on mount
- **aria-describedby:** space-separated IDs of helper + error spans (both always in DOM, toggled via CSS)
- **aria-required:** passed through as prop if required
- **aria-readonly:** set via native `readOnly` attr
- **aria-hidden on decorative icons:** yes

---

## Animation

- Enter: N/A
- Exit: N/A
- State change: `transition-colors duration-150` on border and ring
- `prefers-reduced-motion:` handled via `motion-safe:` prefix on transitions

---

## Dark Mode

- [x] All tokens semantic — dark mode activates via `?mode=dark` URL param (NOT CSS class toggle / NOT `data-theme`)
- [x] No hardcoded colors
- [x] Verified at `/preview?tab=components&mode=dark`

---

## Demo States (required in ComponentGallery)

| State | Label in demo | Notes |
|-------|--------------|-------|
| default (md) | "Default" | Interactive — user can type |
| with placeholder | "With placeholder" | Shows placeholder text |
| with value | "With value" | Pre-filled value |
| disabled | "Disabled" | Non-interactive, opacity-50 |
| readonly | "Read only" | Focusable, not editable |
| error | "Error state" | isError + errorMessage |
| with helper | "Helper text" | Shows helper below input |
| size sm | "Small" | h-8 |
| size lg | "Large" | h-12 |

---

## Test Plan (written BEFORE implementation)

- [ ] All variants render without errors
- [ ] `cursor:text` on enabled input — Playwright
- [ ] `cursor:not-allowed` on disabled — Playwright
- [ ] No `style` with hex color — Playwright
- [ ] axe-core: 0 critical violations
- [ ] Keyboard: Tab → focus visible ring appears
- [ ] `aria-invalid="true"` on error state
- [ ] `aria-describedby` references valid DOM IDs for helper + error
- [ ] Dark mode renders correctly
- [ ] `npm run lint:ui` passes

---

## Spec Sign-off

- [x] Variants complete
- [x] All states addressed
- [x] Visual Design section filled with token-based values (no arbitrary px)
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Test plan written

**Spec complete:** YES
