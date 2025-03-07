import AbstractDomElement from './AbstractDomElement.ts'
import { getMaxHeight } from '../utils/helpers'
import { ThrottledEvent } from 'oneloop.js'
import imagesLoaded from '../utils/imagesLoaded'

/**
 * @typedef {Object} SliderOptions
 * @property {string} closeButtonSelector - The selector for the close button.
 * @property {string} closedClassName - The class name to be applied when the Slider is closed.
 * @property {boolean} closeOnFocusOutside - Whether to close the Slider when focus is outside.
 * @property {null|string} descriptionSelector - The selector for the description element.
 * @property {null|string} labelSelector - The selector for the label element.
 * @property {MediaQueryList|null} mediaQuery - The media query for responsiveness.
 * @property {string} openedClassName - The class name to be applied when the Slider is open.
 * @property {(e: MouseEvent) => any} onOpen - The callback function to execute when the Slider is opened.
 * @property {(e: MouseEvent) => any} onClose - The callback function to execute when the Slider is closed.
 * @property {null|string} triggerSelector - The selector for the trigger button.
 */
interface SliderOptions {
  posAttr: string
  dirAttr: string
  currentAttr: string
  dotsListClass: string
  activeClass: string
  hiddenNavClass: string
  counterClass: string
  items: string
  item: string
  prev: string
  next: string
  customLinks: string
  liveRegion: string
  current: number
  adaptiveHeight: true
  infinite: false
  counter: HTMLElement | null
  dots: HTMLUListElement | null
  maxPrevPos: number
  maxNextPos: number
  touch: true
  clickableItem: boolean
  onSetPosition: (index: number, pos: number) => any
  onGoto: (index: number, dir: (-1|1), announceItem?: boolean) => any
  onClickItem: (e: MouseEvent, item: HTMLElement, index: number) => any
}

/**
 * Represents a Slider component.
 *
 * @extends AbstractDomElement
 */
export default class Slider extends AbstractDomElement {
  /**
   * Indicates whether the Slider component has been initialized.
   *
   * @protected
   * @type {boolean}
   */
  private items: HTMLElement | null
  private item: NodeListOf<Element> // eslint-disable-line no-undef
  private prev: HTMLElement | null
  private next: HTMLElement | null
  private customLinks: HTMLElement | null
  private liveRegion: HTMLElement | null
  private current: number
  private lastDir: number
  private counter: HTMLElement | null
  private dots: HTMLUListElement | null
  private pointerPositions: {
    start: number
    end: number,
    move: number,
  }
  private resize: any
  private isPrevEnabled: boolean
  private isNextEnabled: boolean

  /**
   * Options for configuring the Slider component.
   *
   * @protected
   * @type {SliderOptions}
   */
  protected options: SliderOptions

  private onTransitionEnd: (e: Event) => void // eslint-disable-line no-unused-vars
  private onClickItem: (e: MouseEvent) => void // eslint-disable-line no-unused-vars
  private onTouchStart: (e: TouchEvent) => void // eslint-disable-line no-unused-vars
  private onPointerDown: (e: MouseEvent|TouchEvent) => void // eslint-disable-line no-unused-vars
  private onPointerMove: (e: MouseEvent|TouchEvent) => void // eslint-disable-line no-unused-vars
  private onPointerUp: (e: MouseEvent|TouchEvent) => void // eslint-disable-line no-unused-vars
  private onKeyDown: (e: KeyboardEvent) => void // eslint-disable-line no-unused-vars
  private onClickDot: (e: MouseEvent) => void // eslint-disable-line no-unused-vars
  private onRequestPrev: (e: MouseEvent) => void // eslint-disable-line no-unused-vars
  private onRequestNext: (e: MouseEvent) => void // eslint-disable-line no-unused-vars
  private onResize: () => void // eslint-disable-line no-unused-vars

  /**
   * Default options for the Slider component.
   *
   * @private
   * @static
   * @readonly
   * @type {SliderOptions}
   */
  private static readonly defaults: SliderOptions = {
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
    counter: null,
    dots: null,
    maxPrevPos: -Infinity,
    maxNextPos: Infinity,
    touch: true,
    clickableItem: false,
    onSetPosition: () => {},
    onGoto: () => {},
    onClickItem: () => {},
  }

