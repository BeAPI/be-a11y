import AbstractDomElement from './AbstractDomElement.js'

/**
 * Tabs Class
 * @author Milan Ricoul
 */
class Tabs extends AbstractDomElement {
  constructor(element, options) {
    var instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    this.focus = false
    this._handleButtonBlur = handleButtonBlur.bind(this)
    this._handleButtonClick = handleButtonClick.bind(this)
    this._handleButtonFocus = handleButtonFocus.bind(this)
    this._handleKeydown = handleKeydown.bind(this)
    this._focusPreviousTab = focusPreviousTab.bind(this)
    this._focusNextTab = focusNextTab.bind(this)
    this._focusFirstTab = focusFirstTab.bind(this)
    this._focusLastTab = focusLastTab.bind(this)
    this.close = this.close.bind(this)
    this.init()
  }

  /**
   * Initialization
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  init() {
    const buttons = this._element.querySelectorAll(this._settings.tabListSelector)

    buttons.forEach((button) => {
      button.addEventListener('click', this._handleButtonClick)
      button.addEventListener('focus', this._handleButtonFocus)
      button.addEventListener('blur', this._handleButtonBlur)
    })

    document.addEventListener('keydown', this._handleKeydown)
  }

  /**
   * Destroy method
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  destroy() {
    const buttons = this._element.querySelectorAll(this._settings.tabListSelector)

    buttons.forEach((button) => button.removeEventListener('click', this.handleButtonClick))

    document.removeEventListener('keydown', this.handleKeydown)

    super.destroy()
  }

  /**
   * Unselect all tab buttons
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  unselectAllButtons() {
    const buttons = this._element.querySelectorAll(this._settings.tabListSelector)

    buttons.forEach((button) => button.setAttribute('aria-selected', 'false'))
  }

  /**
   * Open tab panel
   *
   * @param {HTMLElement} button clicked button
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  open(button) {
    const buttons = this._element.querySelectorAll(this._settings.tabListSelector)
    const panel = document.getElementById(button.getAttribute('aria-controls'))

    buttons.forEach((button) => this.close(button))

    button.focus()
    button.setAttribute('aria-selected', 'true')
    button.removeAttribute('tabindex')
    panel.removeAttribute('hidden')
  }

  /**
   * Open tab panel
   *
   * @param {HTMLElement} button clicked button
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  close(button) {
    const panel = document.getElementById(button.getAttribute('aria-controls'))
    button.setAttribute('aria-selected', 'false')
    button.setAttribute('tabindex', '-1')
    panel.setAttribute('hidden', '')
  }

  /**
   * Remove the focused tab, then focus the first tab.
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  removeTab() {
    const activeElement = document.activeElement
    const firstTab = this._element.querySelectorAll(this._settings.tabListSelector)[0]

    if (
      activeElement &&
      activeElement.parentNode.getAttribute('role') === 'tablist' &&
      activeElement.hasAttribute('data-deletable')
    ) {
      const panel = document.getElementById(activeElement.getAttribute('aria-controls'))
      panel.parentNode.removeChild(panel)
      activeElement.parentNode.removeChild(activeElement)
      this.open(firstTab)
    }
  }
}

/**
 * Handle tab button click
 *
 * @param {MouseEvent} e Mouse click event
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function handleButtonClick(e) {
  const clickedButton = e.currentTarget
  const isSelected = clickedButton.getAttribute('aria-selected') === 'true'

  if (!isSelected) {
    this.open(clickedButton)
  }
}

/**
 * Focus the previous tab. If not previous tag, focus the last tab.
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function focusPreviousTab() {
  const activeElement = document.activeElement

  if (activeElement && activeElement.parentNode.getAttribute('role') === 'tablist') {
    const previousButton = activeElement.previousElementSibling || activeElement.parentNode.lastElementChild

    this._settings.auto ? this.open(previousButton) : previousButton.focus()
  }
}

/**
 * Focus the next tab. If not next tab, focus the first tab.
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function focusNextTab() {
  const activeElement = document.activeElement

  if (activeElement && activeElement.parentNode.getAttribute('role') === 'tablist') {
    const nextButton = activeElement.nextElementSibling || activeElement.parentNode.firstElementChild

    this._settings.auto ? this.open(nextButton) : nextButton.focus()
  }
}

/**
 * Focus the first tab.
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function focusFirstTab() {
  const firstTab = this._element.querySelectorAll(this._settings.tabListSelector)[0]

  this._settings.auto ? this.open(firstTab) : firstTab.focus()
}

/**
 * Focus the last tab.
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function focusLastTab() {
  const tabs = this._element.querySelectorAll(this._settings.tabListSelector)
  const tabsCount = tabs.length
  const lastTab = tabs[tabsCount - 1]

  this._settings.auto ? this.open(lastTab) : lastTab.focus()
}

/**
 * Handle tab button focus
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function handleButtonFocus() {
  this.focus = true
}

/**
 * Handle tab button blur
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function handleButtonBlur() {
  this.focus = false
}

/**
 * Handle keyboard keydown
 *
 * @param {KeyboardEvent} e Keyboard keydown event
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function handleKeydown(e) {
  if (!this.focus) {
    return
  }

  switch (e.code) {
    case 'ArrowLeft':
      this._focusPreviousTab()
      break
    case 'ArrowRight':
      this._focusNextTab()
      break
    case 'Home':
      this._focusFirstTab()
      break
    case 'End':
      this._focusLastTab()
      break
    case 'Delete':
      this.removeTab()
  }
}

Tabs.defaults = {
  auto: false,
  tabListSelector: 'button[role="tab"]',
  tabPanelSelector: 'div[role="tabpanel"]',
}

// loop on each preset
export default Tabs
