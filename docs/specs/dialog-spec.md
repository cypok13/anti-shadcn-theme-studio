# Component Spec: Dialog

---

## Usage Guidelines

### When to use

- Use when: user must complete a task or confirm an action before returning to the main flow
- Use when: content is too complex for a tooltip or popover (forms, confirmations, detail views)
- Do NOT use when: a simple one-line confirmation → use AlertDialog (separate component)
- Do NOT use when: content is supplementary and non-blocking → use Popover or Drawer
- Do NOT use when: content is a navigation step → use routing

### Variant decision tree

```
Need to block user interaction with background?
├── YES → Dialog (modal)
│   ├── Destructive action (delete/reset)? → closeOnOutsideClick={false}, focus Cancel
│   ├── Complex form / lots of content? → size="lg", scrollable
│   └── Simple confirmation or short form → size="md" (default)
└── NO → Popover / Sheet (separate components)
```

### Common patterns

```tsx
// Basic confirmation
<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Scrollable form dialog
<Dialog>
  <DialogTrigger asChild><Button>Edit profile</Button></DialogTrigger>
  <DialogContent size="lg" scrollable>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
    </DialogHeader>
    {/* long form content */}
    <DialogFooter>
      <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
      <Button>Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Destructive — no outside-click dismiss, focus Cancel
<Dialog>
  <DialogTrigger asChild><Button variant="destructive">Delete account</Button></DialogTrigger>
  <DialogContent closeOnOutsideClick={false}>
    <DialogHeader>
      <DialogTitle>Delete account</DialogTitle>
      <DialogDescription>All data will be permanently removed.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="ghost" autoFocus>Cancel</Button></DialogClose>
      <Button variant="destructive">Delete account</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Anti-patterns

- NEVER omit DialogTitle — axe-core critical violation (role="dialog" without accessible name)
- NEVER auto-focus the destructive action — user may press Enter accidentally
- NEVER allow outside-click dismiss on destructive dialogs — user loses context
- NEVER put horizontal scroll inside dialog body
- NEVER use aria-describedby when body has complex content (lists, tables)
- NEVER block body scroll without restoring — Radix handles this, do not add manual overflow:hidden

---

## Identity

- **Component name:** Dialog
- **File:** `src/components/ui/dialog.tsx`
- **ARIA APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- **Reference:** https://www.radix-ui.com/primitives/docs/components/dialog · https://ui.shadcn.com/docs/components/dialog
- **Ticket:** ALE-722

---

## Industry Parity Check

| Feature / Prop | Material 3 | Carbon | Spectrum | Fluent 2 | Atlassian | shadcn | **Include?** | Reason if excluded |
|----------------|:----------:|:------:|:--------:|:--------:|:---------:|:------:|:-----------:|-------------------|
| Size variants (sm/md/lg) | NO | YES | YES | partial | YES | NO | **YES** | 3+ DS |
| Close button (X) top-right | YES | YES | YES | YES | YES | YES | **YES** | Universal |
| DialogTitle (required) | YES | YES | YES | YES | YES | YES | **YES** | WCAG + universal |
| DialogDescription | YES | YES | YES | YES | YES | YES | **YES** | Universal |
| DialogHeader / DialogFooter | YES | YES | YES | YES | YES | YES | **YES** | Universal |
| Sticky header + footer when scrollable | YES | YES | YES | YES | YES | partial | **YES** | 5/6 DS |
| Scrollable body | YES | YES | — | YES | YES | YES | **YES** | Universal |
| Backdrop/overlay | YES | YES | YES | YES | YES | YES | **YES** | Universal |
| Backdrop click to close | YES | YES | YES | YES | YES | YES | **YES** | Universal; disable for destructive |
| closeOnOutsideClick prop | — | — | YES | YES | YES | NO | **YES** | Needed for destructive dialogs |
| Full-screen variant | YES | YES | NO | NO | YES | NO | **NO** | Only 2-3 DS; out of scope MVP |
| Alert/non-modal type | — | YES | YES | YES | NO | NO | **NO** | Separate AlertDialog component |
| Footer divider | NO | YES | YES | NO | NO | NO | **NO** | Only 2/6 DS |

**GATE:** Parity check complete. All REQUIRED features included.

---

## Variants

| Prop | Values | Default |
|------|--------|---------|
| `size` | `"sm"` \| `"md"` \| `"lg"` | `"md"` |
| `scrollable` | `boolean` | `false` |
| `showCloseButton` | `boolean` | `true` |
| `closeOnOutsideClick` | `boolean` | `true` |
| `children` | `React.ReactNode` | — |

**Size max-widths:**

| Size | Max-width | Use case |
|------|-----------|---------|
| sm | 400px | Confirmations, single-field forms |
| md | 560px | Standard forms, moderate content |
| lg | 720px | Complex forms, data-heavy content |

---

## States

| State | How implemented | CSS / data-attr |
|-------|-----------------|-----------------|
| closed | default | `data-state="closed"` on Overlay + Content |
| open | dialog visible | `data-state="open"` on Overlay + Content |
| scrolled (body) | CSS overflow | sticky Header + Footer via CSS |

---

## Interaction Zones

- **Trigger:** click → opens dialog, focus moves into Content
- **Overlay click:** closes dialog (if `closeOnOutsideClick={true}`)
- **Escape:** closes dialog
- **Tab / Shift+Tab:** cycles through focusable elements inside Content only (focus trap)
- **Close button (X):** closes dialog, focus returns to trigger
- **DialogClose:** any element wrapped with DialogClose closes dialog

---

## Visual Design

### Dimensions

| Property | Value | Token / class |
|----------|-------|---------------|
| Panel max-width sm | 400px | `max-w-[400px]` |
| Panel max-width md | 560px | `max-w-[560px]` |
| Panel max-width lg | 720px | `max-w-[720px]` |
| Panel width | 100% (minus margin) | `w-full` |
| Panel border-radius | `var(--radius)` | `rounded-[var(--radius)]` |
| Panel padding | 24px | `p-6` |
| Header gap | 4px | `gap-1` |
| Footer gap | 8px | `gap-2` |
| Close button size | 24px icon, 32px hit area | `h-8 w-8` with `h-4 w-4` icon |
| Close button position | top-right inside panel | `absolute right-4 top-4` |
| Overlay opacity | 0.8 | `bg-[hsl(var(--overlay)/0.8)]` |
| Content max-height (scrollable) | 80vh | `max-h-[80vh]` |

### Scrollable layout (when `scrollable={true}`)

Header sticks to top, footer sticks to bottom, body (`DialogBody`) scrolls:
```
┌─ DialogContent ─────────────────┐
│  [X]                            │
│  ─ DialogHeader (sticky top) ─  │
├─────────────────────────────────┤
│  DialogBody (scrollable)        │
│  overflow-y: auto               │
├─────────────────────────────────┤
│  ─ DialogFooter (sticky bot) ─  │
└─────────────────────────────────┘
```

---

## Token Compliance

| CSS property | Token used |
|-------------|-----------|
| Overlay background | `var(--overlay)` → `bg-[hsl(var(--overlay)/0.8)]` |
| Panel background | `var(--card)` → `bg-[hsl(var(--card))]` |
| Panel border | `var(--border)` → `border-[hsl(var(--border))]` |
| Panel text | `var(--card-foreground)` → `text-[hsl(var(--card-foreground))]` |
| Title text | `var(--foreground)` → `text-[hsl(var(--foreground))]` |
| Description text | `var(--muted-foreground)` → `text-[hsl(var(--muted-foreground))]` |
| Close icon color | `var(--muted-foreground)` → `text-[hsl(var(--muted-foreground))]` |
| Close hover bg | `var(--accent)` → `hover:bg-[hsl(var(--accent))]` |
| Focus ring | `var(--ring)` → `focus-visible:ring-[hsl(var(--ring))]` |

**Hardcoded values:** NONE.

---

## ARIA

- **role:** `dialog` — set automatically by Radix on Content
- **aria-modal:** `"true"` — set automatically by Radix
- **aria-labelledby:** Radix links Content to Title automatically when DialogTitle is present
- **aria-describedby:** Radix links Content to Description when DialogDescription is present; omit Description for complex body content
- **Focus trap:** Radix implements natively (Tab/Shift+Tab cycles within Content)
- **Escape:** Radix handles natively
- **Return focus:** Radix returns focus to trigger on close automatically

---

## Animation

- Overlay: `data-[state=open]:animate-in data-[state=open]:fade-in-0` / `data-[state=closed]:animate-out data-[state=closed]:fade-out-0`
- Content: `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95` / `data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95`
- Duration: 150ms open / 100ms close
- `prefers-reduced-motion`: handled via Tailwind `motion-safe:` prefix

---

## Dark Mode

- [ ] All tokens semantic — dark mode via `?mode=dark` URL param
- [ ] No hardcoded colors
- [ ] Overlay opacity adequate on dark backgrounds
- [ ] Verified at `/preview?tab=components&mode=dark`

---

## Demo States (required in ComponentGallery)

| State | Label | Notes |
|-------|-------|-------|
| Default (md) | "Default" | Simple title + description + footer with Cancel/Confirm |
| Small | "Small (sm)" | Confirmation dialog, size="sm" |
| Large | "Large (lg)" | More content, size="lg" |
| No close button | "No close button" | showCloseButton={false}, footer-only dismiss |
| Scrollable | "Scrollable" | scrollable={true}, long body content |
| Destructive | "Destructive" | closeOnOutsideClick={false}, destructive confirm button |

---

## Test Plan

- [ ] No JS errors or hydration failures (Gate 0)
- [ ] No `<div>` inside `<button>` (Gate 0)
- [ ] `cursor:pointer` on trigger buttons (Gate 1)
- [ ] No inline hex in style attributes (Gate 1)
- [ ] axe-core: 0 critical violations — especially dialog accessible name (Gate 1)
- [ ] Click trigger → dialog opens (Gate 2)
- [ ] Click overlay → dialog closes (Gate 2)
- [ ] Escape → dialog closes (Gate 2)
- [ ] Click X button → dialog closes (Gate 2)
- [ ] Focus trap: Tab cycles within dialog only (Gate 3)
- [ ] All sizes render correctly (Visual gate)
- [ ] Scrollable body: header/footer sticky (Visual gate)
- [ ] Dark mode: correct colors (Visual gate)
- [ ] `npm run lint:ui` passes
- [ ] `npm run docs:validate` passes

---

## Spec Sign-off

- [x] Industry Parity Check table filled
- [x] Variants complete (size sm/md/lg, scrollable, showCloseButton, closeOnOutsideClick)
- [x] All states addressed
- [x] Visual Design filled with token-based values
- [x] All CSS → tokens
- [x] ARIA specified
- [x] Test plan written

**Spec complete:** YES
