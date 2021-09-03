/**
 * Throttle helper function
 * @param {Function} callback Callback function
 * @param {Number} delay Deflay of throttle
 * @returns {Function}
 */
const throttle = (callback, delay) => {
  let last
  let timer
  return function () {
    const context = this
    const now = +new Date()
    const args = arguments
    if (last && now < last + delay) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        callback.apply(context, args)
      }, delay)
    } else {
      last = now
      callback.apply(context, args)
    }
  }
}

export default throttle
