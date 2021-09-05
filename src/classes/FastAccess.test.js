import puppeteer from 'puppeteer'

let browser
const app = `file://${process.cwd()}/examples/accessible-fast-access/index.html`

describe('FastAccess', () => {
  test('Press "Tab" key, expect the fast access navigation is visible.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.keyboard.press('Tab')
    let ariaHidden = await page.$eval(
      '#fast-access',
      element => element.getAttribute('aria-hidden')
    )

    expect(ariaHidden).toBe('false')

    await page.close()
  })
})