import AbstractDomElement from './AbstractDomElement.js'
import DOMAnimations from '../utils/DOMAnimations.js'
import { randomId } from '../utils/helpers.js'
import { ThrottledEvent } from 'oneloop.js'

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

    const { mediaQuery } = this._settings

    this.active = false
    this.focus = false
    this.breakpointLevel = 'below' // below or above breakpoint
    this.activePanel = null
    this._onResizeHandler = onResize.bind(this)
    this._handleButtonBlur = handleButtonBlur.bind(this)
    this._handleButtonFocus = handleButtonFocus.bind(this)
    this._handleButtonClick = handleButtonClick.bind(this)

    new ThrottledEvent(window, 'resize').add('resize', this._onResizeHandler)
    this._onResizeHandler()

    if (Boolean(mediaQuery && mediaQuery.matches) || !mediaQuery) {
      this.init()

      return
    }

    this.destroy()
  }

  /**
   * Initialization
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  init() {
    const el = this._element
    const { closedDefault, mediaQuery, onInit, onReachBreakpoint, panelSelector, prefixId, triggerSelector } = this._settings
    const pattern = /\d+/g
    const triggers = el.querySelectorAll(triggerSelector)
    const panels = el.querySelectorAll(panelSelector)
    const id = randomId()

    el.dataset.id = id

    if (onInit && !this.active) {
      this.active = true
      onInit.bind(this)(el)
    }

    this.active = true

    if (mediaQuery && onReachBreakpoint && pattern.test(mediaQuery.media)) {
      if (mediaQuery.media.includes('min')) {
        this.hasReachBreakpoint = window.innerWidth > parseInt(mediaQuery.media.match(pattern)[0]) ? 'above' : 'below'
      }

      if (mediaQuery.media.includes('max')) {
        this.hasReachBreakpoint = window.innerWidth >= parseInt(mediaQuery.media.match(pattern)[0]) ? 'above' : 'below'
      }
    }

    if (closedDefault) {
      this._settings.forceExpand = false
    }

    // Set id and ARIA attributes to the trigger
    triggers.forEach((trigger, index) => {
      let i = index + 1
      while (document.getElementById(`${prefixId}-${id}-${i}`)) {
        i++
      }

      trigger.id = `${prefixId}-${id}-${i}`
      trigger.setAttribute('aria-controls', `${prefixId}-${id}-panel-${i}`)
      trigger.setAttribute('aria-expanded', `${index === 0 ? 'true' : 'false'}`)
    })

    // Set id and ARIA attributes to the panel
    panels.forEach((panel, index) => {
      let i = index + 1
      while (document.getElementById(`${prefixId}-${id}-panel-${i}`)) {
        i++
      }
      panel.id = `${prefixId}-${id}-panel-${i}`
      panel.setAttribute('aria-labelledby', `${prefixId}-${id}-${i}`)

      if (index !== 0) {
        panel.style.display = 'none'
      }

      if (closedDefault) {
        triggers[index].setAttribute('aria-expanded', 'false')
        this.close(panel)
      }
    })

    // Add events
    triggers.forEach((trigger) => {
      trigger.addEventListener('click', this._handleButtonClick)
      trigger.addEventListener('focus', this._handleButtonFocus)
      trigger.addEventListener('blur', this._handleButtonBlur)
    })
  }

  /**
   * Destroy component
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  destroy() {
    this.active = false
    this.activePanel = null

    const el = this._element
    const { panelSelector, triggerSelector } = this._settings
    const triggers = el.querySelectorAll(triggerSelector)
    const panels = el.querySelectorAll(panelSelector)

    // Remove id and ARIA attributes from the trigger
    triggers.forEach((trigger) => {
      trigger.removeAttribute('id')
      trigger.removeAttribute('aria-controls')
      trigger.removeAttribute('aria-expanded')
    })

    // Remove id and ARIA attributes from the panel
    panels.forEach((panel) => {
      panel.removeAttribute('id')
      panel.removeAttribute('aria-labelledby')
      panel.removeAttribute('style')
    })

    // Remove events
    triggers.forEach((trigger) => {
      trigger.removeEventListener('click', this._handleButtonClick)
      trigger.removeEventListener('focus', this._handleButtonFocus)
      trigger.removeEventListener('blur', this._handleButtonBlur)
    })

    super.destroy()
  }

  /**
   * Open the panel
   *
   * @author Milan Ricoul
   *
   * @param {HTMLElement} panel panel selector
   *
   * @returns {void}
   */
  open(panel) {
    if (!panel) {
      return
    }

    this.activePanel = panel

    if (this._settings.hasAnimation && window.getComputedStyle(panel).display === 'none') {
      DOMAnimations.slideDown(panel, 500)
    } else {
      panel.style.display = 'block'
    }

    return
  }

  /**
   * Close the panel
   *
   * @param {HTMLElement} panel panel selector
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  close(panel) {
    this._settings.hasAnimation ? DOMAnimations.slideUp(panel) : (panel.style.display = 'none')
  }

  /**
   * Check if panel is closed
   *
   * @author Milan Ricoul
   *
   * @param {HTMLElement} panel accordion panel
   *
   * @returns {Boolean}
   */
  isClosed(panel) {
    return window.getComputedStyle(panel).display === 'none'
  }
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
 * Handle trigger button click
 *
 * @param {MouseEvent} e click event handler
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function handleButtonClick(e) {
  const el = this._element
  const s = this._settings
  const { allowMultiple, forceExpand, onClose, onOpen, panelSelector } = this._settings
  const trigger = e.currentTarget
  const panel = document.getElementById(trigger.getAttribute('aria-controls'))

  if (
    trigger.getAttribute('aria-expanded') === 'true' &&
    (!forceExpand ||
      (forceExpand && allowMultiple && el.querySelectorAll(`${s.triggerSelector}[aria-expanded="true"]`).length > 1))
  ) {
    trigger.setAttribute('aria-expanded', 'false')
    this.close(panel)

    if (onClose) {
      onClose.bind(this)(panel)
    }
  } else {
    if (!allowMultiple) {
      el.querySelectorAll(panelSelector).forEach((panel) => {
        if (panel.id !== trigger.getAttribute('aria-controls')) {
          document.getElementById(panel.getAttribute('aria-labelledby')).setAttribute('aria-expanded', 'false')

          if (!this.isClosed(panel)) {
            this.close(panel)

            if (onClose) {
              onClose.bind(this)(panel)
            }
          }
        }
      })
    }

    trigger.setAttribute('aria-expanded', 'true')
    this.open(panel)

    if (onOpen) {
      onOpen.bind(this)(panel)
    }
  }
}

