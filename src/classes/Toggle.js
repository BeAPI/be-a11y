import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import AbstractDomElement from '../AbstractDomElement'
import DOMAnimations from '../utils/DOMAnimations'
import throttle from '../utils/throttle'

/**
 * Toggle Class
 * @author Milan Ricoul
 */
class Toggle extends AbstractDomElement {
  constructor(element, options) {
    var instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    this.target = this._settings.target
      ? this._element.parentNode.querySelector(this._settings.target)
      : document.getElementById(this._element.getAttribute('aria-controls'))

    this._onResizeHandler = onResize.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.enableBodyScroll = this.enableBodyScroll.bind(this)
    this.disableBodyScroll = this.disableBodyScroll.bind(this)

    this.initialized = false

    window.addEventListener('resize', throttle(this._onResizeHandler, 300))
    this._onResizeHandler()
  }

  /**
   * Initialize class
   * @returns {Boolean}
   * @author Milan Ricoul
   */
  init() {
    const el = this._element
    const s = this._settings

    this.initialized = true

    if (this.target) {
      el.addEventListener('click', this.handleClick)
      el.addEventListener('keydown', this.handleClick)
    } else if (!this.target && s.onClick) {
      el.addEventListener('click', s.onClick)
      el.addEventListener('keydown', s.onClick)

      return false
    } else {
      return false
    }

    if (s.onClick) {
      el.addEventListener('click', s.onClick)
      el.addEventListener('keydown', s.onClick)
    }

    if (!el.getAttribute('aria-controls')) {
      const id = this.defineId()
      el.setAttribute('aria-controls', id)
      this.target.id = id
    }

    if (s.closeOnBlur) {
      el.addEventListener('blur', this.handleBlur)
    }

    if (s.closeOnEscPress) {
      closeOnEscPress(el)
    }

    if (s.isOpened) {
      this.open()
    }

    return true
  }

  /**
   * Set id to the modal dialog
   * @returns {String}
   * @author Milan Ricoul
   */
  defineId() {
    let i = 1

    while (document.getElementById(`toggle-${i}`)) {
      i++
    }

    return `toggle-${i}`
  }

  /**
   * Destroy events
   * @returns {void}
   * @author Milan Ricoul
   */
  destroy() {
    const el = this._element
    this.initialized = false

    this.reset()

    if (this._settings.onClick) {
      el.removeEventListener('click', this._settings.onClick)
      el.removeEventListener('keydown', this._settings.onClick)
    } else {
      el.removeEventListener('click', this.handleClick)
      el.removeEventListener('keydown', this.handleClick)
      el.removeEventListener('blur', this.handleBlur)
    }
  }

  /**
   * Handle button MouseEvent
   * @param {(MouseEvent|KeyboardEvent)} e event handler
   * @returns {void}
   * @author Milan Ricoul
   */
  handleClick(e) {
    if (e.type === 'keydown' && e.code !== 'Enter' && e.code !== 'Space') {
      return false
    }

    e.preventDefault()

    if (this.target.getAttribute('aria-hidden')) {
      this.target.getAttribute('aria-hidden') !== 'true' ? this.close() : this.open()

      return
    }

    if (this.target.getAttribute('aria-expanded')) {
      this.target.getAttribute('aria-expanded') !== 'false' ? this.close() : this.open()
    }
  }

  /**
   * Open target
   * @returns {void}
   * @author Milan Ricoul
   */
  open() {
    const el = this._element
    const s = this._settings

    this.target.setAttribute('aria-hidden', 'false')
    this.target.setAttribute('aria-expanded', 'true')
    el.setAttribute('aria-expanded', 'true')

    if (s.hasAnimation) {
      DOMAnimations.slideDown(this.target)
    }

    if (s.bodyScrollLock) {
      this.disableBodyScroll()
    }
  }

  /**
   * Close target
   * @returns {void}
   * @author Milan Ricoul
   */
  close() {
    const el = this._element
    const s = this._settings

    this.target.setAttribute('aria-hidden', 'true')
    this.target.setAttribute('aria-expanded', 'false')
    el.setAttribute('aria-expanded', 'false')

    if (this._settings.hasAnimation) {
      DOMAnimations.slideUp(this.target)
    }

    if (s.bodyScrollLock) {
      enableBodyScroll(this.target)
    }
  }

  /**
   * Remove ARIA attributes
   * @returns {void}
   * @author Milan Ricoul
   */
  reset() {
    const el = this._element

    this.target.removeAttribute('aria-hidden')
    this.target.removeAttribute('aria-expanded')
    el.removeAttribute('aria-expanded')

    if (this._settings.hasAnimation) {
      DOMAnimations.slideDown(this.target, 500, () => {
        this.target.removeAttribute('style')
      })
    }
  }

  /**
   * Handle button FocusEvent
   * @returns {void}
   * @author Milan Ricoul
   */
  handleBlur() {
    window.setTimeout(() => {
      this.target.setAttribute('aria-hidden', 'true')
      this.target.setAttribute('aria-expanded', 'false')
      this._element.setAttribute('aria-expanded', 'false')
    }, 200)
  }

  /**
   * Disable body scroll
   * @returns {void}
   * @author Milan Ricoul
   */
  disableBodyScroll() {
    const s = this._settings

    if (s.bodyScrollLockMediaQuery && window.matchMedia(s.bodyScrollLockMediaQuery).matches) {
      disableBodyScroll(this.target)
    } else if (!s.bodyScrollLockMediaQuery) {
      disableBodyScroll(this.target)
    }
  }

  /**
   * Enable body scroll
   * @returns {void}
   * @author Milan Ricoul
   */
  enableBodyScroll() {
    enableBodyScroll(this.target)
  }
}

/**
 * Events
 * @returns {void}
 * @author Milan Ricoul
 */
function onResize() {
  const s = this._settings

  if (!s.mediaQuery && !this.initialized) {
    this.init()
  }

  if (s.mediaQuery && this.initialized && !s.mediaQuery.matches) {
    this.destroy()
  } else if (s.mediaQuery && !this.initialized && s.mediaQuery.matches) {
    this.init()
  }
}

/**
 * Close all targets on Esc keydown
 * @param {HTMLElement} el element from preset
 */
function closeOnEscPress(el) {
  window.addEventListener('keydown', (e) => {
    if (e.defaultPrevented) {
      return
    }

    const key = e.key || e.keyCode

    if (
      (key === 'Escape' || key === 'Esc' || key === 27) &&
      document.getElementById(el.getAttribute('aria-controls')).getAttribute('aria-hidden') !== 'true'
    ) {
      el.click()
    }
  })
}

Toggle.defaults = {
  bodyScrollLock: false,
  bodyScrollLockMediaQuery: false,
  closeOnBlur: false,
  closeOnEscPress: false,
  hasAnimation: false,
  isOpened: false,
  mediaQuery: null,
  onClick: null,
  target: null,
}

Toggle.preset = {
  'button[aria-controls="toggle-1"]': {},
  'button[aria-controls="toggle-2"]': {
    hasAnimation: true,
  },
  'button[aria-controls="toggle-3"]': {
    onClick: function () {
      window.alert('You have successfully clicked on the button.')
    },
  },
  'button[aria-controls="toggle-4"]': {
    mediaQuery: window.matchMedia('(max-width: 1024px)'),
  },
  'button[aria-controls="toggle-5"]': {
    isOpened: true,
  },
}

export default Toggle
