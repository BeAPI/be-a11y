import puppeteer from 'puppeteer'

let browser
const app = `file://${process.cwd()}/examples/accessible-accordion/index.html`

describe('Accordion', () => {
  test('Click the first tab accordion, expect the first focusable element in the panel is focused.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('#accordion-1')
    const firstFocusableElement = await page.$(`#cufc1-1`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstFocusableElement)).toEqual(true)

    await page.close()
  })
  
  test('Click the second tab accordion, expect the second panel is visible.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('#accordion-2')
    let display = await page.$eval(
      '#accordion-panel-2',
      dialog => window.getComputedStyle(dialog).display
    )

    expect(display).toBe('block')

    await page.close()
  })
  
  test('Press "ArrowDown" key when the first tab accordion is focused, expect the second tab accordion is focused.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('#accordion-1')
    await page.keyboard.press('ArrowDown')
    const secondAccordionTab = await page.$(`#accordion-2`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, secondAccordionTab)).toEqual(true)

    await page.close()
  })

  test('Press "ArrowUp" key when the first tab accordion is focused, expect the last tab accordion is focused.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('#accordion-1')
    await page.keyboard.press('ArrowUp')
    const lastAccordionTab = await page.$(`#accordion-3`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, lastAccordionTab)).toEqual(true)

    await page.close()
  })

  test('Press "ArrowUp" key when the last tab accordion is focused, expect the second tab accordion is focused.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('#accordion-3')
    await page.keyboard.press('ArrowUp')
    const secondAccordionTab = await page.$(`#accordion-2`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, secondAccordionTab)).toEqual(true)

    await page.close()
  })

  test('Press "ArrowDown" key when the last tab accordion is focused, expect the first tab accordion is focused.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('#accordion-3')
    await page.keyboard.press('ArrowDown')
    const firstAccordionTab = await page.$(`#accordion-1`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstAccordionTab)).toEqual(true)

    await page.close()
  })

  test('Press "Home" key when the last tab accordion is focused, expect the first tab accordion is focused.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('#accordion-3')
    await page.keyboard.press('Home')
    const firstAccordionTab = await page.$(`#accordion-1`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstAccordionTab)).toEqual(true)

    await page.close()
  })

  test('Press "End" key when the first tab accordion is focused, expect the last tab accordion is focused.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('#accordion-1')
    await page.keyboard.press('End')
    const lastAccordionTab = await page.$(`#accordion-3`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, lastAccordionTab)).toEqual(true)

    await page.close()
  })
})