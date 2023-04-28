import { expect, test } from '@playwright/test'

test.describe('CssSlider', () => {
  test.beforeEach(async({page}) => {
    await page.goto('http://127.0.0.1:5173/examples/accessible-css-slider/index.html')
  })

  test('Click on next button, expect live region to be updated', async ({page}) => {
    const liveRegion = page.getByTestId('live-region')
    const btnNext = page.getByTestId('btn-next')
    const liveRegionOriginalValue = await liveRegion.innerHTML()

    await btnNext.click()

    expect(liveRegionOriginalValue !== await liveRegion.innerHTML()).toBe(true)
  })

  test('Click on prev button, expect live region to be updated', async ({page}) => {
    const liveRegion = page.getByTestId('live-region')
    const btnPrev = page.getByTestId('btn-next')
    const liveRegionOriginalValue = await liveRegion.innerHTML()

    await btnPrev.click()

    expect(liveRegionOriginalValue !== await liveRegion.innerHTML()).toBe(true)
  })
})
