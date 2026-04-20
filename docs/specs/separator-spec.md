# Component Spec: Separator

---

## Usage Guidelines

### When to use this component

- Use when: разделение групп контента, section dividers на preview page, горизонтальный разрыв между компонентами в gallery
- Do NOT use when: нужен заголовок/label внутри разделителя → "labeled divider" паттерн; нужны отступы → используй spacing/margin родителя

### Common patterns

```tsx
// Горизонтальный (по умолчанию, декоративный)
<Separator />

// Вертикальный в inline-flex ряду
<div className="flex items-center gap-2">
  <span>Item A</span>
  <Separator orientation="vertical" className="h-4" />
  <span>Item B</span>
</div>

// Семантический (структурный разрыв контента)
<Separator decorative={false} />
```

---

## Identity

- **Component name:** Separator
- **File:** `src/components/ui/separator.tsx`
- **ARIA APG pattern:** [Separator (role)](https://www.w3.org/WAI/ARIA/apg/patterns/separator/) — decorative: `role="none"`, semantic: `role="separator"`
- **Reference:** [Radix Separator](https://www.radix-ui.com/primitives/docs/components/separator), [shadcn/ui Separator](https://ui.shadcn.com/docs/components/radix/separator)
- **Ticket:** ALE-773

---

## Industry Parity Check

| Feature / Prop | Material UI | Spectrum | Fluent 2 | Twilio Paste | shadcn | **Include?** | Reason if excluded |
|----------------|------------|---------|----------|-------------|--------|-------------|-------------------|
| `orientation` (h/v) | yes | yes | yes | yes | yes | YES | Present in all 5 |
| Default: horizontal | yes | yes | yes | yes | yes | YES | Universal default |
| `decorative` bool | — | — | — | — | yes (Radix) | YES | Core a11y |
| 1px visual weight | yes | yes | yes | yes | yes | YES | Universal spec |
| `--border` color token | yes | yes | yes | yes | yes | YES | Universal |
| `shrink-0` in flex | implicit | implicit | implicit | implicit | yes | YES | Prevents collapse |
| Size variants | — | S/M/L | — | — | — | NO | Spectrum-only |
| `variant` / `inset` | yes | — | yes | — | — | NO | CSS concern → className |
| Children / label | yes | — | yes | — | — | NO | Separate pattern |
| `className` passthrough | yes | — | — | — | yes | YES | shadcn convention |

**GATE:** ✅ Table complete.

---

## Variants

| Prop | Values | Default |
|------|--------|---------|
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |
| `decorative` | `boolean` | `true` |

No `variant` or `size` props — overrides via `className`.

---

## States

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| default | `bg-[hsl(var(--border))]` | — |
| hover | N/A — not interactive | — |
| focus-visible | N/A — not interactive | — |
| active | N/A | — |
| disabled | N/A | — |
| loading | N/A | — |
| error | N/A | — |
| horizontal | `h-px w-full` | `data-orientation="horizontal"` |
| vertical | `h-full w-px` | `data-orientation="vertical"` |

---

## Interaction Zones

- **Clickable area:** None
- **Trigger:** None
- **Tab:** Not focusable (`tabindex` absent)
- **Enter/Space:** N/A
- **Escape:** N/A
- **Arrow keys:** N/A

---

## Visual Design

### Dimensions

| Orientation | Width | Height | Token / class |
|-------------|-------|--------|---------------|
| Horizontal | `w-full` (100%) | `h-px` (1px) | — |
| Vertical | `w-px` (1px) | `h-full` (100%) | — |

**На 4px scale:** `1px` — accepted exception. Separator — hairline rule, не layout box. Используется в 5/5 DS.

### Internal proportions

No icon, no padding. Pure line element.

### Border & shape

No border radius. No border — separator IS the visual line via `background-color`.

### Anti-patterns (visual)

- DO NOT add `border` — use `background-color` (bg-border)
- DO NOT add margin — spacing is parent's responsibility
- DO NOT use `height: 2px` — separator is always 1px

---

## Token Compliance

| CSS property | Token used |
|-------------|-----------|
| background | `hsl(var(--border))` via `bg-border` Tailwind class |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** `"none"` when `decorative={true}` (default); `"separator"` when `decorative={false}`
- **aria-orientation:** Omitted for horizontal (implicit default per ARIA spec). Explicitly `"vertical"` for vertical — set by Radix automatically
- **aria-hidden:** Not needed — `role="none"` is the correct approach for decorative
- **tabindex:** None — separator is never interactive
- **aria-hidden on decorative icons:** N/A

---

## Animation

- None — separator is static.
- `prefers-reduced-motion:` N/A.

---

## Dark Mode

- [x] All tokens semantic — `--border` auto-switches: light `#d4d4d4` → dark `#404040`
- [x] No hardcoded colors
- [x] Verify at `/preview?tab=components&mode=dark`

---

## Demo States (required in ComponentGallery)

| State | Label in demo | Notes |
|-------|--------------|-------|
| horizontal default | "Horizontal" | Full width |
| vertical default | "Vertical" | Inside flex row, explicit `h-4` |

**GATE:** Оба варианта должны быть видны в ComponentGallery перед Visual Gate.

---

## Test Plan

### Universal gates (уже в component-qa.spec.ts)

- [x] No JS errors
- [x] axe-core: 0 critical violations
- [x] No inline hex colors

### Component-specific Playwright assertions

```typescript
// 1. Decorative separator (default) — role="none"
const sep = page.locator('[data-slot="separator"]').first()
await expect(sep).toHaveAttribute('role', 'none')

// 2. Horizontal separator — data-orientation attribute
await expect(sep).toHaveAttribute('data-orientation', 'horizontal')

// 3. Horizontal separator — 1px height
const box = await sep.boundingBox()
expect(box?.height).toBe(1)
expect(box?.width).toBeGreaterThan(1)

// 4. Vertical separator — aria-orientation + dimensions
const vSep = page.locator('[data-slot="separator"][data-orientation="vertical"]').first()
await expect(vSep).toHaveAttribute('aria-orientation', 'vertical')
const vBox = await vSep.boundingBox()
expect(vBox?.width).toBe(1)
expect(vBox?.height).toBeGreaterThan(1)

// 5. Not interactive — no cursor:pointer
const cursor = await sep.evaluate(el => getComputedStyle(el).cursor)
expect(cursor).not.toBe('pointer')

// 6. No tabindex
await expect(sep).not.toHaveAttribute('tabindex')

// 7. Background resolves (CSS var works)
const bg = await sep.evaluate(el => getComputedStyle(el).backgroundColor)
expect(bg).toMatch(/^rgb/)
```

### Dark mode
- [ ] Verified at `/preview?tab=components&mode=dark`

---

## Spec Sign-off

- [x] Industry Parity Check table filled
- [x] Variants complete
- [x] All states addressed
- [x] Visual Design with token-based values
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Test plan written

**Spec complete:** YES
