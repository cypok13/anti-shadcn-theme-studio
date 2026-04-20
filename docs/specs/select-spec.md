# Component Spec: Select

---

## Usage Guidelines

### When to use this component

- Use when: user must choose exactly one option from a predefined list (5–20 options)
- Use when: screen space is limited — list stays hidden until triggered
- Do NOT use when: <5 options → use RadioGroup instead
- Do NOT use when: searchable/filterable list needed → use Combobox (separate component)
- Do NOT use when: multiple selections needed → use MultiSelect (separate component)

### Variant decision tree

```
Need a select?
├── How many options?
│   ├── <5 → RadioGroup
│   ├── 5–20 → Select (this component)
│   └── >20 searchable → Combobox
├── What size?
│   ├── Dense UI / table rows → size="sm"
│   ├── Default forms → size="md" (default)
│   └── Hero / large forms → size="lg"
└── Options grouped? → use SelectGroup + SelectLabel
```

### Common patterns

```tsx
// Basic
<SelectField label="Country" placeholder="Select country">
  <SelectItem value="us">United States</SelectItem>
  <SelectItem value="gb">United Kingdom</SelectItem>
</SelectField>

// With error
<SelectField label="Role" isError errorMessage="Please select a role">
  <SelectItem value="admin">Admin</SelectItem>
  <SelectItem value="viewer">Viewer</SelectItem>
</SelectField>

// Grouped
<SelectField label="Font" placeholder="Choose font">
  <SelectGroup label="Sans-serif">
    <SelectItem value="inter">Inter</SelectItem>
    <SelectItem value="geist">Geist</SelectItem>
  </SelectGroup>
  <SelectGroup label="Monospace">
    <SelectItem value="jetbrains">JetBrains Mono</SelectItem>
  </SelectGroup>
</SelectField>
```

### Anti-patterns

- DO NOT use `position="item-aligned"` — causes overflow on short viewports; always use `position="popper"`
- DO NOT add leading icon to trigger — not in scope; compose manually if needed
- DO NOT use for searchable lists — use Combobox instead

---

## Identity

- **Component name:** Select
- **File:** `src/components/ui/select.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- **Reference:** https://www.radix-ui.com/primitives/docs/components/select · https://ui.shadcn.com/docs/components/select
- **Ticket:** ALE-768

---

## Industry Parity Check

| Feature / Prop | Material 3 | Carbon | Spectrum | Fluent 2 | Atlassian | shadcn | **Include?** | Reason if excluded |
|----------------|:----------:|:------:|:--------:|:--------:|:---------:|:------:|:-----------:|-------------------|
| Size variants sm/md/lg | partial | YES | partial | YES | partial | NO | **YES** | 3+ DS |
| Placeholder | YES | YES | YES | YES | YES | YES | **YES** | Universal |
| Disabled state | YES | YES | YES | YES | YES | YES | **YES** | Universal |
| Error/invalid state | YES | YES | YES | YES | YES | partial | **YES** | shadcn gap — add `aria-invalid` styling |
| Required prop | YES | YES | YES | YES | YES | YES | **YES** | Universal |
| Helper text | YES | YES | YES | YES | YES | NO | **YES** | 5/6 DS — shadcn gap |
| Error message text | YES | YES | YES | YES | YES | NO | **YES** | 5/6 DS — shadcn gap |
| Group / section support | YES | YES | YES | YES | YES | YES | **YES** | Universal |
| Leading icon in items | YES | NO | YES | NO | YES | NO | **YES** | 3/6 DS |
| Scroll buttons (long lists) | NO | YES | YES | YES | YES | YES | **YES** | 5/6 DS — Radix built-in |
| Keyboard type-ahead | YES | YES | YES | YES | YES | YES | **YES** | Universal — Radix built-in |
| Leading icon in trigger | YES | NO | NO | NO | partial | NO | NO | Only 1–2 DS; compose manually |
| Searchable/filterable | NO | separate | NO | NO | YES | separate | NO | Out of scope — Combobox |
| Multi-select | NO | separate | separate | YES | YES | separate | NO | Out of scope — separate component |
| Quiet/underline variant | NO | NO | YES | YES | NO | NO | NO | Only 2 DS |
| isLoading state | NO | NO | YES | NO | NO | NO | NO | Out of scope for MVP |

**GATE:** Parity check complete. All REQUIRED features included.

---

## Variants

| Prop | Values | Default |
|------|--------|---------|
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` |
| `disabled` | `boolean` | `false` |
| `required` | `boolean` | `false` |
| `isError` | `boolean` | `false` |
| `placeholder` | `string` | — |
| `label` | `string` | — |
| `helperText` | `string` | — |
| `errorMessage` | `string` | — |

