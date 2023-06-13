import AbstractDomElement from './AbstractDomElement'
import { ThrottledEvent } from 'oneloop.js'
import each from '../utils/each'
import getMaxHeight from '../utils/getMaxHeight'
import imagesLoaded from '../utils/imagesLoaded'
import noop from '../utils/noop'

class Slider extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    const s = this._settings
    const el = this._element

    this._items = el.querySelector(s.items)
    this._item = el.querySelectorAll(s.item)
    this._prev = el.querySelector(s.prev)
    this._next = el.querySelector(s.next)
    this._customLinks = el.querySelector(s.customLinks)
    this._liveRegion = el.querySelector(s.liveRegion)
    this._current = s.current
    this._lastDir = 0
    this._dots = null
    this._pointerPositions = {
      start: 0,
      end: 0,
    }
    this._resize = null
    this._isPrevEnabled = true
    this._isNextEnabled = true

    this._onTransitionEnd = onTransitionEnd.bind(this)
    this._onClickItem = onClickItem.bind(this)
    this._onTouchStart = onTouchStart.bind(this)
    this._onPointerDown = onPointerDown.bind(this)
    this._onPointerMove = onPointerMove.bind(this)
    this._onPointerUp = onPointerUp.bind(this)
    this._onKeyDown = onKeydown.bind(this)
    this._onResize = this.refresh.bind(this)
    this._onClickDot = onClickDot.bind(this)
    this._onRequestPrev = onRequestPrev.bind(this)
    this._onRequestNext = onRequestNext.bind(this)

    // hide nav if only on item
    if (this._item.length <= 1) {
      el.classList.add(s.hiddenNavClass)
    }

    // add aria attributes
    el.setAttribute('aria-roledescription', 'carrousel')

    each(this._item, (item) => {
      item.setAttribute('role', 'group')
      item.setAttribute('aria-roledescription', 'slide')
    })

    if (this._liveRegion) {
      this._liveRegion.setAttribute('aria-live', 'polite')
      this._liveRegion.setAttribute('aria-atomic', 'true')
    }

    // init prev
    if (this._prev) {
      this._prev.addEventListener('click', this._onRequestPrev)
    }

    // init next
    if (this._next) {
      this._next.addEventListener('click', this._onRequestNext)
    }

    // create dots list if dots option = true
    if (s.dots && this._item.length > 1) {
      this._dots = createDotList(this._item.length, s.dotsListClass, this._onClickDot)
      el.appendChild(this._dots)
    }

    // if custom links are already in DOM, add event
    if (this._customLinks) {
      each(this._customLinks.getElementsByTagName('button'), (button) => {
        button.addEventListener('click', this._onClickDot)
      })
    }

    // if user can click on item to change slide
    if (s.clickableItem) {
      each(this._item, (item, i) => {
        item.setAttribute('data-index', i)
        item.addEventListener('click', this._onClickItem)
      })
    }

    // if items container must update his height accordingly to current item
    if (s.adaptiveHeight) {
      each(this._item, (item) => {
        item.addEventListener('transitionend', this._onTransitionEnd)
      })

      this._resize = new ThrottledEvent(window, 'resize')
      this._resize.add('resize', this._onResize)

      imagesLoaded(el.getElementsByTagName('img'), null, () => {
        this.refresh()
      })
    }

    // if counter is set to true
    if (s.counter && this._item.length > 1) {
      this._counter = document.createElement('div')
      this._counter.classList.add(s.counterClass)

      el.appendChild(this._counter)
    }

    // set keyboard events
    el.addEventListener('keydown', this._onKeyDown)

    // set swipe behavior events
    if (s.touch) {
      el.addEventListener('touchstart', this._onTouchStart)

      el.addEventListener('touchstart', this._onPointerDown)
      el.addEventListener('touchmove', this._onPointerMove)
      el.addEventListener('touchend', this._onPointerUp)

      el.addEventListener('mousedown', this._onPointerDown)
      el.addEventListener('mousemove', this._onPointerMove)
      el.addEventListener('mouseup', this._onPointerUp)
    }

    // go to current item
    this.goto(s.current)
  }

  /**
   * Get element
   *
   * @returns domElement -> The element on which the slider was initialized
   */
  getElement() {
    return this._element
  }

  /**
   * Get item count
   *
   * @returns number -> Number of items in slider
   */
  getItemLength() {
    return this._item.length
  }

  /**
   * Get current index
   *
   * @returns number -> Current index of the slider
   */
  getCurrentIndex() {
    return this._current
  }

  /**
   * Go to previous
   *
   * @param {boolean} announceItem update the live region if true
   *
   * @returns {object}
   */
  prev(announceItem) {
    this.goto(this._current - 1, announceItem, -1)
    return this
  }

  /**
   * Go to next
   *
   * @param {boolean} announceItem update the live region if true
   *
   * @returns {object}
   */
  next(announceItem) {
    this.goto(this._current + 1, announceItem, 1)
    return this
  }

  /**
   * Go to
   *
   * @param {number} index -> position to reach
   * @param {boolean} announceItem -> update the live region if true
   * @param {number} dir 1|-1 optional
   *
   * @returns {object}
   */
  goto(index, announceItem, dir) {
    const s = this._settings
    const l = this._item.length
    const half = Math.ceil(l / 2)

    index = (index + l) % l

    if (!dir) {
      dir = index > this._lastDir ? 1 : -1
    }

    if (s.infinite) {
      for (let i = 1; i <= half; i++) {
        setPosition.call(this, (index - i + l) % l, -i)
      }

      for (let i = 1; i <= half; i++) {
        setPosition.call(this, (index + i) % l, i)
      }

      setPosition.call(this, index, 0)
    } else {
      for (let i = 0; i < l; i++) {
        setPosition.call(this, i, i - index)
      }

      if (index === 0 && this._isPrevEnabled) {
        this._isPrevEnabled = false

        if (this._prev) {
          this._prev.setAttribute('disabled', '')
        }
      } else if (!this._isPrevEnabled && index > 0) {
        this._isPrevEnabled = true

        if (this._prev) {
          this._prev.removeAttribute('disabled')
        }
      }

      if (index === l - 1 && this._isNextEnabled) {
        this._isNextEnabled = false

        if (this._next) {
          this._next.setAttribute('disabled', '')
        }
      } else if (!this._isNextEnabled && index < l - 1) {
        this._isNextEnabled = true

        if (this._next) {
          this._next.removeAttribute('disabled')
        }
      }
    }

    if (this._dots) {
      setActive.call(this, this._dots, index)
    }

    if (this._customLinks) {
      setActive.call(this, this._customLinks, index)
    }

    if (this._counter) {
      this._counter.textContent = index + 1 + ' / ' + l
    }

    if (announceItem && this._liveRegion) {
      this._liveRegion.textContent = this._item[index].getAttribute('aria-label')
    }

    if (this._lastDir !== dir) {
      this._element.setAttribute(s.dirAttr, dir)
      this._lastDir = dir
    }

    this._element.setAttribute(s.currentAttr, index)
    this._current = index

    s.onGoto.call(this, index, dir)

    return this
  }

  /**
   * Refresh
   *
   * @returns {object}
   */
  refresh() {
    this._items.style.height = `${getMaxHeight(this._item)}px`

    return this
  }
}