  /**
   * Constructs a new Slider instance.
   *
   * @param {HTMLElement} element - The DOM node representing the Slider container.
   * @param {Partial<SliderOptions>} options - Options for configuring the Slider component.
   */
  constructor(element: HTMLElement, options: Partial<SliderOptions> = {}) {
    const mergedOptions: SliderOptions = {
      ...Slider.defaults,
      ...options,
    }

    super(element, mergedOptions)

    if (!this.isNewInstance()) {
      return this
    }

    const { current, customLinks, liveRegion, item, items, prev, next } = this.options
    const el = this.element

    this.items = el.querySelector(items)
    this.item = el.querySelectorAll(item)
    this.prev = el.querySelector(prev)
    this.next = el.querySelector(next)
    this.customLinks = el.querySelector(customLinks)
    this.liveRegion = el.querySelector(liveRegion)
    this.current = current
    this.lastDir = 0
    this.counter = null
    this.dots = null
    this.pointerPositions = {
      start: 0,
      end: 0,
      move: 0,
    }
    this.resize = new ThrottledEvent(window, 'resize')
    this.isPrevEnabled = true
    this.isNextEnabled = true

    this.onTransitionEnd = this._onTransitionEnd.bind(this) as (e: Event) => void
    this.onClickItem = this._onClickItem.bind(this)
    this.onTouchStart = this._onTouchStart.bind(this)
    this.onPointerDown = this._onPointerDown.bind(this)
    this.onPointerMove = this._onPointerMove.bind(this)
    this.onPointerUp = this._onPointerUp.bind(this)
    this.onKeyDown = this._onKeyDown.bind(this)
    this.onClickDot = this._onClickDot.bind(this)
    this.onRequestPrev = this._onRequestPrev.bind(this)
    this.onRequestNext = this._onRequestNext.bind(this)
    this.onResize = this.refresh.bind(this)

    this.init()
  }

  /**
   * Initializes the Slider component.
   *
   * @private
   * @returns {void}
   */
  private init(): void {
    const el = this.element
    const { adaptiveHeight, clickableItem, counter,counterClass, current, dots, dotsListClass, hiddenNavClass, touch } = this.options

    // hide nav if only on item
    if (this.item.length <= 1) {
      el.classList.add(hiddenNavClass)
    }

    // add aria attributes
    el.setAttribute('aria-roledescription', 'carrousel')

    for (const item of this.item) {
      item.setAttribute('role', 'group')
      item.setAttribute('aria-roledescription', 'slide')
    }

    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', 'polite')
      this.liveRegion.setAttribute('aria-atomic', 'true')
    }

    // init prev
    if (this.prev) {
      this.prev.addEventListener('click', this.onRequestPrev)
    }

    // init next
    if (this.next) {
      this.next.addEventListener('click', this.onRequestNext)
    }

    // create dots list if dots option = true
    if (dots && this.item.length > 1) {
      this.dots = this.createDotList(this.item.length, dotsListClass, this.onClickDot)
      el.appendChild(this.dots)
    }

    // if custom links are already in DOM, add event
    if (this.customLinks) {
      for (const button of this.customLinks.getElementsByTagName('button')) {
        button.addEventListener('click', this.onClickDot as (e: MouseEvent) => void)
      }
    }

    // if user can click on item to change slide
    if (clickableItem) {
      let i = 0
      for (const item of this.item) {
        item.setAttribute('data-index', String(i))
        item.addEventListener('click', this.onClickItem as EventListener)
        i++
      }
    }

    // if items container must update his height accordingly to current item
    if (adaptiveHeight) {
      for (const item of this.item) {
        item.addEventListener('transitionend', this.onTransitionEnd as EventListener)
      }

      this.resize = new ThrottledEvent(window, 'resize')
      if (this.resize) {
        this.resize.add('resize', this.onResize)
      }

      imagesLoaded(el.getElementsByTagName('img'), null, () => {
        this.refresh()
      })
    }

    // if counter is set to true
    if (counter && this.item.length > 1) {
      this.counter = document.createElement('div')
      this.counter.classList.add(counterClass)

      el.appendChild(this.counter)
    }

    // set keyboard events
    el.addEventListener('keydown', this.onKeyDown)

    // set swipe behavior events
    if (touch) {
      el.addEventListener('touchstart', this.onTouchStart)

      el.addEventListener('touchstart', this.onPointerDown)
      el.addEventListener('touchmove', this.onPointerMove)
      el.addEventListener('touchend', this.onPointerUp)

      el.addEventListener('mousedown', this.onPointerDown)
      el.addEventListener('mousemove', this.onPointerMove)
      el.addEventListener('mouseup', this.onPointerUp)
    }

