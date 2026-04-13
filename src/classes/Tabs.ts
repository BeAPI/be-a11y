import AbstractDomElement from './AbstractDomElement.ts'

interface TabsOptions {
  auto: boolean
  tabListSelector: string
  tabPanelSelector: string
}

/**
 * Tabs component for managing tabbed interfaces.
 *
 * @extends AbstractDomElement
 * @author Milan Ricoul
 */
export default class Tabs extends AbstractDomElement {
  /**
   * Whether the component has focus.
   */
  protected focus: boolean

  /**
   * Options for configuring the Tabs component.
   */
  protected options: TabsOptions

  /**
   * Bound event handlers
   */

  private handleButtonClick: (e: MouseEvent) => void // eslint-disable-line no-unused-vars
  private handleButtonFocus: () => void
  private handleButtonBlur: () => void
  private handleKeydown: (e: KeyboardEvent) => void // eslint-disable-line no-unused-vars

  /**
   * Default options for the Tabs component.
   *
   * @typedef {Object} TabsOptions
   * @property {boolean} auto - Whether to automatically switch tabs on focus.
   * @property {string} tabListSelector - The selector for the tab list buttons.
   * @property {string} tabPanelSelector - The selector for the tab panels.
   */
  private static readonly defaults = {
    auto: false,
    tabListSelector: 'button[role="tab"]',
    tabPanelSelector: 'div[role="tabpanel"]',
  }

  /**
   * Constructs a new Tabs instance.
   *
   * @param {HTMLElement} element - The DOM node representing the tabs container.
   * @param {Partial<TabsOptions>} options - Options for configuring the Tabs component.
   */
  constructor(element: HTMLElement, options: Partial<TabsOptions> = {}) {
    const mergedOptions = {
      ...Tabs.defaults,
      ...options,
    }

    super(element, mergedOptions)

    if (!this.isNewInstance()) {
      return this
    }

    this.options = mergedOptions

    this.handleButtonClick = this._handleButtonClick.bind(this)
    this.handleButtonFocus = this._handleButtonFocus.bind(this)
    this.handleButtonBlur = this._handleButtonBlur.bind(this)
    this.handleKeydown = this._handleKeydown.bind(this)

    this.init()
  }

  /**
   * Initializes the Tabs component.
   */
  private init(): void {
    const element = this.element as HTMLElement
    const buttons = element.querySelectorAll<HTMLButtonElement>(this.options.tabListSelector)

    for (const button of buttons) {
      // eslint-disable-next-line no-undef
      button.addEventListener('click', this.handleButtonClick as EventListener)
      button.addEventListener('focus', this.handleButtonFocus)
      button.addEventListener('blur', this.handleButtonBlur)
    }

    document.addEventListener('keydown', this.handleKeydown)
  }

  /**
   * Destroys the Tabs component, removing event listeners and cleanup.
   *
   * @param {HTMLElement | NodeList | string} element - The element or elements to destroy.
   */
  static destroy(element: HTMLElement | NodeList | string): void {
    const instance = AbstractDomElement.getInstance(element) as Tabs | undefined

    if (instance) {
      const {
        element,
        options: { tabListSelector },
      } = instance
      const buttons = element.querySelectorAll(tabListSelector)

      for (const button of buttons) {
        // eslint-disable-next-line no-undef
        button.removeEventListener('click', instance.handleButtonClick as EventListener)
        button.removeEventListener('focus', instance.handleButtonFocus)
        button.removeEventListener('blur', instance.handleButtonBlur)
      }

      document.removeEventListener('keydown', instance.handleKeydown)
    }

    AbstractDomElement.destroy(element)
  }

  /**
   * Opens the specified tab panel.
   *
   * @param {HTMLButtonElement} button - The tab button element to activate.
   */
  open(button: HTMLButtonElement): void {
    const buttons = this.element.querySelectorAll(this.options.tabListSelector)
    const ariaControls = button.getAttribute('aria-controls')

    if (!ariaControls) {
      return
    }

    const panel = document.getElementById(ariaControls) as HTMLElement

    for (const button of buttons) {
      this.close(button as HTMLButtonElement)
    }

    button.focus()
    button.setAttribute('aria-selected', 'true')
    button.removeAttribute('tabindex')
    panel.removeAttribute('hidden')
  }

