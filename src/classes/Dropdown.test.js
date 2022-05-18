import puppeteer from 'puppeteer'

let browser
const app = `file://${process.cwd()}/examples/accessible-dropdown/index.html`

describe('Dropdown', () => {
  test('Click on the dropdown button, expect the listbox is visible.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('#dropdown button')
    const display = await page.$eval(
      '#dropdown ul',
      listbox => window.getComputedStyle(listbox).display
    )

    expect(display).toBe('block')

    await page.close()
  })

  test('Click on the dropdown button, expect first list item has aria-selected attribute set to true.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(app)
    await page.click('#dropdown button')
    const hasValidAriaSelected = await page.$eval(
      '#dropdown li:first-child',
      firstListItem => firstListItem.hasAttribute('aria-selected') && firstListItem.getAttribute('aria-selected') === 'true'
    )

    expect(hasValidAriaSelected).toBe(true)

    await page.close()
  })

  test('Focus the dropdown button, press Enter key once, press ArrowDown key twice, expect the third list item has aria-selected attribute set to true.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(app)
    await page.focus('#dropdown button')
    await page.keyboard.down('Enter')
    await page.keyboard.down('ArrowDown')
    await page.keyboard.down('ArrowDown')

    const hasValidAriaSelected = await page.$eval(
      '#dropdown li:nth-child(3)',
      thirdListItem => thirdListItem.hasAttribute('aria-selected') && thirdListItem.getAttribute('aria-selected') === 'true'
    )

    expect(hasValidAriaSelected).toBe(true)

    await page.close()
  })

  test('Focus the dropdown button, press Enter key, press End key, expect the last list item has aria-selected attribute set to true.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(app)
    await page.focus('#dropdown button')
    await page.keyboard.down('Enter')
    await page.keyboard.down('End')

    const hasValidAriaSelected = await page.$eval(
      '#dropdown li:last-child',
     lastListItem => lastListItem.hasAttribute('aria-selected') && lastListItem.getAttribute('aria-selected') === 'true'
    )

    expect(hasValidAriaSelected).toBe(true)

    await page.close()
  })

  test('Click on the dropdown button, click on the body, expect the listbox is not visible.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('#dropdown button')
    await page.click('body')
    const display = await page.$eval(
      '#dropdown ul',
      listbox => window.getComputedStyle(listbox).display
    )

    expect(display).toBe('none')

    await page.close()
  })

  test('Focus the dropdown button, press Enter key, press Escape key, expect the listbox is not visible.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto(app)
    await page.focus('#dropdown button')
    await page.keyboard.down('Enter')
    await page.keyboard.down('Escape')

    const display = await page.$eval(
      '#dropdown ul',
      listbox => window.getComputedStyle(listbox).display
    )

    expect(display).toBe('none')

    await page.close()
  })
})