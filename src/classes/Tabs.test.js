import puppeteer from 'puppeteer'
import Tabs from './Tabs'

const app = `file://${process.cwd()}/examples/accessible-tabs/index.html`

describe('Tabs', () => {
  test('Click on a tab, expect aria-selected attribute to be "true".', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('button#tab-3')
    let thirdTabButton = await page.$eval(
      'button#tab-3',
      button => button.getAttribute('aria-selected')
    )

    expect(thirdTabButton).toBe('true')
  })
  
  test('Click on a tab, expect hidden attribute of the panel to be null.', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('button#tab-3')
    let thirdTabPanel = await page.$eval(
      '#tab-panel-3',
      panel => panel.getAttribute('hidden')
    )

    expect(thirdTabPanel).toBe(null)
  })

  test('Focus second tab, expect the third tab is focused after pressing ArrowRight key.', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('button#tab-2')
    await page.keyboard.press('ArrowRight')
    const thirdTabPanel = await page.$(`button#tab-3`);

    expect(await page.evaluate(elem => window.document.activeElement === elem, thirdTabPanel)).toEqual(true);
  })

  test('Focus second tab, expect the first tab is focused after pressing ArrowLeft key.', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('button#tab-2')
    await page.keyboard.press('ArrowLeft')
    const firstTabPanel = await page.$(`button#tab-1`);

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstTabPanel)).toEqual(true);
  })

  test('Focus first tab, expect the last tab is focused after pressing ArrowLeft key.', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('button#tab-1')
    await page.keyboard.press('ArrowLeft')
    const thirdTabPanel = await page.$(`button#tab-3`);

    expect(await page.evaluate(elem => window.document.activeElement === elem, thirdTabPanel)).toEqual(true);
  })

  test('Focus last tab, expect the first tab is focused after pressing ArrowRight key.', async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.focus('button#tab-3')
    await page.keyboard.press('ArrowRight')
    const firstTabPanel = await page.$(`button#tab-1`);

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstTabPanel)).toEqual(true);
  })
});