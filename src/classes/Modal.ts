import { ThrottledEvent } from 'oneloop.js'
import AbstractDomElement from './AbstractDomElement.ts'
import { isSelectorValid, randomId } from '../utils.ts'

/**
 * @typedef {Object} ModalOptions
 * @property {string} closeButtonSelector - The selector for the close button.
 * @property {string} closedClassName - The class name to be applied when the modal is closed.
 * @property {boolean} closeOnFocusOutside - Whether to close the modal when focus is outside.
 * @property {null|string} descriptionSelector - The selector for the description element.
 * @property {null|string} labelSelector - The selector for the label element.
 * @property {MediaQueryList|null} mediaQuery - The media query for responsiveness.
 * @property {string} openedClassName - The class name to be applied when the modal is open.
 * @property {(e: MouseEvent) => any} onOpen - The callback function to execute when the modal is opened.
 * @property {(e: MouseEvent) => any} onClose - The callback function to execute when the modal is closed.
 * @property {null|string} triggerSelector - The selector for the trigger button.
 */
interface ModalOptions {
  closeButtonSelector: string
  closedClassName: string
  closeOnEscapeKey: boolean
  closeOnFocusOutside: boolean
  descriptionSelector: null | string
  labelSelector: null | string
  mediaQuery: MediaQueryList | null
  openedClassName: string
  onOpen: (e: MouseEvent) => any // eslint-disable-line no-unused-vars
  onClose: (e: MouseEvent) => any // eslint-disable-line no-unused-vars
  triggerSelector: null | string
}

/**
 * Represents a modal component.
 *
 * @extends AbstractDomElement
 */
export default class Modal extends AbstractDomElement {
  /**
   * Indicates whether the modal component has been initialized.
   *
   * @protected
   * @type {boolean}
   */
  protected initialized: boolean

  /**
   * The string representing focusable elements.
   *
   * @private
   * @readonly
   * @type {string}
   */
  private readonly FOCUSABLE_ELEMENTS: string = 'a[href]:not([tabindex="-1"]),area[href]:not([tabindex="-1"]),input:not([disabled]):not([tabindex="-1"]),select:not([disabled]):not([tabindex="-1"]),textarea:not([disabled]):not([tabindex="-1"]),button:not([disabled]):not([tabindex="-1"]),iframe:not([tabindex="-1"]),[tabindex]:not([tabindex="-1"]),[contentEditable=true]:not([tabindex="-1"])'

  /**
   * The id of the modal.
   *
   * @private
   * @type {string}
   */
  private id: string

  /**
   * Indicates whether the modal is opened.
   *
   * @private
   * @type {boolean}
   */
  private isOpened: boolean

  /**
   * The button that triggered the modal.
   *
   * @private
   * @type {null|HTMLElement}
   */
  private triggerButton: null | HTMLElement

  /**
   * Options for configuring the modal component.
   *
   * @protected
   * @type {ModalOptions}
   */
  protected options: ModalOptions

