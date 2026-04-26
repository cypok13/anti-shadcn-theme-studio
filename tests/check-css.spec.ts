import { test } from '@playwright/test'

test('check CSS rules', async ({ page }) => {
  await page.goto('/preview')
  await page.waitForLoadState('networkidle')
  
  const result = await page.evaluate(() => {
    const allRules: string[] = []
    const styles = document.querySelectorAll('style')
    for (const s of styles) {
      allRules.push('STYLE: ' + s.textContent?.substring(0, 100) + '...')
    }
    for (const sheet of document.styleSheets) {
      try {
        allRules.push('SHEET href=' + sheet.href + ' rules=' + sheet.cssRules.length)
      } catch(e) { allRules.push('SHEET (blocked): ' + sheet.href) }
    }
    return allRules
  })
  for (const r of result) console.log(r)
})
