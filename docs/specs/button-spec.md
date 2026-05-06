# Component Spec: Button

> Fill this out COMPLETELY before writing any implementation code.
> Source: ARIA APG → component library reference → primitive docs

---

## Usage Guidelines

### When to use Button

- Use when: triggering an action (submit, save, delete, open modal, navigate with side effects)
- Do NOT use when: pure navigation with no side effects → use `<Link>` or `<a>` instead
- Do NOT use when: toggling binary state → use Switch or Checkbox instead

### Variant decision tree

```
What's the hierarchy of this action?

Primary CTA? (one per view max)
└── variant="default"  →  "Save", "Create", "Confirm", "Send"

Secondary / supporting action?
├── Has clear boundary needed → variant="outline"  →  "Cancel", "Back", "Edit"
├── Lower visual weight → variant="secondary"  →  "View details", "Export"
└── Inline in text / nav → variant="ghost"  →  icon actions, toolbar buttons, table row actions

Destructive (can't undo)?
└── variant="destructive"  →  "Delete", "Remove", "Revoke" (always confirm before firing)

Looks like a link, acts like a button?
└── variant="link"  →  inline "Forgot password?", "Learn more" that trigger actions not navigation
```

### Size decision tree

```
Context?
├── Default UI, forms, dialogs → size="default" (40px)
├── Tight spaces: tables, cards, badges → size="sm" (36px)
├── Hero sections, prominent CTAs → size="lg" (44px)
└── Icon-only action (no label) → size="icon" (40×40px square)
    └── MUST have aria-label prop — no exceptions
```

### Disabled state decision tree

```
Why is the button unavailable?

Action is loading / in-flight?
└── isLoading={true}  →  shows spinner, aria-disabled, stays in tab order

Form is invalid?
└── disabled={true}  →  removed from tab order (acceptable — user can't submit invalid form)

Contextually unavailable (permission, plan, quota)?
└── aria-disabled="true" + title/tooltip explaining why
    →  stays in tab order so screen reader users understand it exists
    →  NEVER disabled attr — users deserve to know why, not to find nothing
```

### Common patterns

```tsx
// Primary CTA
<Button onClick={handleSave}>Save changes</Button>

// Destructive with confirmation
<Button variant="destructive" onClick={() => setConfirmOpen(true)}>
  Delete account
</Button>

// Loading state (form submit)
<Button isLoading={isSubmitting} disabled={isSubmitting} type="submit">
  Create project
</Button>

// Icon-only toolbar action
<Button variant="ghost" size="icon" aria-label="Copy to clipboard">
  <CopyIcon aria-hidden="true" />
</Button>

// asChild with Next.js Link
<Button asChild>
  <Link href="/dashboard">Go to dashboard</Link>
</Button>

// Conditionally unavailable (no permission)
<Button
  variant="default"
  aria-disabled="true"
  title="Upgrade to Pro to unlock exports"
  onClick={(e) => e.preventDefault()}
>
  Export CSV
</Button>
```

### Anti-patterns

- **Never use `default` for two equal actions** — one must be primary, one secondary/outline
- **Never use `link` variant for navigation** — use `<Link>` from next/link instead
- **Never use `disabled` for permission gates** — user loses discoverability; use `aria-disabled` + tooltip
- **Never put an icon inside `size="default"` without a label** — use `size="icon"` for icon-only
- **Never skip `aria-label` on icon-only buttons** — axe-core critical violation
- **Never stack two `variant="default"` buttons side by side** — creates false hierarchy

---

## Identity

