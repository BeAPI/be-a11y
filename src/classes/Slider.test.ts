import { expect, test } from '@playwright/test'

test.describe('Slider', () => {
  test.beforeEach(async({page}) => {
    await page.goto('http://localhost:5173/examples/accessible-slider/index.html')
  })

  test('Click on next button, expect "data-dir" attribute is set to 1.', async ({page}) => {
    await page.click('.slider__next')

    const slider = await page.$eval(
      '.slider',
      s => s.getAttribute('data-dir')
    )

    expect(slider).toBe('1')
  })

  test('Click on previous button, expect "data-dir" attribute is set to -1.', async ({page}) => {
    await page.click('.slider__next')
    await page.click('.slider__prev')

    const slider = await page.$eval(
      '.slider',
      s => s.getAttribute('data-dir')
    )

    expect(slider).toBe('-1')
  })

  test('Click on last item button, then click on previous button, expect "data-dir" attribute is set to -1.', async ({page}) => {
    await page.click('button[value="4"]')
    await page.click('.slider__prev')

    const slider = await page.$eval(
      '.slider',
      s => s.getAttribute('data-dir')
    )

    expect(slider).toBe('-1')
  })
})
