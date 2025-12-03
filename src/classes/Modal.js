import AbstractDomElement from './AbstractDomElement.js'
import { ThrottledEvent } from 'oneloop.js'
import { isSelectorValid, randomId } from '../utils/helpers.js'

const FOCUSABLE_ELEMENTS = 'a[href]:not([tabindex="-1"]),area[href]:not([tabindex="-1"]),input:not([disabled]):not([tabindex="-1"]),select:not([disabled]):not([tabindex="-1"]),textarea:not([disabled]):not([tabindex="-1"]),button:not([disabled]):not([tabindex="-1"]),iframe:not([tabindex="-1"]),[tabindex]:not([tabindex="-1"]),[contentEditable=true]:not([tabindex="-1"])'

/**
 * Modal Class
 *
 * @author Milan Ricoul
 */
class Modal extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    const { onClose, onOpen } = this._settings

    this.isOpened = false
    this.triggerButton = null
    this._onResizeHandler = onResize.bind(this)
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
    this._handleOutsideClick = handleOutsideClick.bind(this)
    this._handleButtonClick = handleButtonClick.bind(this)
    this._handleKeydown = handleKeydown.bind(this)
    this._handleTransitionEnd = handleTransitionEnd.bind(this)

    if (onOpen) {
      this._onOpen = onOpen.bind(this)
    }

    if (onClose) {
      this._onClose = onClose.bind(this)
    }

    this.initialized = false

    new ThrottledEvent(window, 'resize').add('resize', this._onResizeHandler)
    this._onResizeHandler()
  }

  /**
   * Initialization
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  init() {
    this.initialized = true
    this.disableAllFocusedElements()
    const el = this._element
    const { closeButtonSelector, closedClassName, descriptionSelector, labelSelector, triggerSelector } = this._settings

    // Set id
    if (el.id) {
      this.id = el.id
    } else {
      this.id = `modal-${randomId()}`

      el.id = this.id
    }

    if (el.hasAttribute('aria-hidden') && el.getAttribute('aria-hidden') === 'true') {
      el.classList.add(closedClassName)
    }

    // Set aria-labelledby attribute
    if (labelSelector && el.querySelector(labelSelector)) {
      el.setAttribute('aria-labelledby', `${this.id}-label`)
      el.querySelector(labelSelector).id = `${this.id}-label`
    }

    // Set aria-describedby attribute
    if (descriptionSelector && el.querySelector(descriptionSelector)) {
      el.setAttribute('aria-describedby', `${this.id}-description`)
      el.querySelector(descriptionSelector).id = `${this.id}-description`
    }

    // Set aria-controls attribute to close button
    if (closeButtonSelector && el.querySelector(closeButtonSelector)) {
      const closeButton = el.querySelector(closeButtonSelector)
      closeButton.id = `${this.id}-close`
      closeButton.setAttribute('aria-controls', this.id)
      closeButton.addEventListener('click', this.close)
    }

    // if setting triggerButton is defined and exists, set aria-controls attribute to this button
    if (triggerSelector && document.querySelectorAll(triggerSelector).length) {
      document.querySelectorAll(triggerSelector).forEach((btn) => {
        btn.setAttribute('aria-controls', this.id)
      })
    }

    document.querySelectorAll(`button[aria-controls="${this.id}"]:not(#${this.id}-close)`).forEach((btn) => {
      btn.addEventListener('click', this._handleButtonClick)
    })

    window.addEventListener('keydown', this._handleKeydown)
  }

  /**
   * Open modal
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  open() {
    this.isOpened = true
    this.enableAllFocusedElements()

    const el = this._element
    const { closedClassName, openedClassName } = this._settings
    el.classList.remove(closedClassName)
    el.classList.add(openedClassName)
    el.removeAttribute('aria-hidden')
    el.querySelectorAll(FOCUSABLE_ELEMENTS).forEach((element, index) => {
      element.style.removeProperty('display')

      if (index === 0) {
        element.focus()
      }
    })

    if (this._onOpen) {
      this._onOpen()
    }

    if (this._settings.closeOnFocusOutside) {
      // Use requestAnimationFrame to add the event after the initial rendering
      requestAnimationFrame(() => {
        window.addEventListener('click', this._handleOutsideClick)
      })
    }
  }

  /**
   * Close modal
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  close() {
    const el = this._element
    const { closedClassName, openedClassName } = this._settings

    this.isOpened = false
    this.disableAllFocusedElements()

    el.classList.add(closedClassName)
    el.classList.remove(openedClassName)
    el.setAttribute('aria-hidden', 'true')
    el.addEventListener('transitionend', this._handleTransitionEnd)

    if (this.triggerButton) {
      this.triggerButton.focus()
    }

    if (this._onClose) {
      this._onClose()
    }

    if (this._settings.closeOnFocusOutside) {
      window.removeEventListener('click', this._handleOutsideClick)
    }
  }

  /**
   * Check if the next focusable element in dialog exists, else focus the first focusable element in dialog
   *
   * @param {KeyboardEvent} e keyboard event handler
   *
   * @returns {void}
   *
   * @author Milan Ricoul
   */
  checkNextFocusableElement(e) {
    if (!this.isOpened && this.initialized) {
      return
    }

    const el = this._element
    const focusableElements = el.querySelectorAll(FOCUSABLE_ELEMENTS)
    const currentIndexOfActiveElement = Array.prototype.indexOf.call(focusableElements, document.activeElement)

    if (currentIndexOfActiveElement === 0 && e.shiftKey) {
      e.preventDefault()
      focusableElements[focusableElements.length - 1].focus()
    }

    if (currentIndexOfActiveElement === focusableElements.length - 1 && !e.shiftKey) {
      e.preventDefault()
      focusableElements[0].focus()
    }
  }

  /**
   * Destroy method
   *
   * @author Milan Ricoul
   */
  destroy() {
    this.initialized = false
    const el = this._element
    const { closeButtonSelector, closedClassName, openedClassName } = this._settings

    el.classList.remove(closedClassName, openedClassName)
    el.removeAttribute('aria-hidden')

    if (closeButtonSelector) {
      el.querySelector(closeButtonSelector).removeEventListener('click', this.close)
    }

    document.querySelectorAll(`button[aria-controls="${this.id}"]`).forEach((btn) => {
      btn.removeEventListener('click', this.open)
    })

    this.enableAllFocusedElements()

    super.destroy()
  }

  /**
   * Remove attribute tabindex to focusable elements
   */
  enableAllFocusedElements() {
    const el = this._element

    for (const focusableElement of Array.from(el.querySelectorAll('[tabindex="-1"]'))) {
      focusableElement.removeAttribute('tabindex')
    }
  }

  /**
   * Set attribute tabindex="-1" to focusable elements
   */
  disableAllFocusedElements() {
    const el = this._element

    for (const focusableElement of Array.from(el.querySelectorAll(FOCUSABLE_ELEMENTS))) {
      focusableElement.setAttribute('tabindex', '-1')
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
  const el = this._element
  const { closedClassName, mediaQuery, openedClassName } = this._settings

  if (!mediaQuery && !this.initialized) {
    this.init()
  }

  if (mediaQuery && this.initialized && !mediaQuery.matches) {
    this.destroy()
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
 * Handle button click
 *
 * @param {MouseEvent} e click event handler
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function handleButtonClick(e) {
  this.triggerButton = e.currentTarget

  this.open()
}

/**
 * Handle keydown event
 *
 * @param {KeyboardEvent} e keydown event handler
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function handleKeydown(e) {
  switch (e.code) {
    case 'Tab':
      this.checkNextFocusableElement(e)
      break
    case 'Escape':
      if (this.isOpened && this._settings.closeOnEscapeKey) {
        this.close()
      }
  }
}

/**
 * Handle document click
 *
 * @param {MouseEvent} e click event handler
 *
 * @returns {void}
 *
 * @author Milan Ricoul
 */
function handleOutsideClick(e) {
  // If the modal is not open, do nothing
  if (!this.isOpened) {
    return
  }

  const { target } = e
  const { closeOnFocusOutside } = this._settings

  // If closeOnFocusOutside is a valid selector and it is an parent element of the clicked target
  // Or, if the modal element is an parent of the clicked target.
  if (
    (isSelectorValid(closeOnFocusOutside) && target.closest(closeOnFocusOutside)) ||
    (closeOnFocusOutside === true && target.closest(this._element))
  ) {
    return
  }

  this.close()
}

/**
 * Handle modal transition end
 */
function handleTransitionEnd() {
  const el = this._element

  el.querySelectorAll(FOCUSABLE_ELEMENTS).forEach((element) => {
    element.style.display = 'none'
  })

  el.removeEventListener('transitionend', this._handleTransitionEnd)
}

Modal.defaults = {
  closeButtonSelector: '.modal__close',
  closedClassName: 'modal--hidden',
  closeOnEscapeKey: true,
  closeOnFocusOutside: false,
  descriptionSelector: false,
  labelSelector: false,
  mediaQuery: null,
  openedClassName: 'modal--visible',
  onOpen: null,
  onClose: null,
  triggerSelector: false,
}

export default Modal
