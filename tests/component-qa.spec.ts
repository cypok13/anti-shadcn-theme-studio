import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const BASE_URL = '/preview'

// ─── Gate 0: Runtime integrity ───────────────────────────────────────────────

test.describe('Gate 0 — Runtime integrity', () => {
  test('no JS errors or React hydration failures on components tab', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })

  test('no block elements (div/section/article) inside button', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
    // Exclude Vercel toolbar buttons (data-issues-open) — injected by Vercel dev overlay, not our code
    const invalid = await page.locator('button:not([data-issues-open]) div, button:not([data-issues-open]) section, button:not([data-issues-open]) article').count()
    expect(invalid).toBe(0)
  })

})

// ─── Gate 1: CSS / ARIA form ─────────────────────────────────────────────────

test.describe('Gate 1 — CSS & ARIA form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('buttons have cursor:pointer', async ({ page }) => {
    const buttons = page.locator('button:not([disabled]):not([aria-disabled="true"])')
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveCSS('cursor', 'pointer')
    }
  })

  test('buttons have user-select:none', async ({ page }) => {
    const buttons = page.locator('button')
    const count = await buttons.count()
    for (let i = 0; i < count; i++) {
      const userSelect = await buttons.nth(i).evaluate(el =>
        getComputedStyle(el).userSelect
      )
      expect(userSelect).not.toBe('text')
    }
  })

  test('disabled buttons have cursor:not-allowed', async ({ page }) => {
    const disabled = page.locator('button[disabled]')
    const count = await disabled.count()
    if (count === 0) test.skip()
    for (let i = 0; i < count; i++) {
      await expect(disabled.nth(i)).toHaveCSS('cursor', 'not-allowed')
    }
  })

  test('no inline hex colors in style attributes', async ({ page }) => {
    const hexInStyle = await page.locator('[style*="#"]').count()
    expect(hexInStyle).toBe(0)
  })

  test('axe-core: zero critical violations on components tab', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('.recharts-wrapper')
      .analyze()
    const critical = results.violations.filter(v => v.impact === 'critical')
    expect(critical).toHaveLength(0)
  })

})

// ─── Gate 2: Interaction — controls actually work ─────────────────────────────

test.describe('Gate 2 — Interaction smoke tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('checkbox: clicking label text toggles checked state', async ({ page }) => {
    const labels = page.locator('div').filter({ has: page.locator('h2', { hasText: 'Checkbox' }) }).first().locator('label')
    const first = labels.first()
    const input = first.locator('input[type="checkbox"]')
    const textSpan = first.locator('span').first()

    const checkedBefore = await input.isChecked()
    // Click the text span directly (not the indicator)
    await textSpan.click()
    await page.waitForTimeout(150)

    const checkedAfter = await input.isChecked()
    expect(checkedAfter).not.toBe(checkedBefore)
  })

  test('radio: clicking label text selects the option', async ({ page }) => {
    const labels = page.locator('section').filter({ hasText: 'Radio' }).locator('label')
    // option-b (index 1) starts unselected — click it and verify it becomes selected
    const second = labels.nth(1)
    const textSpan = second.locator('span').first()

    // option-b starts unselected: button aria-checked should be false
    const radioBtn = second.locator('button[role="radio"]')
    await expect(radioBtn).toHaveAttribute('aria-checked', 'false')

    await textSpan.click()
    await page.waitForTimeout(150)

    // After click: option-b selected — aria-checked must be true
    await expect(radioBtn).toHaveAttribute('aria-checked', 'true')
  })

  test('radio: selecting new option deselects previously selected (mutual exclusivity)', async ({ page }) => {
    const radioSection = page.locator('section').filter({ hasText: 'Radio' })
    const labels = radioSection.locator('label')
    const firstBtn = labels.nth(0).locator('button[role="radio"]')
    const secondBtn = labels.nth(1).locator('button[role="radio"]')

    // Initial state: first selected, second not
    await expect(firstBtn).toHaveAttribute('aria-checked', 'true')
    await expect(secondBtn).toHaveAttribute('aria-checked', 'false')

    // Click second option
    await labels.nth(1).locator('span').first().click()
    await page.waitForTimeout(150)

    // Mutual exclusivity: second selected AND first must now be deselected
    await expect(secondBtn).toHaveAttribute('aria-checked', 'true')
    await expect(firstBtn).toHaveAttribute('aria-checked', 'false')
  })

  test('switch: clicking full row toggles aria-checked', async ({ page }) => {
    const switches = page.locator('[role="switch"]')
    const count = await switches.count()
    expect(count).toBeGreaterThan(0)

    const sw = switches.first()
    const before = await sw.getAttribute('aria-checked')
    await sw.click()
    await page.waitForTimeout(100)
    const after = await sw.getAttribute('aria-checked')

    expect(after).not.toBeNull()
    expect(after).not.toBe(before)
  })

  test('switch: clicking label text (not the toggle) also toggles', async ({ page }) => {
    const switchSection = page
      .locator('div.rounded-2xl')
      .filter({ has: page.locator('h2', { hasText: 'Switch' }) })
      .first()
    const sw = switchSection.locator('[role="switch"]').first()
    const before = await sw.getAttribute('aria-checked')

    // Click the text span (left side) directly
    const textSpan = sw.locator('span').first()
    await textSpan.click()
    await page.waitForTimeout(150)

    const after = await sw.getAttribute('aria-checked')
    expect(after).not.toBe(before)
  })

  test('tabs: clicking a different tab switches content', async ({ page }) => {
    const tabSection = page.locator('[data-section="tabs-original"]')
    const tabs = tabSection.locator('button')
    const secondTab = tabs.nth(1)

    // Record content before
    const contentBefore = await tabSection.locator('p').last().innerText()

    await secondTab.click()
    await page.waitForTimeout(100)

    const contentAfter = await tabSection.locator('p').last().innerText()
    expect(contentAfter).not.toBe(contentBefore)
  })

  test('select: clicking trigger opens dropdown', async ({ page }) => {
    const selectSection = page.locator('div').filter({ has: page.locator('h2', { hasText: 'Select' }) }).first()
    const trigger = selectSection.locator('button[role="combobox"]').first()

    // Trigger should start closed
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await trigger.click()
    await page.waitForTimeout(150)

    // Radix renders dropdown via Portal into document.body — check aria-expanded and listbox
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const listbox = page.locator('[role="listbox"]')
    await expect(listbox).toBeVisible()
  })



  test('dialog: clicking trigger opens dialog with role="dialog"', async ({ page }) => {
    const dialogSection = page.locator('[data-section="dialog"]')
    const trigger = dialogSection.getByRole('button', { name: 'Default dialog' })
    await trigger.click()
    await page.waitForTimeout(200)

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)

    await expect(dialog).not.toBeVisible()
  })

  test('dialog scrollable: DialogBody has overflow-y scrolling and content exceeds visible height', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 600 })
    const dialogSection = page.locator('[data-section="dialog"]')
    const trigger = dialogSection.getByRole('button', { name: 'Scrollable' })
    await trigger.click()
    await page.waitForTimeout(200)

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Find the scrollable body: first child of the dialog that has overflow-y auto/scroll
    const dialogBody = dialog.locator('.overflow-y-auto').first()
    await expect(dialogBody).toBeVisible()

    const overflowY = await dialogBody.evaluate(el => getComputedStyle(el).overflowY)
    expect(['auto', 'scroll']).toContain(overflowY)

    // The key assertion: scrollHeight > clientHeight means content actually overflows
    // This would have caught the min-h-0 bug (flex-1 without min-h-0 collapses the container,
    // making scrollHeight === clientHeight even with overflow content)
    const isScrollable = await dialogBody.evaluate(el => el.scrollHeight > el.clientHeight)
    expect(isScrollable).toBe(true)

    await page.keyboard.press('Escape')
  })

  test('popover: trigger toggles aria-expanded and content visible via Portal', async ({ page }) => {
    const popoverSection = page.locator('[data-section="popover"]')
    const trigger = popoverSection.getByRole('button', { name: 'Default (bottom)' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await trigger.click()
    await page.waitForTimeout(200)

    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const content = page.locator('[role="dialog"]').first()
    await expect(content).toBeVisible()

    // Verify content is rendered in Portal (inside body), not inline in trigger's subtree
    const isInBody = await content.evaluate(el => document.body.contains(el))
    expect(isInBody).toBe(true)
    const isInsideTrigger = await content.evaluate(el => {
      const section = document.querySelector('[data-section="popover"]')
      return section?.contains(el) ?? false
    })
    expect(isInsideTrigger).toBe(false)
  })

  test('popover: Escape closes and restores focus to trigger', async ({ page }) => {
    const popoverSection = page.locator('[data-section="popover"]')
    const trigger = popoverSection.getByRole('button', { name: 'Default (bottom)' })
    await trigger.click()
    await page.waitForTimeout(200)
    await expect(page.locator('[role="dialog"]').first()).toBeVisible()

    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)

    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
  })

  test('popover: click outside closes popover', async ({ page }) => {
    const popoverSection = page.locator('[data-section="popover"]')
    const trigger = popoverSection.getByRole('button', { name: 'Default (bottom)' })
    await trigger.click()
    await page.waitForTimeout(200)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await page.mouse.click(10, 10)
    await page.waitForTimeout(200)

    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})

// ─── Gate 3: Click zones (full-row coverage) ──────────────────────────────────

test.describe('Gate 3 — Full-row click zones', () => {
  test('interactive elements in cards are focusable via keyboard', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')

    // Tab through 6 elements and verify focus lands on semantic interactive controls (not divs/spans)
    const interactiveTags = new Set(['button', 'input', 'select', 'textarea', 'a'])
    let interactiveHits = 0
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      const tag = await page.evaluate(() => document.activeElement?.tagName?.toLowerCase() ?? '')
      const role = await page.evaluate(() => document.activeElement?.getAttribute('role') ?? '')
      if (interactiveTags.has(tag) || role === 'switch' || role === 'checkbox') {
        interactiveHits++
      }
    }
    expect(interactiveHits).toBeGreaterThanOrEqual(3)
  })

  test('dialog: Tab key cycles focus within dialog only', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
    const dialogSection = page.locator('[data-section="dialog"]')
    const trigger = dialogSection.getByRole('button', { name: 'Default dialog' })
    await trigger.click()
    await page.waitForTimeout(200)

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Tab several times and verify focus never escapes the dialog
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab')
      const focusInsideDialog = await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]')
        return dialog ? dialog.contains(document.activeElement) : false
      })
      expect(focusInsideDialog).toBe(true)
    }

    await page.keyboard.press('Escape')
  })

})

