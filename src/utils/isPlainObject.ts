/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

/**
 * Returns true if the value is an object created by the Object constructor.
 *
 * @param o {any}
 * @returns {boolean}
 */
function isObject(o: any): boolean {
  return Object.prototype.toString.call(o) === '[object Object]'
}

/**
 * Returns true if the value is an object created by the Object constructor.
 *
 * @param o {any}
 * @returns {boolean}
 */
export default function isPlainObject(o: any): boolean {
  let ctor, prot

  if (isObject(o) === false) {
    return false
  }

  // If has modified constructor
  ctor = o.constructor
  if (ctor === undefined) {
    return true
  }

  // If has modified prototype
  prot = ctor.prototype
  if (isObject(prot) === false) {
    return false
  }

  // If constructor does not have an Object-specific method
  // eslint-disable-next-line no-prototype-builtins
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false
  }

  // Most likely a plain Object
  return true
}
