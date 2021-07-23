import AbstractDomElement from '../AbstractDomElement'

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

    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.focusPreviousTab = this.focusPreviousTab.bind(this)
    this.focusNextTab = this.focusNextTab.bind(this)
    this.close = this.close.bind(this)
    this.init()
  }

  /**
   * Initialization
   * @returns {void}
   * @author Milan Ricoul
   */
  init() {
    this.applyToButtons((button) => button.addEventListener('click', this.handleButtonClick))
    document.addEventListener('keydown', this.handleKeydown)
  }

  /**
   * Destroy method
   * @returns {void}
   * @author Milan Ricoul
   */
  destroy() {
    this.applyToButtons((button) => button.removeEventListener('click', this.handleButtonClick))
    document.removeEventListener('keydown', this.handleKeydown)
  }

  /**
   * Unselect all tab buttons
   * @returns {void}
   * @author Milan Ricoul
   */
  unselectAllButtons() {
    this.applyToButtons((button) => button.setAttribute('aria-selected', 'false'))
  }

  /**
   * Execute a function for every tab buttons
   * @returns {void}
   * @param {Function} func callback
   * @author Milan Ricoul
   */
  applyToButtons(func) {
    const el = this._element
    const s = this._settings
    const buttons = el.querySelectorAll(s.tabListSelector)

    Array.prototype.slice.call(buttons).forEach((button) => func(button))
  }

  /**
   * Open tab panel
   * @param {HTMLElement} button clicked button
   * @returns {void}
   * @author Milan Ricoul
   */
  open(button) {
    this.applyToButtons((btn) => this.close(btn))

    const panel = document.getElementById(button.getAttribute('aria-controls'))
    button.focus()
    button.setAttribute('aria-selected', 'true')
    button.removeAttribute('tabindex')
    panel.removeAttribute('hidden')
  }

  /**
   * Open tab panel
   * @param {HTMLElement} button clicked button
   * @returns {void}
   * @author Milan Ricoul
   */
  close(button) {
    const panel = document.getElementById(button.getAttribute('aria-controls'))
    button.setAttribute('aria-selected', 'false')
    button.setAttribute('tabindex', '-1')
    panel.setAttribute('hidden', '')
  }

  /**
   * Focus the previous tab. If not previous tag, focus the last tab.
   * @returns {void}
   * @author Milan Ricoul
   */
  focusPreviousTab() {
    const activeElement = document.activeElement

    if (activeElement && activeElement.parentNode.getAttribute('role') === 'tablist') {
      const previousButton = activeElement.previousElementSibling || activeElement.parentNode.lastElementChild

      this._settings.auto ? this.open(previousButton) : previousButton.focus()
    }
  }

  /**
   * Focus the next tab. If not next tab, focus the fist tab.
   * @returns {void}
   * @author Milan Ricoul
   */
  focusNextTab() {
    const activeElement = document.activeElement

    if (activeElement && activeElement.parentNode.getAttribute('role') === 'tablist') {
      const nextButton = activeElement.nextElementSibling || activeElement.parentNode.firstElementChild

      this._settings.auto ? this.open(nextButton) : nextButton.focus()
    }
  }

  /**
   * Handle tab button click
   * @param {MouseEvent} e Mouse click event
   * @returns {void}
   * @author Milan Ricoul
   */
  handleButtonClick(e) {
    const clickedButton = e.currentTarget
    const isSelected = clickedButton.getAttribute('aria-selected') === 'true'

    if (!isSelected) {
      this.open(clickedButton)
    }
  }

  /**
   * Handle keyboard keydown
   * @param {KeyboardEvent} e Keyboard keydown event
   * @returns {void}
   * @author Milan Ricoul
   */
  handleKeydown(e) {
    switch (e.code) {
      case 'ArrowLeft':
        this.focusPreviousTab()
        break
      case 'ArrowRight':
        this.focusNextTab()
        break
    }
  }
}

Tabs.defaults = {
  auto: false,
  tabListSelector: 'button[role="tab"]',
  tabPanelSelector: 'div[role="tabpanel"]',
}

Tabs.preset = {
  '.tabs': {
    auto: true,
  },
}

// loop on each preset
export default Tabs
