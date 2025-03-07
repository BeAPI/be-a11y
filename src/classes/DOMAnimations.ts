class DOMAnimations {
  /**
   * Hide an element with a jQuery slide effect
   * @param {HTMLElement} element
   * @param {number} duration
   * @param {Function} callback
   * @returns {Promise<boolean>}
   */
  static slideUp(element: HTMLElement, duration: number = 500, callback: () => void = () => {}): Promise<boolean> {
    return new Promise((resolve) => {
      element.style.height = `${element.offsetHeight}px`;
      element.style.transitionProperty = `height, margin, padding`;
      element.style.transitionDuration = `${duration}ms`;
      element.offsetHeight; // eslint-disable-line no-unused-expressions
      element.style.overflow = 'hidden';
      element.style.height = '0';
      element.style.paddingTop = '0';
      element.style.paddingBottom = '0';
      element.style.marginTop = '0';
      element.style.marginBottom = '0';

      window.setTimeout(() => {
        element.style.display = 'none';
        element.style.removeProperty('height');
        element.style.removeProperty('padding-top');
        element.style.removeProperty('padding-bottom');
        element.style.removeProperty('margin-top');
        element.style.removeProperty('margin-bottom');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition-duration');
        element.style.removeProperty('transition-property');
        resolve(false);

        if (callback) {
          callback();
        }
      }, duration);
    });
  }

  /**
   * Show an element with a jQuery slide effect
   * @param {HTMLElement} element
   * @param {number} duration
   * @param {Function} callback
   * @returns {Promise<boolean>}
   */
  static slideDown(element: HTMLElement, duration: number = 500, callback: () => void = () => {}): Promise<boolean> {
    return new Promise((resolve) => {
      element.style.removeProperty('display');
      let display = window.getComputedStyle(element).display;
      if (display === 'none') {
        display = 'block';
      }
      element.style.display = display;

      let height = element.offsetHeight;
      element.style.overflow = 'hidden';
      element.style.height = '0';
      element.style.paddingTop = '0';
      element.style.paddingBottom = '0';
      element.style.marginTop = '0';
      element.style.marginBottom = '0';
      element.offsetHeight; // eslint-disable-line no-unused-expressions
      element.style.transitionProperty = `height, margin, padding`;
      element.style.transitionDuration = `${duration}ms`;
      element.style.height = `${height}px`;
      element.style.removeProperty('padding-top');
      element.style.removeProperty('padding-bottom');
      element.style.removeProperty('margin-top');
      element.style.removeProperty('margin-bottom');

      window.setTimeout(() => {
        element.style.removeProperty('height');
        element.style.removeProperty('overflow');
        element.style.removeProperty('transition-duration');
        element.style.removeProperty('transition-property');
        resolve(true);

        if (callback) {
          callback();
        }
      }, duration);
    });
  }

  /**
   * Show or hide an element with a jQuery slide effect
   * @param {HTMLElement} element
   * @param {number} duration
   * @param {Function} callback
   * @returns {Promise<boolean>}
   */
  static slideToggle(element: HTMLElement, duration: number = 500, callback: () => void = () => {}): Promise<boolean> {
    if (window.getComputedStyle(element).display === 'none') {
      return this.slideDown(element, duration, callback);
    }
    return this.slideUp(element, duration, callback);
  }
}

export default DOMAnimations;
