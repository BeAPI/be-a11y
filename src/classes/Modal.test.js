import puppeteer from 'puppeteer'
import { async } from 'regenerator-runtime';

let browser
const app = `file://${process.cwd()}/examples/accessible-modal/index.html`

describe('Modal', () => {
  test('Click on a dialog trigger button, expect the modal dialog is visible.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('button[aria-controls="dialog-1"]')
    let display = await page.$eval(
      '#dialog-1',
      dialog => window.getComputedStyle(dialog).display
    )

    expect(display).toBe('block')

    await page.close()
  })
  
  test('Click on a dialog trigger button, expect the first focusable element in dialog is focused.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('button[aria-controls="dialog-1"]')
    const firstFocusableElement = await page.$(`#street`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstFocusableElement)).toEqual(true)

    await page.close()
  })

  test('Click on the dialog close button, expect the modal dialog is hidden.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('button[aria-controls="dialog-1"]')
    await page.click('#dialog-1-close')
    let display = await page.$eval(
      '#dialog-1',
      dialog => window.getComputedStyle(dialog).display
    )

    expect(display).toBe('none')

    await page.close()
  })

  test('Press "Escape" key when the modal dialog is visible, expect the modal dialog is hidden.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('button[aria-controls="dialog-1"]')
    await page.keyboard.press('Escape')
    let display = await page.$eval(
      '#dialog-1',
      dialog => window.getComputedStyle(dialog).display
    )

    expect(display).toBe('none')

    await page.close()
  })

  test('Open the modal dialog, expect the last focusable element in modal dialog is focused after pressing "Shift Tab" key.', async () => {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    await page.goto(app)
    await page.click('button[aria-controls="dialog-1"]')
    await page.keyboard.down('ShiftLeft')
    await page.keyboard.press('Tab')
    await page.keyboard.up('ShiftLeft')

    const closeButton = await page.$(`#dialog-1-close`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, closeButton)).toEqual(true)

    await page.close()
  })
})