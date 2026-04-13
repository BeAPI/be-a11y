import AbstractDomElement from './AbstractDomElement.ts'

interface LinkOptions {
  hasIcon: boolean
  iconSize: number
  replaceIcon?: string
  screenReaderText: string
  screenReaderClassName: string
}

/**
 * Represents a Link component.
 *
 * @extends AbstractDomElement
 */
export default class Link extends AbstractDomElement {
  /**
   * Options for configuring the Link component.
   *
   * @protected
   * @type {DropdownOptions}
   */
    protected options: LinkOptions

  /**
   * Default options for the Link component.
   *
   * @private
   * @static
   * @readonly
   * @type {LinkOptions}
   */
  private static readonly defaults: LinkOptions = {
    hasIcon: false,
    iconSize: 24,
    screenReaderText: '(opened in a new tab)',
    screenReaderClassName: 'sr-only'
  }

  /**
   * Constructs a new Link instance.
   *
   * @param {HTMLElement} element - The DOM node representing the Link container.
   * @param {Partial<LinkOptions>} options - Options for configuring the Link component.
   */
  constructor(element: HTMLElement, options: Partial<LinkOptions> = {}) {
    const mergedOptions: LinkOptions = {
      ...Link.defaults,
      ...options,
    }

    super(element, mergedOptions)

    if (!this.isNewInstance()) {
      return this
    }

    this.init()
  }

  /**
   * Initializes the Link component.
   *
   * @private
   * @returns {void}
   */
  private init(): void {
    const newTabLinks = this.element.querySelectorAll('a[target="_blank"]')
    const {hasIcon, iconSize, replaceIcon, screenReaderText, screenReaderClassName} = this.options

    for (const newTabLink of newTabLinks) {
      const screenReaderSpan = document.createElement('span')
      screenReaderSpan.textContent = ` ${screenReaderText}`
      screenReaderSpan.classList.add(screenReaderClassName)
      newTabLink.appendChild(screenReaderSpan)

      if (!hasIcon) {
        return
      }

      if (hasIcon && !replaceIcon) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        svg.setAttribute('viewBox', '0 0 24 24')
        svg.setAttribute('width', String(iconSize))
        svg.setAttribute('height', String(iconSize))
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('fill-rule', 'evenodd')
        path.setAttribute('clip-rule', 'evenodd')
        path.setAttribute('d', 'M14.8981 4.5363L18.6234 4.51946L12.2309 10.9119L13.2916 11.9726L19.6765 5.58765L19.6447 9.27985L21.1447 9.29276L21.1988 3.00781L14.8913 3.03631L14.8981 4.5363ZM7 4.24999C5.48122 4.24999 4.25 5.4812 4.25 6.99999V17C4.25 18.5188 5.48122 19.75 7 19.75H17C18.5188 19.75 19.75 18.5188 19.75 17V13.3611H18.25V17C18.25 17.6903 17.6904 18.25 17 18.25H7C6.30964 18.25 5.75 17.6903 5.75 17V6.99999C5.75 6.30963 6.30964 5.74999 7 5.74999H10.25V4.24999H7Z')
        svg.appendChild(path)
        newTabLink.appendChild(svg)
      }

      if (hasIcon && replaceIcon) {
        newTabLink.insertAdjacentHTML('beforeend', replaceIcon)
      }
    }
  }

  /**
   * Destroys the Link component.
   *
   * @param {HTMLElement | NodeList | string} element - The element or selector to destroy the link a11y behaviors.
   * @returns {void}
   */
  static destroy(element: HTMLElement | NodeList | string): void {
    const instance = AbstractDomElement.getInstance(element) as Link | undefined

    if (instance) {
      const {
        element,
        options: {hasIcon, replaceIcon, screenReaderClassName}
      } = instance

      for (const screenReaderSpan of document.querySelectorAll(`a[target="_blank"]`)) {
        screenReaderSpan.remove()

        if (hasIcon && !replaceIcon) {
          element.querySelector(`.${screenReaderClassName}`)?.remove()
        }

        if (hasIcon && replaceIcon) {
          element.querySelector('svg')?.remove()
        }
      }
    }

    AbstractDomElement.destroy(element)
  }
}
