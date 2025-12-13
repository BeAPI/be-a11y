# Accessible Modal

An accessible modal component that creates a focused overlay window on top of the main content. It implements proper focus management, keyboard navigation, and ARIA attributes to ensure all users can interact with modal content. When activated, it traps focus within the modal and provides clear mechanisms for dismissal, making it fully accessible to screen reader users and keyboard-only navigation.

**When to use Dialog vs Modal:**

- **Use Modal** when you need advanced features like CSS animations, responsive behavior with media queries, or close-on-outside-click functionality
- **Use [Dialog](../accessible-dialog/README.md)** when you want a modern, native implementation with minimal JavaScript and leverage browser features like the `closedby` attribute

This component implements proper focus management, keyboard navigation, and ARIA attributes to ensure all users can interact with dialog content, making it fully accessible to screen reader users and keyboard-only navigation.

- [See accessible specificies](https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html)
- [Demo — Default](https://codepen.io/beapi/full/mdwOVBm)
- [Demo — Close on focus outside](https://codepen.io/beapi/full/oNVbxOy)
- [Demo — Only for < 1024px devices](https://codepen.io/beapi/full/oNVbxVy)
- [Demo — Animated](https://codepen.io/beapi/full/LYaGNor)

## Getting started

### Install the package

We can install the package from NPM or Yarn.

```bash
yarn add @beapi/be-a11y
```

Then import the component in your JavaScript.

```js
import { Modal } from '@beapi/be-a11y';
```

### Manual ID

#### Add manual ID modal HTML markup

You can manually set an id on your modal element and specify it in the button's aria-controls value.

Copy the following markup on your HTML file :

```html
<button type="button" aria-controls="dialog-1">Open modal dialog</button>

<div id="dialog-1" class="modal" tabindex="-1" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="modal__inner">
        <!-- Your content here -->

        <button type="button" class="modal__close">Close</button>
    </div>
</div>
```

#### Initialize the component

Finally, we need to initialize this component in JavaScript.

```js
import { Modal } from '@beapi/be-a11y';

Modal.init('.modal');
```

### Automatic ID

#### Add automatic ID modal HTML markup

In this case, the id is automatically set on the modal element in JavaScript.

```html
<button type="button" class="trigger">Open modal dialog</button>

<div class="modal" tabindex="-1" role="dialog" aria-modal="true" style="display: none;">
    <div class="modal__inner">
        <!-- Your content here -->

        <button type="button" class="modal__close">Close</button>
    </div>
</div>
```

#### Initialize the component with automatic ID

You have to specifiy the triggerSelector option to define the trigger button.

```js
import { Modal } from '@beapi/be-a11y';

Modal.init('.modal', {
  triggerSelector: '.trigger',
});
```

If you have multiple modal with different HTML markup, you can set a preset and initialize all at once.

```js
import { Modal } from '@beapi/be-a11y';

Modal.preset = {
  '#modal-1': {
    triggerSelector: '.modal-btn--demo-1',
  },
  '#modal-2': {
    mediaQuery: window.matchMedia('(max-width: 1024px)'),
  },
};

Modal.initFromPreset();
```

> **Warning**
> There is no embedded style. It's up to you to style the component as you see fit.

### Options

| name                | type            | default          | description                                                                 |
|---------------------|-----------------|------------------|-----------------------------------------------------------------------------|
| closeButtonSelector | boolean\|string | `.modal__close`  | The selector of the modal close button.                                     |
| closedClassName     | string          | `modal--hidden`  | The class name when the modal is hidden.                                    |
| closeOnEscapeKey    | boolean         | `true`           | Should the 'Escape' key close the modal?                                    |
| closeOnFocusOutside | boolean\|string | `false`          | Specify the selector in which the modal should close on click. If false, the modal does not close on outside click. If true, the modal closes on outside click of the element. |
| descriptionSelector | boolean\|string | `false`          | The selector of the modal label (for the attribute  ` aria-describedby ` ). |
| labelSelector       | boolean\|string | `false`          | The selector of the modal label (for the attribute  ` aria-labelledby ` ).  |
| mediaQuery          | object          | `null`           | Apply modal to a window match.                                              |
| openedClassName     | string          | `modal--visible` | The class name when the modal is visible.                                   |
| onOpen              | function        | `null`           | Callback when modal is opened.                                              |
| onClose             | function        | `null`           | Callback when modal is closed.                                              |
| triggerSelector     | boolean\|string | `false`          | The selector of the modal trigger button.                                   |
