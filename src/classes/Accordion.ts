import { ThrottledEvent } from 'oneloop.js'
import AbstractDomElement from './AbstractDomElement.ts'
import DOMAnimations from './DOMAnimations.ts'
import { randomId } from '../utils.ts'

/**
 * @typedef {Object} AccordionOptions
 * @property {boolean} allowMultiple - Whether multiple panels can be opened simultaneously.
 * @property {boolean} closedDefault - Whether the panels are closed by default.
 * @property {boolean} forceExpand - Whether at least one panel must be expanded at all times.
 * @property {boolean} hasAnimation - Whether to use animations when opening/closing panels.
 * @property {MediaQueryList | null} mediaQuery - The media query to match for initializing the accordion.
 * @property {(e: MouseEvent, panel: HTMLElement) => any} onOpen - Callback when a panel is opened.
 * @property {(e: MouseEvent, panel: HTMLElement) => any} onClose - Callback when a panel is closed.
 * @property {string} panelSelector - The CSS selector for panels.
 * @property {string} prefixId - The prefix for the IDs used in the accordion.
 * @property {string} triggerSelector - The CSS selector for triggers.
 */

interface AccordionOptions {
  allowMultiple: boolean
  closedDefault: boolean
  forceExpand: boolean
  hasAnimation: boolean
  mediaQuery: MediaQueryList | null
  onInit: (element: HTMLElement) => any // eslint-disable-line no-unused-vars
  onReachBreakpoint: (mediaQueryMatches: boolean) => any // eslint-disable-line no-unused-vars
  onOpen: (e: MouseEvent, panel: HTMLElement) => any // eslint-disable-line no-unused-vars
  onClose: (e: MouseEvent, panel: HTMLElement) => any // eslint-disable-line no-unused-vars
  panelSelector: string
  prefixId: string
  triggerSelector: string
}

/**
 * Represents an accordion component.
 *
 * @extends AbstractDomElement
 */
export default class Accordion extends AbstractDomElement {
  /**
   * @protected
   * @type {boolean}
   */
  protected active: boolean

  /**
   * @protected
   * @type {null | HTMLElement}
   */
  protected activePanel: null | HTMLElement

  /**
   * @protected
   * @type {boolean}
   */
  protected focus: boolean

  /**
   * @protected
   * @type {'above' | 'below' | null}
   */
  protected hasReachBreakpoint: 'above' | 'below' | null

  /**
   * The string representing focusable elements.
   *
   * @private
   * @readonly
   * @type {string}
   */
  private readonly FOCUSABLE_ELEMENTS: string =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  /**
   * Options for configuring the accordion component.
   *
   * @protected
   * @type {AccordionOptions}
   */
  protected options: AccordionOptions

  /**
   * Event handler for resize events.
   *
   * @private
   * @type {() => void}
   */
  private handleResize: () => void

