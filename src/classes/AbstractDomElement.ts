import { getFirstNodeFromElement, getNodeListFromElement } from '../utils'

/**
 * AbstractDomElement provides a base class for managing DOM elements.
 */
export default class AbstractDomElement {
  public element: HTMLElement
  protected newInstance: boolean
  protected static preset: { [key: string]: object } = {}
  protected options: object

  /**
   * A map to keep track of initialized elements.
   */
  private static initializedElements: Map<HTMLElement | Node, AbstractDomElement> = new Map()

  /**
   * Constructs an instance of AbstractDomElement.
   *
   * @param {HTMLElement} element - The DOM element to be managed.
   * @param {object} [options={}] - Configuration options for the element.
   */
  constructor(element: HTMLElement, options: object = {}) {
    if (AbstractDomElement.initializedElements.has(element)) {
      console.warn(`[AbstractDomElement]: this element has already been initialised.`)
      this.newInstance = false

      return
    }

    AbstractDomElement.initializedElements.set(element, this)

    this.element = element
    this.options = options
    this.newInstance = true
  }

  /**
   * Initializes DOM elements.
   *
   * @param {HTMLElement | NodeList | string} element - The element(s) to initialize.
   * @param {object} [options={}] - Configuration options for the elements.
   */
  static init(element: HTMLElement | NodeList | string, options = {}) {
    const elements = getNodeListFromElement(element)

    for (const element of elements) {
      if (typeof this === 'function' && typeof this.prototype.constructor === 'function') {
        new this(element as HTMLElement, options)
      }
    }
  }

  /**
   * Initializes DOM elements based on preset configurations.
   * This method iterates over the static `preset` property of the class,
   * initializing elements with corresponding options.
   *
   * @returns {typeof AbstractDomElement} The class itself for chaining purposes.
   */
  static initFromPreset(): void {
    const preset = this.preset

    for (const selector in preset) {
      this.init(selector, preset[selector])
    }

    return
  }

  /**
   * Destroys the instance associated with the given element.
   *
   * @param {HTMLElement | NodeList | string} element - The element(s) to destroy.
   */
  static destroy(element: HTMLElement | NodeList | string): void {
    const elements = getNodeListFromElement(element)

    for (const element of elements) {
      if (AbstractDomElement.initializedElements.has(element)) {
        AbstractDomElement.initializedElements.delete(element)

        return
      }

      console.warn(`[AbstractDomElement]: this element cannot be destroyed because it is not initialized yet.`)
    }
  }

  /**
   * Destroys instances based on preset configurations.
   *
   * @returns {typeof AbstractDomElement} The class itself for chaining purposes.
   */
  static destroyFromPreset(): void {
    const preset = this.preset

    for (const selector in preset) {
      this.destroy(selector)
    }

    return
  }

  /**
   * Checks if the instance is new.
   *
   * @returns {boolean} True if the instance is new, otherwise false.
   */
  isNewInstance(): boolean {
    return this.newInstance
  }

  /**
   * Checks if an instance exists for the given element.
   *
   * @param {HTMLElement | NodeList | string} element - The element to check.
   * @returns {boolean} True if an instance exists, otherwise false.
   */
  static hasInstance(element: HTMLElement | NodeList | string): boolean {
    const el = getFirstNodeFromElement(element) as HTMLElement

    return AbstractDomElement.initializedElements.has(el)
  }

  /**
   * Gets the instance associated with the given element.
   *
   * @param {HTMLElement | NodeList | string} element - The element to get the instance for.
   * @returns {AbstractDomElement | undefined} The instance if found, otherwise undefined.
   */
  static getInstance(element: HTMLElement | NodeList | string): AbstractDomElement | undefined {
    const elements = getNodeListFromElement(element)
    return elements.length ? AbstractDomElement.initializedElements.get(elements[0] as HTMLElement) : undefined
  }
}