**Size dimensions:**

| Size | Height | Padding X | Font size | Icon size |
|------|--------|-----------|-----------|-----------|
| sm | `h-8` (32px) | `px-2` (8px) | `text-xs` | `h-3 w-3` |
| md | `h-9` (36px) | `px-3` (12px) | `text-sm` | `h-4 w-4` |
| lg | `h-10` (40px) | `px-4` (16px) | `text-sm` | `h-4 w-4` |

---

## States

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| default (closed) | — | `data-state="closed"` on trigger |
| open | dropdown visible | `data-state="open"` on trigger + content |
| placeholder | no value selected | `data-[placeholder]` on trigger |
| hover | bg change on trigger | `hover:bg-accent/50` |
| focus-visible | ring-2 on trigger | `focus-visible:ring-2 focus-visible:ring-ring` |
| active (mousedown) | N/A — Radix handles | — |
| disabled | opacity-50, cursor-not-allowed, no interaction | `data-[disabled]` / `disabled` attr |
| error | red border + ring, aria-invalid | `aria-invalid="true"`, `aria-describedby` → error message |
| item default | bg-transparent | — |
| item highlighted | accent bg | `data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground` |
| item selected | checkmark in ItemIndicator | `data-state="checked"` |
| item disabled | opacity-50, skip in keyboard nav | `data-[disabled]` |

---

## Interaction Zones

- **Clickable area:** entire trigger button (`SelectTrigger`) — full width
- **Trigger:** click or Enter/Space opens dropdown
- **Tab:** moves focus to/from trigger; dropdown items are NOT in tab order
- **Enter / Space:** on trigger → opens; on highlighted item → selects + closes
- **Escape:** closes dropdown, returns focus to trigger
- **Arrow keys:** ArrowDown/Up navigates items (Radix handles natively); opens dropdown if closed
- **Type-ahead:** printable characters jump to matching option (Radix native)
- **Home / End:** first / last item (Radix native)
- **Click outside:** closes dropdown

---

## Visual Design

### Trigger Dimensions

| Property | Value | Token / Tailwind class |
|----------|-------|------------------------|
| Height sm | 32px | `h-8` |
| Height md | 36px | `h-9` |
| Height lg | 40px | `h-10` |
| Min touch target | 44×44px | lg size + wrapper padding if needed |
| Width | full parent | `w-full` |

### Internal proportions

| Property | Value | Token / class | Notes |
|----------|-------|---------------|-------|
| Padding X sm | 8px | `px-2` | On 4px scale |
| Padding X md | 12px | `px-3` | On 4px scale |
| Padding X lg | 16px | `px-4` | On 4px scale |
| Chevron icon size md/lg | 16px | `h-4 w-4` | `--icon-sm` |
| Chevron icon size sm | 12px | `h-3 w-3` | `--icon-indicator` |
| ItemIndicator icon | 12px | `h-3 w-3` | `--icon-indicator` — NOT h-3.5 (E-011 lesson) |
| Item padding | pl-8 pr-2 py-1.5 | `pl-8 pr-2 py-1.5` | space for indicator |
| Content min-width | trigger width | `min-w-[var(--radix-select-trigger-width)]` | |
| Content padding | 4px | `p-1` | |
| Content offset | 4px | `sideOffset={4}` on Content | |

### Border & shape

| Property | Value | Token |
|----------|-------|-------|
| Border radius (trigger) | `var(--radius)` | `rounded-[var(--radius)]` |
| Border radius (content) | `var(--radius)` | `rounded-[var(--radius)]` |
| Border radius (item) | 4px | `rounded-sm` |
| Border width | 1px | `border` |

### Anti-patterns (visual)

- DO NOT use `h-3.5` for ItemIndicator — use `h-3 w-3` (12px = on scale)
- DO NOT hardcode heights — use size token map
- DO NOT use `position="item-aligned"` — causes clipping

---

## Token Compliance

