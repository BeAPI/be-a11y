import { expect, test } from '@playwright/test'

test.describe('Accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/examples/accessible-accordion/index.html')
  })

  test('Click the first tab accordion, expect the first focusable element in the panel is focused.', async ({
    page,
  }) => {
    const id = await page.locator('#accordion-demo-1').getAttribute('data-id')
    await page.click(`#accordion-${id}-1`)
    await expect(page.locator('#cufc1-1')).toBeFocused()
  })

  test('Click the second tab accordion, expect the second panel is visible.', async ({ page }) => {
    const id = await page.locator('#accordion-demo-1').getAttribute('data-id')
    await page.click(`#accordion-${id}-2`)
    const display = await page.$eval(`#accordion-${id}-panel-2`, (dialog) => window.getComputedStyle(dialog).display)

    expect(display).toBe('block')
  })

  test('When opening a new panel, the previously opened panel should have aria-expanded set to false.', async ({
    page,
  }) => {
    const id = await page.locator('#accordion-demo-1').getAttribute('data-id')

    // First panel should be open by default with aria-expanded="true"
    await expect(page.locator(`#accordion-${id}-1`)).toHaveAttribute('aria-expanded', 'true')

    // Click the second trigger to open the second panel
    await page.click(`#accordion-${id}-2`)

    // The first trigger should now have aria-expanded="false"
    await expect(page.locator(`#accordion-${id}-1`)).toHaveAttribute('aria-expanded', 'false')

    // The second trigger should have aria-expanded="true"
    await expect(page.locator(`#accordion-${id}-2`)).toHaveAttribute('aria-expanded', 'true')

    // The first panel should be hidden
    const firstPanelDisplay = await page.$eval(
      `#accordion-${id}-panel-1`,
      (panel) => window.getComputedStyle(panel).display
    )
    expect(firstPanelDisplay).toBe('none')

    // The second panel should be visible
    const secondPanelDisplay = await page.$eval(
      `#accordion-${id}-panel-2`,
      (panel) => window.getComputedStyle(panel).display
    )
    expect(secondPanelDisplay).toBe('block')
  })
})
