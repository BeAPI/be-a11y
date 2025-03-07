/**
 * Loop a node list
 *
 * @param {NodeList} array node list
 *
 * @param {Function} callback function
 */
export const each = function (array, callback) {
  const l = array.length
  var i

  for (i = 0; i < l; i++) {
    callback(array[i], i, l)
  }
}

/**
 * Get a random id
 *
 * @example https://www.codemzy.com/blog/random-unique-id-javascript
 *
 * @param {number} length length of id
 *
 * @returns {string}
 */
export const randomId = function (prefix = '', length = 6) {
  return String(
    prefix +
      '-' +
      Math.random()
        .toString(36)
        .substring(2, length + 2)
  )
}

/**
 * Get the maximum height of sibling elements
 *
 * @param {NodeList} elements
 *
 * @returns {number}
 */
export const getMaxHeight = (elements: NodeListOf<Element>): number => {
  return Math.max(...Array.from(elements).map(el => el.scrollHeight))
}

/**
 * Check if an HTML element exists in DOM
 */
export const isSelectorValid = ((dummyElement) => (selector) => {
  try {
    dummyElement.querySelector(selector)
  } catch {
    return false
  }
  return true
})(document.createDocumentFragment())

export default isSelectorValid