// ─── Gate 4: Badge-specific assertions ───────────────────────────────────────

test.describe('Gate 4 — Badge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('badge: renders as <span> (not <div>)', async ({ page }) => {
    const badge = page.locator('[data-slot="badge"]').first()
    await expect(badge).toBeVisible()
    const tagName = await badge.evaluate(el => el.tagName.toLowerCase())
    expect(tagName).toBe('span')
  })

  test('badge: display is inline-flex (or flex when inside flex container)', async ({ page }) => {
    // Inside a flex container, inline-flex is blockified to flex — both are valid
    const badge = page.locator('[data-slot="badge"]').first()
    const display = await badge.evaluate(el => getComputedStyle(el).display)
    expect(['inline-flex', 'flex']).toContain(display)
  })

  test('badge: all 7 variants render with data-variant attribute', async ({ page }) => {
    const variants = ['default', 'secondary', 'outline', 'destructive', 'success', 'warning', 'info']
    for (const v of variants) {
      await expect(page.locator(`[data-slot="badge"][data-variant="${v}"]`).first()).toBeVisible()
    }
  })

  test('badge: whitespace is nowrap', async ({ page }) => {
    const badge = page.locator('[data-slot="badge"]').first()
    const ws = await badge.evaluate(el => getComputedStyle(el).whiteSpace)
    expect(ws).toBe('nowrap')
  })

  test('badge: dot badge has aria-label', async ({ page }) => {
    const dotBadge = page.locator('[data-slot="badge"][data-dot="true"]').first()
    await expect(dotBadge).toBeVisible()
    const ariaLabel = await dotBadge.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
  })

  test('badge: text badges have height within expected range (18–28px)', async ({ page }) => {
    // Exclude dot-only badges (no text) — they are tiny by design (6px dot)
    const badges = page.locator('[data-slot="badge"]:not([data-dot="true"])')
    const count = await badges.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const box = await badges.nth(i).boundingBox()
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(18)
        expect(box.height).toBeLessThanOrEqual(28)
      }
    }
  })

  test('badge: background resolves to rgb (CSS var resolves correctly)', async ({ page }) => {
    const badge = page.locator('[data-slot="badge"][data-variant="default"]').first()
    const bg = await badge.evaluate(el => getComputedStyle(el).backgroundColor)
    expect(bg).toMatch(/^rgb/)
  })
})

// ─── Gate 5: Separator-specific assertions ────────────────────────────────────

