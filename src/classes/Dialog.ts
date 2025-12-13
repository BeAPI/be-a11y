import AbstractDomElement from './AbstractDomElement.ts'
import { randomId } from '../utils.ts'

/**
 * @typedef {Object} DialogOptions
 * @property {string} closeButtonSelector - The selector for the close button.
 * @property {null|string} descriptionSelector - The selector for the description element.
 * @property {null|string} labelSelector - The selector for the label element.
 * @property {(e: MouseEvent) => any} onOpen - The callback function to execute when the dialog is opened.
 * @property {(e: MouseEvent) => any} onClose - The callback function to execute when the dialog is closed.
 * @property {boolean} showDialogAsModal - Whether to show the dialog as a dialog.
 * @property {null|string} triggerSelector - The selector for the trigger button.
 */
interface DialogOptions {
  closeButtonSelector: string
  descriptionSelector: null | string
  labelSelector: null | string
  onOpen: (e: MouseEvent) => any // eslint-disable-line no-unused-vars
  onClose: (e: MouseEvent) => any // eslint-disable-line no-unused-vars
  showDialogAsModal: boolean
  triggerSelector: null | string
}

/**
 * Represents a dialog component.
 *
 * @extends AbstractDomElement
 */
export default class Dialog extends AbstractDomElement {
  /**
   * Indicates whether the dialog component has been initialized.
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
   * The id of the dialog.
   *
   * @private
   * @type {string}
   */
  private id: string

  /**
   * Indicates whether the dialog is opened.
   *
   * @private
   * @type {boolean}
   */
  private isOpened: boolean

  /**
   * The button that triggered the dialog.
   *
   * @private
   * @type {null|HTMLElement}
   */
  private triggerButton: null | HTMLElement

  /**
   * Options for configuring the dialog component.
   *
   * @protected
   * @type {DialogOptions}
   */
  protected options: DialogOptions

  /**
   * Event handler for button click events.
   *
   * @private
   * @type {(e: MouseEvent) => void}
   */
  private handleButtonClick: (e: MouseEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Default options for the Dialog component.
   *
   * @private
   * @static
   * @readonly
   * @type {DialogOptions}
   */
  private static readonly defaults: DialogOptions = {
    closeButtonSelector: '.dialog__close',
    descriptionSelector: null,
    labelSelector: null,
    onOpen: () => {},
    onClose: () => {},
    showDialogAsModal: false,
    triggerSelector: null,
  }

  /**
   * Constructs a new Dialog instance.
   *
   * @param {HTMLDialogElement} element - The DOM node representing the dialog container.
   * @param {Partial<DialogOptions>} options - Options for configuring the dialog component.
   */
  constructor(element: HTMLDialogElement, options: Partial<DialogOptions> = {}) {
    const mergedOptions: DialogOptions = {
      ...Dialog.defaults,
      ...options,
    }

    super(element, mergedOptions)

    if (!this.isNewInstance()) {
      return this
    }

    this.initialized = false
    this.isOpened = false
    this.triggerButton = null
    this.handleButtonClick = this._handleButtonClick.bind(this)

    this.init()
  }

  /**
   * Initializes the Dialog component.
   *
   * @private
   * @returns {void}
   */
  private init(): void {
    this.initialized = true
    const el = this.element
    const { closeButtonSelector, descriptionSelector, labelSelector, showDialogAsModal, triggerSelector } = this.options

    // If showDialogAsModal is true and the dialog does not have the aria-modal attribute, set it to true
    if (showDialogAsModal && !el.hasAttribute('aria-modal')) {
      el.setAttribute('aria-modal', 'true')
    }

    // Set id
    if (el.id) {
      this.id = el.id
    } else {
      this.id = `dialog-${randomId()}`

      el.id = this.id
    }

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
  }

  /**
   * Destroys the Dialog component, removing event listeners and cleaning up.
   *
   * @param {HTMLElement | NodeList | string} element - The element or elements to destroy.
   * @returns {void}
   */
  static destroy(element: HTMLElement | NodeList | string): void {
    const instance = AbstractDomElement.getInstance(element) as Dialog | undefined

    if (instance) {
      const {
        element,
        options: { closeButtonSelector },
        id,
        open,
        close,
      } = instance

      instance.initialized = false

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
   * Opens the dialog.
   *
   * @returns {void}
   */
  open() {
    this.isOpened = true

    const el = this.element as HTMLDialogElement

    if (this.options.showDialogAsModal) {
      el.showModal()
      return
    }

    el.show()
  }

  /**
   * Closes the dialog.
   *
   * @returns {void}
   */
  close() {
    this.isOpened = false

    const el = this.element as HTMLDialogElement

    el.close()
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
}
