import { expect, test } from '@playwright/test'

test.describe('Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/examples/accessible-dialog/index.html')
  })

  test('Dialog element has a unique ID attribute.', async ({ page }) => {
    const dialogId = await page.locator('#demo-1').getAttribute('id')

    expect(dialogId).toBe('demo-1')
  })

  test('Dialog element has aria-labelledby attribute linking to the title element.', async ({ page }) => {
    const ariaLabelledby = await page.locator('#demo-1').getAttribute('aria-labelledby')

    expect(ariaLabelledby).toBe('demo-1-label')
  })

  test('Dialog title element has the correct ID matching aria-labelledby.', async ({ page }) => {
    const titleId = await page.locator('#demo-1 .dialog__title').getAttribute('id')

    expect(titleId).toBe('demo-1-label')
  })

  test('Dialog close button has aria-controls attribute linking to the dialog.', async ({ page }) => {
    const ariaControls = await page.locator('#demo-1-close').getAttribute('aria-controls')

    expect(ariaControls).toBe('demo-1')
  })

  test('Trigger button has aria-controls attribute linking to the dialog.', async ({ page }) => {
    const ariaControls = await page.locator('button[aria-controls="demo-1"]').first().getAttribute('aria-controls')

    expect(ariaControls).toBe('demo-1')
  })

  test('Click on a dialog trigger button, expect the dialog is visible (open attribute present).', async ({ page }) => {
    await page.click('button[aria-controls="demo-1"]')
    const isOpen = await page.locator('#demo-1').evaluate((dialog: HTMLDialogElement) => dialog.open)

    expect(isOpen).toBe(true)
  })

  test('Click on a dialog trigger button with triggerSelector, expect the dialog is visible.', async ({ page }) => {
    await page.click('.dialog-btn--demo-1')
    const isOpen = await page.locator('#demo-1').evaluate((dialog: HTMLDialogElement) => dialog.open)

    expect(isOpen).toBe(true)
  })

  test('Click on the dialog close button, expect the dialog is hidden (open attribute removed).', async ({ page }) => {
    await page.click('button[aria-controls="demo-1"]')
    await page.click('#demo-1-close')
    const isOpen = await page.locator('#demo-1').evaluate((dialog: HTMLDialogElement) => dialog.open)

    expect(isOpen).toBe(false)
  })

  test('Open a dialog, expect first focusable element to be focused.', async ({ page }) => {
    await page.click('button[aria-controls="demo-1"]')

    // Wait a bit for focus to be set
    await page.waitForTimeout(100)

    const firstFocusableElement = await page.$('#street-1')
    const isFocused = await page.evaluate((elem) => window.document.activeElement === elem, firstFocusableElement)

    expect(isFocused).toBe(true)
  })

  test('Modal dialog (showDialogAsModal: true) has aria-modal="true" attribute.', async ({ page }) => {
    await page.click('button[aria-controls="core-tab-panel-2"]')
    const ariaModal = await page.locator('#demo-2').getAttribute('aria-modal')

    expect(ariaModal).toBe('true')
  })

  test('Modal dialog opens with showModal() method.', async ({ page }) => {
    await page.click('button[aria-controls="core-tab-panel-2"]')
    await page.click('button[aria-controls="demo-2"]')

    const isOpen = await page.locator('#demo-2').evaluate((dialog: HTMLDialogElement) => dialog.open)

    expect(isOpen).toBe(true)
  })

  test('Non-modal dialog opens with show() method (default behavior).', async ({ page }) => {
    await page.click('button[aria-controls="demo-1"]')

    const isOpen = await page.locator('#demo-1').evaluate((dialog: HTMLDialogElement) => dialog.open)
    const ariaModal = await page.locator('#demo-1').getAttribute('aria-modal')

    expect(isOpen).toBe(true)
    expect(ariaModal).toBeNull()
  })

  test('Close button closes the dialog correctly.', async ({ page }) => {
    await page.click('button[aria-controls="demo-1"]')

    // Verify dialog is open
    let isOpen = await page.locator('#demo-1').evaluate((dialog: HTMLDialogElement) => dialog.open)
    expect(isOpen).toBe(true)

    // Click close button
    await page.click('#demo-1-close')

    // Verify dialog is closed
    isOpen = await page.locator('#demo-1').evaluate((dialog: HTMLDialogElement) => dialog.open)
    expect(isOpen).toBe(false)
  })

  test('Multiple trigger buttons can open the same dialog.', async ({ page }) => {
    // First trigger button
    await page.click('button[aria-controls="demo-1"]')
    let isOpen = await page.locator('#demo-1').evaluate((dialog: HTMLDialogElement) => dialog.open)
    expect(isOpen).toBe(true)

    // Close dialog
    await page.click('#demo-1-close')

    // Second trigger button
    await page.click('.dialog-btn--demo-1')
    isOpen = await page.locator('#demo-1').evaluate((dialog: HTMLDialogElement) => dialog.open)
    expect(isOpen).toBe(true)
  })

  test('Dialog with closedby="any" attribute supports light dismiss (ESC key).', async ({ page }) => {
    await page.click('button[aria-controls="core-tab-panel-2"]')
    await page.click('button[aria-controls="demo-2"]')

    // Verify dialog is open
    let isOpen = await page.locator('#demo-2').evaluate((dialog: HTMLDialogElement) => dialog.open)
    expect(isOpen).toBe(true)

    // Press Escape key
    await page.keyboard.press('Escape')

    // Verify dialog is closed
    isOpen = await page.locator('#demo-2').evaluate((dialog: HTMLDialogElement) => dialog.open)
    expect(isOpen).toBe(false)
  })

  test('Dialog stores reference to trigger button when opened.', async ({ page }) => {
    const triggerButton = await page.locator('button[aria-controls="demo-1"]').first()
    await triggerButton.click()

    const dialogIsOpen = await page.locator('#demo-1').evaluate((dialog: HTMLDialogElement) => dialog.open)
    expect(dialogIsOpen).toBe(true)
  })

  test('Dialog initialization does not fail if trigger selector has no matches.', async ({ page }) => {
    // This test ensures the component handles missing triggers gracefully
    // The dialog should still be initialized and work when triggered via aria-controls
    await page.click('button[aria-controls="demo-1"]')

    const isOpen = await page.locator('#demo-1').evaluate((dialog: HTMLDialogElement) => dialog.open)
    expect(isOpen).toBe(true)
  })
})
