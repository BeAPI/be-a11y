import { randomId } from '../utils/helpers.js'
import AbstractDomElement from './AbstractDomElement.js'
import { ThrottledEvent } from 'oneloop.js'

/**
 * Dropdown Class
 * @author Milan Ricoul
 */
class Dropdown extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    const { mediaQuery } = this._settings

    this.id = randomId('dropdown')
    this.opened = false
    this.active = false
    this.focusedElement = null
    this._onResize = onResize.bind(this)
    this._handleKeydown = handleKeydown.bind(this)
    this._handleButtonClick = handleButtonClick.bind(this)
    this._handleListItemClick = handleListItemClick.bind(this)
    this._handleOutsideElementClick = handleOutsideElementClick.bind(this)
    this._focusPreviousElement = focusPreviousElement.bind(this)
    this._focusNextElement = focusNextElement.bind(this)
    this._focusFirstElement = focusFirstElement.bind(this)
    this._focusLastElement = focusLastElement.bind(this)
    this._resize = new ThrottledEvent(window, 'resize')
    this._resize.add('resize', this._onResize)

    if (Boolean(mediaQuery && mediaQuery.matches) || !mediaQuery) {
      this.init()
      return
    }

    this.destroy()
  }

  /**
   * Initialization
   *
   * @author Milan Ricoul
   *
   * @returns {Object}
   */
  init() {
    this.active = true

    const el = this._element
    const { automaticSelection, buttonSelector, labelSelector, listClassName, listSelector } = this._settings
    const buttonId = `${this.id}-button`
    const labelId = `${this.id}-label`

    // Button selector
    if (el.querySelector(buttonSelector)) {
      this.button = el.querySelector(buttonSelector)
    } else {
      this.button = document.createElement('button')
      this.button.type = 'button'
      this.button.setAttribute('aria-haspopup', 'listbox')
      this.button.innerHTML = this.focusedElement.innerHTML

      el.prepend(this.button)
    }

    // Label selector
    if (el.querySelector(labelSelector)) {
      this.label = el.querySelector(labelSelector)
    } else {
      this.label = document.createElement('span')
      this.label.classList.add(labelSelector.replace('.', ''))
      this.label.innerHTML = this.focusedElement.innerHTML

      el.prepend(this.label)
    }

    this.list = el.querySelector(listSelector)
    this.listItems = el.querySelectorAll('li')

    this.button.id = buttonId
    this.label.id = labelId
    this.button.setAttribute('aria-labelledby', `${labelId} ${buttonId}`)
    this.list.setAttribute('aria-labelledby', `${labelId}`)
    this.list.setAttribute('tabindex', '-1')
    this.list.setAttribute('role', 'listbox')

    if (listClassName) {
      this.list.classList.add(listClassName)
    }

    this.listItems.forEach((listItem, index) => {
      listItem.setAttribute('role', 'option')
      listItem.id = `${this.id}-item-${index + 1}`
      listItem.addEventListener('click', this._handleListItemClick)
    })

    if (automaticSelection) {
      // if automaticSelection === true, select first item
      if (typeof automaticSelection === 'boolean') {
        this.updateFocusedListItem(this.listItems[0])
      }

      // if automaticSelection === string, check if element exists and select it
      if (typeof automaticSelection === 'string' && el.querySelector(automaticSelection)) {
        this.updateFocusedListItem(el.querySelector(automaticSelection))
      }
    }

    this.button.addEventListener('click', this._handleButtonClick)
    document.addEventListener('click', this._handleOutsideElementClick)
    document.addEventListener('keydown', this._handleKeydown)

    return this
  }

  /**
   * Destroy
   *
   * @author Milan Ricoul
   *
   * @returns {Object}
   */
  destroy() {
    const { buttonSelector, labelSelector, listClassName, listSelector } = this._settings

    if (!this.active) {
      const el = this._element

      this.button = el.querySelector(buttonSelector)
      this.label = el.querySelector(labelSelector)
      this.list = el.querySelector(listSelector)
      this.listItems = el.querySelectorAll('li')

      this.updateFocusedListItem(this.listItems[0])

      this.button.remove()
      this.label.remove()
      this.list.classList.remove(listClassName)
      this.list.removeAttribute('tabindex')
      this.list.removeAttribute('role')
      this.list.removeAttribute('aria-activedescendant')
      this.listItems.forEach((listItem) => {
        listItem.removeAttribute('role')
        listItem.removeAttribute('aria-selected')
      })

      return this
    }

    this.active = false

    this.button.remove()
    this.label.remove()
    this.list.classList.remove(this._settings.listClassName)
    this.list.removeAttribute('tabindex')
    this.list.removeAttribute('role')
    this.listItems.forEach((listItem) => {
      listItem.removeAttribute('role')
    })

    return this
  }

  /**
   * Adds a new item to the list.
   *
   * @param {HTMLElement} listItem - The list item to be added.
   * @returns {void}
   */
  addItem(listItem) {
    const el = this._element
    listItem.role = 'option'
    listItem.id = `${this.id}-item-${this.listItems.length + 1}`
    listItem.addEventListener('click', this._handleListItemClick)

    this.list.appendChild(listItem)
    this.listItems = el.querySelectorAll('li')

    if (this.button.hasAttribute('hidden')) {
      this.button.removeAttribute('hidden')
    }
  }

  /**
   * Removes a specific item from the list.
   *
   * @param {HTMLElement} listItem - The list item to be removed.
   * @returns {void}
   */
  removeItem(listItem) {
    const el = this._element

    if (listItem === this.focusedElement) {
      this.button.innerText = this._settings.nonSelectedItemLabel
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
    this.listItems = this._element.querySelectorAll('li')
    this.button.setAttribute('hidden', 'hidden')
  }

  /**
   * Check if media query matches
   *
   * @author Milan Ricoul
   */
  refresh() {
    const { mediaQuery } = this._settings

    if (!this.active && ((mediaQuery && mediaQuery.matches) || !mediaQuery)) {
      this.init()
    } else if (this.active && mediaQuery && !mediaQuery.matches) {
      this.destroy()
    }
  }

  /**
   * Open dropdown
   *
   * @author Milan Ricoul
   *
   * @returns {void}
   */
  open() {
    this.opened = true

    const el = this._element
    const { onOpen } = this._settings

    this.button.setAttribute('aria-expanded', 'true')

    const nodeListSelectedItems = el.querySelectorAll('li[aria-selected="true"]')

    if (nodeListSelectedItems.length === 1) {
      this.updateFocusedListItem(el.querySelector('li[aria-selected="true"]'))
    }

    if (onOpen) {
      onOpen.bind(this)()
    }
  }

  /**
   * Close dropdown
   *
   * @author Milan Ricoul
   *
   * @returns {void}
   */
  close() {
    this.opened = false

    const { onClose } = this._settings

    this.button.removeAttribute('aria-expanded')

    if (onClose) {
      onClose.bind(this)()
    }
  }

  /**
   * Update dropdown value
   *
   * @author Milan Ricoul
   *
   * @param {HTMLElement} listItem new list item
   */
  updateFocusedListItem(listItem) {
    const { onChange } = this._settings

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
}

/**
 * Handle button click on dropdown button
 *
 * @author Milan Ricoul
 */
function handleButtonClick() {
  this.opened ? this.close() : this.open()
}

/**
 * Handle list items click
 *
 * @author Milan Ricoul
 *
 * @param {MouseEvent} e mouse event handler
 */
function handleListItemClick(e) {
  const { onListItemClick } = this._settings

  if (onListItemClick) {
    onListItemClick.bind(this)()
  }

  this.updateFocusedListItem(e.currentTarget)
  this.close()
}

/**
 * Handle keyboard keydown
 *
 * @author Milan Ricoul
 *
 * @param {KeyboardEvent} e Keyboard keydown event
 *
 * @returns {void}
 */
function handleKeydown(e) {
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
        this.close(this.id)
      }
      break
    case 'ArrowDown':
      e.preventDefault()

      if (activeElement === this.button && !this.opened) {
        this.open()
      } else {
        this._focusNextElement()
      }

      break
    case 'ArrowUp':
      e.preventDefault()

      if (activeElement === this.button && !this.opened) {
        this.open()
      } else {
        this._focusPreviousElement()
      }

      break
    case 'Home':
      e.preventDefault()
      this._focusFirstElement()
      break
    case 'End':
      e.preventDefault()
      this._focusLastElement()
      break
  }
}

