import extend from './utils/extend'

/**
 * AbstractDomElement class
 */
class AbstractDomElement {
  constructor(element, options) {
    let oldInstance

    // provide an explicit spaceName to prevent conflict after minification
    // MaClass.nameSpace = 'MaClass'
    this.constructor.nameSpace = this.constructor.nameSpace || this.constructor.name
    const nameSpace = this.constructor.nameSpace

    // if no spacename beapi, create it - avoid futur test
    if (!element.beapi) {
      element.beapi = {}
    }

    oldInstance = element.beapi[nameSpace]

    if (oldInstance) {
      console.warn(
        '[AbstractDomElement] more than 1 class is initialised with the same name space on :',
        element,
        oldInstance
      )
      oldInstance._isNewInstance = false
      return oldInstance
    }

    this._element = element
    this._settings = extend(true, {}, this.constructor.defaults, options)
    this._element.beapi[nameSpace] = this
    this._isNewInstance = true
  }

  /**
   * Check if it's a new instance
   * @returns {Boolean}
   */
  isNewInstance() {
    return this._isNewInstance
  }

  /**
   * Destroy the instance
   * @returns {Object}
   */
  destroy() {
    this._element.beapi[this.constructor.nameSpace] = undefined
    return this
  }

  /**
   * Initialize new instance
   * @param {String} element query selector
   * @param {Object} options object of settings
   * @returns {Object}
   */
  static init(element, options) {
    foreach(element, (el) => {
      new this(el, options)
    })

    return this
  }

  /**
   * Check if element has instance
   * @param {String} element query selector
   * @returns {Boolean}
   */
  static hasInstance(element) {
    const el = getDomElement(element)
    return el && el.beapi && !!el.beapi[this.nameSpace]
  }

  /**
   * Get the instance of element
   * @param {String} element query selector
   * @returns {Object}
   */
  static getInstance(element) {
    const el = getDomElement(element)
    return el && el.beapi ? el.beapi[this.nameSpace] : undefined
  }

  /**
   * Browse all elements from query selector string and destroy instances
   * @param {String} element query selector
   * @returns {Object}
   */
  static destroy(element) {
    this.foreach(element, (el) => {
      if (el.beapi && el.beapi[this.nameSpace]) {
        el.beapi[this.nameSpace].destroy()
      }
    })

    return this
  }

  /**
   * Browse all elements from query selector string
   * @param {String} element query selector
   * @param {Function} callback callback function
   * @returns {Object}
   */
  static foreach(element, callback) {
    foreach(element, (el) => {
      if (el.beapi && el.beapi[this.nameSpace]) {
        callback(el)
      }
    })

    return this
  }

  /**
   * Initialize new instances from class presets
   * @returns {Object}
   */
  static initFromPreset() {
    const preset = this.preset
    let selector

    for (selector in preset) {
      this.init(selector, preset[selector])
    }

    return this
  }

  /**
   * Destroy instances defined in class presets
   * @returns {Object}
   */
  static destroyFromPreset() {
    const preset = this.preset
    let selector

    for (selector in preset) {
      this.destroy(selector)
    }

    return this
  }
}

// ----
// utils
// ----
function foreach(element, callback) {
  const el = getDomElements(element)
  let i

  for (i = 0; i < el.length; i++) {
    if (callback(el[i]) === false) {
      break
    }
  }
}

function getDomElements(element) {
  return typeof element === 'string' ? document.querySelectorAll(element) : element.length >= 0 ? element : [element]
}

function getDomElement(element) {
  return getDomElements(element)[0]
}

export default AbstractDomElement
