import { ThrottledEvent } from 'oneloop.js'
import AbstractDomElement from './AbstractDomElement.ts'
import { randomId } from '../utils.ts'

interface DropdownOptions {
  defaultSelection: boolean | string
  buttonSelector: string
  labelSelector: string
  listClassName: string
  listSelector: string
  mediaQuery: MediaQueryList | null
  onChange: () => any // eslint-disable-line no-unused-vars
  onClose: () => any // eslint-disable-line no-unused-vars
  onListItemClick: () => any // eslint-disable-line no-unused-vars
  onOpen: () => any // eslint-disable-line no-unused-vars
  nonSelectedItemLabel: string
  prefixId: string
  closeOnBlur: boolean
}

/**
 * Represents a Dropdown component.
 *
 * @extends AbstractDomElement
 */
export default class Dropdown extends AbstractDomElement {
  /**
   * The unique identifier of the component.
   * @type {string}
   * @private
   */
  private id: string

  /**
   * Indicates whether the component is currently opened.
   * @type {boolean}
   * @private
   */
  private opened: boolean

  /**
   * Indicates whether the component is currently active.
   * @type {boolean}
   * @private
   */
  private active: boolean

  /**
   * The button element associated with the component.
   * @type {HTMLButtonElement | null}
   * @private
   */
  private button: HTMLButtonElement | null

  /**
   * The currently focused element within the component.
   * @type {HTMLElement | null}
   * @private
   */
  private focusedElement: HTMLElement | null

  /**
   * The label element associated with the component.
   * @type {HTMLElement | null}
   * @private
   */
  private label: HTMLElement | null

  /**
   * The list element associated with the component.
   * @type {HTMLUListElement | null}
   * @private
   */
  private list: HTMLUListElement | null

  /**
   * The list items within the component.
   * @type {NodeListOf<HTMLLIElement>}
   * @private
   */
  private listItems: NodeListOf<HTMLLIElement> // eslint-disable-line no-undef

  /**
   * Options for configuring the dropdown component.
   *
   * @protected
   * @type {DropdownOptions}
   */
  protected options: DropdownOptions

  /**
   * Focuses the previous element. If not previous element, focus the last element.
   *
   * @private
   * @type {() => void}
   */
  private focusPreviousElement: () => void

  /**
   * Focuses the next element. If not next element, focus the first element.
   *
   * @private
   * @type {() => void}
   */
  private focusNextElement: () => void

  /**
   * Focuses the first element.
   *
   * @private
   * @type {() => void}
   */
  private focusFirstElement: () => void

  /**
   * Focuses the last element.
   *
   * @private
   * @type {() => void}
   */
  private focusLastElement: () => void