test.describe('Gate 5 — Separator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('separator: decorative default has role="none"', async ({ page }) => {
    const sep = page.locator('[data-slot="separator"]').first()
    await expect(sep).toBeVisible()
    await expect(sep).toHaveAttribute('role', 'none')
  })

  test('separator: horizontal has data-orientation="horizontal"', async ({ page }) => {
    const sep = page.locator('[data-slot="separator"][data-orientation="horizontal"]').first()
    await expect(sep).toBeVisible()
    await expect(sep).toHaveAttribute('data-orientation', 'horizontal')
  })

  test('separator: horizontal is 1px tall and wider than tall', async ({ page }) => {
    const sep = page.locator('[data-slot="separator"][data-orientation="horizontal"]').first()
    const box = await sep.boundingBox()
    expect(box?.height).toBe(1)
    expect(box!.width).toBeGreaterThan(1)
  })

  test('separator: vertical has data-orientation="vertical" and is 1px wide', async ({ page }) => {
    // Radix only sets aria-orientation on semantic (non-decorative) separators.
    // Demo uses decorative=true (default), so check data-orientation instead.
    const vSep = page.locator('[data-slot="separator"][data-orientation="vertical"]').first()
    await expect(vSep).toBeVisible()
    await expect(vSep).toHaveAttribute('data-orientation', 'vertical')
    const box = await vSep.boundingBox()
    expect(box?.width).toBe(1)
    expect(box!.height).toBeGreaterThan(1)
  })

  test('separator: not interactive (no cursor:pointer, no tabindex)', async ({ page }) => {
    const sep = page.locator('[data-slot="separator"]').first()
    const cursor = await sep.evaluate(el => getComputedStyle(el).cursor)
    expect(cursor).not.toBe('pointer')
    await expect(sep).not.toHaveAttribute('tabindex')
  })

  test('separator: background resolves to rgb (CSS var works)', async ({ page }) => {
    const sep = page.locator('[data-slot="separator"]').first()
    const bg = await sep.evaluate(el => getComputedStyle(el).backgroundColor)
    expect(bg).toMatch(/^rgb/)
  })
})

// ─── Gate 6: Tabs-specific assertions ────────────────────────────────────────

test.describe('Gate 6 — Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test('tabs: tablist role is visible', async ({ page }) => {
    const tabSection = page.locator('[data-section="tabs-component"]')
    await expect(tabSection.getByRole('tablist')).toBeVisible()
  })

  test('tabs: active tab has aria-selected="true" and data-state="active"', async ({ page }) => {
    const tabSection = page.locator('[data-section="tabs-component"]')
    const activeTab = tabSection.getByRole('tab', { selected: true })
    await expect(activeTab).toHaveAttribute('aria-selected', 'true')
    await expect(activeTab).toHaveAttribute('data-state', 'active')
  })

  test('tabs: inactive tab has aria-selected="false" and data-state="inactive"', async ({ page }) => {
    const tabSection = page.locator('[data-section="tabs-component"]')
    const inactiveTabs = tabSection.getByRole('tab', { selected: false })
    await expect(inactiveTabs.first()).toHaveAttribute('aria-selected', 'false')
    await expect(inactiveTabs.first()).toHaveAttribute('data-state', 'inactive')
  })

  test('tabs: clicking inactive tab makes it active', async ({ page }) => {
    const tabSection = page.locator('[data-section="tabs-component"]')
    const secondTab = tabSection.getByRole('tab').nth(1)
    await secondTab.click()
    await page.waitForTimeout(100)
    await expect(secondTab).toHaveAttribute('aria-selected', 'true')
    await expect(secondTab).toHaveAttribute('data-state', 'active')
  })

  test('tabs: tabpanel is visible', async ({ page }) => {
    const tabSection = page.locator('[data-section="tabs-component"]')
    await expect(tabSection.getByRole('tabpanel')).toBeVisible()
  })

  test('tabs: active tab has tabindex="0"', async ({ page }) => {
    const tabSection = page.locator('[data-section="tabs-component"]')
    const activeTab = tabSection.getByRole('tab', { selected: true })
    // Radix roving focus sets tabindex=0 after the tablist receives focus
    await activeTab.click()
    await expect(activeTab).toHaveAttribute('tabindex', '0')
  })

  test('tabs: ArrowRight moves focus to next tab', async ({ page }) => {
    const tabSection = page.locator('[data-section="tabs-component"]')
    const firstTab = tabSection.getByRole('tab').first()
    await firstTab.focus()
    await page.keyboard.press('ArrowRight')
    await expect(tabSection.getByRole('tab').nth(1)).toBeFocused()
  })

  test('tabs: disabled tab has data-disabled attribute', async ({ page }) => {
    const tabSection = page.locator('[data-section="tabs-component"]')
    const disabledTab = tabSection.locator('[role="tab"][data-disabled]')
    await expect(disabledTab).toBeVisible()
    await expect(disabledTab).toBeDisabled()
  })
})
// ─── Gate 7: Overlay Positioning ─────────────────────────────────────────────

test.describe('Gate 7 — Overlay Positioning', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview')
    await page.waitForLoadState('networkidle')
  })

  test('select: dropdown opens near trigger, not at top-left corner', async ({ page }) => {
    const selectSection = page.locator('div').filter({ has: page.locator('h2', { hasText: 'Select' }) }).first()
    const trigger = selectSection.locator('button[role="combobox"]').first()

    await trigger.click()
    await page.waitForTimeout(250)

    const overlay = page.locator('[role="listbox"]')
    await expect(overlay).toBeVisible()

    const triggerBox = await trigger.boundingBox()
    const overlayBox = await overlay.boundingBox()

    expect(triggerBox).not.toBeNull()
    expect(overlayBox).not.toBeNull()

    // Overlay must NOT be at top-left corner (0,0 bug)
    expect(overlayBox!.y).toBeGreaterThan(50)
    expect(overlayBox!.x).toBeGreaterThan(10)

    // Overlay must be geometrically close to its trigger
    expect(Math.abs(overlayBox!.x - triggerBox!.x)).toBeLessThan(300)
    const verticalGap = overlayBox!.y - (triggerBox!.y + triggerBox!.height)
    expect(verticalGap).toBeGreaterThan(-50)
    expect(verticalGap).toBeLessThan(200)
  })

  test('popover: content opens near trigger, not at top-left corner', async ({ page }) => {
    const popoverSection = page.locator('[data-section="popover"]')
    const trigger = popoverSection.getByRole('button', { name: 'Default (bottom)' })

    await trigger.click()
    await page.waitForTimeout(250)

    const overlay = page.locator('[role="dialog"]').first()
    await expect(overlay).toBeVisible()

    const triggerBox = await trigger.boundingBox()
    const overlayBox = await overlay.boundingBox()

    expect(triggerBox).not.toBeNull()
    expect(overlayBox).not.toBeNull()

    // Overlay must NOT be at top-left corner (0,0 bug)
    expect(overlayBox!.y).toBeGreaterThan(50)
    expect(overlayBox!.x).toBeGreaterThan(10)

    // Overlay must be geometrically close to its trigger
    expect(Math.abs(overlayBox!.x - triggerBox!.x)).toBeLessThan(300)
    const verticalGap = overlayBox!.y - (triggerBox!.y + triggerBox!.height)
    expect(verticalGap).toBeGreaterThan(-50)
    expect(verticalGap).toBeLessThan(200)
  })

  test('tooltip: appears near trigger, not at top-left corner', async ({ page }) => {
    const tooltipSection = page.locator('[data-section="tooltip"]')
    const trigger = tooltipSection.locator('button').first()

    await trigger.hover()
    await page.waitForTimeout(250)

    const overlay = page.locator('[role="tooltip"]')
    await expect(overlay).toBeVisible()

    const triggerBox = await trigger.boundingBox()
    const overlayBox = await overlay.boundingBox()

    expect(triggerBox).not.toBeNull()
    expect(overlayBox).not.toBeNull()

    // Overlay must NOT be at top-left corner (0,0 bug)
    expect(overlayBox!.y).toBeGreaterThan(50)
    expect(overlayBox!.x).toBeGreaterThan(10)

    // Overlay must be geometrically close to its trigger
    expect(Math.abs(overlayBox!.x - triggerBox!.x)).toBeLessThan(300)
    // Tooltip may appear above or below trigger — check proximity via absolute distance
    const triggerCenterY = triggerBox!.y + triggerBox!.height / 2
    const overlayCenterY = overlayBox!.y + overlayBox!.height / 2
    expect(Math.abs(overlayCenterY - triggerCenterY)).toBeLessThan(200)
  })
})

