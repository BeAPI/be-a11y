/**
 * Return a unique id
 * @param {String} id prefix id
 * @param {String} separator separator between prefix and counter
 * @param {Number} counter initial index of the id
 * @returns {String}
 */
export default function getUniqueId(id, separator, counter) {
  const test = id + (counter >= 0 ? separator + counter.toString() : '')
  return !document.getElementById(test) ? test : getUniqueId(id, separator, counter + 1)
}
