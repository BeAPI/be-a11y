import noop from './noop'

// return orignal function or noop

/**
 * Get function or noop
 *
 * @param fn {Function}
 * @returns {Function}
 */
function getFunction(fn: Function) {
  return typeof fn === 'function' ? fn : noop
}

type ImagesLoadedCallback = (images: HTMLImageElement[]) => void

const imagesLoaded = (
  images: HTMLCollectionOf<HTMLImageElement>,
  singleCallback?: ImagesLoadedCallback | null,
  allCallback?: ImagesLoadedCallback | null
): void => {
  const loadedImages: HTMLImageElement[] = []
  let completed = 0

  const checkComplete = (img: HTMLImageElement) => {
    loadedImages.push(img)
    completed++

    if (singleCallback) singleCallback([img])
    if (completed === images.length && allCallback) allCallback(loadedImages)
  }

  Array.from(images).forEach(img => {
    if (img.complete) {
      checkComplete(img)
    } else {
      img.addEventListener('load', () => checkComplete(img))
    }
  })
}

export default imagesLoaded
