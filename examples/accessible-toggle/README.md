# Accessible Toggle

The Toggle component is a button that triggers changes on a specified item when you click it.

* [Demo](https://codepen.io/beapi/full/BaZQjWm)

## Getting started

### Install the package

We can install the package from NPM or Yarn.
```bash
yarn add @beapi/be-a11y
```

Then import the component in your JavaScript.
```js
import { Toggle } from '@beapi/be-a11y';
```

### Add Toggle HTML Layout
Copy the following markup on your HTML file :

```html
<button type="button" class="button" aria-controls="toggle-1">Reveal text</button>

<div id="toggle-1" aria-hidden="true">
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis deserunt veniam perferendis recusandae sunt quasi, dolor laboriosam quibusdam saepe numquam officia, incidunt fugiat amet velit quas doloribus earum nostrum ut?</p>
</div>
```

### Initialize the component
Finally, we need to initialize this component in JavaScript.

```js
import { Toggle } from '@beapi/be-a11y';

Toggle.init('.button', {
  // Options here
});
```

If you have multiple toggle buttons, you can set a preset and initialize all at once.

```js
import { Toggle } from '@beapi/be-a11y';

Toggle.preset = {
  '#button-1': {
    onClick: function() {
        console.log('Clicked!');
    },
  },
  '#button-2': {
    target: '#my-div',
  },
};

Toggle.initFromPreset();
```

> **Warning**
> There is no embedded style. It's up to you to style the component as you see fit.

### Options

| name                       | type            | default | description                                                                                                                             |
|----------------------------|-----------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `bodyScrollLock`           | boolean         | `false` | If true, the body scroll is locked when the content is revealed.                                                                        |
| `bodyScrollLockMediaQuery` | boolean\|object | `false` | Lock the body scroll when the content is revealed based on the window match media.                                                      |
| `closeOnBlur`              | boolean         | `false` | When you unfocus the toggle button, the content is hidden.                                                                              |
| `closeOnEscPress`          | boolean         | `false` | When you press Escape button, the content is hidden.                                                                                    |
| `hasAnimation`             | boolean         | `false` | If true, the content has a slideDown / slideUp animation.                                                                               |
| `isOpened`                 | boolean         | `false` | If true, the content is revealed by default.                                                                                            |
| `mediaQuery`               | string          | `null`  | Apply toggle button to a window match media.                                                                                            |
| `onClick`                  | function        | `null`  | Callback function when you click on the toggle button.                                                                                  |
| `target`                   | string          | `null`  | Specify the content target with a selector. If null, the target is based on the `aria-controls` attribute value from the toggle button. |
