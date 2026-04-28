# Component Spec: Select

---

## Usage Guidelines

### When to use this component

- Use when: presenting 6–30 mutually exclusive options and vertical space is constrained
- Use when: options are well-known and don't require search/filtering
- Do NOT use when: 2–5 options and vertical space allows → use **Radio**
- Do NOT use when: 30+ options or user needs to type/filter → use **Combobox**
- Do NOT use when: single boolean toggle → use **Switch**

### Variant decision tree

```
Mutually exclusive choice?
├── 2–5 options, space allows → Radio
├── 6–30 options, fixed list → Select
├── 30+ options or needs search → Combobox
└── Boolean (on/off) → Switch
```

### Common patterns

```tsx
// Basic controlled
const [value, setValue] = useState('system')
<Select value={value} onValueChange={setValue}>
  <SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>

// Form field (label + helper + error wired automatically)
<SelectField id="country" label="Country" placeholder="Choose country"
  helperText="We'll ship to this address.">
  <SelectItem value="us">United States</SelectItem>
  <SelectItem value="gb">United Kingdom</SelectItem>
</SelectField>

// Error state
<SelectField id="plan" label="Plan" isError errorMessage="Please select a plan."
  placeholder="Select plan">
  <SelectItem value="free">Free</SelectItem>
  <SelectItem value="pro">Pro</SelectItem>
</SelectField>
```

### Anti-patterns

- Don't use Select for 2–4 options — Radio shows all choices at once, reducing cognitive load
- Don't use Select when users need to search — Combobox has a text input for filtering
- Don't use bare SelectTrigger in forms without SelectField — label/aria wiring is manual and error-prone

---

## Identity

