import { expect, test } from '@playwright/test'

test.describe('Accordion', () => {
  test.beforeEach(async({page}) => {
    await page.goto('http://localhost:5173/examples/accessible-accordion/index.html')
  })

  test('Click the first accordion button, expect this accordion button is still focused.', async ({page}) => {
    const id = await page.locator('#accordion-demo-1').getAttribute('data-id')
    await page.click(`#accordion-${id}-1`)
    await expect(page.locator(`#accordion-${id}-1`)).toBeFocused()
  })

  test('Click the second tab accordion, expect the second panel is visible.', async ({page}) => {
    const id = await page.locator('#accordion-demo-1').getAttribute('data-id')
    await page.click(`#accordion-${id}-2`)
    const display = await page.$eval(
      `#accordion-${id}-panel-2`,
      dialog => window.getComputedStyle(dialog).display
    )

    expect(display).toBe('block')
  })
})
