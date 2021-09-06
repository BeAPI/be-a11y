import AbstractDomElement from '../AbstractDomElement'

/**
 * FastAccess Class
 * @author Milan Ricoul
 */
class FastAccess extends AbstractDomElement {
  constructor(element, options) {
    const instance = super(element, options)

    // avoid double init :
    if (!instance.isNewInstance()) {
      return instance
    }

    this.handleFocus = this.handleFocus.bind(this)
    this.handleBlur = this.handleBlur.bind(this)

    this.applyToSelectors(
      this._element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      (element) => element.addEventListener('focus', this.handleFocus)
    )
    this.applyToSelectors(
      this._element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      (element) => element.addEventListener('blur', this.handleBlur)
    )
  }

  /**
   * Execute a function for every elements in node list
   * @param {NodeList} selectors node list
   * @param {Function} func callback
   * @returns {void}
   * @author Milan Ricoul
   */
  applyToSelectors(selectors, func) {
    Array.prototype.slice.call(selectors).forEach((s, i) => func(s, i))
  }

  /**
   * Handle focus event
   * @returns {void}
   * @author Milan Ricoul
   */
  handleFocus() {
    this._element.setAttribute('aria-hidden', 'false')
  }

  /**
   * Handle blur event
   * @returns {void}
   * @author Milan Ricoul
   */
  handleBlur() {
    this._element.setAttribute('aria-hidden', 'true')
  }
}

FastAccess.defaults = {}

export default FastAccess
