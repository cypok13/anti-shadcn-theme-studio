# Component Spec: Badge

---

## Usage Guidelines

### When to use this component

- Use when: labeling status (success, warning, error), categorizing content (tags, types), drawing attention to new/updated items, showing counts in compact form
- Do NOT use when: you need a clickable action → use Button; you need a dismissible tag → add close icon manually; you need a full-status bar → use Callout

### Variant decision tree

```
What does the badge communicate?
├── Primary action label → variant="default"
├── Neutral/secondary info → variant="secondary"
├── No fill, just border → variant="outline"
├── Error / danger state → variant="destructive"
├── Success / positive → variant="success"
├── Caution / pending → variant="warning"
└── Info / neutral-blue → variant="info"
```

### Common patterns

```tsx
// Status badge
<Badge variant="success">Active</Badge>

// Category label
<Badge variant="secondary" size="sm">Design</Badge>

// Dot indicator (live status)
<Badge variant="success" dot aria-label="Online" />

// Inside a button or link context
<Badge asChild><a href="/new">New</a></Badge>
```

### Anti-patterns

- Do NOT use badge for interactive actions — it has no click handler by default
- Do NOT use `div` wrapper around badge inside inline contexts
- Do NOT add `disabled` prop — badge is decorative; apply `opacity-50 pointer-events-none` via className if needed

---

## Identity

