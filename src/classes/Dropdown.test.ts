import { expect, test } from '@playwright/test'

test.describe('Dropdown', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/examples/accessible-dropdown/index.html')
  })

  test('Click on the dropdown button, expect the listbox is visible.', async ({ page }) => {
    await page.click('#dropdown-1 button')
    const display = await page.$eval('#dropdown-1 ul', (listbox) => window.getComputedStyle(listbox).display)

    expect(display).toBe('block')
  })

  test('Click on the dropdown button, expect first list item has aria-selected attribute set to true.', async ({
    page,
  }) => {
    await page.click('#dropdown-1 button')
    const hasValidAriaSelected = await page.$eval(
      '#dropdown-1 li:first-child',
      (firstListItem) =>
        firstListItem.hasAttribute('aria-selected') && firstListItem.getAttribute('aria-selected') === 'true'
    )

    expect(hasValidAriaSelected).toBe(true)
  })

  test('Focus the dropdown button, press Enter key once, press ArrowDown key twice, expect the third list item has aria-selected attribute set to true.', async ({
    page,
  }) => {
    await page.focus('#dropdown-1 button')
    await page.keyboard.down('Enter')
    await page.keyboard.down('ArrowDown')
    await page.keyboard.down('ArrowDown')

    const hasValidAriaSelected = await page.$eval(
      '#dropdown-1 li:nth-child(3)',
      (thirdListItem) =>
        thirdListItem.hasAttribute('aria-selected') && thirdListItem.getAttribute('aria-selected') === 'true'
    )

    expect(hasValidAriaSelected).toBe(true)
  })

  test('Focus the dropdown button, press Enter key, press End key, expect the last list item has aria-selected attribute set to true.', async ({
    page,
  }) => {
    await page.focus('#dropdown-1 button')
    await page.keyboard.down('Enter')
    await page.keyboard.down('End')

    const hasValidAriaSelected = await page.$eval(
      '#dropdown-1 li:last-child',
      (lastListItem) =>
        lastListItem.hasAttribute('aria-selected') && lastListItem.getAttribute('aria-selected') === 'true'
    )

    expect(hasValidAriaSelected).toBe(true)
  })

  test('Click on the dropdown button, click on the body, expect the listbox is not visible.', async ({ page }) => {
    await page.click('#dropdown-1 button')
    await page.click('body')
    const display = await page.$eval('#dropdown-1 ul', (listbox) => window.getComputedStyle(listbox).display)

    expect(display).toBe('none')
  })

  test('Focus the dropdown button, press Enter key, press Escape key, expect the listbox is not visible.', async ({
    page,
  }) => {
    await page.focus('#dropdown-1 button')
    await page.keyboard.down('Enter')
    await page.keyboard.down('Escape')

    const display = await page.$eval('#dropdown-1 ul', (listbox) => window.getComputedStyle(listbox).display)

    expect(display).toBe('none')
  })

  test('Click on "Add item" button, expect there is a Dummy list item.', async ({ page }) => {
    await page.click('#add')

    const lastItemText = await page.locator('#dropdown-6 li').last().textContent()
    expect(lastItemText).toBe('Dummy')
  })

  test('Click on "Remove first item" button, expect the new first item is "Movies".', async ({ page }) => {
    await page.click('#remove')

    const firstItemText = await page.locator('#dropdown-6 li').first().textContent()
    expect(firstItemText).toBe('Movies')
  })

  test('Click on "Remove all items" button, expect there is not list items anymore.', async ({ page }) => {
    await page.click('#remove-all')

    const isListItemsEmpty = await page
      .locator('#dropdown-6 ul')
      .evaluate((element) => element.textContent.trim() === '')
    expect(isListItemsEmpty).toBe(true)
  })
})
