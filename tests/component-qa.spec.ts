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
    const tabButtons = page.locator('[role="tablist"] button, .rounded-\\[var\\(--radius\\)\\].bg-\\[hsl\\(var\\(--muted\\)\\)\\] button').first().locator('..')
    // Simpler: find the tabs container
    const tabSection = page.locator('section').filter({ hasText: 'Tabs' })
    const tabs = tabSection.locator('button')
    const firstTab = tabs.first()
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
    const trigger = selectSection.locator('button').first()

    // Dropdown should not be visible initially
    const dropdownBefore = await selectSection.locator('.absolute').count()

    await trigger.click()
    await page.waitForTimeout(100)

    // Dropdown should appear after click
    const dropdownAfter = await selectSection.locator('.absolute').count()
    expect(dropdownAfter).toBeGreaterThan(dropdownBefore)
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
})