// ─── Gate 8: Select — spec-driven scenarios ──────────────────────────────────

test.describe('Gate 8 — Select scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview')
    await page.waitForLoadState('networkidle')
  })

  test('select: click item — trigger text changes + listbox closes', async ({ page }) => {
    const selectSection = page.locator('div').filter({ has: page.locator('h2', { hasText: 'Select' }) }).first()
    const trigger = selectSection.locator('button[role="combobox"]').first()

    const textBefore = await trigger.innerText()

    await trigger.click()
    await page.waitForTimeout(150)
    const listbox = page.locator('[role="listbox"]')
    await expect(listbox).toBeVisible()

    const firstOption = listbox.locator('[role="option"]').first()
    const optionText = await firstOption.innerText()
    await firstOption.click()
    await page.waitForTimeout(200)

    // Listbox must be closed
    await expect(listbox).not.toBeVisible()

    // Trigger text must have changed to reflect selection
    const textAfter = await trigger.innerText()
    expect(textAfter).not.toBe(textBefore)
    expect(textAfter.trim()).toContain(optionText.trim())
  })

  test('select: exclusive selection — selecting B removes aria-selected from A', async ({ page }) => {
    const selectSection = page.locator('div').filter({ has: page.locator('h2', { hasText: 'Select' }) }).first()
    const trigger = selectSection.locator('button[role="combobox"]').first()

    // Open + select first option (A)
    await trigger.click()
    await page.waitForTimeout(150)
    const listbox = page.locator('[role="listbox"]')
    const optionA = listbox.locator('[role="option"]').first()
    await optionA.click()
    await page.waitForTimeout(200)

    // Reopen + verify A is selected, then pick B
    await trigger.click()
    await page.waitForTimeout(150)
    const listbox2 = page.locator('[role="listbox"]')
    const optionsAfterA = listbox2.locator('[role="option"]')
    await expect(optionsAfterA.first()).toHaveAttribute('aria-selected', 'true')

    const optionB = optionsAfterA.nth(1)
    await optionB.click()
    await page.waitForTimeout(200)

    // Reopen to verify — A must now be deselected, B selected
    await trigger.click()
    await page.waitForTimeout(150)
    const listbox3 = page.locator('[role="listbox"]')
    const optionsFinal = listbox3.locator('[role="option"]')
    await expect(optionsFinal.first()).not.toHaveAttribute('aria-selected', 'true')
    await expect(optionsFinal.nth(1)).toHaveAttribute('aria-selected', 'true')
  })

  test('select: keyboard Tab→Enter opens, ArrowDown navigates, Enter selects', async ({ page }) => {
    const selectSection = page.locator('div').filter({ has: page.locator('h2', { hasText: 'Select' }) }).first()
    const trigger = selectSection.locator('button[role="combobox"]').first()

    await trigger.focus()
    await expect(trigger).toBeFocused()

    await page.keyboard.press('Enter')
    await page.waitForTimeout(150)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(100)

    await page.keyboard.press('Enter')
    await page.waitForTimeout(200)

    await expect(page.locator('[role="listbox"]')).not.toBeVisible()
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('select: Escape closes dropdown + focus stays on trigger', async ({ page }) => {
    const selectSection = page.locator('div').filter({ has: page.locator('h2', { hasText: 'Select' }) }).first()
    const trigger = selectSection.locator('button[role="combobox"]').first()

    await trigger.click()
    await page.waitForTimeout(150)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)

    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('[role="listbox"]')).not.toBeVisible()
  })

  test('select: aria-invalid="true" on trigger when isError', async ({ page }) => {
    const selectSection = page.locator('div').filter({ has: page.locator('h2', { hasText: 'Select' }) }).first()
    const errorTrigger = selectSection.locator('#select-error')
    await expect(errorTrigger).toBeVisible()
    await expect(errorTrigger).toHaveAttribute('aria-invalid', 'true')
  })
})

// ─── Gate 9: Checkbox — spec-driven scenarios ─────────────────────────────────