- **Component name:** Badge
- **File:** `src/components/ui/badge.tsx`
- **ARIA APG pattern:** No dedicated pattern. Uses `<span>` (static) or `role="status"` (dynamic counter). See [ARIA22](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22)
- **Reference:** [shadcn v4 new-york badge](https://github.com/shadcn-ui/ui), [Fluent 2 Badge SPEC](https://github.com/microsoft/fluentui-react-native/tree/main/packages/components/Badge), [Spectrum Badge](https://react-spectrum.adobe.com/react-spectrum/Badge.html)
- **Ticket:** ALE-772

---

## Industry Parity Check

| Feature / Prop | Material 3 | Carbon | Spectrum | Fluent 2 | Atlassian | shadcn v4 | **Include?** | Reason if excluded |
|----------------|-----------|--------|----------|----------|-----------|-----------|-------------|-------------------|
| Element: `<span>` | yes | yes | yes | yes | yes | yes | YES | |
| Semantic color variants (success/warning/info) | — | yes | yes | yes | yes | — | YES | Present in 4/6 |
| `outline` variant | — | yes | yes | yes | — | yes | YES | Present in 4/6 |
| `dot` variant (no text) | yes | — | — | yes | — | — | YES | Present in 2+ DS for presence/status |
| Icon support (`[&>svg]:size-3`) | — | yes | yes | yes | — | yes | YES | Present in 4/6 |
| `size` prop (sm/md) | yes | yes | yes | yes | — | — | YES (sm/md) | Present in 5/6 |
| `asChild` / polymorphic | — | — | — | — | — | yes | YES | Allows `<a>` rendering |
| `ghost`/`link` variants | — | — | — | — | — | yes | NO | Interaction-states, not badge semantics |
| `disabled` state | — | yes | — | — | — | — | NO | Only Carbon; badge is decorative |
| `shape` (pill/square/round) | — | — | — | yes | — | — | NO | Adds prop surface area; pill is universal default |
| `max count` | — | — | — | yes | — | — | NO | Niche; out of scope |

**GATE:** ✅ Table complete.

---

## Variants (exhaustive)

| Prop | Values | Default |
|------|--------|---------|
| `variant` | `"default" \| "secondary" \| "outline" \| "destructive" \| "success" \| "warning" \| "info"` | `"default"` |
| `size` | `"sm" \| "md"` | `"sm"` |
| `dot` | `boolean` | `false` |
| `asChild` | `boolean` | `false` |

---

## States

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| default | base CVA classes | — |
| hover (link context only) | `[a&]:hover:bg-[hsl(var(--primary)/0.9)]` | activates only when badge is/inside `<a>` |
| focus-visible | ring-[3px] brand color | `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-[hsl(var(--ring)/0.5)]` |
| active (mousedown) | N/A — badge is not interactive | — |
| disabled | N/A — apply `opacity-50 pointer-events-none` via className externally | consumer responsibility |
| loading | N/A | — |
| error | use `variant="destructive"` | — |
| selected/checked | N/A — badge is decorative | — |
| dot indicator | `dot` prop renders `<span class="size-1.5 rounded-full bg-current mr-0.5" />` | — |

---

## Interaction Zones

- **Clickable area:** N/A by default. With `asChild` wrapping `<a>` — entire badge is clickable
- **Trigger:** No native trigger
- **Tab:** Focusable only when rendered as/inside an interactive element
- **Enter/Space:** N/A
- **Escape:** N/A
- **Arrow keys:** N/A

---

## Visual Design

### Dimensions

| Property | sm | md | Token / Tailwind class |
|----------|----|----|------------------------|
| Height (computed) | ~20px | ~22px | `py-0.5` / `py-1` + `text-xs` line-height |
| Min touch target | N/A — decorative | N/A | Badge is decorative, not interactive |

### Internal proportions

| Property | sm | md | Token / class | Notes |
|----------|----|----|---------------|-------|
| Padding horizontal | 8px | 10px | `px-2` / `px-2.5` | 4px scale compliant |
| Padding vertical | 2px | 4px | `py-0.5` / `py-1` | 4px scale compliant |
| Gap (icon↔text) | 4px | 4px | `gap-1` | Fixed, same both sizes |
| Icon size | 12px | 12px | `[&>svg]:size-3` | `--icon-indicator` |
| Font size | 12px | 12px | `text-xs` | Same both sizes |
| Font weight | 500 | 500 | `font-medium` | Same both sizes |

### Border & shape

| Property | Value | Token |
|----------|-------|-------|
| Border radius | 9999px (pill) | `rounded-full` |
| Border width | 1px | `border` (default transparent except outline) |

### Anti-patterns (visual)

- DO NOT use `rounded-md` — pill is the correct shape per v4 and 5/6 DS
- DO NOT add arbitrary padding (`px-[10px]`) — use the 4px scale
- DO NOT size icon to anything other than `size-3` (12px = `--icon-indicator`)

---

## Token Compliance

| CSS property | Token used |
|-------------|-----------|
| background (default) | `hsl(var(--primary))` |
| text (default) | `hsl(var(--primary-foreground))` |
| background (secondary) | `hsl(var(--secondary))` |
| text (secondary) | `hsl(var(--secondary-foreground))` |
| border (outline) | `hsl(var(--border))` |
| text (outline) | `hsl(var(--foreground))` |
| background (destructive) | `hsl(var(--destructive))` |
| text (destructive) | `hsl(var(--destructive-foreground))` |
| background (success) | `hsl(var(--success))` |
| text (success) | `hsl(var(--success-foreground))` |
| background (warning) | `hsl(var(--warning))` |
| text (warning) | `hsl(var(--warning-foreground))` |
| background (info) | `hsl(var(--info))` |
| text (info) | `hsl(var(--info-foreground))` |
| ring | `hsl(var(--ring))` |

**Pre-implementation action:** Add `--info` and `--info-foreground` to `globals.css` (blue: `210 100% 56%` / `0 0% 100%`).

**Hardcoded values:** NONE.

---

## ARIA

- **role:** none (static `<span>`). Add `role="status"` only when badge content updates dynamically (e.g., live counter)
- **aria-live:** `polite` implicit via `role="status"` when used — do NOT add manually
- **aria-label:** REQUIRED on dot badges (no text child). Optional on icon-only badges
- **aria-disabled:** N/A — badge is decorative
- **aria-hidden on decorative icons:** yes — `[&>svg]:pointer-events-none`; add `aria-hidden="true"` on icon elements

---

## Animation

- Enter: none (badge appears inline with parent)
- Exit: none
- State change: `transition-[color,box-shadow] duration-150` on focus ring
- `prefers-reduced-motion:` handled via Tailwind's `motion-safe:` — transition is already lightweight, acceptable without override

---

## Dark Mode

- [x] All tokens semantic — dark mode activates via `?mode=dark` URL param
- [x] No hardcoded colors
- [x] Verify at `/preview?tab=components&mode=dark`

---

## Demo States (required in ComponentGallery)

| State | Label in demo | Notes |
|-------|--------------|-------|
| default | "Default" | sm size |
| secondary | "Secondary" | sm size |
| outline | "Outline" | sm size |
| destructive | "Destructive" | sm size |
| success | "Success" | sm size |
| warning | "Warning" | sm size |
| info | "Info" | sm size |
| md size (default) | "Medium" | Shows size difference |
| dot default | "dot" aria-label="Active" | No text child |
| dot success | "dot" aria-label="Online" | Green dot |
| with icon (Lucide) | "With icon" | Icon left of text |

**GATE:** All rows above must be visible in ComponentGallery before Visual Gate.

---

## Test Plan

### Universal gates (already in component-qa.spec.ts — no action needed)

- [x] All variants render without errors
- [x] `cursor:pointer` on interactive elements
- [x] No `style` with hex color
- [x] axe-core: 0 critical violations
- [x] `npm run lint:ui` passes

### Component-specific Playwright assertions

```typescript
// 1. display: inline-flex (never block)
const display = await badge.evaluate(el => getComputedStyle(el).display)
expect(display).toBe('inline-flex')

// 2. Element tag must be <span>
const tagName = await badge.evaluate(el => el.tagName.toLowerCase())
expect(tagName).toBe('span')

// 3. data-slot="badge" present
await expect(badge).toHaveAttribute('data-slot', 'badge')

// 4. All 7 variants render and have data-variant attribute
for (const v of ['default','secondary','outline','destructive','success','warning','info']) {
  await expect(page.locator(`[data-slot="badge"][data-variant="${v}"]`).first()).toBeVisible()
}

// 5. Dot badge has aria-label
const dotBadge = page.locator('[data-slot="badge"][data-dot="true"]').first()
const ariaLabel = await dotBadge.getAttribute('aria-label')
expect(ariaLabel).toBeTruthy()

// 6. whitespace: nowrap
const ws = await badge.evaluate(el => getComputedStyle(el).whiteSpace)
expect(ws).toBe('nowrap')

// 7. Height within expected range (sm=20px ±2, md=22px ±2)
const box = await badge.boundingBox()
expect(box!.height).toBeGreaterThanOrEqual(18)
expect(box!.height).toBeLessThanOrEqual(28)

// 8. Background resolves to rgb (confirms CSS var resolves, not raw hex)
const bg = await badge.evaluate(el => getComputedStyle(el).backgroundColor)
expect(bg).toMatch(/^rgb/)
```

### Dark mode
- [ ] Verified at `/preview?tab=components&mode=dark`

---

## Spec Sign-off

- [x] Industry Parity Check table filled
- [x] Variants complete (success/warning/info flagged as REQUIRED in parity check)
- [x] All states addressed
- [x] Visual Design section filled with token-based values
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Test plan written

**Spec complete:** YES
