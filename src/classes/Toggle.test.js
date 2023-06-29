import { expect, test } from '@playwright/test'

test.describe('Toggle', () => {
  test.beforeEach(async({page}) => {
    await page.goto('http://localhost:5173/examples/accessible-toggle/index.html')
  })
  
  test('Click on a toggle button, expect the content is visible.', async ({page}) => {
    await page.click('button[aria-controls="toggle-1"]')
    let display = await page.$eval(
      '#toggle-1',
      content => window.getComputedStyle(content).display
    )

    expect(display).toBe('block')
  })
  
  test('On a 1025px window width page, click on a toggle button of a content who is visible only for <= 1024px window width pages, expect the content is still hidden.', async ({page}) => {
    await page.setViewportSize({
      width: 1025,
      height: 100,
    })
    await page.click('button[aria-controls="toggle-4"]')
    let display = await page.$eval(
      '#toggle-4',
      content => window.getComputedStyle(content).display
    )

    expect(display).toBe('none')
  })

  test('On a 1024px window width page, click on a toggle button of a content who is visible only for <= 1024px window width pages, expect the content is visible.', async ({page}) => {
    await page.setViewportSize({
      width: 1024,
      height: 100,
    })
    await page.click('button[aria-controls="toggle-4"]')
    let display = await page.$eval(
      '#toggle-4',
      content => window.getComputedStyle(content).display
    )

    expect(display).toBe('block')
  })

  test('Click on a toggle button of a visible content, expect the content is hidden.', async ({page}) => {
    await page.click('button[aria-controls="toggle-5"]')
    let display = await page.$eval(
      '#toggle-5',
      content => window.getComputedStyle(content).display
    )

    expect(display).toBe('none')
  })
})