test.describe('Gate 9 — Checkbox scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview')
    await page.waitForLoadState('networkidle')
  })

  test('checkbox: Space key toggles checked state', async ({ page }) => {
    // Checkbox uses native <input type="checkbox"> wrapped in a div
    const checkboxSection = page.locator('div').filter({ has: page.locator('h2', { hasText: 'Checkbox' }) }).first()
    const labels = checkboxSection.locator('label')
    const firstLabel = labels.first()
    const input = firstLabel.locator('input[type="checkbox"]')

    const checkedBefore = await input.isChecked()
    // Focus the input and press Space
    await input.focus()
    await page.keyboard.press('Space')
    await page.waitForTimeout(150)

    const checkedAfter = await input.isChecked()
    expect(checkedAfter).not.toBe(checkedBefore)
  })

  test('checkbox: Tab reaches checkbox input element', async ({ page }) => {
    const checkboxSection = page.locator('div').filter({ has: page.locator('h2', { hasText: 'Checkbox' }) }).first()
    // The input is opacity-0 (visually hidden) but focusable
    const input = checkboxSection.locator('input[type="checkbox"]').first()
    await input.focus()
    await expect(input).toBeFocused()
  })

  test('checkbox: focus-visible ring appears on keyboard focus (on indicator div)', async ({ page }) => {
    const checkboxSection = page.locator('div').filter({ has: page.locator('h2', { hasText: 'Checkbox' }) }).first()
    const firstLabel = checkboxSection.locator('label').first()
    const input = firstLabel.locator('input[type="checkbox"]')
    const indicatorDiv = firstLabel.locator('div.peer-focus-visible\\:ring-2, div[class*="peer-focus-visible"]').first()

    await input.focus()
    await page.waitForTimeout(100)

    // Focus ring is applied via peer-focus-visible on the sibling div.
    // When input is focused, browser applies :focus-visible → peer-focus-visible activates ring-2.
    // We verify by checking that the indicator div has a box-shadow (ring) applied.
    const boxShadow = await indicatorDiv.evaluate(el => getComputedStyle(el).boxShadow)
    // ring-2 with ring-[hsl(var(--ring))] produces a box-shadow that is non-empty and non-'none'
    expect(boxShadow).not.toBe('none')
    expect(boxShadow).not.toBe('')
  })

  test('checkbox: disabled checkbox — Space does NOT toggle', async ({ page }) => {
    const checkboxSection = page.locator('div').filter({ has: page.locator('h2', { hasText: 'Checkbox' }) }).first()
    // Third label is "Disabled checked"
    const disabledInput = checkboxSection.locator('input[type="checkbox"][disabled]').first()
    const checkedBefore = await disabledInput.isChecked()

    // Disabled inputs cannot receive focus via .focus() in most browsers, but can via force
    // Verify Space on a focused parent div doesn't accidentally toggle
    await disabledInput.dispatchEvent('keydown', { key: ' ', code: 'Space' })
    await page.waitForTimeout(150)

    const checkedAfter = await disabledInput.isChecked()
    expect(checkedAfter).toBe(checkedBefore)
  })
})

// ─── Gate 10: Input — spec-driven scenarios ───────────────────────────────────

test.describe('Gate 10 — Input scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview')
    await page.waitForLoadState('networkidle')
  })

  test('input: cursor:text on enabled input', async ({ page }) => {
    // Use the specific id from the demo — no data-section on Input section
    const input = page.locator('#input-default')
    await expect(input).toBeVisible()
    const cursor = await input.evaluate(el => getComputedStyle(el).cursor)
    expect(cursor).toBe('text')
  })

  test('input: cursor:not-allowed on disabled input', async ({ page }) => {
    const disabledInput = page.locator('#input-disabled')
    await expect(disabledInput).toBeVisible()
    const cursor = await disabledInput.evaluate(el => getComputedStyle(el).cursor)
    expect(cursor).toBe('not-allowed')
  })

  test('input: focus-visible ring appears on keyboard focus', async ({ page }) => {
    const input = page.locator('#input-default')
    await input.focus()
    await page.waitForTimeout(100)

    const boxShadow = await input.evaluate(el => getComputedStyle(el).boxShadow)
    const outlineStyle = await input.evaluate(el => getComputedStyle(el).outlineStyle)
    const hasFocusRing = outlineStyle !== 'none' || (boxShadow !== 'none' && boxShadow !== '')
    expect(hasFocusRing).toBe(true)
  })

  test('input: aria-invalid="true" on error state input', async ({ page }) => {
    const errorInput = page.locator('#input-error')
    await expect(errorInput).toBeVisible()
    await expect(errorInput).toHaveAttribute('aria-invalid', 'true')
  })

  test('input: aria-describedby references valid DOM IDs for helper + error', async ({ page }) => {
    const errorInput = page.locator('#input-error')
    const describedBy = await errorInput.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()

    const ids = describedBy!.split(/\s+/).filter(Boolean)
    expect(ids.length).toBeGreaterThan(0)
    for (const id of ids) {
      const el = page.locator(`#${id}`)
      await expect(el).toBeAttached()
    }
  })
})

// ─── Gate 11: Tooltip — spec-driven scenarios ─────────────────────────────────

test.describe('Gate 11 — Tooltip scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview')
    await page.waitForLoadState('networkidle')
  })

  test('tooltip: hover trigger → tooltip appears', async ({ page }) => {
    const tooltipSection = page.locator('[data-section="tooltip"]')
    const trigger = tooltipSection.locator('button').first()

    await trigger.hover()
    await page.waitForTimeout(700) // delayDuration default 300ms + render buffer

    await expect(page.locator('[role="tooltip"]')).toBeVisible()
  })

  test('tooltip: keyboard Tab to trigger → tooltip opens', async ({ page }) => {
    const tooltipSection = page.locator('[data-section="tooltip"]')
    const trigger = tooltipSection.locator('button').first()

    await trigger.focus()
    await page.waitForTimeout(700) // focus uses same delayDuration timer

    await expect(page.locator('[role="tooltip"]')).toBeVisible()
  })

  test('tooltip: Escape closes tooltip when open', async ({ page }) => {
    const tooltipSection = page.locator('[data-section="tooltip"]')
    const trigger = tooltipSection.locator('button').first()

    // Open via focus
    await trigger.focus()
    await page.waitForTimeout(700)
    await expect(page.locator('[role="tooltip"]')).toBeVisible()

    // Press Escape — should close (Escape handler added to tooltip trigger)
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    await expect(page.locator('[role="tooltip"]')).not.toBeVisible()
  })
})

// ─── Gate 12: Popover — spec-driven scenarios ─────────────────────────────────

test.describe('Gate 12 — Popover additional scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview')
    await page.waitForLoadState('networkidle')
  })

  test('popover: open → first focusable element inside popover receives focus', async ({ page }) => {
    const popoverSection = page.locator('[data-section="popover"]')
    // "With form" popover has a Field/input inside — use that for focus check
    const trigger = popoverSection.getByRole('button', { name: 'With form' })
    await trigger.click()
    await page.waitForTimeout(350) // wait for portal render + auto-focus delay (50ms)

    const popoverContent = page.locator('[role="dialog"]').first()
    await expect(popoverContent).toBeVisible()

    // Verify focus moved inside the popover content (auto-focus feature)
    const focusInsidePopover = await page.evaluate(() => {
      const dialogs = document.querySelectorAll('[role="dialog"]')
      for (const dialog of dialogs) {
        if (dialog.contains(document.activeElement)) return true
      }
      return false
    })
    expect(focusInsidePopover).toBe(true)
  })
})

// ─── Gate 13: RadioGroup — spec-driven scenarios ──────────────────────────────