  /**
   * Event handler for keydown events.
   *
   * @private
   * @type {(e: KeyboardEvent) => void}
   */
  private handleKeydown: (e: KeyboardEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for button click events.
   *
   * @private
   * @type {(e: MouseEvent) => void}
   */
  private handleButtonClick: (e: MouseEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for list item click events.
   *
   * @private
   * @type {(e: MouseEvent) => void}
   */
  private handleListItemClick: (e: MouseEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for outside element click events.
   *
   * @private
   * @type {(e: MouseEvent) => void}
   */
  private handleOutsideElementClick: (e: MouseEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for button blur events.
   *
   * @private
   * @type {(e: FocusEvent) => void}
   */
  private handleButtonBlur: (e: FocusEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Event handler for resize events.
   *
   * @private
   * @type {() => void}
   */
  private handleResize: () => void

  /**
   * Default options for the Dropdown component.
   *
   * @private
   * @static
   * @readonly
   * @type {DropdownOptions}
   */
  private static readonly defaults: DropdownOptions = {
    defaultSelection: false,
    buttonSelector: 'button',
    labelSelector: '.dropdown__label',
    listClassName: 'dropdown__list',
    listSelector: 'ul',
    mediaQuery: null,
    onChange: () => {},
    onClose: () => {},
    onListItemClick: () => {},
    onOpen: () => {},
    nonSelectedItemLabel: 'No item selected',
    prefixId: 'dropdown',
    closeOnBlur: false,
  }

  /**
   * Constructs a new Dropdown instance.
   *
   * @param {HTMLElement} element - The DOM node representing the Dropdown container.
   * @param {Partial<DropdownOptions>} options - Options for configuring the Dropdown component.
   */
  constructor(element: HTMLElement, options: Partial<DropdownOptions> = {}) {
    const mergedOptions: DropdownOptions = {
      ...Dropdown.defaults,
      ...options,
    }

    super(element, mergedOptions)

    if (!this.isNewInstance()) {
      return this
    }

    this.id = randomId('dropdown')
    this.opened = false
    this.active = false
    this.button = null
    this.focusedElement = null
    this.label = null

    this.focusPreviousElement = this._focusPreviousElement.bind(this)
    this.focusNextElement = this._focusNextElement.bind(this)
    this.focusFirstElement = this._focusFirstElement.bind(this)
    this.focusLastElement = this._focusLastElement.bind(this)
    this.handleKeydown = this._handleKeydown.bind(this)
    this.handleButtonClick = this._handleButtonClick.bind(this)
    this.handleListItemClick = this._handleListItemClick.bind(this)
    this.handleButtonBlur = this._handleButtonBlur.bind(this)
    this.handleOutsideElementClick = this._handleOutsideElementClick.bind(this)
    this.handleResize = this._handleResize.bind(this)
    new ThrottledEvent(window, 'resize').add('resize', this.handleResize)
    this.handleResize()
  }

  /**
   * Initializes the Dropdown component.
   *
   * @private
   * @returns {void}
   */
  private init(): void {
    this.active = true

    const el = this.element
    const { closeOnBlur, defaultSelection, buttonSelector, labelSelector, listClassName, listSelector } = this.options
    const buttonId = `${this.id}-button`
    const labelId = `${this.id}-label`

    if (el.querySelector(buttonSelector)) {
      this.button = el.querySelector(buttonSelector)
    } else if (this.focusedElement) {
      this.button = document.createElement('button')
      this.button.type = 'button'
      this.button.setAttribute('aria-haspopup', 'listbox')
      this.button.innerHTML = this.focusedElement.innerHTML

      el.prepend(this.button)
    }

    // Label selector
    if (el.querySelector(labelSelector)) {
      this.label = el.querySelector(labelSelector)
    } else if (this.focusedElement) {
      this.label = document.createElement('span')
      this.label.classList.add(labelSelector.replace('.', ''))
      this.label.innerHTML = this.focusedElement.innerHTML

      el.prepend(this.label)
    }

    if (!this.button || !this.label) {
      return
    }

    this.list = el.querySelector(listSelector)
    this.listItems = el.querySelectorAll('li')

    if (!this.list) {
      return
    }

    this.button.id = buttonId
    this.label.id = labelId
    this.button.setAttribute('aria-labelledby', `${labelId} ${buttonId}`)
    this.list.setAttribute('aria-labelledby', `${labelId}`)
    this.list.setAttribute('tabindex', '-1')
    this.list.setAttribute('role', 'listbox')

    if (listClassName) {
      this.list.classList.add(listClassName)
    }

    let i = 0
    for (const listItem of this.listItems) {
      listItem.setAttribute('role', 'option')
      listItem.id = `${this.id}-item-${i + 1}`
      listItem.addEventListener('click', this.handleListItemClick)
      i++
    }

    if (defaultSelection) {
      // if defaultSelection === true, select first item
      if (typeof defaultSelection === 'boolean') {
        this.updateFocusedListItem(this.listItems[0])
      }

      // if defaultSelection === string, check if element exists and select it
      if (typeof defaultSelection === 'string') {
        const automaticElement = el.querySelector(defaultSelection) as HTMLElement

        if (automaticElement) {
          this.updateFocusedListItem(automaticElement)
        }
      }
    }

    if (closeOnBlur) {
      this.button.addEventListener('blur', this.handleButtonBlur)
    }

    this.button.addEventListener('click', this.handleButtonClick)
    document.addEventListener('click', this.handleOutsideElementClick)
    document.addEventListener('keydown', this.handleKeydown)
  }

  /**
   * Destroys the Dropdown component.
   *
   * @param {HTMLElement | NodeList | string} element - The element or selector to destroy the dropdown on.
   * @returns {void}
   */
  static destroy(element: HTMLElement | NodeList | string): void {
    const instance = AbstractDomElement.getInstance(element) as Dropdown | undefined

    if (instance) {
      const {
        active,
        element,
        options: { buttonSelector, labelSelector, listClassName, listSelector },
      } = instance

      if (!active) {
        instance.button = element.querySelector(buttonSelector)
        instance.label = element.querySelector(labelSelector)
        instance.list = element.querySelector(listSelector)
        instance.listItems = element.querySelectorAll('li')

        instance.updateFocusedListItem(instance.listItems[0])

        if (instance.button) {
          instance.button.remove()
        }

        if (instance.label) {
          instance.label.remove()
        }

        if (instance.list) {
          instance.list.classList.remove(listClassName)
          instance.list.removeAttribute('tabindex')
          instance.list.removeAttribute('role')
          instance.list.removeAttribute('aria-activedescendant')
        }

        for (const listItem of instance.listItems) {
          listItem.removeAttribute('role')
          listItem.removeAttribute('aria-selected')
        }
      }

      instance.active = false

      if (instance.button) {
        instance.button.remove()
      }

      if (instance.label) {
        instance.label.remove()
      }

      if (instance.list) {
        instance.list.classList.remove(listClassName)
        instance.list.removeAttribute('tabindex')
        instance.list.removeAttribute('role')
      }

      for (const listItem of instance.listItems) {
        listItem.removeAttribute('role')
      }
    }

    AbstractDomElement.destroy(element)
  }

  /**
   * Adds a new item to the list.
   *
   * @param {HTMLElement} listItem - The list item to be added.
   * @returns {void}
   */
  addItem(listItem: HTMLLIElement): void {
    const el = this.element
    listItem.role = 'option'
    listItem.id = `${this.id}-item-${this.listItems.length + 1}`
    listItem.addEventListener('click', this.handleListItemClick)

    this.list?.appendChild(listItem)
    this.listItems = el.querySelectorAll('li')

    if (this.button?.hasAttribute('hidden')) {
      this.button.removeAttribute('hidden')
    }
  }

  /**
   * Removes a specific item from the list.
   *
   * @param {HTMLElement} listItem - The list item to be removed.
   * @returns {void}
   */
  removeItem(listItem: HTMLLIElement): void {
    if (typeof listItem === 'undefined') {
      this.removeAllItems()
      return
    }

    const el = this.element

    if (listItem === this.focusedElement && this.button) {
      this.button.innerText = this.options.nonSelectedItemLabel
      this.focusedElement = null
    }

    listItem.remove()
    this.listItems = el.querySelectorAll('li')
  }

  /**
   * Removes all items from the list.
   *
   * @returns {void}
   */
  removeAllItems() {
    this.listItems.forEach((listItem) => {
      listItem.remove()
    })
    this.listItems = this.element.querySelectorAll('li')
    this.button?.setAttribute('hidden', 'hidden')
  }

  /**
   * Opens the dropdown.
   *
   * @returns {void}
   */
  open(): void {
    if (!this.button) {
      return
    }

    this.opened = true

    const el = this.element
    const { onOpen } = this.options

    this.button.setAttribute('aria-expanded', 'true')

    if (el.querySelectorAll('li[aria-selected="true"]').length === 1) {
      const selectedListItem = el.querySelector('li[aria-selected="true"]') as HTMLElement

      if (selectedListItem) {
        this.updateFocusedListItem(selectedListItem)
      }
    } else {
      this.focusedElement = el.querySelector('li:first-child')

      if (this.focusedElement) {
        this.focusedElement.setAttribute('aria-selected', 'true')
      }
    }

    if (onOpen) {
      onOpen.bind(this)()
    }
  }

  /**
   * Closes the dropdown.
   *
   * @returns {void}
   */
  close(): void {
    if (!this.button) {
      return
    }

    this.opened = false

    const { onClose } = this.options

    this.button.removeAttribute('aria-expanded')

    if (onClose) {
      onClose.bind(this)()
    }
  }

  /**
   * Updates the focused list item.
   *
   * @private
   * @param {HTMLElement} listItem - The list item to focus.
   * @returns {void}
   */
  private updateFocusedListItem(listItem: HTMLElement): void {
    if (!this.button || !this.list) {
      return
    }

    const { onChange } = this.options

    if (this.focusedElement) {
      this.focusedElement.removeAttribute('aria-selected')
    }

    this.focusedElement = listItem
    this.focusedElement.setAttribute('aria-selected', 'true')
    this.list.setAttribute('aria-activedescendant', this.focusedElement.id)
    this.button.innerHTML = this.focusedElement.innerHTML

    if (this.list.scrollHeight > this.list.clientHeight) {
      const scrollBottom = this.list.clientHeight + this.list.scrollTop
      const elementBottom = this.focusedElement.offsetTop + this.focusedElement.offsetHeight

      if (elementBottom > scrollBottom) {
        this.list.scrollTop = elementBottom - this.list.clientHeight
      } else if (this.focusedElement.offsetTop < this.list.scrollTop) {
        this.list.scrollTop = this.focusedElement.offsetTop
      }
    }

    if (onChange) {
      onChange.bind(this)()
    }
  }

  /**
   * Focuses the previous element.
   *
   * @private
   * @returns {void}
   */
  private _focusPreviousElement(): void {
    if (this.focusedElement) {
      const previousElementSibling = this.focusedElement.previousElementSibling as HTMLElement

      if (previousElementSibling) {
        this.updateFocusedListItem(previousElementSibling)
      }
    }
  }

  /**
   * Focuses the next element.
   *
   * @private
   * @returns {void}
   */
  private _focusNextElement(): void {
    if (this.focusedElement) {
      const nextElementSibling = this.focusedElement.nextElementSibling as HTMLElement

      if (nextElementSibling) {
        this.updateFocusedListItem(nextElementSibling)
      }
    }
  }

  /**
   * Focuses the first element.
   *
   * @private
   * @returns {void}
   */
  private _focusFirstElement(): void {
    this.updateFocusedListItem(this.listItems[0])
  }

  /**
   * Focuses the last element.
   *
   * @private
   * @returns {void}
   */
  private _focusLastElement(): void {
    this.updateFocusedListItem(this.listItems[this.listItems.length - 1])
  }

  /**
   * Handles the keydown event.
   *
   * @private
   * @param {KeyboardEvent} e - The keyboard event.
   * @returns {void}
   */
  private _handleKeydown(e: KeyboardEvent): void {
    const activeElement = document.activeElement

    if (activeElement !== this.button && !this.opened) {
      return
    }

    switch (e.code) {
      case 'Enter':
        if (activeElement === this.button && !this.opened) {
          e.preventDefault()
          this.open()
        }
        break
      case 'Escape':
        if (this.opened) {
          e.preventDefault()
          this.close()
        }
        break
      case 'ArrowDown':
        e.preventDefault()

        if (activeElement === this.button && !this.opened) {
          this.open()
        } else {
          this.focusNextElement()
        }

        break
      case 'ArrowUp':
        e.preventDefault()

        if (activeElement === this.button && !this.opened) {
          this.open()
        } else {
          this.focusPreviousElement()
        }

        break
      case 'Home':
        e.preventDefault()
        this.focusFirstElement()
        break
      case 'End':
        e.preventDefault()
        this.focusLastElement()
        break
    }
  }

  /**
   * Handles the button click event.
   *
   * @private
   * @returns {void}
   */
  private _handleButtonClick(): void {
    this.opened ? this.close() : this.open()
  }

  /**
   * Handles the list item click event.
   *
   * @private
   * @param {MouseEvent} e - The mouse event.
   * @returns {void}
   */
  private _handleListItemClick(e: MouseEvent): void {
    const target = e.currentTarget as HTMLElement

    if (!target) {
      return
    }

    const { onListItemClick } = this.options

    if (onListItemClick) {
      onListItemClick.bind(this)()
    }

    this.updateFocusedListItem(target)
    this.close()
  }

  /**
   * Handles the outside element click event.
   *
   * @private
   * @param {MouseEvent} e - The mouse event.
   * @returns {void}
   */
  private _handleOutsideElementClick(e: MouseEvent): void {
    const target = e.target as HTMLElement
    if (target && this.opened && !this.element.contains(target)) {
      this.close()
    }
  }

  /**
   * Handles the resize event.
   *
   * @private
   * @returns {void}
   */
  private _handleResize(): void {
    const { mediaQuery } = this.options

    if (!this.active && ((mediaQuery && mediaQuery.matches) || !mediaQuery)) {
      this.init()

      return
    }

    if (this.active && mediaQuery && !mediaQuery.matches) {
      Dropdown.destroy(this.element)
    }
  }

  /**
   * Handles the button blur event.
   *
   * @private
   * @param e - The focus event.
   * @returns {void}
   */
  private _handleButtonBlur(e: FocusEvent): void {
    if (!this.opened) {
      return
    }

    this.close()
  }
}
