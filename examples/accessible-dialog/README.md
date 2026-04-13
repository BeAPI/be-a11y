# Accessible Dialog

A lightweight accessible dialog component built on the native HTML `<dialog>` element. It leverages modern browser capabilities (`show()`, `showModal()`, and `close()` methods) to create overlay windows with built-in accessibility features. Unlike the Modal component which uses custom HTML elements and CSS-based visibility toggling, Dialog relies on native browser behavior for simpler implementation and better performance.

**When to use Dialog vs Modal:**

- **Use Dialog** when you want a modern, native implementation with minimal JavaScript and leverage browser features like the `closedby` attribute
- **Use [Modal](../accessible-modal/README.md)** when you need advanced features like CSS animations, responsive behavior with media queries, or close-on-outside-click functionality

This component implements proper focus management, keyboard navigation, and ARIA attributes to ensure all users can interact with dialog content, making it fully accessible to screen reader users and keyboard-only navigation.

- [See accessible specificies](https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html)
- [Demo — Default](https://codepen.io/beapi/full/NPNmWeo)
- [Demo — Modal Behavior](https://codepen.io/beapi/full/ogxONmw)

## Getting started

### Install the package

We can install the package from NPM or Yarn.

```bash
yarn add @beapi/be-a11y
```

Then import the component in your JavaScript.

```js
import { Dialog } from '@beapi/be-a11y';
```

### Manual ID

#### Add manual ID modal HTML markup

You can manually set an id on your modal element and specify it in the button's aria-controls value.

Copy the following markup on your HTML file:

```html
<button type="button" aria-controls="dialog-1">Open modal dialog</button>

<dialog id="dialog-1" class="dialog">
  <!-- Your content here -->

  <button type="button" class="dialog__close">Close</button>
</dialog>
```

#### Initialize the component

Finally, we need to initialize this component in JavaScript.

```js
import { Dialog } from '@beapi/be-a11y';

Dialog.init('.dialog');
```

### Automatic ID

#### Add automatic ID modal HTML markup

In this case, the id is automatically set on the modal element in JavaScript.

```html
<button type="button" class="trigger">Open modal dialog</button>

<dialog class="dialog">
  <!-- Your content here -->

  <button type="button" class="dialog__close">Close</button>
</dialog>
```

#### Initialize the component with automatic ID

You have to specifiy the triggerSelector option to define the trigger button.

```js
import { Dialog } from '@beapi/be-a11y';

Dialog.init('.dialog', {
  triggerSelector: '.trigger',
});
```

If you have multiple modal with different HTML markup, you can set a preset and initialize all at once.

```js
import { Dialog } from '@beapi/be-a11y';

Dialog.preset = {
  '#dialog-1': {
    triggerSelector: '.modal-btn--demo-1',
  },
  '#dialog-2': {
    showDialogAsModal: true,
  },
};

Dialog.initFromPreset();
```

> **Warning**
> There is no embedded style. It's up to you to style the component as you see fit.

### Options

| name                | type         | default           | description                                                                                                      |
|---------------------|--------------|-------------------|------------------------------------------------------------------------------------------------------------------|
| closeButtonSelector | string       | `.dialog__close`  | The selector of the dialog close button.                                                                         |
| descriptionSelector | null\|string | `null`            | The selector of the dialog description element (for the attribute `aria-describedby`).                           |
| labelSelector       | null\|string | `null`            | The selector of the dialog label element (for the attribute `aria-labelledby`).                                  |
| onOpen              | function     | `() => {}`        | Callback function executed when the dialog is opened. Receives the MouseEvent as parameter.                      |
| onClose             | function     | `() => {}`        | Callback function executed when the dialog is closed. Receives the MouseEvent as parameter.                      |
| showDialogAsModal   | boolean      | `false`           | Whether to show the dialog as a modal (using `showModal()` method). When `true`, sets `aria-modal="true"`.       |
| triggerSelector     | null\|string | `null`            | The selector of the dialog trigger button(s). When specified, automatically sets `aria-controls` on the buttons. |

> **Note**
> For modal dialogs (`showDialogAsModal: true`), you can control the closing behavior using the native HTML [`closedby`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy) attribute on the `<dialog>` element:
>
> - `closedby="any"` - Allows closing via Esc key, clicking outside (light dismiss), or close button
> - `closedby="closerequest"` - Allows closing via Esc key or close button only
> - `closedby="none"` - Requires explicit close button interaction only
>
> ```html
> <dialog class="dialog" closedby="any">
>   <!-- Dialog content -->
> </dialog>
> ```
>
> **Browser support:** This feature has limited availability. Check [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy#browser_compatibility) before using it in production.
