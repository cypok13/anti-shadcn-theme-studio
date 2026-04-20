import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const COMPONENTS_URL = '/preview?tab=components'
const CARDS_URL = '/preview?tab=cards'

// ─── Gate 0: Runtime integrity ───────────────────────────────────────────────

test.describe('Gate 0 — Runtime integrity', () => {
  test('no JS errors or React hydration failures on components tab', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))
    await page.goto(COMPONENTS_URL)
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })

  test('no JS errors or React hydration failures on cards tab', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    page.on('pageerror', err => errors.push(err.message))
    await page.goto(CARDS_URL)
    await page.waitForLoadState('networkidle')
    expect(errors).toHaveLength(0)
  })

  test('no block elements (div/section/article) inside button', async ({ page }) => {
    await page.goto(COMPONENTS_URL)
    await page.waitForLoadState('networkidle')
    // Exclude Vercel toolbar buttons (data-issues-open) — injected by Vercel dev overlay, not our code
    const invalid = await page.locator('button:not([data-issues-open]) div, button:not([data-issues-open]) section, button:not([data-issues-open]) article').count()
    expect(invalid).toBe(0)
  })

  test('no block elements inside button on cards tab', async ({ page }) => {
    await page.goto(CARDS_URL)
    await page.waitForLoadState('networkidle')
    const invalid = await page.locator('button:not([data-issues-open]) div, button:not([data-issues-open]) section, button:not([data-issues-open]) article').count()
    expect(invalid).toBe(0)
  })
})

// ─── Gate 1: CSS / ARIA form ─────────────────────────────────────────────────

test.describe('Gate 1 — CSS & ARIA form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(COMPONENTS_URL)
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

  test('axe-core: zero critical violations on cards tab', async ({ page }) => {
    await page.goto(CARDS_URL)
    await page.waitForLoadState('networkidle')
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
    await page.goto(COMPONENTS_URL)
    await page.waitForLoadState('networkidle')
  })

  test('checkbox: clicking label text toggles checked state', async ({ page }) => {
    const labels = page.locator('section').filter({ hasText: 'Checkbox' }).locator('label')
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
    const switchSection = page.locator('section').filter({ hasText: 'Switch' })
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
    const contentBefore = await tabSection.locator('.border').last().innerText()

    await secondTab.click()
    await page.waitForTimeout(100)

    const contentAfter = await tabSection.locator('.border').last().innerText()
    expect(contentAfter).not.toBe(contentBefore)
  })

  test('select: clicking trigger opens dropdown', async ({ page }) => {
    const selectSection = page.locator('section').filter({ hasText: 'Select' })
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

  test('cards tab: cookie settings switch toggles', async ({ page }) => {
    await page.goto(CARDS_URL)
    await page.waitForLoadState('networkidle')

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
    const trigger = popoverSection.getByRole('button', { name: 'Default' })
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
    const trigger = popoverSection.getByRole('button', { name: 'Default' })
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
    const trigger = popoverSection.getByRole('button', { name: 'Default' })
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
    await page.goto(CARDS_URL)
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
    await page.goto(COMPONENTS_URL)
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
    await page.goto(COMPONENTS_URL)
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
    await page.goto(COMPONENTS_URL)
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
    await page.goto(COMPONENTS_URL)
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