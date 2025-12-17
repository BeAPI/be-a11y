import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { ThrottledEvent } from 'oneloop.js'
import { randomId } from '../utils.ts'
import AbstractDomElement from './AbstractDomElement.ts'
import DOMAnimations from './DOMAnimations.ts'

/**
 * Options for configuring the Toggle component.
 *
 * @typedef {Object} ToggleOptions
 * @property {boolean} bodyScrollLock - Whether to lock body scroll when the toggle is opened.
 * @property {MediaQueryList | null} bodyScrollLockMediaQuery - Media query condition for locking body scroll.
 * @property {boolean} closeOnBlur - Whether to close the toggle when it loses focus.
 * @property {boolean} closeOnEscPress - Whether to close the toggle when the escape key is pressed.
 * @property {boolean} hasAnimation - Whether to use animations when opening or closing the toggle.
 * @property {boolean} isOpened - Initial state of the toggle, whether it is opened.
 * @property {MediaQueryList | null} mediaQuery - Media query condition for initializing the toggle.
 * @property {(e: MouseEvent) => any} onClick - Callback function for click events.
 * @property {string} prefixId - Prefix for the toggle ID.
 * @property {string | null} target - Selector for the target element.
 */

interface ToggleOptions {
  bodyScrollLock: boolean
  bodyScrollLockMediaQuery: MediaQueryList | null
  closeOnBlur: boolean
  closeOnEscPress: boolean
  hasAnimation: boolean
  isOpened: boolean
  mediaQuery: MediaQueryList | null
  onClick: (e: MouseEvent) => any // eslint-disable-line no-unused-vars
  prefixId: string
  target: null | string
}

/**
 * A class representing a toggle component that controls the visibility of a target element.
 *
 * @extends AbstractDomElement
 * @author Milan Ricoul
 */
export default class Toggle extends AbstractDomElement {
  /**
   * Indicates whether the toggle component has been initialized.
   *
   * @protected
   * @type {boolean}
   */
  protected initialized: boolean

  /**
   * The target element controlled by the toggle.
   *
   * @protected
   * @type {HTMLElement | null}
   */
  protected target: HTMLElement | null

  /**
   * Options for configuring the toggle component.
   *
   * @protected
   * @type {ToggleOptions}
   */
  protected options: ToggleOptions

