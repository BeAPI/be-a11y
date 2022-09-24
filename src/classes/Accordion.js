import AbstractDomElement from './AbstractDomElement.js'
import DOMAnimations from '../utils/DOMAnimations.js'

/**
 * Accordion class
 * @author Milan Ricoul
 */
class Accordion extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    this.focus = false
    this.handleButtonBlur = this.handleButtonBlur.bind(this)
    this.handleButtonFocus = this.handleButtonFocus.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.init()
  }

  /**
   * Initialization
   * @returns {void}
   * @author Milan Ricoul
   */
  init() {
    const el = this._element
    const s = this._settings
    const triggers = el.querySelectorAll(s.triggerSelector)
    const panels = el.querySelectorAll(s.panelSelector)

    // Set id and ARIA attributes to the trigger
    this.applyToSelectors(triggers, (trigger, index) => {
      let i = index + 1
      while (document.getElementById(`${s.prefixId}-${i}`)) {
        i++
      }

      trigger.id = `${s.prefixId}-${i}`
      trigger.setAttribute('aria-controls', `${s.prefixId}-panel-${i}`)
    })

    // Set id and ARIA attributes to the panel
    this.applyToSelectors(panels, (panel, index) => {
      let i = index + 1
      while (document.getElementById(`${s.prefixId}-panel-${i}`)) {
        i++
      }
      panel.id = `${s.prefixId}-panel-${i}`
      panel.setAttribute('aria-labelledby', `${s.prefixId}-${i}`)
    })

    this.applyToSelectors(triggers, (trigger) => trigger.addEventListener('click', this.handleButtonClick))
    this.applyToSelectors(triggers, (trigger) => trigger.addEventListener('focus', this.handleButtonFocus))
    this.applyToSelectors(triggers, (trigger) => trigger.addEventListener('blur', this.handleButtonBlur))
    document.addEventListener('keydown', this.handleKeydown)
  }

  /**
   * Execute a function for every elements in node list
   * @param {NodeList} selectors node list
   * @param {Function} func callback
   * @returns {void}
   * @author Milan Ricoul
   */
  applyToSelectors(selectors, func) {
    Array.prototype.slice.call(selectors).forEach((s, i) => func(s, i))
  }

  /**
   * Open the panel
   * @param {HTMLElement} panel panel selector
   * @returns {void}
   * @author Milan Ricoul
   */
  open(panel) {
    const firstFocusableElement = panel.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )[0]

    if (this._settings.hasAnimation && window.getComputedStyle(panel).display === 'none') {
      DOMAnimations.slideDown(panel, 500, () => {
        if (firstFocusableElement) {
          firstFocusableElement.focus()
        }
      })
    } else {
      panel.style.display = 'block'
      if (firstFocusableElement) {
        firstFocusableElement.focus()
      }
    }
  }

  /**
   * Close the panel
   * @param {HTMLElement} panel panel selector
   * @returns {void}
   * @author Milan Ricoul
   */
  close(panel) {
    this._settings.hasAnimation ? DOMAnimations.slideUp(panel) : (panel.style.display = 'none')
  }

  /**
   * Handle tab button focus
   * @returns {void}
   * @author Milan Ricoul
   */
  handleButtonFocus() {
    this.focus = true
  }

  /**
   * Handle tab button blur
   * @returns {void}
   * @author Milan Ricoul
   */
  handleButtonBlur() {
    this.focus = false
  }

  /**
   * Handle trigger button click
   * @param {MouseEvent} e click event handler
   * @returns {void}
   * @author Milan Ricoul
   */
  handleButtonClick(e) {
    const el = this._element
    const s = this._settings
    const { allowMultiple, forceExpand, panelSelector } = this._settings
    const trigger = e.currentTarget
    const panel = document.getElementById(trigger.getAttribute('aria-controls'))

    if (
      trigger.getAttribute('aria-expanded') === 'true' &&
      (!forceExpand ||
        (forceExpand && allowMultiple && el.querySelectorAll(`${s.triggerSelector}[aria-expanded="true"]`).length > 1))
    ) {
      trigger.setAttribute('aria-expanded', 'false')
      this.close(panel)
    } else {
      if (!allowMultiple) {
        this.applyToSelectors(el.querySelectorAll(panelSelector), (panel) => {
          if (panel.id !== trigger.getAttribute('aria-controls')) {
            document.getElementById(panel.getAttribute('aria-labelledby')).setAttribute('aria-expanded', 'false')
            this.close(panel)
          }
        })
      }

      trigger.setAttribute('aria-expanded', 'true')
      this.open(panel)
    }
  }

  /**
   * Handle keyboard keydown
   * @param {KeyboardEvent} e Keyboard keydown event
   * @returns {void}
   * @author Milan Ricoul
   */
  handleKeydown(e) {
    if (!this.focus) {
      return
    }

    switch (e.code) {
      case 'ArrowUp':
        e.preventDefault()
        this.focusPreviousTab()
        break
      case 'ArrowDown':
        e.preventDefault()
        this.focusNextTab()
        break
      case 'Home':
        e.preventDefault()
        this.focusFirstTab()
        break
      case 'End':
        e.preventDefault()
        this.focusLastTab()
        break
    }
  }

  /**
   * Focus the previous trigger. If not previous trigger, focus the last trigger.
   * @returns {void}
   * @author Milan Ricoul
   */
  focusPreviousTab() {
    const s = this._settings
    const activeElement = document.activeElement
    const triggers = this._element.querySelectorAll(s.triggerSelector)
    const triggersCount = triggers.length

    if (activeElement.classList.contains(s.triggerSelector.substring(1))) {
      const currentIndexOfActiveElement = Array.prototype.indexOf.call(triggers, activeElement)

      triggers[currentIndexOfActiveElement === 0 ? triggersCount - 1 : currentIndexOfActiveElement - 1].focus()
    }
  }

  /**
   * Focus the next trigger. If not next trigger, focus the first trigger.
   * @returns {void}
   * @author Milan Ricoul
   */
  focusNextTab() {
    const s = this._settings
    const activeElement = document.activeElement
    const triggers = this._element.querySelectorAll(s.triggerSelector)
    const triggersCount = triggers.length

    if (activeElement.classList.contains(s.triggerSelector.substring(1))) {
      const currentIndexOfActiveElement = Array.prototype.indexOf.call(triggers, activeElement)

      triggers[currentIndexOfActiveElement === triggersCount - 1 ? 0 : currentIndexOfActiveElement + 1].focus()
    }
  }

  /**
   * Focus the first trigger.
   * @returns {void}
   * @author Milan Ricoul
   */
  focusFirstTab() {
    this._element.querySelectorAll(this._settings.triggerSelector)[0].focus()
  }

  /**
   * Focus the last trigger.
   * @returns {void}
   * @author Milan Ricoul
   */
  focusLastTab() {
    const s = this._settings
    const triggers = this._element.querySelectorAll(s.triggerSelector)
    const triggersCount = triggers.length

    triggers[triggersCount - 1].focus()
  }
}

Accordion.defaults = {
  allowMultiple: false,
  forceExpand: true,
  hasAnimation: false,
  panelSelector: '.accordion__panel',
  prefixId: 'accordion',
  triggerSelector: '.accordion__trigger',
}

export default Accordion
