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

    this.opened = false
    this.active = false
    this.focusedElement = null
    this._onResize = onResize.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleListItemClick = this.handleListItemClick.bind(this)
    this.detectClickOutsideElement = this.detectClickOutsideElement.bind(this)
    this._resize = new ThrottledEvent(window, 'resize')
    this._resize.add('resize', this._onResize)
    this._defineId = defineId.bind(this)

    if (Boolean(mediaQuery && mediaQuery.matches) || !mediaQuery) {
      this.init()
    } else {
      this.destroy()
    }
  }

  /**
   * Initialization
   * @author Milan Ricoul
   * @returns {Object}
   */
  init() {
    this.active = true

    const el = this._element
    const { automaticSelection, buttonSelector, labelSelector, listClassName, listSelector } = this._settings
    const buttonId = `${this._defineId()}-button`
    const labelId = `${this._defineId()}-label`

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
      listItem.id = `${this._defineId()}-item-${index + 1}`
      listItem.addEventListener('click', this.handleListItemClick)
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

    this.button.addEventListener('click', this.handleButtonClick)
    document.addEventListener('click', this.detectClickOutsideElement)
    document.addEventListener('keydown', this.handleKeydown)

    return this
  }

  /**
   * Destroy
   * @author Milan Ricoul
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
   * Check if media query matches
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
   * Handle button click on dropdown button
   * @author Milan Ricoul
   */
  handleButtonClick() {
    this.opened ? this.close() : this.open()
  }

  /**
   * Handle list items click
   * @author Milan Ricoul
   * @param {MouseEvent} e mouse event handler
   */
  handleListItemClick(e) {
    const { onListItemClick } = this._settings

    if (onListItemClick) {
      onListItemClick.bind(this)()
    }

    this.updateFocusedListItem(e.currentTarget)
    this.close()
  }

  /**
   * Open dropdown
   * @author Milan Ricoul
   * @returns {Void}
   */
  open() {
    this.opened = true

    const el = this._element
    const { onOpen } = this._settings

    this.button.setAttribute('aria-expanded', 'true')

    if (el.querySelectorAll('li[aria-selected="true"]').length === 1) {
      this.updateFocusedListItem(el.querySelector('li[aria-selected="true"]'))
    } else {
      this.focusedElement = el.querySelector('li:first-child')
      this.focusedElement.setAttribute('aria-selected', 'true')
    }

    if (onOpen) {
      onOpen.bind(this)()
    }
  }

  /**
   * Close dropdown
   * @author Milan Ricoul
   * @returns {Void}
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
   * Close dropdown if click outside the dropdown
   * @author Milan Ricoul
   * @param {MouseEvent} e mouse event handler
   * @returns {void}
   */
  detectClickOutsideElement(e) {
    if (this.opened && !this._element.contains(e.target)) {
      this.close(this.id)
    }
  }

  /**
   * Focus previous list item
   * @author Milan Ricoul
   */
  focusPreviousElement() {
    if (this.focusedElement && this.focusedElement.previousElementSibling) {
      this.updateFocusedListItem(this.focusedElement.previousElementSibling)
    }
  }

  /**
   * Focus next list item
   * @author Milan Ricoul
   */
  focusNextElement() {
    if (this.focusedElement && this.focusedElement.nextElementSibling) {
      this.updateFocusedListItem(this.focusedElement.nextElementSibling)
    }
  }

  /**
   * Focus first list item
   * @author Milan Ricoul
   */
  focusFirstElement() {
    this.updateFocusedListItem(this.listItems[0])
  }

  /**
   * Focus last list item
   * @author Milan Ricoul
   */
  focusLastElement() {
    this.updateFocusedListItem(this.listItems[this.listItems.length - 1])
  }

  /**
   * Update dropdown value
   * @author Milan Ricoul
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

  /**
   * Handle keyboard keydown
   * @author Milan Ricoul
   * @param {KeyboardEvent} e Keyboard keydown event
   * @returns {void}
   */
  handleKeydown(e) {
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
}

/**
 * On screen resize
 *
 * @author Milan Ricoul
 */
function onResize() {
  this.refresh()
}

/**
 * Set id to the modal dialog
 *
 * @author Milan Ricoul
 *
 * @returns {string}
 */
function defineId() {
  const { prefixId } = this._settings
  let i = 1

  while (document.getElementById(`${prefixId}-${i}`)) {
    i++
  }

  return `${prefixId}-${i}`
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
  prefixId: 'dropdown',
}

export default Dropdown