| CSS property | Token used |
|-------------|-----------|
| Trigger background | `var(--background)` → `bg-background` |
| Trigger border | `var(--input)` → `border-input` |
| Trigger text | `var(--foreground)` → `text-foreground` |
| Trigger placeholder | `var(--muted-foreground)` → `data-[placeholder]:text-muted-foreground` |
| Trigger focus ring | `var(--ring)` → `ring-ring` |
| Trigger error border | `var(--destructive)` → `aria-[invalid=true]:border-destructive` |
| Trigger disabled | opacity-50 |
| Chevron icon | `var(--muted-foreground)` → `text-muted-foreground` |
| Content background | `var(--popover)` → `bg-popover` |
| Content text | `var(--popover-foreground)` → `text-popover-foreground` |
| Content border | `var(--border)` → `border` |
| Item hover bg | `var(--accent)` → `data-[highlighted]:bg-accent` |
| Item hover text | `var(--accent-foreground)` → `data-[highlighted]:text-accent-foreground` |
| Group label | `var(--muted-foreground)` → `text-muted-foreground` |
| Separator | `var(--muted)` → `bg-muted` |
| Helper text | `var(--muted-foreground)` → `text-muted-foreground` |
| Error message | `var(--destructive)` → `text-destructive` |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** `combobox` on trigger, `listbox` on content, `option` on each item
- **aria-expanded:** `"true"` / `"false"` on trigger (Radix sets automatically)
- **aria-haspopup:** `"listbox"` on trigger (Radix sets automatically)
- **aria-controls:** points to listbox element (Radix sets automatically)
- **aria-activedescendant:** ID of highlighted item (Radix sets automatically)
- **aria-selected:** `"true"` on selected item (Radix sets automatically)
- **aria-disabled:** on disabled items (Radix sets automatically)
- **aria-invalid:** `"true"` on trigger when `isError=true` — **must be set manually**
- **aria-describedby:** points to error message element when `isError=true` — **must be set manually**
- **aria-label / aria-labelledby:** via external `<label htmlFor>` + `id` on trigger
- **aria-required:** `"true"` when `required=true`
- **aria-hidden on chevron icon:** yes — `aria-hidden="true"`

---

## Animation

- Enter: fade-in + zoom-in-95 (80ms ease-out) — `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95`
- Exit: fade-out + zoom-out-95 (80ms ease-in) — `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95`
- Side transitions: `data-[side=bottom]:slide-in-from-top-2` etc.
- `prefers-reduced-motion:` handled via `motion-safe:` prefix on animation classes

---

## Dark Mode

- [ ] All tokens semantic — dark mode activates via `?mode=dark` URL param (NOT CSS class toggle / NOT `data-theme`)
- [ ] No hardcoded colors
- [ ] Verified at `/preview?tab=components&mode=dark`

---

## Demo States (required in ComponentGallery)

| State | Label in demo | Notes |
|-------|--------------|-------|
| Size sm | "Small" | placeholder, no value |
| Size md | "Medium" | placeholder, no value |
| Size lg | "Large" | placeholder, no value |
| With value selected | "With value" | shows selected text |
| Disabled | "Disabled" | opacity-50, not interactive |
| Error | "Error" | red border, aria-invalid, error message below |
| With helper text | "With helper text" | label + helper below |
| Grouped options | "Grouped" | two SelectGroups with labels + separator |
| Items with icons | "Items with icons" | leading icon per item |
| Long list (scroll) | "Long list" | 12+ items, scroll buttons appear |

---

## Test Plan

- [ ] All size variants render without errors
- [ ] `cursor:pointer` on trigger — Playwright
- [ ] `cursor:not-allowed` on disabled — Playwright
- [ ] No `style` with hex color — Playwright
- [ ] Click trigger → dropdown opens (`aria-expanded="true"`) — Playwright
- [ ] Click item → item selected, dropdown closes — Playwright
- [ ] **EXCLUSIVE-SELECTION:** Select item A → open again → select item B → verify item A `aria-selected` becomes `"false"` — Playwright
- [ ] `Escape` closes dropdown — Playwright
- [ ] `aria-invalid="true"` on trigger when isError — Playwright
- [ ] axe-core: 0 critical violations
- [ ] Keyboard: Tab → focus trigger → Enter → open → ArrowDown → Enter → select
- [ ] Dark mode renders correctly at `/preview?tab=components&mode=dark`
- [ ] `npm run lint:ui` passes
- [ ] ItemIndicator icon is `h-3 w-3` (12px) — NOT `h-3.5`

---

## Spec Sign-off

- [x] Industry Parity Check table filled
- [x] Variants complete (size sm/md/lg, disabled, error, required)
- [x] All states addressed
- [x] Visual Design filled with token-based values
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Test plan written

**Spec complete:** YES