/**
 * Focus previous list item
 *
 * @author Milan Ricoul
 */
function focusPreviousElement() {
  if (this.focusedElement && this.focusedElement.previousElementSibling) {
    this.updateFocusedListItem(this.focusedElement.previousElementSibling)

    return
  }

  if (this.focusedElement) {
    this.updateFocusedListItem(this.focusedElement)
  }
}

/**
 * Focus next list item
 *
 * @author Milan Ricoul
 */
function focusNextElement() {
  const el = this._element

  if (!this.focusedElement) {
    const nodeListItems = el.querySelectorAll('li')
    const nodeListSelectedItems = el.querySelectorAll('li[aria-selected="true"]')

    if (nodeListSelectedItems.length === 0 && nodeListItems.length >= 1) {
      this.updateFocusedListItem(el.querySelector('li:first-child'))
    }

    return
  }

  if (this.focusedElement && this.focusedElement.nextElementSibling) {
    this.updateFocusedListItem(this.focusedElement.nextElementSibling)

    return
  }

  if (this.focusedElement) {
    this.updateFocusedListItem(this.focusedElement)
  }
}

/**
 * Focus first list item
 *
 * @author Milan Ricoul
 */
function focusFirstElement() {
  this.updateFocusedListItem(this.listItems[0])
}

/**
 * Focus last list item
 *
 * @author Milan Ricoul
 */
function focusLastElement() {
  this.updateFocusedListItem(this.listItems[this.listItems.length - 1])
}

/**
 * Close dropdown if click outside the dropdown
 *
 * @author Milan Ricoul
 *
 * @param {MouseEvent} e mouse event handler
 *
 * @returns {void}
 */
function handleOutsideElementClick(e) {
  if (this.opened && !this._element.contains(e.target)) {
    this.close(this.id)
  }
}

/**
 * On screen resize
 *
 * @author Milan Ricoul
 */
function onResize() {
  this.refresh()
}

Dropdown.defaults = {
  automaticSelection: false,
  buttonSelector: 'button',
  labelSelector: '.dropdown__label',
  listClassName: 'dropdown__list',
  listSelector: 'ul',
  mediaQuery: null,
  onChange: null,
  onClose: null,
  onListItemClick: null,
  onOpen: null,
  nonSelectedItemLabel: 'No item selected',
  prefixId: 'dropdown',
}

export default Dropdown
