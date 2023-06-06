# Accessible Modal

In user interface design for computer applications, a modal window is a graphical control element subordinate to an application's main window.

* [See accessible specificies](https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html)
* [Demo](https://codepen.io/beapi/full/mdwOVBm)

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

### Add Modal HTML Layout
Copy the following markup on your HTML file :

```html
<button type="button" aria-controls="dialog-1" data-modal="dialog-1">Open modal dialog</button>

<div class="modal" tabindex="-1" role="dialog" aria-modal="true" style="display: none;">
    <div class="modal__inner">
        <!-- Your content here -->

        <button type="button" class="modal__close">Close</button>
    </div>
</div>
```

### Initialize the component
Finally, we need to initialize this component in JavaScript.

```js
import { Modal } from '@beapi/be-a11y';

Modal.init('.modal', {
  closeButtonSelector: '.modal__close'
});
```

If you have multiple modal with different HTML markup, you can set a preset and initialize all at once.

```js
import { Modal } from '@beapi/be-a11y';

Modal.preset = {
  '#modal-1': {
    closeButtonSelector: '.close-btn',
  },
  '#modal-2': {
    closeButtonSelector: '.modal-close-button',
  },
};

Modal.initFromPreset();
```

> **Warning**
> There is no embedded style. It's up to you to style the component as you see fit.

### Options

| name                  | type            | default  | description                                                             |
|-----------------------|-----------------|----------|-------------------------------------------------------------------------|
| `prefixId`            | string          | `dialog` | The prefix id of the component.                                         |
| `labelSelector`       | boolean\|string | `false`  | The selector of the modal label (for the attribute `aria-labelledby`).  |
| `descriptionSelector` | boolean\|string | `false`  | The selector of the modal label (for the attribute `aria-describedby`). |
| `closeButtonSelector` | boolean\|string | `false`  | The selector of the modal's close button.                               |