    // go to current item
    this.goto(current)
  }

  /**
   * Go to previous
   *
   * @param {boolean} announceItem update the live region if true
   *
   * @returns {void}
   */
  public gotoPrev(announceItem: boolean): void {
    this.goto(this.current - 1, -1, announceItem)
  }

  /**
   * Go to next
   *
   * @param {boolean} announceItem update the live region if true
   *
   * @returns {object}
   */
  public gotoNext(announceItem: boolean): void {
    this.goto(this.current + 1, 1, announceItem)
  }

  /**
   * Go to
   *
   * @param {number} index -> position to reach
   * @param {number} dir 1|-1 optional
   * @param {boolean} announceItem -> update the live region if true
   *
   * @returns {object}
   */
  public goto(index: number, dir?: (1|-1), announceItem?: boolean): object {
    const { currentAttr, dirAttr, infinite, onGoto } = this.options
    const l = this.item.length
    const half = Math.floor(l / 2)

    index = (index + l) % l

    if (!dir) {
      dir = index > this.lastDir ? 1 : -1
    }

    if (infinite) {
      for (let i = 1; i <= half; i++) {
        this.setPosition.call(this, (index - i + l) % l, -i)
      }

      for (let i = 1; i <= half; i++) {
        this.setPosition.call(this, (index + i) % l, i)
      }

      this.setPosition.call(this, index, 0)
    } else {
      for (let i = 0; i < l; i++) {
        this.setPosition.call(this, i, i - index)
      }

      if (index === 0 && this.isPrevEnabled) {
        this.isPrevEnabled = false

        if (this.prev) {
          this.prev.setAttribute('disabled', '')
        }
      } else if (!this.isPrevEnabled && index > 0) {
        this.isPrevEnabled = true

        if (this.prev) {
          this.prev.removeAttribute('disabled')
        }
      }

      if (index === l - 1 && this.isNextEnabled) {
        this.isNextEnabled = false

        if (this.next) {
          this.next.setAttribute('disabled', '')
        }
      } else if (!this.isNextEnabled && index < l - 1) {
        this.isNextEnabled = true

        if (this.next) {
          this.next.removeAttribute('disabled')
        }
      }
    }

    if (this.dots) {
      this.setActive.call(this, this.dots, index)
    }

    if (this.customLinks) {
      this.setActive.call(this, this.customLinks, index)
    }

    if (this.counter) {
      this.counter.textContent = index + 1 + ' / ' + l
    }

    if (announceItem && this.liveRegion) {
      this.liveRegion.textContent = this.item[index].getAttribute('aria-label')
    }

    if (this.lastDir !== dir) {
      this.element.setAttribute(dirAttr, String(dir))
      this.lastDir = dir
    }

    this.element.setAttribute(currentAttr, String(index))
    this.current = index

    onGoto.call(this, index, dir)

    return this
  }

  /**
   * Click dot callback
   *
   * @param {MouseEvent} e mouse event
   */
  private _onClickDot(e: MouseEvent): void {
    if (!e.currentTarget) {
      return
    }

    const item = e.currentTarget as HTMLElement
    this.goto(parseInt(item.dataset.value || '0'))
  }

  /**
   * Click item callback
   *
   * @param {MouseEvent} e mouse event
   */
  private _onClickItem(e: MouseEvent): void {
    const {onClickItem} = this.options
    const item = e.currentTarget as HTMLElement
    const index = parseInt(item?.dataset?.index || '0')

    onClickItem(e, item, index)
    this.goto(index)
  }

  /**
   * Transition start callback
   */
  private _onTouchStart(): void {
    this.element.removeEventListener('mousedown', this._onPointerDown)
    this.element.removeEventListener('mousemove', this._onPointerMove)
    this.element.removeEventListener('mouseup', this._onPointerUp)
  }

  /**
   * Transition end callback
   *
   * @param {TransitionEvent} e transition event
   */
  private _onTransitionEnd(e: TransitionEvent): void {
    if (!e.currentTarget) {
      return
    }

    const {currentTarget, propertyName, target} = e
    const {posAttr} = this.options
    const isItem = target === currentTarget
    const isMainItem = parseInt((<HTMLElement>currentTarget).getAttribute(posAttr) || '0') === 0
    const isPropertyTransform = propertyName === 'transform'

    if (isItem && isMainItem && isPropertyTransform) {
      this.refresh()
    }
  }

  /**
   * On pointer down callback
   *
   * @param {MouseEvent|TouchEvent} e pointer down event
   */
  private _onPointerDown(e: MouseEvent|TouchEvent): void {
    const touchEvent = this.normalizeEvent(e as TouchEvent)

    this.pointerPositions.start = (<MouseEvent|Touch>touchEvent).clientX
    this.pointerPositions.move = (<MouseEvent|Touch>touchEvent).clientX
  }

  /**
   * On pointer move callback
   *
   * @param {MouseEvent|TouchEvent} e pointer move event
   */
  private _onPointerMove(e: MouseEvent|TouchEvent): void {
    const touchEvent = this.normalizeEvent(e as TouchEvent)

    this.pointerPositions.move = (<MouseEvent|Touch>touchEvent).clientX
  }

  /**
   * On pointer up callback
   */
  private _onPointerUp(): void {
    if (Math.abs(this.pointerPositions.start - this.pointerPositions.move) > 50 && this.pointerPositions.start > this.pointerPositions.move) {
      this.gotoNext(false)
    }

    if (Math.abs(this.pointerPositions.start - this.pointerPositions.move) > 50 && this.pointerPositions.start <= this.pointerPositions.move) {
      this.gotoPrev(false)
    }
  }

  /**
   * Handle keyboard keydown
   *
   * @param {KeyboardEvent} e Keyboard keydown event
   *
   * @returns {void}
   */
  private _onKeyDown(e: KeyboardEvent): void {
    if (this.element !== document.activeElement) {
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

  /**
   * Request previous slide
   */
  private _onRequestPrev() {
    if (this.options.infinite || this.isPrevEnabled) {
      this.gotoPrev(true)
    }
  }

  /**
   * Request next slide
   */
  private _onRequestNext() {
    if (this.options.infinite || this.isNextEnabled) {
      this.gotoNext(true)
    }
  }

  /**
   * Set position of slides
   *
   * @param {number} index index of slide
   * @param {number} pos position of slide
   */
  private setPosition(index: number, pos: number): void {
    const {maxNextPos, maxPrevPos, onSetPosition, posAttr} = this.options

    pos = Math.max(Math.min(pos, maxNextPos), maxPrevPos)

    this.item[index].setAttribute(posAttr, String(pos))
    this.item[index].setAttribute('aria-hidden', String(pos !== 0))
    this.item[index].setAttribute('tabindex', String(pos !== 0 ? -1 : 0))

    onSetPosition.call(this, index, pos)
  }

  /**
   * Set dot active
   * @param {HTMLElement} container dots unordered list
   * @param {number} index index of current slide
   */
  private setActive(container: HTMLElement, index: number): void {
    const {activeClass} = this.options
    const buttons = container.getElementsByTagName('button')
    const active = container.getElementsByClassName(activeClass)[0]

    if (active) {
      active.classList.remove(activeClass)
      active.removeAttribute('aria-current')
    }

    buttons[index].classList.add(activeClass)
    buttons[index].setAttribute('aria-current', 'true')
  }

  /**
   * Create slider unordered list navigation
   *
   * @param {number} nbDot number of dots
   * @param {string} dotsListClass wrapper list element class
   * @param {Function} onClick click callback
   *
   * @returns {HTMLUListElement}
   */
  private createDotList(nbDot: number, dotsListClass: string, onClick: Function): HTMLUListElement {
    const ul = document.createElement('ul')

    for (let i = 1; i <= nbDot; i++) {
      const li = document.createElement('li')
      const button = document.createElement('button')

      button.setAttribute('type', 'button')
      button.textContent = String(i)
      button.setAttribute('data-value', String(i - 1))
      button.addEventListener('click', onClick as (e: MouseEvent) => void)

      li.appendChild(button)
      ul.appendChild(li)
    }

    ul.classList.add(dotsListClass)

    return ul
  }

  /**
   * Get item count
   *
   * @returns {number}
   */
  private getItemLength(): number {
    return this.item.length || 0
  }

  /**
   * Refresh
   *
   * @returns {Slider}
   */
  public refresh() {
    if (!this.items) {
      return this
    }

    this.items.style.height = `${getMaxHeight(this.item)}px`

    return this
  }

  /**
   * Normalize event
   *
   * @param {TouchEvent} e mouse event
   *
   * @returns {TouchEvent|Touch}
   */
  private normalizeEvent(e: TouchEvent): TouchEvent | Touch {
    return e.touches ? e.touches[0] : e
  }
}