// ----
// private
// ----

/**
 * Set position of slides
 *
 * @param {number} index index of slide
 * @param {number} pos position of slide
 */
function setPosition(index, pos) {
  const s = this._settings

  pos = Math.max(Math.min(pos, s.maxNextPos), s.maxPrevPos)

  this._item[index].setAttribute(s.posAttr, pos)
  this._item[index].setAttribute('aria-hidden', pos !== 0)
  this._item[index].setAttribute('tabindex', pos !== 0 ? -1 : 0)

  s.onSetPosition.call(this, index, pos)
}

/**
 * Set dot active
 * @param {HTMLElement} container dots unordered list
 * @param {number} index index of current slide
 */
function setActive(container, index) {
  const activeClass = this._settings.activeClass
  const buttons = container.getElementsByTagName('button')
  const active = container.getElementsByClassName(activeClass)[0]

  if (active) {
    active.classList.remove(activeClass)
    active.removeAttribute('aria-current')
  }

  buttons[index].classList.add(activeClass)
  buttons[index].setAttribute('aria-current', 'true')
}

// ----
// events
// ----

/**
 * Click dot callback
 *
 * @param {MouseEvent} e mouse event
 */
function onClickDot(e) {
  this.goto(parseInt(e.currentTarget.value))
}

/**
 * Click item callback
 *
 * @param {MouseEvent} e mouse event
 */
function onClickItem(e) {
  const item = e.currentTarget
  const index = parseInt(item.dataset.index)

  this._settings.onClickItem(e, item, index)
  this.goto(index)
}

