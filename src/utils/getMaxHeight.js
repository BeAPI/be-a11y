import each from './each'

export default function (elements) {
  var max = 0

  each(elements, function (element) {
    max = Math.max(element.offsetHeight, max)
  })

  return max
}
