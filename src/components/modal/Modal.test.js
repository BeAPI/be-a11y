import { expect, test } from '@playwright/test'

test.describe('Modal', () => {
  test.beforeEach(async({page}) => {
    await page.goto('http://127.0.0.1:5173/src/components/modal/index.html')
  })

  test('Click on a dialog trigger button, expect the modal dialog is visible.', async ({page}) => {
    await page.click('button[aria-controls="dialog-1"]')
    let display = await page.$eval(
      '#dialog-1',
      dialog => window.getComputedStyle(dialog).display
    )

    expect(display).toBe('block')
  })
  
  test('Click on a dialog trigger button, expect the first focusable element in dialog is focused.', async ({page}) => {
    await page.click('button[aria-controls="dialog-1"]')
    const firstFocusableElement = await page.$(`#street`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstFocusableElement)).toEqual(true)
  })

  test('Click on the dialog close button, expect the modal dialog is hidden.', async ({page}) => {
    await page.click('button[aria-controls="dialog-1"]')
    await page.click('#dialog-1-close')
    let display = await page.$eval(
      '#dialog-1',
      dialog => window.getComputedStyle(dialog).display
    )

    expect(display).toBe('none')
  })

  test('Press "Escape" key when the modal dialog is visible, expect the modal dialog is hidden.', async ({page}) => {
    await page.click('button[aria-controls="dialog-1"]')
    await page.keyboard.press('Escape')
    let display = await page.$eval(
      '#dialog-1',
      dialog => window.getComputedStyle(dialog).display
    )

    expect(display).toBe('none')
  })

  test('Open the modal dialog, expect the last focusable element in modal dialog is focused after pressing "Shift Tab" key.', async ({page}) => {
    await page.click('button[aria-controls="dialog-1"]')
    await page.keyboard.down('ShiftLeft')
    await page.keyboard.press('Tab')
    await page.keyboard.up('ShiftLeft')

    const closeButton = await page.$(`#dialog-1-close`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, closeButton)).toEqual(true)
  })
})
