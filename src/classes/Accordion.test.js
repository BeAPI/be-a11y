import { expect, test } from '@playwright/test'

test.describe('Accordion', () => {
  test.beforeEach(async({page}) => {
    await page.goto('http://127.0.0.1:5173/examples/accessible-accordion/index.html')
  })

  test('Click the first tab accordion, expect the first focusable element in the panel is focused.', async ({page}) => {
    const id = await page.locator('#accordion-demo-1').getAttribute('data-id')
    await page.click(`#accordion-${id}-1`)
    await expect(page.locator('#cufc1-1')).toBeFocused()
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

  test('Press "ArrowDown" key when the first tab accordion is focused, expect the second tab accordion is focused.', async ({page}) => {
    const id = await page.locator('#accordion-demo-1').getAttribute('data-id')
    await page.focus(`#accordion-${id}-1`)
    await page.keyboard.press('ArrowDown')
    const secondAccordionTab = await page.$(`#accordion-${id}-2`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, secondAccordionTab)).toEqual(true)
  })

  test('Press "ArrowUp" key when the first tab accordion is focused, expect the last tab accordion is focused.', async ({page}) => {
    const id = await page.locator('#accordion-demo-1').getAttribute('data-id')
    await page.focus(`#accordion-${id}-1`)
    await page.keyboard.press('ArrowUp')
    const lastAccordionTab = await page.$(`#accordion-${id}-3`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, lastAccordionTab)).toEqual(true)
  })

  test('Press "ArrowUp" key when the last tab accordion is focused, expect the second tab accordion is focused.', async ({page}) => {
    const id = await page.locator('#accordion-demo-1').getAttribute('data-id')
    await page.focus(`#accordion-${id}-3`)
    await page.keyboard.press('ArrowUp')
    const secondAccordionTab = await page.$(`#accordion-${id}-2`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, secondAccordionTab)).toEqual(true)
  })

  test('Press "ArrowDown" key when the last tab accordion is focused, expect the first tab accordion is focused.', async ({page}) => {
    const id = await page.locator('#accordion-demo-1').getAttribute('data-id')

    await page.focus(`#accordion-${id}-3`)
    await page.keyboard.press('ArrowDown')
    const firstAccordionTab = await page.$(`#accordion-${id}-1`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstAccordionTab)).toEqual(true)
  })

  test('Press "Home" key when the last tab accordion is focused, expect the first tab accordion is focused.', async ({page}) => {
    const id = await page.locator('#accordion-demo-1').getAttribute('data-id')

    await page.focus(`#accordion-${id}-3`)
    await page.keyboard.press('Home')
    const firstAccordionTab = await page.$(`#accordion-${id}-1`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstAccordionTab)).toEqual(true)
  })

  test('Press "End" key when the first tab accordion is focused, expect the last tab accordion is focused.', async ({page}) => {
    const id = await page.locator('#accordion-demo-1').getAttribute('data-id')

    await page.focus(`#accordion-${id}-1`)
    await page.keyboard.press('End')
    const lastAccordionTab = await page.$(`#accordion-${id}-3`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, lastAccordionTab)).toEqual(true)
  })
})
