# Component Spec: [ComponentName]

> Fill this out COMPLETELY before writing any implementation code.
> Empty sections = incomplete spec = blocked implementation.
> Source: ARIA APG pattern → reference library → Figma/design.

---

## Usage Guidelines

> Fill this in AFTER spec is complete. Required before visual gate.

### When to use this component

- Use when: (specific trigger / context / user need)
- Do NOT use when: (anti-patterns — what to use instead)

### Variant decision tree

```
Need an action?
├── Primary CTA → variant="default"
├── Secondary action → variant="secondary" or variant="outline"
├── Inline action (no bg) → variant="ghost"
├── Destructive action → variant="destructive"
└── Navigation-style link → variant="link"
```

### State decision tree

```
Which disabled pattern?
├── Form submitting → isLoading (stays clickable-looking, aria-disabled)
├── Permanently unavailable → disabled attr (removed from tab order)
└── Conditionally unavailable → aria-disabled="true" (stays in tab order, shows tooltip)
```

### Common patterns

```tsx
// (fill in with 2-3 most common usage examples from real screens)
```

### Anti-patterns

- (what NOT to do, with reason)

---

## Identity

- **Component name:**
- **File:** `src/components/ui/[name].tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/[pattern]/
- **Reference:** (MUI / Radix / shadcn source links)
- **Ticket:** ALE-XXX

---

## Variants (exhaustive — no "etc.")

| Prop | Values | Default |
|------|--------|---------|
| `variant` | | |
| `size` | | |

---

## States (ALL required — write "N/A — reason" if not applicable)

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| default | | |
| hover | cursor:pointer? bg change? | |
| focus-visible | ring-2 | |
| active (mousedown) | scale / opacity | |
| disabled | cursor:not-allowed, opacity | |
| loading | spinner / skeleton | |
| error | error color, aria-invalid | |
| selected/checked | data-state="checked" | |

---

## Interaction Zones

- **Clickable area:** (exact element — e.g. "entire label row, not just control")
- **Trigger:** (what click/keypress does)
- **Tab:** (what receives focus)
- **Enter/Space:** (what activates)
- **Escape:** (what closes, if applicable)
- **Arrow keys:** (if navigable list)

---

## Visual Design

> Fill this section using only values from the spacing/sizing token scale.
> NO hardcoded px values. NO arbitrary Tailwind values like p-[10px].
>
> Spacing token → Tailwind class mapping (4px base scale):
> | Token        | px   | Tailwind |
> |--------------|------|----------|
> | --space-0    | 0    | gap-0 / p-0 |
> | --space-1    | 2px  | (no direct class — use gap-px × 2) |
> | --space-2    | 4px  | gap-1 / p-1 |
> | --space-3    | 6px  | gap-1.5 / p-1.5 |
> | --space-4    | 8px  | gap-2 / p-2 |
> | --space-5    | 12px | gap-3 / p-3 |
> | --space-6    | 16px | gap-4 / p-4 |
> | --space-7    | 20px | gap-5 / p-5 |
> | --space-8    | 24px | gap-6 / p-6 |
> | --space-9    | 32px | gap-8 / p-8 |
> | --space-10   | 48px | gap-12 / p-12 |
>
> Icon sizes: --icon-indicator(12px=h-3) --icon-sm(16px=h-4) --icon-md(20px=h-5) --icon-lg(24px=h-6)
> FORBIDDEN: h-3.5 (14px), p-[10px], p-[13px] — not on scale

### Dimensions

| Property | Value | Token / Tailwind class |
|----------|-------|------------------------|
| Width | | |
| Height | | |
| Min touch target | 44×44px | wrapper padding |

### Internal proportions

| Property | Value | Token / class | Notes |
|----------|-------|---------------|-------|
| [icon / inner element] size | | | Must stay on 4px scale |
| [padding / gap] | | | Cannot be arbitrary px |

### Border & shape

| Property | Value | Token |
|----------|-------|-------|
| Border radius | | `var(--radius)` or fixed px on 4px scale |
| Border width | | |

### Anti-patterns (visual)

- DO NOT use arbitrary px values — every size must land on the 4px scale token
- DO NOT size an icon to fill 100% of its container — always leave ≥1 step (≥2px) visual gap
- DO NOT mix Tailwind's arbitrary values (`p-[13px]`) with the token scale

---

## Token Compliance (NO hardcoded values)

| CSS property | Token used |
|-------------|-----------|
| background | `var(--background-primary)` |
| text | `var(--text-primary)` |
| border | `var(--border-primary)` |
| ring | `var(--brand-primary)` |

**Hardcoded values:** NONE. Any hardcoded value = spec incomplete.

---

## ARIA

- **role:**
- **aria-live:** (assertive/polite/off — if dynamic)
- **aria-label / aria-labelledby:**
- **aria-disabled:**
- **aria-hidden on decorative icons:** yes

---

## Animation

- Enter: (e.g. fade-in 150ms ease-out)
- Exit: (e.g. fade-out 100ms ease-in)
- State change: (transition 200ms)
- `prefers-reduced-motion:` handled via `motion-safe:` prefix

---

## Dark Mode

- [ ] All tokens semantic (auto-switch via [data-theme="dark"])
- [ ] No hardcoded colors

---

## Test Plan (written BEFORE implementation)

- [ ] All variants render without errors
- [ ] `cursor:pointer` on interactive elements — Playwright
- [ ] `cursor:not-allowed` on disabled — Playwright
- [ ] No `style` with hex color — Playwright
- [ ] Full-row click zone — Playwright
- [ ] axe-core: 0 critical violations
- [ ] Keyboard: Tab → focus visible, Enter/Space → action
- [ ] Dark mode renders correctly
- [ ] `npm run lint:ui` passes

---

## Spec Sign-off

- [ ] Variants complete
- [ ] All states addressed (write "N/A — reason" if not applicable, never leave blank)
- [ ] Visual Design section filled with token-based values (no arbitrary px)
- [ ] All CSS → tokens
- [ ] ARIA specified
- [ ] Test plan written

> **GATE:** Если хотя бы один пункт выше не отмечен → `Spec complete: NO`.
> `designer` субагент приступает к реализации ТОЛЬКО при `Spec complete: YES`.
> Оркестратор ОБЯЗАН проверить этот статус перед Step 2.

**Spec complete:** YES / NO

> Implementation starts only when "Spec complete: YES"