  /**
   * Event handler for button click events.
   *
   * @private
   * @type {(e: MouseEvent) => void}
   */
  private handleButtonClick: (e: MouseEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for button blur events.
   *
   * @private
   * @type {() => void}
   */
  private handleButtonBlur: () => void

  /**
   * Event handler for button focus events.
   *
   * @private
   * @type {() => void}
   */
  private handleButtonFocus: () => void

  /**
   * Default options for the Accordion component.
   *
   * @private
   * @static
   * @readonly
   * @type {AccordionOptions}
   */
  private static readonly defaults: AccordionOptions = {
    allowMultiple: false,
    closedDefault: false,
    forceExpand: true,
    hasAnimation: false,
    mediaQuery: null,
    onInit: () => {},
    onOpen: () => {},
    onClose: () => {},
    onReachBreakpoint: () => {},
    panelSelector: '.accordion__panel',
    prefixId: 'accordion',
    triggerSelector: '.accordion__trigger',
  }

  /**
   * Constructs a new Accordion instance.
   *
   * @param {HTMLElement} element - The DOM node representing the accordion container.
   * @param {Partial<AccordionOptions>} options - Options for configuring the accordion component.
   */
  constructor(element: HTMLElement, options: Partial<AccordionOptions> = {}) {
    const mergedOptions: AccordionOptions = {
      ...Accordion.defaults,
      ...options,
    }

    super(element, mergedOptions)

    if (!this.isNewInstance()) {
      return this
    }

    this.active = false
    this.activePanel = null
    this.focus = false

    this.handleButtonClick = this._handleButtonClick.bind(this)
    this.handleButtonBlur = this._handleButtonBlur.bind(this)
    this.handleButtonFocus = this._handleButtonFocus.bind(this)
    this.handleResize = this._handleResize.bind(this)
    new ThrottledEvent(window, 'resize').add('resize', this.handleResize)
    this.handleResize()
  }

  /**
   * Initializes the Accordion component.
   *
   * @private
   * @returns {void}
   */
  private init(): void {
    const el = this.element
    const { closedDefault, mediaQuery, onInit, panelSelector, prefixId, triggerSelector } = this.options
    const pattern = /\d+/g
    const triggers = el.querySelectorAll(triggerSelector)
    const panels = el.querySelectorAll(panelSelector)
    const id = randomId()
    let index = 0

    el.dataset.id = id

    if (onInit && !this.active) {
      this.active = true
      onInit.bind(this)(el)
    }

    this.active = true

    if (mediaQuery && pattern.test(mediaQuery.media)) {
      if (mediaQuery && mediaQuery.media.includes('min')) {
        const minWidth = mediaQuery.media.match(pattern)?.[0];
        if (minWidth) {
          this.hasReachBreakpoint = window.innerWidth > parseInt(minWidth) ? 'above' : 'below'
        }
      }

      if (mediaQuery && mediaQuery.media.includes('max')) {
        const maxWidth = mediaQuery.media.match(pattern)?.[0];
        if (maxWidth) {
          this.hasReachBreakpoint = window.innerWidth >= parseInt(maxWidth) ? 'above' : 'below'
        }
      }
    }

    if (closedDefault) {
      this.options.forceExpand = false
    }

    // Set id and ARIA attributes to the trigger
    for (const trigger of triggers) {
      let i = index + 1
      while (document.getElementById(`${prefixId}-${id}-${i}`)) {
        i++
      }

      trigger.id = `${prefixId}-${id}-${i}`
      trigger.setAttribute('aria-controls', `${prefixId}-${id}-panel-${i}`)
      trigger.setAttribute('aria-expanded', `${index === 0 ? 'true' : 'false'}`)

      // eslint-disable-next-line no-undef
      trigger.addEventListener('click', this.handleButtonClick as EventListener)
      trigger.addEventListener('focus', this.handleButtonFocus)
      trigger.addEventListener('blur', this.handleButtonBlur)

      index++
    }

    // Set id and ARIA attributes to the panel
    index = 0

    for (const panel of panels) {
      let i = index + 1
      while (document.getElementById(`${prefixId}-${id}-panel-${i}`)) {
        i++
      }
      panel.id = `${prefixId}-${id}-panel-${i}`
      panel.setAttribute('aria-labelledby', `${prefixId}-${id}-${i}`)

      if (index !== 0) {
        ;(panel as HTMLElement).style.display = 'none'
      }

      if (closedDefault) {
        triggers[index].setAttribute('aria-expanded', 'false')
        this.close(panel as HTMLElement)
      }
    }
  }

  /**
   * Destroys the Accordion component.
   *
   * @param {HTMLElement | NodeList | string} element - The element or selector to destroy the accordion on.
   * @returns {void}
   */
  static destroy(element: HTMLElement | NodeList | string): void {
    const instance = AbstractDomElement.getInstance(element) as Accordion | undefined

    if (instance) {
      const {
        element,
        options: { panelSelector, triggerSelector },
      } = instance

      instance.active = false
      instance.activePanel = null

      const triggers = element.querySelectorAll(triggerSelector)
      const panels = element.querySelectorAll(panelSelector)

      // Remove id and ARIA attributes from the trigger
      for (const trigger of triggers) {
        trigger.removeAttribute('id')
        trigger.removeAttribute('aria-controls')
        trigger.removeAttribute('aria-expanded')
        trigger.removeEventListener('click', instance.handleButtonClick as EventListener) // eslint-disable-line no-undef
        trigger.removeEventListener('focus', instance.handleButtonFocus)
        trigger.removeEventListener('blur', instance.handleButtonBlur)
      }

      // Remove id and ARIA attributes from the panel
      for (const panel of panels) {
        panel.removeAttribute('id')
        panel.removeAttribute('aria-labelledby')
        panel.removeAttribute('style')
      }
    }

    AbstractDomElement.destroy(element)
  }

  /**
   * Opens the panel.
   *
   * @param {HTMLElement} panel - The panel to open.
   * @returns {void}
   */
  open(panel: HTMLElement): void {
    if (!panel) {
      return
    }

    const { hasAnimation } = this.options
    this.activePanel = panel

    const firstFocusableElement = panel.querySelectorAll(this.FOCUSABLE_ELEMENTS)[0] as HTMLElement

    if (hasAnimation && window.getComputedStyle(panel).display === 'none') {
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
   * Closes the panel.
   *
   * @param {HTMLElement} panel - The panel to close.
   * @returns {void}
   */
  close(panel: HTMLElement): void {
    this.options.hasAnimation ? DOMAnimations.slideUp(panel) : (panel.style.display = 'none')
  }

  /**
   * Check if panel is closed.
   *
   * @private
   * @param {HTMLElement} panel - The accordion panel.
   * @returns {boolean}
   */
  private isClosed(panel: HTMLElement): boolean {
    return window.getComputedStyle(panel).display === 'none'
  }

  /**
   * Handles the button click event.
   *
   * @private
   * @param {MouseEvent} e - The mouse event.
   * @returns {void}
   */
  private _handleButtonClick(e: MouseEvent): void {
    const el = this.element
    const { allowMultiple, forceExpand, onClose, onOpen, panelSelector, triggerSelector } = this.options
    const trigger = e.currentTarget as HTMLElement
    const triggerAriaControlsAttr = trigger.getAttribute('aria-controls')

    if (!trigger || !triggerAriaControlsAttr) {
      return
    }

    const panel = document.getElementById(triggerAriaControlsAttr) as HTMLElement

    if (!panel) {
      return
    }

    const panelAriaLabelledByAttr = panel.getAttribute('aria-labelledby')

    if (
      trigger.getAttribute('aria-expanded') === 'true' &&
      (!forceExpand ||
        (forceExpand && allowMultiple && el.querySelectorAll(`${triggerSelector}[aria-expanded="true"]`).length > 1))
    ) {
      trigger.setAttribute('aria-expanded', 'false')
      this.close(panel)

      if (onClose) {
        onClose.bind(this)(e, panel)
      }
    } else {
      if (!allowMultiple) {
        el.querySelectorAll(panelSelector).forEach((otherPanel) => {
          // Skip the panel we're about to open
          if (otherPanel.id === panel.id) {
            return
          }

          const otherPanelAriaLabelledBy = otherPanel.getAttribute('aria-labelledby')
          if (otherPanelAriaLabelledBy) {
            const otherTrigger = document.getElementById(otherPanelAriaLabelledBy)

            if (otherTrigger && !this.isClosed(otherPanel as HTMLElement)) {
              otherTrigger.setAttribute('aria-expanded', 'false')
              this.close(otherPanel as HTMLElement)

              if (onClose) {
                onClose.bind(this)(e, otherPanel as HTMLElement)
              }
            }
          }
        })
      }

      trigger.setAttribute('aria-expanded', 'true')
      this.open(panel)

      if (onOpen) {
        onOpen.bind(this)(e, panel)
      }
    }
  }

  /**
   * Handles the button blur event.
   *
   * @private
   * @returns {void}
   */
  private _handleButtonBlur(): void {
    this.focus = false
  }

  /**
   * Handles the button focus event.
   *
   * @private
   * @returns {void}
   */
  private _handleButtonFocus(): void {
    this.focus = true
  }

  /**
   * Handles the resize event.
   *
   * @private
   * @returns {void}
   */
  private _handleResize(): void {
    const el = this.element
    const { mediaQuery, onReachBreakpoint } = this.options
    const pattern = /\d+/g

    if (mediaQuery && onReachBreakpoint && pattern.test(mediaQuery.media)) {
      const matchResult = mediaQuery.media.match(pattern)
      const breakpointValue = matchResult?.[0]

      if (breakpointValue) {
        const breakpointWidth = parseInt(breakpointValue, 10)
        const shouldToggle =
          (this.hasReachBreakpoint === 'above' && window.innerWidth <= breakpointWidth) ||
          (this.hasReachBreakpoint === 'below' && window.innerWidth > breakpointWidth)

        if (shouldToggle) {
          this.hasReachBreakpoint = this.hasReachBreakpoint === 'above' ? 'below' : 'above'
          onReachBreakpoint.bind(this)(mediaQuery.matches)
        }
      }
    }

    if (!this.active && ((mediaQuery && mediaQuery.matches) || !mediaQuery)) {
      this.init()

      return
    }

    if (this.active && mediaQuery && !mediaQuery.matches) {
      Accordion.destroy(el)
    }
  }
}
