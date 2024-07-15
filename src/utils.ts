/**
 * Get NodeList from string or HTMLElement
 *
 * @param element the source element
 *
 * @returns {Node[]}
 */
export function getNodeListFromElement(element: HTMLElement | NodeList | string): Node[] {
    // In case, element is a string
    if (typeof element === 'string') {
      return Array.prototype.slice.call(document.querySelectorAll(element as string))
    }

    // In case, element is a HTMLElement
    if (element instanceof HTMLElement) {
      return [element]
    }

    // In case, element is already a NodeList
    return Array.prototype.slice.call(element)
}

/**
 * Get first NODE from string or HTMLElement
 *
 * @param element the source element
 *
 * @returns {Node | null}
 */
export function getFirstNodeFromElement(element: HTMLElement | NodeList | string): Node | null {
    const elements = getNodeListFromElement(element)

    return elements.length ? elements[0] : null
}