  /**
   * Event handler for outside click events.
   *
   * @private
   * @type {(e: MouseEvent) => void}
   */
  private handleOutsideClick: (e: MouseEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for button click events.
   *
   * @private
   * @type {(e: MouseEvent) => void}
   */
  private handleButtonClick: (e: MouseEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for resize events.
   *
   * @private
   * @type {() => void}
   */
  private handleResize: () => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for keydown events.
   *
   * @private
   * @type {(e: KeyboardEvent) => void}
   */
  private handleKeydown: (e: KeyboardEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for transition end events.
   *
   * @private
   * @type {() => void}
   */
  private handleTransitionEnd: () => void // eslint-disable-line no-unused-vars

  /**
   * Default options for the Modal component.
   *
   * @private
   * @static
   * @readonly
   * @type {ModalOptions}
   */
  private static readonly defaults: ModalOptions = {
    closeButtonSelector: '.modal__close',
    closedClassName: 'modal--hidden',
    closeOnEscapeKey: true,
    closeOnFocusOutside: false,
    descriptionSelector: null,
    labelSelector: null,
    mediaQuery: null,
    openedClassName: 'modal--visible',
    onOpen: () => {},
    onClose: () => {},
    triggerSelector: null,
  }

  /**
   * Constructs a new Modal instance.
   *
   * @param {HTMLElement} element - The DOM node representing the modal container.
   * @param {Partial<ModalOptions>} options - Options for configuring the modal component.
   */
  constructor(element: HTMLElement, options: Partial<ModalOptions> = {}) {
    const mergedOptions: ModalOptions = {
      ...Modal.defaults,
      ...options,
    }

    super(element, mergedOptions)

    if (!this.isNewInstance()) {
      return this
    }

    this.initialized = false
    this.isOpened = false
    this.triggerButton = null
    this.handleOutsideClick = this._handleOutsideClick.bind(this)
    this.handleButtonClick = this._handleButtonClick.bind(this)
    this.handleKeydown = this._handleKeydown.bind(this)
    this.handleTransitionEnd = this._handleTransitionEnd.bind(this)
    this.handleResize = this._handleResize.bind(this)

    new ThrottledEvent(window, 'resize').add('resize', this.handleResize)
    this.handleResize()
  }

  /**
   * Initializes the Modal component.
   *
   * @private
   * @returns {void}
   */
  private init(): void {
    this.initialized = true
    const el = this.element
    const { closeButtonSelector, closedClassName, descriptionSelector, labelSelector, triggerSelector } = this.options

    // Set id
    if (el.id) {
      this.id = el.id
    } else {
      this.id = `modal-${randomId()}`

      el.id = this.id
    }

    el.classList.add(closedClassName)

    // Set aria-labelledby attribute
    if (labelSelector) {
      const labelElement = el.querySelector(labelSelector)

      if (labelElement) {
        el.setAttribute('aria-labelledby', `${this.id}-label`)
        labelElement.id = `${this.id}-label`
      }
    }

    // Set aria-describedby attribute
    if (descriptionSelector) {
      const descriptionElement = el.querySelector(descriptionSelector)

      if (descriptionElement) {
        el.setAttribute('aria-describedby', `${this.id}-description`)
        descriptionElement.id = `${this.id}-description`
      }
    }

    // Set aria-controls attribute to close button
    if (closeButtonSelector) {
      const closeButtonElement = el.querySelector(closeButtonSelector)
      const closeButton = el.querySelector(closeButtonSelector)

      if (closeButtonElement && closeButton) {
        closeButton.id = `${this.id}-close`
        closeButton.setAttribute('aria-controls', this.id)
        closeButton.addEventListener('click', this.close.bind(this))
      }
    }

    // if setting triggerButton is defined and exists, set aria-controls attribute to this button
    if (triggerSelector && document.querySelectorAll(triggerSelector).length) {
      document.querySelectorAll(triggerSelector).forEach((btn) => {
        btn.setAttribute('aria-controls', this.id)
      })
    }

    for (const button of document.querySelectorAll<HTMLButtonElement>(
      `button[aria-controls="${this.id}"]:not(#${this.id}-close)`
    )) {
      button.addEventListener('click', this.handleButtonClick)
    }

    window.addEventListener('keydown', this.handleKeydown)
  }

  /**
   * Destroys the Modal component, removing event listeners and cleaning up.
   *
   * @param {HTMLElement | NodeList | string} element - The element or elements to destroy.
   * @returns {void}
   */
  static destroy(element: HTMLElement | NodeList | string): void {
    const instance = AbstractDomElement.getInstance(element) as Modal | undefined

    if (instance) {
      const {
        element,
        options: { closeButtonSelector, closedClassName, openedClassName },
        id,
        open,
        close,
      } = instance

      instance.initialized = false

      element.classList.remove(closedClassName, openedClassName)
      element.removeAttribute('aria-hidden')

      if (closeButtonSelector) {
        element.querySelector(closeButtonSelector)?.removeEventListener('click', close.bind(instance))
      }

      for (const button of document.querySelectorAll(`button[aria-controls="${id}"]`)) {
        button.removeEventListener('click', open.bind(instance))
      }

      AbstractDomElement.destroy(element)
    }
  }

  /**
   * Opens the modal.
   *
   * @returns {void}
   */
  open() {
    this.isOpened = true

    const el = this.element
    const { closedClassName, closeOnFocusOutside, openedClassName, onOpen } = this.options
    el.classList.remove(closedClassName)
    el.classList.add(openedClassName)
    el.removeAttribute('aria-hidden')

    const focusableElements = el.querySelectorAll(this.FOCUSABLE_ELEMENTS)

    for (const [index, element] of focusableElements.entries()) {
      const HTMLElement = element as HTMLElement
      HTMLElement.style.removeProperty('display')

      if (index === 0) {
        HTMLElement.focus()
      }
    }

    if (onOpen) {
      onOpen.bind(this)
    }

    if (closeOnFocusOutside) {
      // Use requestAnimationFrame to add the event after the initial rendering
      requestAnimationFrame(() => {
        window.addEventListener('click', this.handleOutsideClick)
      })
    }
  }

  /**
   * Closes the modal.
   *
   * @returns {void}
   */
  close() {
    const el = this.element
    const { closedClassName, closeOnFocusOutside, openedClassName, onClose } = this.options

    this.isOpened = false

    el.classList.add(closedClassName)
    el.classList.remove(openedClassName)
    el.setAttribute('aria-hidden', 'true')
    el.addEventListener('transitionend', this.handleTransitionEnd)

    if (this.triggerButton) {
      this.triggerButton.focus()
    }

    if (onClose) {
      onClose.bind(this)
    }

    if (closeOnFocusOutside) {
      window.removeEventListener('click', this.handleOutsideClick)
    }
  }

  /**
   * Checks the next focusable element in the modal.
   *
   * @private
   * @param {KeyboardEvent} e - The keyboard event.
   * @returns {void}
   */
  private checkNextFocusableElement(e: KeyboardEvent) {
    const el = this.element
    const focusableElements = el.querySelectorAll(this.FOCUSABLE_ELEMENTS)
    const currentIndexOfActiveElement = Array.prototype.indexOf.call(focusableElements, document.activeElement)

    if (currentIndexOfActiveElement === 0 && e.shiftKey) {
      e.preventDefault()
      ;(focusableElements[focusableElements.length - 1] as HTMLElement).focus()
    }

    if (currentIndexOfActiveElement === focusableElements.length - 1 && !e.shiftKey) {
      e.preventDefault()
      ;(focusableElements[0] as HTMLElement).focus()
    }
  }

  /**
   * Handles the button click event.
   *
   * @private
   * @param {MouseEvent} e - The mouse event.
   * @returns {void}
   */
  _handleButtonClick(e: MouseEvent) {
    this.triggerButton = e.currentTarget as HTMLElement

    this.open()
  }

  /**
   * Handles the outside click event.
   *
   * @private
   * @param {MouseEvent} e - The mouse event.
   * @returns {void}
   */
  _handleOutsideClick(e: MouseEvent): void {
    // If the modal is not open, do nothing
    if (!this.isOpened) {
      return
    }

    const { target } = e
    const { closeOnFocusOutside } = this.options

    // If closeOnFocusOutside is a valid selector and it is an parent element of the clicked target
    // Or, if the modal element is an parent of the clicked target.
    if (
      (typeof closeOnFocusOutside === 'string' &&
        isSelectorValid(closeOnFocusOutside) &&
        (target as HTMLElement)?.closest(closeOnFocusOutside)) ||
      (closeOnFocusOutside === true && this.element.contains(target as Node))
    ) {
      return
    }

    this.close()
  }

  /**
   * Handles the keydown event.
   *
   * @private
   * @param {KeyboardEvent} e - The keyboard event.
   * @returns {void}
   */
  _handleKeydown(e: KeyboardEvent) {
    switch (e.code) {
      case 'Tab':
        this.checkNextFocusableElement(e)
        break
      case 'Escape':
        if (this.isOpened && this.options.closeOnEscapeKey) {
          this.close()
        }
    }
  }

  /**
   * Handles the resize event.
   *
   * @private
   * @returns {void}
   */
  _handleResize() {
    const el = this.element
    const { closedClassName, mediaQuery, openedClassName } = this.options

    if (!mediaQuery && !this.initialized) {
      this.init()
    }

    if (mediaQuery && this.initialized && !mediaQuery.matches) {
      Modal.destroy(el)
    } else if (!this.initialized && mediaQuery && mediaQuery.matches) {
      this.init()
    } else if (
      !this.initialized &&
      mediaQuery &&
      !mediaQuery.matches &&
      el.hasAttribute('aria-hidden') &&
      el.getAttribute('aria-hidden') === 'true'
    ) {
      el.classList.remove(closedClassName, openedClassName)
      el.removeAttribute('aria-hidden')
    }
  }

  /**
   * Handles the transition end event.
   *
   * @private
   * @returns {void}
   */
  _handleTransitionEnd() {
    const el = this.element

    for (const focusableElement of el.querySelectorAll(this.FOCUSABLE_ELEMENTS)) {
      ;(focusableElement as HTMLElement).style.display = 'none'
    }

    el.removeEventListener('transitionend', this.handleTransitionEnd)
  }
}
