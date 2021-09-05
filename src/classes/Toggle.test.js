import puppeteer from 'puppeteer'

let browser
const app = `file://${process.cwd()}/examples/accessible-toggle/index.html`

describe('Toggle', () => {
  test('Click on a toggle button, expect the content is visible.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('button[aria-controls="toggle-1"]')
    let display = await page.$eval(
      '#toggle-1',
      content => window.getComputedStyle(content).display
    )

    expect(display).toBe('block')

    await page.close()
  })
  
  test('On a 1025px window width page, click on a toggle button of a content who is visible only for <= 1024px window width pages, expect the content is still hidden.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({
      width: 1025,
      height: 100,
    })
    await page.goto(app)
    await page.click('button[aria-controls="toggle-4"]')
    let display = await page.$eval(
      '#toggle-4',
      content => window.getComputedStyle(content).display
    )

    expect(display).toBe('none')

    await page.close()
  })

  test('On a 1024px window width page, click on a toggle button of a content who is visible only for <= 1024px window width pages, expect the content is visible.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({
      width: 1024,
      height: 100,
    })
    await page.goto(app)
    await page.click('button[aria-controls="toggle-4"]')
    let display = await page.$eval(
      '#toggle-4',
      content => window.getComputedStyle(content).display
    )

    expect(display).toBe('block')

    await page.close()
  })

  test('Click on a toggle button of a visible content, expect the content is hidde5.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('button[aria-controls="toggle-5"]')
    let display = await page.$eval(
      '#toggle-5',
      content => window.getComputedStyle(content).display
    )

    expect(display).toBe('none')

    await page.close()
  })
})