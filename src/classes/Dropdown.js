import AbstractDomElement from '../AbstractDomElement'
import { ThrottledEvent } from '../utils/OneLoop'

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

    const { matchMedia } = this._settings
    this.opened = false
    this.active = false
    this.focusedElement = null
    this.elementInner = this._element.innerHTML
    this._onResize = onResize.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.detectClickOutsideElement = this.detectClickOutsideElement.bind(this)
    this._resize = new ThrottledEvent(window, 'resize')
    this._resize.add('resize', this._onResize)
    this._defineId = defineId.bind(this)

    if ((matchMedia && matchMedia.matches) || !matchMedia) {
      this.init()
    }
  }

  /**
   * Initialization
   * @returns {Object}
   * @author Milan Ricoul
   */
  init() {
    this.active = true

    const el = this._element
    const { buttonSelector, labelSelector, listSelector } = this._settings
    const buttonId = `${this._defineId()}-button`
    const labelId = `${this._defineId()}-label`
    this.button = el.querySelector(buttonSelector)
    this.label = el.querySelector(labelSelector)
    this.list = el.querySelector(listSelector)
    this.listItems = el.querySelectorAll('li')

    this.button.id = buttonId
    this.label.id = labelId
    this.button.setAttribute('aria-labelledby', `${labelId} ${buttonId}`)
    this.list.setAttribute('aria-labelledby', `${labelId}`)

    this.listItems.forEach(($listItem, index) => {
      $listItem.id = `${this._defineId()}-item-${index + 1}`
    })

    this.updateFocusedListItem(this.listItems[0])

    this.button.addEventListener('click', this.handleButtonClick)
    document.addEventListener('click', this.detectClickOutsideElement)
    document.addEventListener('keydown', this.handleKeydown)

    return this
  }

  /**
   * Destroy
   * @returns {Object}
   * @author Milan Ricoul
   */
  destroy() {
    this.active = false
  }

  /**
   * Check if media query matches
   */
  refresh() {
    const { matchMedia } = this._settings

    if (!this.active && ((matchMedia && matchMedia.matches) || !matchMedia)) {
      this.init()
    } else if (this.active && matchMedia && !matchMedia.matches) {
      this.destroy()
    }
  }

  /**
   * Handle button click on dropdown button
   */
  handleButtonClick() {
    this.opened ? this.close() : this.open()
  }

  /**
   * Open dropdown
   * @returns {Void}
   * @author Milan Ricoul
   */
  open() {
    this.opened = true

    const el = this._element
    this.button.setAttribute('aria-expanded', 'true')

    if (el.querySelectorAll('li[aria-selected="true"]').length === 1) {
      this.updateFocusedListItem(el.querySelector('li[aria-selected="true"]'))
    } else {
      this.focusedElement = el.querySelector('li:first-child')
      this.focusedElement.setAttribute('aria-selected', 'true')
    }
  }

  /**
   * Close dropdown
   * @returns {Void}
   * @author Milan Ricoul
   */
  close() {
    this.opened = false

    this.button.removeAttribute('aria-expanded')
  }

  /**
   * Close dropdown if click outside the dropdown
   * @param {MouseEvent} e mouse event handler
   * @returns {void}
   * @author Milan Ricoul
   */
  detectClickOutsideElement(e) {
    if (this.opened && !this._element.contains(e.target)) {
      this.close(this.id)
    }
  }

  /**
   * Focus previous list item
   */
  focusPreviousElement() {
    if (this.focusedElement && this.focusedElement.previousElementSibling) {
      this.updateFocusedListItem(this.focusedElement.previousElementSibling)
    }
  }

  /**
   * Focus next list item
   */
  focusNextElement() {
    if (this.focusedElement && this.focusedElement.nextElementSibling) {
      this.updateFocusedListItem(this.focusedElement.nextElementSibling)
    }
  }

  /**
   * Focus first list item
   */
  focusFirstElement() {
    this.updateFocusedListItem(this.listItems[0])
  }

  /**
   * Focus last list item
   */
  focusLastElement() {
    this.updateFocusedListItem(this.listItems[this.listItems.length - 1])
  }

  /**
   * Update dropdown value
   * @param {HTMLElement} listItem new list item
   */
  updateFocusedListItem(listItem) {
    if (this.focusedElement) {
      this.focusedElement.removeAttribute('aria-selected')
    }

    this.focusedElement = listItem
    this.focusedElement.setAttribute('aria-selected', 'true')
    this.list.setAttribute('aria-activedescendant', this.focusedElement.id)
    this.button.innerText = this.focusedElement.innerText

    if (this.list.scrollHeight > this.list.clientHeight) {
      const scrollBottom = this.list.clientHeight + this.list.scrollTop
      const elementBottom = this.focusedElement.offsetTop + this.focusedElement.offsetHeight
      if (elementBottom > scrollBottom) {
        this.list.scrollTop = elementBottom - this.list.clientHeight
      } else if (this.focusedElement.offsetTop < this.list.scrollTop) {
        this.list.scrollTop = this.focusedElement.offsetTop
      }
    }
  }

  /**
   * Handle keyboard keydown
   * @param {KeyboardEvent} e Keyboard keydown event
   * @returns {void}
   * @author Milan Ricoul
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
 */
function onResize() {
  this.refresh()
}

/**
 * Set id to the modal dialog
 * @returns {String}
 * @author Milan Ricoul
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
  buttonSelector: 'button',
  defaultValueAttr: 'data-placeholder',
  labelSelector: '.dropdown__label',
  listSelector: 'ul',
  matchMedia: null,
  prefixId: 'dropdown',
  prefixClassName: 'dropdown',
  transitionDuration: 500,
}

export default Dropdown
