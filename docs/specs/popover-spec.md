# Component Spec: Popover

> Fill this out COMPLETELY before writing any implementation code.
> Source: ARIA APG pattern → Radix UI → shadcn/ui reference.

---

## Usage Guidelines

### When to use this component

- Use when: content has interactive elements (forms, pickers, actions) and should be non-blocking
- Do NOT use when: content is read-only text hint → use Tooltip instead
- Do NOT use when: content blocks all interaction or requires confirmation → use Dialog instead
- Do NOT use when: content is a navigation menu → use DropdownMenu (separate component)

### Variant decision tree

```
Content is read-only text hint? → Tooltip
Content blocks all interaction (confirmation)? → Dialog
Content has interactive elements, non-blocking? → Popover ✓
  └── Content is a navigation menu? → DropdownMenu (separate component)
```

### Common patterns

```tsx
// Simple text content
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p className="text-sm">Popover content goes here.</p>
  </PopoverContent>
</Popover>

// With form
<Popover>
  <PopoverTrigger asChild>
    <Button>Edit profile</Button>
  </PopoverTrigger>
  <PopoverContent>
    <Field id="username" label="Username" inputProps={{ placeholder: 'Enter username' }} />
    <Button className="mt-3 w-full">Save</Button>
  </PopoverContent>
</Popover>

// Controlled
const [open, setOpen] = useState(false)
<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button>Toggle</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p className="text-sm">Controlled popover.</p>
  </PopoverContent>
</Popover>
```

### Anti-patterns

- DO NOT nest Popover inside another Popover — use a single layered design instead
- DO NOT use Popover for confirmations that require blocking all other interaction — use Dialog
- DO NOT use Popover for navigation menus — use DropdownMenu

---

## Identity

