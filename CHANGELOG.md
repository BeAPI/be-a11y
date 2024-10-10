# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.5.8 - 2024-10-10

- Add new option `closeOnEscapeKey` for Modal component.

## 1.5.7 - 2024-10-03

- Add new methods for Dropdown component.
  - `addItem()`
  - `removeItem()`
  - `removeAllItems()`

## 1.5.6 - 2024-09-25

- Add condition to hidden class name for the modal component.

## 1.5.5 - 2024-07-31

- Add `onTabChange` option callback for Tabs component

## 1.5.4 - 2024-04-04

- Add support for 1 list item dropdown

## 1.5.3 - 2024-03-21

- Add `aria-expanded="false"` attribute to button on init and remove it on destroy for Toggle class.

## 1.5.2 - 2024-01-23

- Fix closed Modal focusable elements
- Fix `this.initialized` value in Modal
- Remove `babel-jest`

## 1.5.1 - 2024-01-03

- Fix playwright tests config
- Add option `closeOnFocusOutside` for Modal component.
- Add visible and hidden classNames for Modal component.
- Set aria-hidden attribute for Modal component.
- Remove inline styles for Modal component.

## 1.5.0 - 2023-11-21

- Update `vite` to version 5
- Update all packages
- Replace yarn with pnpm
- Update Slider README

## 1.4.5 - 2023-11-20

- Refactoring classes
- Add `super.destroy()` in `destroy()` methods.

## 1.4.4 - 2023-09-19

- Fix `aria-expanded` attribute value for closedDefault Accordion
- Complete documentation for Accordion

## 1.4.3 - 2023-09-14

- Add `mediaQuery` option to Accordion component
- Replace all `matchMedia` options with `mediaQuery`

## 1.4.2 - 2023-07-03

- Slider, infinite mode position

## 1.4.1 - 2023-06-29

- Refactoring helpers
- Remove uniqid package

## 1.4.0 - 2023-06-29

- Add Tree Shaking to the build
- Update `vite` to version 4
- Add `rollup-license-plugin`
- Fix Modal tests
- Fix Playwright webServer host
- Typo Modal README

## 1.3.4 - 2023-06-14

- Update `@playwright/test`
- Add `mediaQuery` option for Modal
- Add uniqid for Modal
- Add manual and automatic id for Modal

## 1.3.3 - 2023-06-13

- Remove Slider presets

## 1.3.2 - 2023-06-13

- Fix Slider documentation
- Fix Slider tests

## 1.3.1 - 2023-06-13

- Fix Slider component
- Add Slider to main README file

## 1.3.0 - 2023-06-06

- Add Slider component
- Bump json5 from 2.2.0 to 2.2.3

## 1.2.15 - 2023-01-03

- Allow string for automaticSelection for Dropdown component

## 1.2.14 - 2023-01-02

- Hotfix Accordion dupplicate ids

## 1.2.13 - 2023-01-02

- Add [uniqid](https://www.npmjs.com/package/uniqid)
- Add uniqid for Accordion and Toggle components
- Remove all aria attributes for dropdown component on destroy

## 1.2.12 - 2022-12-30

- Add param `onClose` and `onOpen` callbacks for Accordion component

## 1.2.11 - 2022-12-30

- Add param `closedDefault` for Accordion component
- Auto add accessibles attributes for Dropdown component

## 1.2.10 - 2022-11-29

- Update all README

## 1.2.9 - 2022-11-29

- Fix End To End tests

## 1.2.8 - 2022-11-24

- Add events onChange, onClose, onListItemClick and onOpen for Dropdown

## 1.2.7 - 2022-11-24

- Add automaticSelection option for Dropdown

## 1.2.6 - 2022-11-18

- Remove keydown events for Toggle

## 1.2.5 - 2022-11-10

- Fix dropdown detectClickOutsideElement method

## 1.2.4 - 2022-11-10

- Change e.target to e.currentTarget for dropdown

## 1.2.3 - 2022-11-10

- Fix innerHTML for dropdown

## 1.2.2 - 2022-10-26

- Remove unused dep

## 1.2.1 - 2022-10-26

- Fix package

## 1.2.0 - 2022-10-26

- Add Vite config for lib package
- add callback `onOpen()` and `onClose()` for Modal
- fix bugs for Modal

## 1.1.4 - 2022-10-26

- Dependencies security updates

## 1.1.3 - 2022-09-29

- Fix package.json

## 1.1.2 - 2022-09-25

- Update README

## 1.1.1 - 2022-09-24

- Refactoring

## 1.1.0 - 2022-09-24

- Replace Webpack with [ViteJS](https://vitejs.dev/)
- Hot Module Replacement
- Packages update
- HTML pages fix
- Add NPM package

## 1.0.6 - 2022-06-19

- Add Styelint 14

## 1.0.5 - 2022-06-19

- Add Dropdown class
- Add Dropdown UI tests

## 1.0.4 - 2022-05-08

- Finally, remove FastAccess class

## 1.0.3 - 2021-09-06

- Add FastAccess class
- Add description to components in docs
- Add new UI tests
- Fix Accordion class

## 1.0.2 - 2021-09-03

- Add Accordion class
- Add Toggle class
- Add UI tests
- Add styles with Tailwind

## 1.0.1 - 2021-08-31

- Fix AbstractDomElement class
- Add documentation for components

## 1.0.0 - 2021-08-30

- Init repo
- Add webpack, eslint, babel
- Add Tabs component