- **Component name:** Button
- **File:** `src/components/ui/button.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/button/
- **Reference:** https://ui.shadcn.com/docs/components/button · https://github.com/shadcn-ui/ui/blob/main/apps/www/registry/new-york/ui/button.tsx

---

## Variants (exhaustive)

| Prop | Values | Default |
|------|--------|---------|
| `variant` | `default` \| `secondary` \| `outline` \| `ghost` \| `destructive` \| `link` | `default` |
| `size` | `sm` \| `default` \| `lg` \| `icon` | `default` |
| `asChild` | `boolean` | `false` |
| `isLoading` | `boolean` | `false` |

**Notes:**
- `icon` size = square button 40×40px for icon-only use
- `link` variant = underlined text, semantically a `<button>` (not `<a>`)
- `asChild` = renders the child element (e.g. `<Link>`) with button props

---

## States (ALL required)

| State | How implemented | CSS / attr |
|-------|-----------------|------------|
| default | base styles | — |
| hover | `enabled:hover:opacity-90` (primary/secondary/destructive); variant-specific hover for outline/ghost/link | `cursor: pointer` |
| focus-visible | ring 2px offset 2px | `focus-visible:ring-2 ring-[hsl(var(--ring))]` |
| active (mousedown) | `enabled:active:opacity-80 enabled:active:scale-[0.98]` | `motion-safe:` prefix |
| disabled (native) | `disabled` attr — removes from tab order; used for submit buttons | `cursor: not-allowed; opacity: 0.5` |
| aria-disabled | `aria-disabled="true"` — stays in tab order; for contextually disabled | `cursor: not-allowed; opacity: 0.5` |
| loading | `isLoading` prop → spinner + `aria-label="Loading"` + `aria-disabled` | spinner `aria-hidden="true"` |
| error | N/A — Button does not validate; error state is the parent's responsibility | — |
| selected/checked | N/A — for toggle use `aria-pressed` prop (out of scope) | — |

---

## Interaction Zones

- **Clickable area:** the entire `<button>` element including padding
- **Trigger:** any mouse click / touch
- **Tab:** button receives focus (default tabindex for `<button>`)
- **Enter / Space:** activates the button (native `<button>` behavior)
- **Escape:** N/A — button does not close overlays on its own
- **Minimum target:** 24×24px (WCAG 2.5.8 AA) — icon size = 40px ✓, sm = 36px height ✓

---

## Token Compliance (NO hardcoded values)

| CSS property | Token |
|-------------|-------|
| primary bg | `var(--primary)` |
| primary fg | `var(--primary-foreground)` |
| secondary bg | `var(--secondary)` |
| secondary fg | `var(--secondary-foreground)` |
| outline border | `var(--border)` |
| outline hover bg | `var(--primary)` |
| ghost hover bg | `var(--accent)` |
| ghost hover fg | `var(--accent-foreground)` |
| destructive bg | `var(--destructive)` |
| destructive fg | `var(--destructive-foreground)` |
| focus ring | `var(--ring)` |
| focus ring offset bg | `var(--background)` |
| link fg | `var(--primary)` |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** native `<button>` — role implicit
- **type:** `"button"` by default (prevents accidental form submit)
- **aria-disabled:** `"true"` when button is contextually unavailable (stays in tab order)
- **disabled attr:** only for submit buttons or forms (removes from tab order)
- **aria-label:** required for icon-only buttons (consumer responsibility — passed via props)
- **aria-hidden on icons:** `aria-hidden="true" focusable="false"` on all SVGs inside the button
- **loading:** `aria-label="Loading"` on the button + `aria-disabled="true"`; spinner `aria-hidden="true"`

---

## Animation

- State change: `transition-[opacity,background-color,border-color,transform] duration-150 ease-in-out`
- Active scale: `motion-safe:enabled:active:scale-[0.98]` — disabled when `prefers-reduced-motion`
- Loading spinner: `animate-spin` — disabled when `prefers-reduced-motion: reduce` via Tailwind

---

## Dark Mode

- [x] All tokens semantic — dark mode activates via `?mode=dark` URL param (NOT CSS class toggle / NOT `data-theme`)
- [x] No hardcoded colors
- [x] Verified at `/preview?tab=components&mode=dark`

---

## Test Plan (written BEFORE implementation)

- [x] All 6 variants render without errors
- [x] `cursor:pointer` on enabled buttons — Playwright Gate 1
- [x] `cursor:not-allowed` on disabled buttons — Playwright Gate 1
- [x] No hover effect on disabled — Playwright Gate 1
- [x] No `style` with hex color — Playwright Gate 1
- [x] axe-core: 0 critical violations — Playwright Gate 1
- [x] Click changes state (Gate 2 smoke tests)
- [x] `npm run lint:ui` passes

---

## Spec Sign-off

- [x] Variants complete
- [x] All states addressed
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Test plan written

**Spec complete:** YES

## Related
- [[switch-spec]]
- [[tooltip-spec]]
- [[checkbox-spec]]
