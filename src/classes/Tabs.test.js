import puppeteer from 'puppeteer'

let browser
const app = `file://${process.cwd()}/examples/accessible-tabs/index.html`

describe('Tabs', () => {
  test('Click on a tab, expect aria-selected attribute to be "true".', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('button#tab-3')
    let thirdTabButton = await page.$eval(
      'button#tab-3',
      button => button.getAttribute('aria-selected')
    )

    expect(thirdTabButton).toBe('true')

    await page.close()
  })
  
  test('Click on a tab, expect hidden attribute of the panel to be null.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('button#tab-3')
    let thirdTabPanel = await page.$eval(
      '#tab-panel-3',
      panel => panel.getAttribute('hidden')
    )

    expect(thirdTabPanel).toBe(null)

    await page.close()
  })

  test('Focus second tab, expect the third tab is focused after pressing ArrowRight key.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('button#tab-2')
    await page.keyboard.press('ArrowRight')
    const thirdTab = await page.$(`button#tab-3`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, thirdTab)).toEqual(true)

    await page.close()
  })

  test('Focus second tab, expect the first tab is focused after pressing ArrowLeft key.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('button#tab-2')
    await page.keyboard.press('ArrowLeft')
    const firstTab = await page.$(`button#tab-1`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstTab)).toEqual(true)

    await page.close()
  })

  test('Focus first tab, expect the last tab is focused after pressing ArrowLeft key.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('button#tab-1')
    await page.keyboard.press('ArrowLeft')
    const thirdTab = await page.$(`button#tab-4`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, thirdTab)).toEqual(true)

    await page.close()
  })

  test('Focus last tab, expect the first tab is focused after pressing ArrowRight key.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('button#tab-4')
    await page.keyboard.press('ArrowRight')
    const firstTab = await page.$(`button#tab-1`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstTab)).toEqual(true)

    await page.close()
  })

  test('Focus the third tab, expect the first tab is focused after pressing Home key.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('button#tab-3')
    await page.keyboard.press('Home')
    const firstTab = await page.$(`button#tab-1`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstTab)).toEqual(true)

    await page.close()
  })

  test('Focus the second tab, expect the last tab is focused after pressing End key.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('button#tab-2')
    await page.keyboard.press('End')
    const lastTab = await page.$(`button#tab-4`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, lastTab)).toEqual(true)

    await page.close()
  })

  test('Focus a deletable tab, expect the focused tab is removed after pressing Delete key.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('button#tab-3[data-deletable]')
    await page.keyboard.press('Delete')

    expect(await page.$('#tab-panel-3') === null).toEqual(true)

    await page.close()
  })
})