test.describe('Gate 13 — RadioGroup scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview')
    await page.waitForLoadState('networkidle')
  })

  test('radio: selected item has aria-checked="true"', async ({ page }) => {
    const radioSection = page.locator('section').filter({ hasText: 'Radio' })
    const firstGroup = radioSection.locator('[role="radiogroup"]').first()
    const freeBtn = firstGroup.locator('button[role="radio"]').first()
    await expect(freeBtn).toHaveAttribute('aria-checked', 'true')
  })

  test('radio: Space key selects focused item', async ({ page }) => {
    const radioSection = page.locator('section').filter({ hasText: 'Radio' })
    const firstGroup = radioSection.locator('[role="radiogroup"]').first()
    // Click free first to ensure consistent state
    await firstGroup.locator('button[role="radio"]').first().click()
    await page.waitForTimeout(100)

    // Focus Pro (second) and press Space
    const secondBtn = firstGroup.locator('button[role="radio"]').nth(1)
    await secondBtn.focus()
    await page.keyboard.press('Space')
    await page.waitForTimeout(150)

    await expect(secondBtn).toHaveAttribute('aria-checked', 'true')
  })

  test('radio: ArrowDown moves focus AND selects next item', async ({ page }) => {
    const radioSection = page.locator('section').filter({ hasText: 'Radio' })
    const firstGroup = radioSection.locator('[role="radiogroup"]').first()
    const firstBtn = firstGroup.locator('button[role="radio"]').first()
    const secondBtn = firstGroup.locator('button[role="radio"]').nth(1)

    // Ensure first is selected
    await firstBtn.click()
    await page.waitForTimeout(100)
    await expect(firstBtn).toHaveAttribute('aria-checked', 'true')

    await firstBtn.focus()
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(150)

    await expect(secondBtn).toBeFocused()
    await expect(secondBtn).toHaveAttribute('aria-checked', 'true')
    await expect(firstBtn).toHaveAttribute('aria-checked', 'false')
  })

  test('radio: disabled item click does not change selection', async ({ page }) => {
    const radioSection = page.locator('section').filter({ hasText: 'Radio' })
    const firstGroup = radioSection.locator('[role="radiogroup"]').first()
    const firstBtn = firstGroup.locator('button[role="radio"]').first()

    await firstBtn.click()
    await page.waitForTimeout(100)
    await expect(firstBtn).toHaveAttribute('aria-checked', 'true')

    const disabledBtn = firstGroup.locator('button[role="radio"][disabled]').first()
    await expect(disabledBtn).toBeVisible()

    await disabledBtn.click({ force: true })
    await page.waitForTimeout(150)

    await expect(firstBtn).toHaveAttribute('aria-checked', 'true')
    await expect(disabledBtn).not.toHaveAttribute('aria-checked', 'true')
  })
})

// ─── Gate 14: Switch — spec-driven scenarios ──────────────────────────────────

test.describe('Gate 14 — Switch scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview')
    await page.waitForLoadState('networkidle')
  })

  // Helper: locate the Switch ComponentSection root (rounded-2xl wrapper with h2 "Switch")
  const switchSection = (page: import('@playwright/test').Page) =>
    page.locator('div.rounded-2xl').filter({ has: page.locator('h2', { hasText: 'Switch' }) }).first()

  test('switch: Space key toggles state', async ({ page }) => {
    const section = switchSection(page)
    const sw = section.locator('[role="switch"]:not([disabled])').first()

    const before = await sw.getAttribute('aria-checked')
    await sw.focus()
    await page.keyboard.press('Space')
    await page.waitForTimeout(150)

    const after = await sw.getAttribute('aria-checked')
    expect(after).not.toBe(before)
  })

  test('switch: data-state=checked applied after toggle to on', async ({ page }) => {
    const section = switchSection(page)
    // Use the first non-disabled switch — the "Unchecked" one starts aria-checked=false
    const switches = section.locator('[role="switch"]:not([disabled])')
    // Find the first unchecked one
    const count = await switches.count()
    let targetIndex = 0
    for (let i = 0; i < count; i++) {
      const checked = await switches.nth(i).getAttribute('aria-checked')
      if (checked === 'false') { targetIndex = i; break }
    }
    const sw = switches.nth(targetIndex)

    await expect(sw).toHaveAttribute('data-state', 'unchecked')

    await sw.click()
    await page.waitForTimeout(200)

    // Re-query to avoid stale element reference after React re-render
    const swAfter = section.locator('[role="switch"]:not([disabled])').nth(targetIndex)
    await expect(swAfter).toHaveAttribute('aria-checked', 'true')
    await expect(swAfter).toHaveAttribute('data-state', 'checked')
  })

  test('switch: Tab reaches switch root', async ({ page }) => {
    const section = switchSection(page)
    const sw = section.locator('[role="switch"]:not([disabled])').first()
    await sw.focus()
    await expect(sw).toBeFocused()
  })

  test('switch: focus-visible ring on keyboard focus', async ({ page }) => {
    const section = switchSection(page)
    const sw = section.locator('[role="switch"]:not([disabled])').first()

    await sw.focus()
    await page.waitForTimeout(100)
    const boxShadow = await sw.evaluate(el => getComputedStyle(el).boxShadow)
    const outlineStyle = await sw.evaluate(el => getComputedStyle(el).outlineStyle)
    const hasFocusRing = outlineStyle !== 'none' || (boxShadow !== 'none' && boxShadow !== '')
    expect(hasFocusRing).toBe(true)
  })

  test('switch: disabled switch — Space does NOT toggle', async ({ page }) => {
    const section = switchSection(page)
    const disabledSw = section.locator('[role="switch"][disabled]').first()

    const before = await disabledSw.getAttribute('aria-checked')
    await disabledSw.focus()
    await page.keyboard.press('Space')
    await page.waitForTimeout(150)

    const after = await disabledSw.getAttribute('aria-checked')
    expect(after).toBe(before)
  })
})

// ─── Gate 17: Switch Preview Block (5-tab ComponentSection) ──────────────────