- **Component name:** Select
- **File:** `src/components/ui/select.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ (Select-only combobox)
- **Reference:** shadcn/ui Select, Radix UI Select primitive
- **Ticket:** ALE-834

---

## Industry Parity Check

| Feature / Prop | Material | Carbon | Spectrum | Fluent | shadcn | **Include?** | Reason if excluded |
|----------------|----------|--------|----------|--------|--------|-------------|-------------------|
| Size variants (sm/md/lg) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ YES | Core UX need |
| Error state + message | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ YES | Form validation required |
| Disabled trigger | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ YES | |
| Disabled individual item | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ YES | |
| Grouped options (SelectGroup) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ YES | |
| Leading icon on item | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ YES | Implemented via leadingIcon |
| Helper text | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ YES | Via SelectField |
| Multi-select | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ NO | Out of scope (separate ticket) |
| Async / dynamic options | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ NO | That's Combobox |

---

## Variants

| Prop | Values | Default |
|------|--------|---------|
| `size` (SelectTrigger) | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `isError` (SelectTrigger) | `boolean` | `false` |
| `disabled` (Select root) | `boolean` | `false` |
| `disabled` (SelectItem) | `boolean` | `false` |

---

## States

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| default (no value) | Placeholder visible in muted color | `text-[hsl(var(--muted-foreground))]` |
| default (value selected) | Selected label visible | `text-[hsl(var(--foreground))]` |
| open / expanded | Portal `<ul>` rendered | `aria-expanded="true"` on trigger |
| option focused | Option bg accent | `bg-[hsl(var(--accent))]` |
| option selected | Check icon in left-2 slot | `aria-selected="true"` |
| disabled trigger | opacity-50, cursor-not-allowed | `opacity-50 cursor-not-allowed pointer-events-none` |
| disabled option | opacity-50, skipped by arrow keys | `aria-disabled="true" tabIndex={-1}` |
| error | Destructive border + focus ring | `aria-invalid="true"` |
| loading | N/A — not implemented | — |

---

## Interaction Zones

- **Clickable area:** entire SelectTrigger button
- **Trigger:** click or Enter/Space/ArrowDown opens listbox
- **Tab:** focus lands on SelectTrigger; Tab inside open listbox exits naturally
- **Enter/Space:** on trigger = open; on focused option = select + close
- **Escape:** closes listbox, returns focus to trigger
- **Arrow keys:** ArrowDown/Up navigate enabled options (wrap-around)
- **Click outside:** mousedown listener closes listbox

---

## Visual Design

### Dimensions

| Property | Value | Token / Tailwind class |
|----------|-------|------------------------|
| Height sm | 36px | `h-9` |
| Height md | 40px | `h-10` |
| Height lg | 44px | `h-11` |

### Internal proportions

| Property | Value | Token / class |
|----------|-------|---------------|
| Horizontal padding | 12px | `px-3` |
| Chevron icon | 16px | `h-4 w-4` |
| Check icon | 16px | `h-4 w-4` |
| Option padding | 8px 12px | `py-2 px-3` |
| Content padding | 4px | `p-1` |

### Border & shape

| Property | Value | Token |
|----------|-------|-------|
| Border radius | `var(--radius)` | `rounded-[var(--radius)]` |
| Border width | 1px | `border` |

### Anti-patterns (visual)

- NO arbitrary px — all sizes on 4px scale
- NO `h-3.5` (14px) anywhere
- NO hardcoded hex — all `hsl(var(--token))`

---

## Token Compliance

| CSS property | Token used |
|-------------|-----------|
| trigger background | `hsl(var(--background))` |
| trigger text | `hsl(var(--foreground))` |
| trigger border | `hsl(var(--input))` |
| trigger focus ring | `hsl(var(--ring))` |
| trigger error border | `hsl(var(--destructive))` |
| content background | `hsl(var(--popover))` |
| content text | `hsl(var(--popover-foreground))` |
| option hover bg | `hsl(var(--accent))` |
| option hover text | `hsl(var(--accent-foreground))` |
| placeholder | `hsl(var(--muted-foreground))` |
| shadow | `var(--shadow-md)` |

**Hardcoded values:** NONE.

---

## ARIA

| Element | Role / Attribute | Value |
|---------|-----------------|-------|
| SelectTrigger `<button>` | `role="combobox"` | — |
| | `aria-expanded` | `true/false` |
| | `aria-haspopup` | `"listbox"` |
| | `aria-controls` | listbox id |
| | `aria-invalid` | `"true"` when isError |
| SelectContent `<ul>` | `role="listbox"` | — |
| | `aria-labelledby` | trigger id |
| SelectItem `<li>` | `role="option"` | — |
| | `aria-selected` | `true/false` |
| | `aria-disabled` | `true` when disabled |
| SelectGroup `<div>` | `role="group"` | — |
| SelectSeparator | `role="separator"` | — |
| Icons | `aria-hidden="true"` | — |

**Focus model:** real DOM focus on `<li>` (tabIndex=0), not aria-activedescendant. Both are valid APG patterns.

---

## Animation

- Enter: `animate-in fade-in-0 zoom-in-95 [animation-duration:var(--duration-fast)]`
- Exit: N/A (portal unmounts on close)
- `prefers-reduced-motion`: `motion-safe:` prefix on animate-in classes

---

## Dark Mode

- [ ] All tokens semantic — dark mode activates via `?mode=dark`
- [ ] No hardcoded colors
- [ ] Verified at `/preview?tab=components&mode=dark`

---

## Demo States

### Tab 1 — Overview: 3 live demo rows

| Row | Label | Setup |
|-----|-------|-------|
| 1 | Basic (md) | Controlled, 3 theme options, placeholder |
| 2 | With label + helper (SelectField) | label, helperText, 3 country options |
| 3 | Error state | isError, errorMessage, 2 plan options |

### Tab 5 — States: 8 live rows

| Label | Setup |
|-------|-------|
| Default (no selection) | placeholder visible |
| Default (value selected) | pre-selected option |
| Size sm | `size="sm"` |
| Size lg | `size="lg"` |
| Disabled | `disabled` on Select root |
| Error | `isError` on SelectTrigger |
| With leadingIcon | flag emoji on items |
| Grouped + separator | SelectGroup + SelectLabel + SelectSeparator |

---

## Test Plan

### Component-specific Playwright assertions

- [ ] Click trigger → `aria-expanded="true"` on trigger + `[role="listbox"]` visible in Portal
- [ ] Click option → `aria-expanded="false"` + selected value appears in trigger text
- [ ] Click disabled option → value does NOT change, listbox stays open
- [ ] Press Escape when open → listbox closes, focus returns to trigger
- [ ] Press ArrowDown on trigger → listbox opens, first enabled option focused
- [ ] Press ArrowDown twice in open listbox → second option focused
- [ ] Disabled trigger → click does NOT open listbox, `aria-expanded` stays `"false"`

### Dark mode

- [ ] Verified at `/preview?tab=components&mode=dark`

---

## Spec Sign-off

- [x] Industry Parity Check table filled
- [x] Variants complete
- [x] All states addressed
- [x] Visual Design section filled with token-based values
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Test plan written

**Spec complete: YES**

---

## Retrospective

*(Fill after visual gate approval, before merge)*

- **iterations_to_done:** 3 (implement → token audit fix → QA id fix)
- **What went wrong:** (1) border-l-[3px] off 4px scale + --success fallback hex in DoDontCard. (2) #select-error placed in States tab but test runs on Overview tab without navigating.
- **Root cause:** QA test expects element visible on page load; id must be on Overview tab element, not lazy-rendered States tab.
- **New Error Log entry created?** no (iterations ≤5)
- **Automation ticket link:** none
- **Memory update:** yes

<!-- retrospective updated 2026-04-28 -->