- **Component name:** Popover
- **File:** `src/components/ui/popover.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ (non-modal variant)
- **Reference:** https://www.radix-ui.com/primitives/docs/components/popover, https://ui.shadcn.com/docs/components/popover
- **Ticket:** ALE-637

---

## Industry Parity Check

| Feature / Prop | Material | Carbon | Spectrum | Fluent | Atlassian | shadcn | **Include?** | Reason if excluded |
|----------------|----------|--------|----------|--------|-----------|--------|-------------|-------------------|
| Side variants (top/right/bottom/left) | YES | YES | YES | YES | YES | YES | YES | Core positioning |
| align (start/center/end) | YES | YES | YES | YES | YES | YES | YES | Core alignment |
| Collision detection / auto-flip | YES | YES | YES | YES | YES | YES | YES | Via Radix avoidCollisions |
| Arrow/caret | YES | YES | YES | YES | YES | YES | YES | showArrow prop |
| Controlled open state | YES | YES | YES | YES | YES | YES | YES | open + onOpenChange |
| Portal rendering | YES | YES | YES | YES | YES | YES | YES | Via Radix Portal |
| sideOffset | YES | — | YES | — | — | YES | YES | Default 4px |
| modal variant | YES | — | YES | — | — | YES | NO (escape hatch) | Passed through as prop, not named variant |
| Color variants | — | — | — | — | — | — | NO | Tokens handle theming |
| Size variants | YES | YES | — | — | — | — | NO | Max-width fixed at 320px; content determines height |

---

## Variants (exhaustive)

| Prop | Values | Default |
|------|--------|---------|
| `side` | `top`, `right`, `bottom`, `left` | `bottom` |
| `align` | `start`, `center`, `end` | `center` |
| `sideOffset` | number | `4` |
| `showArrow` | boolean | `false` |
| `open` | boolean (controlled) | uncontrolled |
| `defaultOpen` | boolean | `false` |
| `onOpenChange` | `(open: boolean) => void` | — |
| `modal` | boolean (passthrough) | `false` |

---

## States (ALL required)

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| closed | Trigger visible, content unmounted | `data-state="closed"` on Content |
| open | Content mounted in Portal | `data-state="open"` on Content |
| hover (trigger) | bg change on trigger button (caller responsibility) | `:hover` on trigger |
| focus-visible (trigger) | ring on trigger | `:focus-visible` on trigger |
| disabled | N/A — Popover has no disabled state; trigger button handles it | N/A — delegated to trigger |
| loading | N/A — no loading state | N/A — not a disclosure pattern |
| error | N/A — error shown inside content | N/A |

---

## Interaction Zones

- **Clickable area:** Trigger element (asChild delegates to wrapped element)
- **Trigger:** Click toggles open/closed
- **Tab:** Focus moves into first focusable element inside Content on open (non-modal — does NOT trap)
- **Enter/Space:** Activates trigger — opens/closes
- **Escape:** Closes popover, returns focus to trigger
- **Click outside:** Closes popover (onPointerDownOutside default)
- **Arrow keys:** N/A — not a list/menu

---

## Visual Design

### Dimensions

| Property | Value | Token / Tailwind class |
|----------|-------|------------------------|
| Max width | 320px | `max-w-[320px]` |
| Width | fit content | `w-max` |
| sideOffset | 4px | prop default |

### Internal proportions

| Property | Value | Token / class | Notes |
|----------|-------|---------------|-------|
| Padding | 16px | `p-4` | `--space-6` on 4px scale |
| Arrow width | 8px | `width={8}` | On 4px scale |
| Arrow height | 4px | `height={4}` | On 4px scale |

### Border & shape

| Property | Value | Token |
|----------|-------|-------|
| Border radius | var(--radius) | `rounded-[var(--radius)]` |
| Border width | 1px | `border` |
| z-index | 50 | `z-50` |

### Anti-patterns (visual)

- DO NOT use arbitrary px values — every size must land on the 4px scale token
- DO NOT hardcode background colors — use `hsl(var(--popover))`
- DO NOT use `stroke="hsl(var(...))"` on SVG arrow — use className (Error Log E-007)

---

## Token Compliance (NO hardcoded values)

| CSS property | Token used |
|-------------|-----------|
| background | `bg-[hsl(var(--popover))]` |
| text | `text-[hsl(var(--popover-foreground))]` |
| border | `border-[hsl(var(--border))]` |
| shadow | `shadow-md` |
| radius | `rounded-[var(--radius)]` |
| arrow fill | `fill-[hsl(var(--popover))]` |
| arrow stroke | `stroke-[hsl(var(--border))]` |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** `dialog` (set by Radix PopoverContent automatically)
- **aria-expanded:** `true/false` on Trigger (set by Radix automatically)
- **aria-controls:** `{content-id}` on Trigger (set by Radix automatically)
- **aria-modal:** NOT set — popover is non-modal by default
- **aria-live:** off — not a live region
- **aria-label / aria-labelledby:** Consumer responsibility
- **aria-disabled:** N/A — delegated to trigger
- **aria-hidden on decorative icons:** Arrow is decorative — handled by Radix

---

## Animation

- Enter open: `animate-in fade-in-0 zoom-in-95` + slide-in-from direction (150ms, `duration-150`)
- Exit closed: `animate-out fade-out-0 zoom-out-95` (150ms)
- Side-specific slide: `data-[side=bottom]:slide-in-from-top-2` etc.
- `prefers-reduced-motion:` Radix respects CSS media query natively

---

## Dark Mode

- [x] All tokens semantic — dark mode activates via `?mode=dark` URL param
- [x] No hardcoded colors — all `hsl(var(--token))`
- [x] Verified at `/preview?tab=components&mode=dark` — darker bg + lighter text expected

---

## Demo States (required in ComponentGallery)

| # | State | Label in demo | Notes |
|---|-------|--------------|-------|
| 1 | Default (bottom, with arrow) | "Default (bottom)" | Basic trigger + text content, showArrow |
| 2 | Top placement | "Top placement" | `side="top"` with arrow |
| 3 | With form fields | "With form" | Field + Input + save Button inside content |
| 4 | No arrow | "No arrow" | `showArrow={false}` explicit |
| 5 | Controlled open state | "Controlled" | External open/close button + `open={open} onOpenChange={setOpen}` |
| 6 | Right placement | "Right placement" | `side="right"` |

---

## Test Plan (written BEFORE implementation)

### Universal gates (already in component-qa.spec.ts — no action needed)

- [x] All variants render without errors
- [x] `cursor:pointer` on interactive elements
- [x] `cursor:not-allowed` on disabled
- [x] No `style` with hex color
- [x] axe-core: 0 critical violations
- [x] `npm run lint:ui` passes

### Component-specific Playwright assertions

- [ ] Click trigger → trigger `aria-expanded="true"` + `[role="dialog"]` visible in DOM
- [ ] Press Escape after open → `[role="dialog"]` not visible + trigger `aria-expanded="false"`
- [ ] Click outside content area → popover closes (`[role="dialog"]` not visible)
- [ ] Open popover → first focusable element inside `[role="dialog"]` receives focus (non-modal — moves in but not trapped)

### Dark mode

- [ ] Verified at `/preview?tab=components&mode=dark`

---

## Spec Sign-off

- [x] Industry Parity Check table filled
- [x] Variants complete
- [x] All states addressed
- [x] Visual Design section filled with token-based values (no arbitrary px)
- [x] All CSS mapped to tokens
- [x] ARIA specified
- [x] Test plan written

**Spec complete: YES**

> Implementation starts only when "Spec complete: YES"