/**
 * Events
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function onResize() {
  const { mediaQuery, onReachBreakpoint } = this._settings
  const pattern = /\d+/g

  if (onReachBreakpoint && pattern.test(mediaQuery.media) && (this.hasReachBreakpoint === 'above' && window.innerWidth <= parseInt(mediaQuery.media.match(pattern)[0])) || (this.hasReachBreakpoint === 'below' && window.innerWidth > parseInt(mediaQuery.media.match(pattern)[0]))) {
    this.hasReachBreakpoint = this.hasReachBreakpoint === 'above' ? 'below' : 'above'
    onReachBreakpoint.bind(this)(mediaQuery.matches)
  }

  if (!this.active && ((mediaQuery && mediaQuery.matches) || !mediaQuery)) {
    this.init()
  } else if (this.active && mediaQuery && !mediaQuery.matches) {
    this.destroy()
  }
}

Accordion.defaults = {
  allowMultiple: false,
  closedDefault: false,
  forceExpand: true,
  hasAnimation: false,
  mediaQuery: null,
  onInit: null,
  onReachBreakpoint: null,
  onOpen: null,
  onClose: null,
  panelSelector: '.accordion__panel',
  prefixId: 'accordion',
  triggerSelector: '.accordion__trigger',
}

export default Accordion
