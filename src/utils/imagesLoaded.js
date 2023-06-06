import noop from './noop'

// return orignal function or noop
function getFunction(fn) {
  return typeof fn === 'function' ? fn : noop
}

export default function (images, onImagesLoaded, onImageLoaded) {
  var i
  var counter = 0

  // be sure callbacks are function
  onImagesLoaded = getFunction(onImagesLoaded)
  onImageLoaded = getFunction(onImageLoaded)

  // can be a single image
  if (images.nodeType) {
    images = [images]
  }

  // increment counter for each image loaded, fire callbacks
  function incrementCounter(image) {
    counter++

    onImageLoaded(image)

    if (counter === images.length) {
      onImagesLoaded(images)
    }
  }

  function onLoad(e) {
    incrementCounter(e.currentTarget)
    e.currentTarget.removeEventListener(e.type, onLoad)
  }

  for (i = 0; i < images.length; i++) {
    if (images[i].classList.contains('lazyload') || images[i].classList.contains('lazyloading')) {
      images[i].addEventListener('lazyloaded', onLoad)
    } else if (images[i].complete || images[i].classList.contains('lazyloaded')) {
      incrementCounter(images[i])
    } else {
      images[i].addEventListener('load', onLoad)
    }
  }
}