test.describe('Gate 17 — Switch Preview Block', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview')
    await page.waitForLoadState('networkidle')
  })

  // Helper: locate the Switch ComponentSection root (rounded-2xl wrapper with h2 "Switch")
  const switchSection = (page: import('@playwright/test').Page) =>
    page.locator('div.rounded-2xl').filter({ has: page.locator('h2', { hasText: 'Switch' }) }).first()

  test('preview-block: all 5 tabs rendered (Overview/API/Usage/Code/States)', async ({ page }) => {
    const section = switchSection(page)
    const expected = ['Overview', 'API', 'Usage', 'Code', 'States']
    for (const label of expected) {
      await expect(section.getByRole('tab', { name: label, exact: true })).toBeVisible()
    }
  })

  test('preview-block: clicking each tab swaps content (tab switching works)', async ({ page }) => {
    const section = switchSection(page)

    // Overview (default): "Unchecked" / "Checked" / "Disabled (off)" label rows
    await expect(section.getByText('Unchecked', { exact: true })).toBeVisible()
    await expect(section.getByText('Checked', { exact: true })).toBeVisible()

    // API tab → DocPropsTable with prop names like "onCheckedChange"
    await section.getByRole('tab', { name: 'API', exact: true }).click()
    await page.waitForTimeout(100)
    await expect(section.getByText('onCheckedChange', { exact: false }).first()).toBeVisible()

    // Usage tab → Do/Don't cards
    await section.getByRole('tab', { name: 'Usage', exact: true }).click()
    await page.waitForTimeout(100)
    await expect(section.getByText('✓ Do').first()).toBeVisible()
    await expect(section.getByText("✕ Don't").first()).toBeVisible()

    // Code tab → code block labels
    await section.getByRole('tab', { name: 'Code', exact: true }).click()
    await page.waitForTimeout(100)
    await expect(section.getByText('Basic (controlled)').first()).toBeVisible()

    // States tab → state matrix table
    await section.getByRole('tab', { name: 'States', exact: true }).click()
    await page.waitForTimeout(100)
    await expect(section.locator('table').first()).toBeVisible()
  })

  test('preview-block: shiki syntax highlighting loads in Code tab', async ({ page }) => {
    const section = switchSection(page)
    await section.getByRole('tab', { name: 'Code', exact: true }).click()
    // shiki import is async; wait for .shiki element to appear
    const shikiEl = section.locator('.shiki').first()
    await expect(shikiEl).toBeVisible({ timeout: 5000 })
    // Verify shiki produced span-based syntax tokens (not a plain <pre><code>)
    const spanCount = await shikiEl.locator('span').count()
    expect(spanCount).toBeGreaterThan(5)
  })

  test('preview-block: Do/Don\'t cards visible in Usage tab', async ({ page }) => {
    const section = switchSection(page)
    await section.getByRole('tab', { name: 'Usage', exact: true }).click()
    await page.waitForTimeout(100)
    const doCards = section.getByText('✓ Do')
    const dontCards = section.getByText("✕ Don't")
    expect(await doCards.count()).toBeGreaterThanOrEqual(1)
    expect(await dontCards.count()).toBeGreaterThanOrEqual(1)
  })

  test('switch: size variants — sm/md/lg rendered in States matrix', async ({ page }) => {
    const section = switchSection(page)
    await section.getByRole('tab', { name: 'States', exact: true }).click()
    await page.waitForTimeout(150)

    // States table renders rows labelled sm / md / lg in the leftmost column
    const table = section.locator('table').first()
    for (const size of ['sm', 'md', 'lg']) {
      await expect(table.locator('td', { hasText: new RegExp(`^${size}$`) }).first()).toBeVisible()
    }
    // Each row contains 4 switches (Unchecked / Checked / Disabled off / Disabled on) → 12 total
    const switchCount = await table.locator('[role="switch"]').count()
    expect(switchCount).toBe(12)
  })

  test('switch: disabled-on column in States preserves data-state=checked', async ({ page }) => {
    const section = switchSection(page)
    await section.getByRole('tab', { name: 'States', exact: true }).click()
    await page.waitForTimeout(150)

    // Disabled-on column → switch is disabled AND aria-checked="true" / data-state="checked"
    const disabledChecked = section.locator('[role="switch"][disabled][aria-checked="true"]').first()
    await expect(disabledChecked).toBeAttached()
    await expect(disabledChecked).toHaveAttribute('data-state', 'checked')
  })

  test('preview-block: tablist exists with role=tablist + aria-orientation=horizontal', async ({ page }) => {
    const section = switchSection(page)
    const tablist = section.getByRole('tablist').first()
    await expect(tablist).toBeVisible()
    await expect(tablist).toHaveAttribute('aria-orientation', 'horizontal')
  })

  test('preview-block: active tab has aria-selected=true, others false; only active is in tab order', async ({ page }) => {
    const section = switchSection(page)
    const activeTab = section.getByRole('tab', { selected: true })
    await expect(activeTab).toHaveCount(1)
    await expect(activeTab).toHaveAttribute('aria-selected', 'true')
    await expect(activeTab).toHaveAttribute('tabindex', '0')

    const inactiveTabs = section.getByRole('tab', { selected: false })
    await expect(inactiveTabs.first()).toHaveAttribute('tabindex', '-1')
  })

  test('preview-block: active panel has role=tabpanel and aria-labelledby points to active tab', async ({ page }) => {
    const section = switchSection(page)
    const panel = section.getByRole('tabpanel').first()
    await expect(panel).toBeVisible()
    const labelledBy = await panel.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    const referenced = section.locator(`#${labelledBy}`)
    await expect(referenced).toHaveAttribute('aria-selected', 'true')
  })

  test('preview-block: ArrowRight cycles selected tab and focus stays on it', async ({ page }) => {
    const section = switchSection(page)
    const firstTab = section.getByRole('tab').first()
    await firstTab.focus()
    await expect(firstTab).toHaveAttribute('aria-selected', 'true')

    await page.keyboard.press('ArrowRight')
    const secondTab = section.getByRole('tab').nth(1)
    await expect(secondTab).toBeFocused()
    await expect(secondTab).toHaveAttribute('aria-selected', 'true')
  })
})

// ─── Gate 15: Dialog — additional spec-driven scenarios ───────────────────────

test.describe('Gate 15 — Dialog additional scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview')
    await page.waitForLoadState('networkidle')
  })

  test('dialog: click overlay closes dialog', async ({ page }) => {
    const dialogSection = page.locator('[data-section="dialog"]')
    const trigger = dialogSection.getByRole('button', { name: 'Default dialog' })
    await trigger.click()
    await page.waitForTimeout(200)

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Click outside the dialog panel (overlay area) — top-left corner of viewport
    await page.mouse.click(5, 5)
    await page.waitForTimeout(300)

    await expect(dialog).not.toBeVisible()
  })

  test('dialog: click X close button closes dialog', async ({ page }) => {
    const dialogSection = page.locator('[data-section="dialog"]')
    const trigger = dialogSection.getByRole('button', { name: 'Default dialog' })
    await trigger.click()
    await page.waitForTimeout(200)

    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Find the X close button — DialogClose renders button with sr-only "Close" text
    const closeBtn = dialog.getByRole('button', { name: 'Close dialog' })
    await closeBtn.click()
    await page.waitForTimeout(300)

    await expect(dialog).not.toBeVisible()
  })
})

// ─── Gate 16: Checkbox Preview Block (5-tab ComponentSection) ─────────────────

