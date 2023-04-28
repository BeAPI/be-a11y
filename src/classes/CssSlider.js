import AbstractDomElement from './AbstractDomElement'
import getMaxHeight from '../utils/getMaxHeight'
import noop from '../utils/noop'
import each from '../utils/each'
import imagesLoaded from '../utils/imagesLoaded'
import { ThrottledEvent } from 'oneloop.js'

class CssSlider extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    const that = this
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

    each(this._item, (item, i, l) => {
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
      each(this._customLinks.getElementsByTagName('button'), function (button) {
        button.addEventListener('click', that._onClickDot)
      })
    }

    // if user can click on item to change slide
    if (s.clickableItem) {
      each(this._item, function (item, i) {
        item.setAttribute('data-index', i)
        item.addEventListener('click', that._onClickItem)
      })
    }

    // if items container must update his height accordingly to current item
    if (s.adaptiveHeight) {
      each(this._item, function (item) {
        item.addEventListener('transitionend', that._onTransitionEnd)
      })

      this._resize = new ThrottledEvent(window, 'resize')
      this._resize.add('resize', this._onResize)

      imagesLoaded(el.getElementsByTagName('img'), null, function () {
        that.refresh()
      })
    }

    // if counter is set to true
    if (s.counter && this._item.length > 1) {
      this._counter = document.createElement('div')
      this._counter.classList.add(s.counterClass)

      el.appendChild(this._counter)
    }

    // set swip behavior events
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

  getElement() {
    return this._element
  }

  getItemLength() {
    return this._item.length
  }

  getCurrentIndex() {
    return this._current
  }

  prev(announceItem) {
    this.goto(this._current - 1, -1, announceItem)
    return this
  }

  next(announceItem) {
    this.goto(this._current + 1, 1, announceItem)
    return this
  }

  goto(index, dir, announceItem) {
    const s = this._settings
    const l = this._item.length
    const half = Math.ceil(l / 2)
    var i

    index = (index + l) % l

    if (!dir) {
      dir = index > this._lastDir ? 1 : -1
    }

    if (s.infinite) {
      for (i = 1; i <= half; i++) {
        setPosition.call(this, (index - i + l) % l, -i)
      }

      for (i = 1; i <= half; i++) {
        setPosition.call(this, (index + i) % l, i)
      }

      setPosition.call(this, index, 0)
    } else {
      for (i = 0; i < l; i++) {
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
      this._counter.innerHTML = index + 1 + ' / ' + l
    }

    if (announceItem && this._liveRegion) {
      this._liveRegion.innerHTML = this._item[index].getAttribute('aria-label')
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

  refresh() {
    var scrollTop = window.pageYOffset

    this._items.style.height = getMaxHeight(this._item) + 'px'

    window.scrollTo(0, scrollTop)

    return this
  }
}

// ----
// private
// ----
function setPosition(index, pos) {
  const s = this._settings
  pos = Math.max(Math.min(pos, s.maxNextPos), s.maxPrevPos)
  this._item[index].setAttribute(s.posAttr, pos)
  this._item[index].setAttribute('aria-hidden', pos !== 0)
  this._item[index].setAttribute('tabindex', pos !== 0 ? -1 : 0)
  s.onSetPosition.call(this, index, pos)
}

function setActive(container, index) {
  const activeClass = this._settings.activeClass
  var buttons = container.getElementsByTagName('button')
  var active = container.getElementsByClassName(activeClass)[0]

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
function onClickDot(e) {
  var index = parseInt(e.currentTarget.value)
  this.goto(index)
}

function onClickItem(e) {
  const item = e.currentTarget
  const index = parseInt(item.dataset.index)

  this._settings.onClickItem(e, item, index)
  this.goto(index)
}

function onTransitionEnd(e) {
  const isItem = e.target === e.currentTarget
  const isMainItem = parseInt(e.currentTarget.getAttribute(this._settings.posAttr)) === 0
  const isPropertyTransform = e.propertyName === 'transform'

  if (isItem && isMainItem && isPropertyTransform) {
    this.refresh()
  }
}

function onTouchStart() {
  this._element.removeEventListener('mousedown', this._onPointerDown)
  this._element.removeEventListener('mousemove', this._onPointerMove)
  this._element.removeEventListener('mouseup', this._onPointerUp)
}

function onPointerDown(e) {
  e = normalizeEvent(e)

  this._pointerPositions.start = e.clientX
  this._pointerPositions.move = e.clientX
}

function onPointerMove(e) {
  e = normalizeEvent(e)

  this._pointerPositions.move = e.clientX
}

function onPointerUp() {
  if (Math.abs(this._pointerPositions.start - this._pointerPositions.move) > 50) {
    this[this._pointerPositions.start > this._pointerPositions.move ? 'next' : 'prev']()
  }
}

function onRequestPrev() {
  if (this._settings.infinte || this._isPrevEnabled) {
    this.prev(true)
  }
}

function onRequestNext() {
  if (this._settings.infinte || this._isNextEnabled) {
    this.next(true)
  }
}

// ----
// utils
// ----
function createDotList(nbDot, dotsListClass, onClick) {
  const ul = document.createElement('ul')
  var button
  var li
  var i

  for (i = 1; i <= nbDot; i++) {
    li = document.createElement('li')
    button = document.createElement('button')

    button.setAttribute('type', 'button')
    button.innerHTML = i
    button.value = i - 1
    button.addEventListener('click', onClick)

    li.appendChild(button)
    ul.appendChild(li)
  }

  ul.classList.add(dotsListClass)

  return ul
}

function normalizeEvent(e) {
  return e.touches ? e.touches[0] : e
}
// ----
// defaults
// ----
CssSlider.defaults = {
  posAttr: 'data-pos',
  dirAttr: 'data-dir',
  currentAttr: 'data-current',
  dotsListClass: 'css-slider__dots',
  activeClass: 'css-slider__active',
  hiddenNavClass: 'css-slider--hide-nav',
  counterClass: 'css-slider__counter',
  items: '.css-slider__items',
  item: '.css-slider__item',
  prev: '.css-slider__prev',
  next: '.css-slider__next',
  customLinks: '.css-slider__custom-links',
  liveRegion: '.css-slider__live-region',
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
CssSlider.preset = {}

// ----
// init
// ----
// CssSlider.initFromPreset()

// ----
// export
// ----
export default CssSlider
