import AbstractDomElement from './AbstractDomElement.js'
import { ThrottledEvent } from 'oneloop.js'
import { randomId } from '../utils/helpers.js'
import isSelectorValid from '../utils/isValidSelector.js'

const FOCUSABLE_ELEMENTS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

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
    const el = this._element
    const { closeButtonSelector, closeOnFocusOutside, descriptionSelector, labelSelector, triggerSelector } =
      this._settings

    // Set id
    if (el.id) {
      this.id = el.id
    } else {
      this.id = `modal-${randomId()}`

      el.id = this.id
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

    const el = this._element
    el.removeAttribute('aria-hidden')
    el.querySelectorAll(FOCUSABLE_ELEMENTS)[0].focus()

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
    this._element.style.display = 'none'
    this.isOpened = false

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
    const el = this._element
    const { closeButtonSelector } = this._settings

    el.removeAttribute('aria-hidden')

    if (closeButtonSelector) {
      el.querySelector(closeButtonSelector).removeEventListener('click', this.close)
    }

    document.querySelectorAll(`button[aria-controls="${this.id}"]`).forEach((btn) => {
      btn.removeEventListener('click', this.open)
    })

    super.destroy()
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
  const { mediaQuery } = this._settings

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
      if (this.isOpened) {
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

Modal.defaults = {
  closeButtonSelector: '.modal__close',
  closeOnFocusOutside: false,
  descriptionSelector: false,
  labelSelector: false,
  mediaQuery: null,
  onOpen: null,
  onClose: null,
  triggerSelector: false,
}

export default Modal