  /**
   * Closes the specified tab panel.
   *
   * @param {HTMLButtonElement} button - The tab button element to deactivate.
   */
  close(button: HTMLButtonElement): void {
    const ariaControls = button.getAttribute('aria-controls')

    if (!ariaControls) {
      return
    }

    const panel = document.getElementById(ariaControls) as HTMLElement
    button.setAttribute('aria-selected', 'false')
    button.setAttribute('tabindex', '-1')
    panel.setAttribute('hidden', '')
  }

  /**
   * Focuses the previous tab. If no previous tab exists, focuses the last tab.
   */
  private focusPreviousTab = (): void => {
    const activeElement = document.activeElement

    if (
      activeElement &&
      activeElement.parentElement &&
      activeElement.parentElement.getAttribute('role') === 'tablist'
    ) {
      const previousButton = (activeElement.previousElementSibling ||
        activeElement.parentElement.lastElementChild) as HTMLButtonElement

      this.options.auto
        ? this.open(previousButton)
        : previousButton
        ? previousButton.focus()
        : this.open(previousButton)
    }
  }

  /**
   * Focuses the next tab. If no next tab exists, focuses the first tab.
   */
  private focusNextTab = (): void => {
    const activeElement = document.activeElement

    if (
      activeElement &&
      activeElement.parentElement &&
      activeElement.parentElement.getAttribute('role') === 'tablist'
    ) {
      const nextButton = (activeElement.nextElementSibling ||
        activeElement.parentElement.firstElementChild) as HTMLButtonElement

      this.options.auto ? this.open(nextButton) : nextButton.focus()
    }
  }

  /**
   * Focuses the first tab.
   */
  private focusFirstTab = (): void => {
    const firstTab = this.element.querySelectorAll(this.options.tabListSelector)[0] as HTMLButtonElement

    this.options.auto ? this.open(firstTab) : firstTab.focus()
  }

  /**
   * Focuses the last tab.
   */
  private focusLastTab = (): void => {
    const tabs = this.element.querySelectorAll(this.options.tabListSelector)
    const tabsCount = tabs.length
    const lastTab = tabs[tabsCount - 1] as HTMLButtonElement

    this.options.auto ? this.open(lastTab) : lastTab.focus()
  }

  /**
   * Removes the focused tab, then focuses the first tab.
   */
  private removeTab = (): void => {
    const activeElement = document.activeElement
    const firstTab = this.element.querySelectorAll(this.options.tabListSelector)[0]
    const ariaControls = activeElement && activeElement.getAttribute('aria-controls')
    if (
      activeElement &&
      ariaControls &&
      activeElement.parentElement &&
      activeElement.parentElement.getAttribute('role') === 'tablist' &&
      activeElement.hasAttribute('data-deletable')
    ) {
      const panel = document.getElementById(ariaControls) as HTMLElement
      if (panel.parentNode) {
        panel.parentNode.removeChild(panel)
      }
      activeElement.parentElement.removeChild(activeElement)
      this.open(firstTab as HTMLButtonElement)
    }
  }

  /**
   * Handles click events on tab buttons.
   *
   * @param {MouseEvent} e - The MouseEvent object.
   */
  private _handleButtonClick(e: MouseEvent): void {
    const clickedButton = e.currentTarget as HTMLButtonElement
    const isSelected = clickedButton && clickedButton.getAttribute('aria-selected') === 'true'

    if (!isSelected) {
      this.open(clickedButton)
    }
  }

  /**
   * Handles focus events on tab buttons.
   */
  private _handleButtonFocus(): void {
    this.focus = true
  }

  /**
   * Handles blur events on tab buttons.
   */
  private _handleButtonBlur(): void {
    this.focus = false
  }

  /**
   * Handles keyboard keydown events for tab navigation.
   *
   * @param {KeyboardEvent} e - The KeyboardEvent object.
   */
  private _handleKeydown(e: KeyboardEvent): void {
    if (!this.focus) {
      return
    }

    switch (e.code) {
      case 'ArrowLeft':
        this.focusPreviousTab()
        break
      case 'ArrowRight':
        this.focusNextTab()
        break
      case 'Home':
        this.focusFirstTab()
        break
      case 'End':
        this.focusLastTab()
        break
      case 'Delete':
        this.removeTab()
    }
  }
}
