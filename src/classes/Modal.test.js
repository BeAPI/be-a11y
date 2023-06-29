import { expect, test } from '@playwright/test'

test.describe('Modal', () => {
  test.beforeEach(async({page}) => {
    await page.goto('http://localhost:5173/examples/accessible-modal/index.html')
  })

  test('Click on a dialog trigger button, expect the modal dialog is visible.', async ({page}) => {
    await page.click('button[aria-controls="demo-1"]')
    let display = await page.$eval(
      '#demo-1',
      dialog => window.getComputedStyle(dialog).display
    )

    expect(display).toBe('block')
  })

  test('Click on a dialog trigger button, expect the first focusable element in dialog is focused.', async ({page}) => {
    await page.click('button[aria-controls="demo-1"]')
    const firstFocusableElement = await page.$(`#street`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, firstFocusableElement)).toEqual(true)
  })

  test('Click on the dialog close button, expect the modal dialog is hidden.', async ({page}) => {
    await page.click('button[aria-controls="demo-1"]')
    await page.click('#demo-1-close')
    let display = await page.$eval(
      '#demo-1',
      dialog => window.getComputedStyle(dialog).display
    )

    expect(display).toBe('none')
  })

  test('Press "Escape" key when the modal dialog is visible, expect the modal dialog is hidden.', async ({page}) => {
    await page.click('button[aria-controls="demo-1"]')
    await page.keyboard.press('Escape')
    let display = await page.$eval(
      '#demo-1',
      dialog => window.getComputedStyle(dialog).display
    )

    expect(display).toBe('none')
  })

  test('Open the modal dialog, expect the last focusable element in modal dialog is focused after pressing "Shift Tab" key.', async ({page}) => {
    await page.click('button[aria-controls="demo-1"]')
    await page.keyboard.down('ShiftLeft')
    await page.keyboard.press('Tab')
    await page.keyboard.up('ShiftLeft')

    const closeButton = await page.$(`#demo-1-close`)

    expect(await page.evaluate(elem => window.document.activeElement === elem, closeButton)).toEqual(true)
  })

  test('On a 1025px window width page, click on a modal button working only for <= 1024px window width pages, expect the content is still visible.', async({page}) => {
    await page.setViewportSize({
      width: 1025,
      height: 100,
    })
    await page.click('.modal-btn--demo-2')
    let display = await page.$eval(
      '.modal--mobile',
      dialog => window.getComputedStyle(dialog).display
    )

    expect(display).toBe('block')
  })
})
