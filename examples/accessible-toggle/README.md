# Accessible Toggle

The Toggle component is a button that triggers ARIA changes on a specified item when you click it.

## Get started

Copy the following markup on your HTML file :

```html
<button type="button" class="button" aria-controls="toggle-1">Reveal text</button>

<div id="toggle-1" aria-hidden="true">
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis deserunt veniam perferendis recusandae sunt quasi, dolor laboriosam quibusdam saepe numquam officia, incidunt fugiat amet velit quas doloribus earum nostrum ut?</p>
</div>
```

Next, in jour JS file, import Toggle class and initialize it :
```js
import Toggle from '/path/to/Toggle.js';

Toggle.initFromPreset();
```

If you want to change the classes of the component, you can also initialize it :
```html
<button type="button" class="menu-trigger">Show menu</button>

<div id="menu" aria-hidden="true">
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis deserunt veniam perferendis recusandae sunt quasi, dolor laboriosam quibusdam saepe numquam officia, incidunt fugiat amet velit quas doloribus earum nostrum ut?</p>
</div>
```

```js
import Toggle from '/path/to/Toggle.js';

Toggle.init('.menu-trigger', {
    closeOnEscPress: true,
    trigger: '#menu',
});
```

## Options

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