test.describe('Gate 16 — Checkbox Preview Block & extended API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview')
    await page.waitForLoadState('networkidle')
  })

  // Helper: locate the Checkbox ComponentSection root (rounded-2xl wrapper with h2 "Checkbox")
  const checkboxSection = (page: import('@playwright/test').Page) =>
    page.locator('div.rounded-2xl').filter({ has: page.locator('h2', { hasText: 'Checkbox' }) }).first()

  test('preview-block: all 5 tabs rendered (Overview/API/Usage/Code/States)', async ({ page }) => {
    const section = checkboxSection(page)
    const expected = ['Overview', 'API', 'Usage', 'Code', 'States']
    for (const label of expected) {
      await expect(section.getByRole('tab', { name: label, exact: true })).toBeVisible()
    }
  })

  test('preview-block: clicking each tab swaps content (tab switching works)', async ({ page }) => {
    const section = checkboxSection(page)

    // Overview (default): has "Unchecked" / "Checked" / "Indeterminate" / "Disabled" label rows
    await expect(section.getByText('Indeterminate', { exact: true })).toBeVisible()

    // API tab → DocPropsTable with prop names like "errorMessage"
    await section.getByRole('tab', { name: 'API', exact: true }).click()
    await page.waitForTimeout(100)
    await expect(section.getByText('errorMessage', { exact: false }).first()).toBeVisible()

    // Usage tab → Do/Don't cards
    await section.getByRole('tab', { name: 'Usage', exact: true }).click()
    await page.waitForTimeout(100)
    await expect(section.getByText('✓ Do').first()).toBeVisible()
    await expect(section.getByText("✕ Don't").first()).toBeVisible()

    // Code tab → code block labels
    await section.getByRole('tab', { name: 'Code', exact: true }).click()
    await page.waitForTimeout(100)
    await expect(section.getByText('Basic (controlled)').first()).toBeVisible()

    // States tab → state matrix table
    await section.getByRole('tab', { name: 'States', exact: true }).click()
    await page.waitForTimeout(100)
    // Column headers "Unchecked","Checked","Indeterminate","Disabled" are shown in State tab table
    await expect(section.locator('table').first()).toBeVisible()
  })

  test('preview-block: shiki syntax highlighting loads in Code tab', async ({ page }) => {
    const section = checkboxSection(page)
    await section.getByRole('tab', { name: 'Code', exact: true }).click()
    // shiki import is async; wait for .shiki element to appear
    const shikiEl = section.locator('.shiki').first()
    await expect(shikiEl).toBeVisible({ timeout: 5000 })
    // Verify shiki produced span-based syntax tokens (not a plain <pre><code>)
    const spanCount = await shikiEl.locator('span').count()
    expect(spanCount).toBeGreaterThan(5)
  })

  test('preview-block: Do/Don\'t cards visible in Usage tab', async ({ page }) => {
    const section = checkboxSection(page)
    await section.getByRole('tab', { name: 'Usage', exact: true }).click()
    await page.waitForTimeout(100)
    const doCards = section.getByText('✓ Do')
    const dontCards = section.getByText("✕ Don't")
    expect(await doCards.count()).toBeGreaterThanOrEqual(1)
    expect(await dontCards.count()).toBeGreaterThanOrEqual(1)
  })

  test('checkbox: indeterminate renders dash SVG + aria-checked="mixed"', async ({ page }) => {
    const section = checkboxSection(page)
    // On Overview tab the 3rd label is Indeterminate
    const indeterminateLabel = section.locator('label').filter({ hasText: 'Indeterminate' }).first()
    const input = indeterminateLabel.locator('input[type="checkbox"]')

    await expect(input).toHaveAttribute('aria-checked', 'mixed')
    // Verify the box has data-state="indeterminate"
    const box = indeterminateLabel.locator('[data-state="indeterminate"]').first()
    await expect(box).toBeVisible()
    // The dash SVG is the <svg> sibling with group-data-[state=indeterminate]:block
    // When state=indeterminate, one of the two SVGs is visible
    const visibleSvgs = await box.locator('svg:visible').count()
    expect(visibleSvgs).toBeGreaterThanOrEqual(1)
  })

  test('checkbox: required={true} forwards native attribute + aria-required="true"', async ({ page }) => {
    // The Required row appears in the States tab
    const section = checkboxSection(page)
    await section.getByRole('tab', { name: 'States', exact: true }).click()
    await page.waitForTimeout(150)

    const requiredInput = section.locator('input[type="checkbox"][required]').first()
    await expect(requiredInput).toBeAttached()
    await expect(requiredInput).toHaveAttribute('aria-required', 'true')
    // Native required must also be present (JSDOM/browser convert to empty string attr)
    const nativeRequired = await requiredInput.evaluate((el: HTMLInputElement) => el.required)
    expect(nativeRequired).toBe(true)
  })

  test('checkbox: error={true} sets aria-invalid="true" + destructive border color', async ({ page }) => {
    const section = checkboxSection(page)
    await section.getByRole('tab', { name: 'States', exact: true }).click()
    await page.waitForTimeout(150)

    const errorInput = section.locator('input[type="checkbox"][aria-invalid="true"]').first()
    await expect(errorInput).toBeAttached()

    // Locate the sibling box (the data-error="true" wrapper)
    const errorBox = section.locator('[data-error="true"]').first()
    await expect(errorBox).toBeVisible()

    // Resolve the destructive CSS var to rgb
    const expectedBorder = await page.evaluate(() => {
      const probe = document.createElement('div')
      probe.style.color = 'hsl(var(--destructive))'
      document.body.appendChild(probe)
      const rgb = getComputedStyle(probe).color
      probe.remove()
      return rgb
    })

    // Get the inner indicator div (has the border class)
    const indicator = errorBox.locator('div').first()
    const actualBorder = await indicator.evaluate((el) => getComputedStyle(el).borderTopColor)
    expect(actualBorder).toBe(expectedBorder)
  })

  test('checkbox: errorMessage renders below + linked via aria-describedby', async ({ page }) => {
    const section = checkboxSection(page)
    await section.getByRole('tab', { name: 'States', exact: true }).click()
    await page.waitForTimeout(150)

    // Error row + Unchecked column carries errorMessage="Required field"
    const messageEl = section.getByText('Required field', { exact: true }).first()
    await expect(messageEl).toBeVisible()

    const messageId = await messageEl.getAttribute('id')
    expect(messageId).toBeTruthy()

    // Find the input whose aria-describedby references that id
    const linkedInput = section.locator(`input[type="checkbox"][aria-describedby~="${messageId}"]`).first()
    await expect(linkedInput).toBeAttached()

    // Assert vertical order: input is above the message (message rendered "below" the box)
    const inputBox = await linkedInput.boundingBox()
    const msgBox = await messageEl.boundingBox()
    expect(inputBox).not.toBeNull()
    expect(msgBox).not.toBeNull()
    expect(msgBox!.y).toBeGreaterThanOrEqual(inputBox!.y)
  })
})