/**
 * Transition end callback
 *
 * @param {TransitionEvent} e transition event
 */
function onTransitionEnd(e) {
  const isItem = e.target === e.currentTarget
  const isMainItem = parseInt(e.currentTarget.getAttribute(this._settings.posAttr)) === 0
  const isPropertyTransform = e.propertyName === 'transform'

  if (isItem && isMainItem && isPropertyTransform) {
    this.refresh()
  }
}

/**
 * Transition start callback
 */
function onTouchStart() {
  this._element.removeEventListener('mousedown', this._onPointerDown)
  this._element.removeEventListener('mousemove', this._onPointerMove)
  this._element.removeEventListener('mouseup', this._onPointerUp)
}

/**
 * On pointer down callback
 *
 * @param {MouseEvent} e pointer down event
 */
function onPointerDown(e) {
  e = normalizeEvent(e)

  this._pointerPositions.start = e.clientX
  this._pointerPositions.move = e.clientX
}

/**
 * On pointer move callback
 *
 * @param {MouseEvent} e pointer move event
 */
function onPointerMove(e) {
  e = normalizeEvent(e)

  this._pointerPositions.move = e.clientX
}

/**
 * On pointer up callback
 *
 * @param {MouseEvent} e pointer up event
 */
function onPointerUp() {
  if (Math.abs(this._pointerPositions.start - this._pointerPositions.move) > 50) {
    this[this._pointerPositions.start > this._pointerPositions.move ? 'next' : 'prev']()
  }
}

/**
 * Request previous slide
 */
function onRequestPrev() {
  if (this._settings.infinte || this._isPrevEnabled) {
    this.prev(true)
  }
}

/**
 * Request next slide
 */
function onRequestNext() {
  if (this._settings.infinte || this._isNextEnabled) {
    this.next(true)
  }
}

/**
 * Handle keyboard keydown
 *
 * @param {KeyboardEvent} e Keyboard keydown event
 *
 * @returns {void}
 */
function onKeydown(e) {
  if (this._element !== document.activeElement) {
    return
  }

  switch (e.code) {
    case 'ArrowLeft':
      e.preventDefault()
      this._onRequestPrev()
      break
    case 'ArrowRight':
      e.preventDefault()
      this._onRequestNext()
      break
    case 'Home':
      e.preventDefault()
      this.goto(0)
      break
    case 'End':
      e.preventDefault()
      this.goto(this.getItemLength() - 1)
  }
}

// ----
// utils
// ----

/**
 * Create slider unordered list navigation
 *
 * @param {Number} nbDot number of dots
 * @param {HTMLElement} dotsListClass wrapper list element
 * @param {Function} onClick click callback
 *
 * @returns {HTMLElement}
 */
function createDotList(nbDot, dotsListClass, onClick) {
  const ul = document.createElement('ul')

  for (let i = 1; i <= nbDot; i++) {
    const li = document.createElement('li')
    const button = document.createElement('button')

    button.setAttribute('type', 'button')
    button.textContent = i
    button.value = i - 1
    button.addEventListener('click', onClick)

    li.appendChild(button)
    ul.appendChild(li)
  }

  ul.classList.add(dotsListClass)

  return ul
}

/**
 * Normalize event
 *
 * @param {MouseEvent} e mouse event
 *
 * @returns {MouseEvent}
 */
function normalizeEvent(e) {
  return e.touches ? e.touches[0] : e
}

// ----
// defaults
// ----
Slider.defaults = {
  posAttr: 'data-pos',
  dirAttr: 'data-dir',
  currentAttr: 'data-current',
  dotsListClass: 'slider__dots',
  activeClass: 'slider__active',
  hiddenNavClass: 'slider--hide-nav',
  counterClass: 'slider__counter',
  items: '.slider__items',
  item: '.slider__item',
  prev: '.slider__prev',
  next: '.slider__next',
  customLinks: '.slider__custom-links',
  liveRegion: '.slider__live-region',
  current: 0,
  adaptiveHeight: true,
  infinite: false,
  dots: false,
  counter: false,
  maxPrevPos: -Infinity,
  maxNextPos: Infinity,
  touch: true,
  clickableItem: false,
  onSetPosition: noop,
  onGoto: noop,
  onClickItem: noop,
}

// ----
// preset
// ----
Slider.preset = {
  '.slider': {
    maxPrevPos: -2,
    maxNextPos: 2,
    infinite: true,
  },
}

// ----
// export
// ----
export default Slider
