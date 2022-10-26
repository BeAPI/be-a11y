import AbstractDomElement from './AbstractDomElement.js'

/**
 * Modal Class
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
    this.close = this.close.bind(this)
    this.open = this.open.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)

    if (onOpen) {
      this._onOpen = onOpen.bind(this)
    }

    if (onClose) {
      this._onClose = onClose.bind(this)
    }

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

    // Set id
    if (el.id) {
      this.id = el.id
    } else {
      this.id = this.defineId()

      el.id = this.id
    }

    // Set aria-labelledby attribute
    if (s.labelSelector && el.querySelector(s.labelSelector)) {
      el.setAttribute('aria-labelledby', `${this.id}-label`)
      el.querySelector(s.labelSelector).id = `${this.id}-label`
    }

    // Set aria-describedby attribute
    if (s.descriptionSelector && el.querySelector(s.descriptionSelector)) {
      el.setAttribute('aria-describedby', `${this.id}-description`)
      el.querySelector(s.descriptionSelector).id = `${this.id}-description`
    }

    // Set aria-controls attribute to close button
    if (s.closeButtonSelector) {
      const closeButton = el.querySelector(s.closeButtonSelector)
      closeButton.setAttribute('aria-controls', this.id)
      closeButton.addEventListener('click', this.close)
    }

    document.querySelectorAll(`button[data-modal="${this.id}"]`).forEach((btn) => {
      btn.addEventListener('click', this.handleButtonClick)
    })

    window.addEventListener('keydown', this.handleKeydown)
  }

  /**
   * Set id to the modal dialog
   * @returns {String}
   * @author Milan Ricoul
   */
  defineId() {
    const s = this._settings
    let i = 1

    while (document.getElementById(`${s.prefixId}-${i}`)) {
      i++
    }

    return `${s.prefixId}-${i}`
  }

  /**
   * Handle button click
   * @param {MouseEvent} e click event handler
   * @returns {Void}
   * @author Milan Ricoul
   */
  handleButtonClick(e) {
    this.triggerButton = e.currentTarget

    this.open()
  }

  /**
   * Open modal
   * @returns {Void}
   * @author Milan Ricoul
   */
  open() {
    const el = this._element
    el.style.display = 'block'
    el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')[0].focus()
    this.isOpened = true

    if (this._onOpen) {
      this._onOpen()
    }
  }

  /**
   * Close modal
   * @returns {Void}
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
  }

  /**
   * Handle keydown event
   * @param {KeyboardEvent} e keydown event handler
   * @returns {Void}
   * @author Milan Ricoul
   */
  handleKeydown(e) {
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
   * Check if the next focusable element in dialog exists, else focus the first focusable element in dialog
   * @param {KeyboardEvent} e keyboard event handler
   * @returns {Void}
   * @author Milan Ricoul
   */
  checkNextFocusableElement(e) {
    const el = this._element
    const focusableElements = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
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
   * @author Milan Ricoul
   */
  destroy() {
    const el = this._element
    const s = this._settings

    if (s.closeButtonSelector) {
      el.querySelector(s.closeButtonSelector).removeEventListener('click', this.close)
    }

    document.querySelectorAll(`button[aria-controls="${this.id}"]`).forEach((btn) => {
      btn.removeEventListener('click', this.open)
    })
  }
}

Modal.defaults = {
  prefixId: 'dialog',
  labelSelector: false,
  descriptionSelector: false,
  closeButtonSelector: false,
  onOpen: null,
  onClose: null,
}

export default Modal