  /**
   * Event handler for blur events.
   *
   * @private
   * @type {(e: FocusEvent) => void}
   */
  private handleBlur: (e: FocusEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for focusout events on target element.
   *
   * @private
   * @type {(e: FocusEvent) => void}
   */
  private handleTargetFocusOut: (e: FocusEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for click events.
   *
   * @private
   * @type {(e: MouseEvent) => void}
   */
  private handleClick: (e: MouseEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for resize events.
   *
   * @private
   * @type {() => void}
   */
  private handleResize: () => void // eslint-disable-line no-unused-vars

  /**
   * Default options for the Toggle component.
   *
   * @private
   * @static
   * @readonly
   * @type {ToggleOptions}
   */
  private static readonly defaults: ToggleOptions = {
    bodyScrollLock: false,
    bodyScrollLockMediaQuery: null,
    closeOnBlur: false,
    closeOnEscPress: false,
    hasAnimation: false,
    isOpened: false,
    mediaQuery: null,
    onClick: () => {},
    prefixId: 'toggle',
    target: null,
  }

  /**
   * Constructs a new Toggle instance.
   *
   * @param {HTMLElement} element - The DOM node representing the toggle container.
   * @param {Partial<ToggleOptions>} options - Options for configuring the Toggle component.
   */
  constructor(element: HTMLElement, options: Partial<ToggleOptions> = {}) {
    const mergedOptions: ToggleOptions = {
      ...Toggle.defaults,
      ...options,
    }

    super(element, mergedOptions)

    if (!this.isNewInstance()) {
      return this
    }

    const el = this.element
    const targetId = this.element.getAttribute('aria-controls')

    this.options = mergedOptions
    this.initialized = false

    if (el && el.parentNode && this.options.target) {
      this.target = el.parentNode.querySelector(this.options.target)
    }

    if (el && el.parentNode && !this.options.target && targetId) {
      this.target = document.getElementById(targetId)
    }

    this.handleResize = this._handleResize.bind(this)
    this.handleBlur = this._handleBlur.bind(this)
    this.handleClick = this._handleClick.bind(this)
    this.handleTargetFocusOut = this._handleTargetFocusOut.bind(this)

    new ThrottledEvent(window, 'resize').add('resize', this.handleResize)
    this.handleResize()
  }

  /**
   * Initializes the Toggle component.
   *
   * @private
   * @returns {void}
   */
  private init(): void {
    const el = this.element

    const { closeOnBlur, closeOnEscPress, isOpened, onClick, prefixId } = this.options

    // In case there is an on click callback, add click event listener
    if (onClick) {
      el.addEventListener('click', onClick.bind(this))
    }

    // In case this.target is not defined, stop the initialization
    if (!this.target) {
      return
    }

    this.initialized = true

    el.setAttribute('aria-expanded', 'false')

    // In case this.target is defined, add on click event
    if (this.target) {
      el.addEventListener('click', this.handleClick)
      el.addEventListener('click', this.handleClick)
    }

    if (!el.hasAttribute('aria-controls')) {
      const id = `${prefixId}-${randomId()}`
      el.setAttribute('aria-controls', id)
      this.target.id = id
    }

    if (closeOnBlur) {
      el.addEventListener('blur', this.handleBlur)
      this.target.addEventListener('focusout', this.handleTargetFocusOut)
    }

    if (closeOnEscPress) {
      window.addEventListener('keydown', function (e) {
        if (e.defaultPrevented) {
          return
        }

        const key = e.key
        const id = el.getAttribute('aria-controls')

        if (
          ['Escape', 'Esc'].includes(key) &&
          id &&
          document.getElementById(id)?.getAttribute('aria-hidden') !== 'true'
        ) {
          el.click()
        }
      })
    }

    if (!this.target.hasAttribute('aria-hidden')) {
      this.target.setAttribute('aria-hidden', isOpened ? 'false' : 'true')
    }

    if (isOpened) {
      this.open()
    }
  }

  /**
   * Destroys the Toggle component, removing event listeners and cleanup.
   *
   * @param {HTMLElement | NodeList | string} element - The element or elements to destroy.
   * @returns {void}
   */
  static destroy(element: HTMLElement | NodeList | string): void {
    const instance = AbstractDomElement.getInstance(element) as Toggle | undefined

    if (instance) {
      const {
        element,
        target,
        options: { onClick },
      } = instance

      instance.initialized = false

      instance.reset()
      element.removeAttribute('aria-expanded')
      element.removeEventListener('click', instance.handleClick)
      element.removeEventListener('blur', instance.handleBlur)

      if (target) {
        target.removeEventListener('focusout', instance.handleTargetFocusOut)
      }

      if (onClick) {
        element.removeEventListener('click', onClick)
      }
    }

    AbstractDomElement.destroy(element)
  }

  /**
   * Opens the toggle, displaying the target element.
   *
   * @returns {void}
   */
  open() {
    if (!this.target) {
      return
    }

    const el = this.element
    const { bodyScrollLock, hasAnimation } = this.options

    this.target.setAttribute('aria-hidden', 'false')
    el.setAttribute('aria-expanded', 'true')

    if (hasAnimation) {
      DOMAnimations.slideDown(this.target)
    }

    if (bodyScrollLock) {
      this.disableBodyScroll()
    }
  }

  /**
   * Closes the toggle, hiding the target element.
   *
   * @returns {void}
   */
  close() {
    if (!this.target) {
      return
    }

    const el = this.element
    const { bodyScrollLock } = this.options

    this.target.setAttribute('aria-hidden', 'true')
    el.setAttribute('aria-expanded', 'false')

    if (this.options.hasAnimation) {
      DOMAnimations.slideUp(this.target)
    }

    if (bodyScrollLock) {
      enableBodyScroll(this.target)
    }
  }

  /**
   * Resets the toggle to its initial state.
   *
   * @returns {void}
   */
  reset() {
    if (!this.target) {
      return
    }

    const el = this.element

    this.target.removeAttribute('aria-hidden')
    this.target.removeAttribute('aria-expanded')
    el.removeAttribute('aria-expanded')

    if (this.options.hasAnimation) {
      DOMAnimations.slideDown(this.target, 500, () => {
        this.target?.removeAttribute('style')
      })
    }
  }

  /**
   * Disables body scroll when the toggle is opened.
   *
   * @private
   * @returns {void}
   */
  private disableBodyScroll() {
    const { bodyScrollLockMediaQuery } = this.options

    if (!this.target) {
      return
    }

    if (bodyScrollLockMediaQuery && bodyScrollLockMediaQuery.matches) {
      disableBodyScroll(this.target)
    } else if (!bodyScrollLockMediaQuery) {
      disableBodyScroll(this.target)
    }
  }

  /**
   * Handles click events on the toggle element.
   *
   * @private
   * @param {MouseEvent} e - The mouse event.
   * @returns {void}
   */
  _handleClick(e: MouseEvent) {
    const { isOpened } = this.options

    e.preventDefault()

    if (this.target?.hasAttribute('aria-hidden')) {
      this.target.getAttribute('aria-hidden') !== 'true' ? this.close() : this.open()

      return
    } else {
      this.target?.setAttribute('aria-hidden', isOpened ? 'true' : 'false')
    }
  }

  /**
   * Handles blur events on the toggle element.
   *
   * @private
   * @param {FocusEvent} e - The focus event.
   * @returns {void}
   */
  _handleBlur(e: FocusEvent) {
    const relatedTarget = e.relatedTarget as HTMLElement | null

    // Check if focus is moving to the button itself
    if (relatedTarget === this.element) {
      return
    }

    // Check if focus is moving to an element inside the toggled target
    if (relatedTarget && this.target?.contains(relatedTarget)) {
      return
    }

    this.close()
  }

  /**
   * Handles focusout events on the target element.
   *
   * @private
   * @param {FocusEvent} e - The focus event.
   * @returns {void}
   */
  _handleTargetFocusOut(e: FocusEvent) {
    const relatedTarget = e.relatedTarget as HTMLElement | null

    // Check if focus is moving to the button
    if (relatedTarget === this.element) {
      return
    }

    // Check if focus is staying inside the toggled target
    if (relatedTarget && this.target?.contains(relatedTarget)) {
      return
    }

    this.close()
  }

  /**
   * Handles resize events and applies the necessary behaviors based on media query.
   *
   * @private
   * @returns {void}
   */
  _handleResize() {
    const { mediaQuery } = this.options

    if (!mediaQuery && !this.initialized) {
      this.init()
    }

    if (mediaQuery && this.initialized && !mediaQuery.matches) {
      Toggle.destroy(this.element)
    } else if (mediaQuery && !this.initialized && mediaQuery.matches) {
      this.init()
    } else if (
      mediaQuery &&
      !this.initialized &&
      !mediaQuery.matches &&
      this.target?.style.display === 'none' &&
      this.target?.hasAttribute('style')
    ) {
      this.target.removeAttribute('style')
    }
  }
}
