# Accessible Dropdown

Build an accessible dropdown arround your markup.

* [See accessible specificies](https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html)
* [Demo](https://codepen.io/beapi/full/VwQbYqN)

## Get started

Copy the following markup on your HTML file :

```html
<div class="dropdown">
    <span class="dropdown__label">Choose an element</span>
    <button aria-haspopup="listbox">Book</button>
    <ul tabindex="-1" role="listbox">
        <li role="option">Book</li>
        <li role="option">Movies</li>
        <li role="option">Music</li>
        <li role="option">Video games</li>
        <li role="option">Paint</li>
    </ul>
</div>
```

In `Dropdown.js` file, add the following preset :
```js
Dropdown.preset = {
  '.dropdown': {
      // options here
  },
}
```

Next, in jour JS file, import Dropdown class and initialize it :
```js
import Dropdown from '/path/to/Dropdown.js';

Dropdown.initFromPreset();
```

If you want to change the classes of the component, you can also initialize it :
```html
<div class="listbox">
    <span class="listbox__label">Choose an element</span>
    <button class="listbox__button" aria-haspopup="listbox">Book</button>
    <ul class="listbox__list" tabindex="-1" role="listbox">
        <li role="option">Book</li>
        <li role="option">Movies</li>
        <li role="option">Music</li>
        <li role="option">Video games</li>
        <li role="option">Paint</li>
    </ul>
</div>
```

```js
import Dropdown from '/path/to/Dropdown.js';

Dropdown.init('.listbox', {
    automaticSelection: true,
    buttonSelector: '.listbox__button',
    labelSelector: '.listbox__label',
    listSelector: '.listbox__list',
    prefixId: 'listbox',
});
```

## Options

| name                 | type                      | default            | description                                     |
|----------------------|---------------------------|--------------------|-------------------------------------------------|
| `automaticSelection` | boolean                   | `false`            | if `true`, first item is automatically selected |
| `buttonSelector`     | string                    | `button`           | Button selector.                                |
| `labelSelector`      | string                    | `.dropdown__label` | Label selector.                                 |
| `listSelector`       | string                    | `ul`               | Listbox selector.                               |
| `matchMedia`         | null or matchMedia object | `null`             | Set dropdown for a specific media query.        |
| `prefixId`           | string                    | `dropdown`         | Define the prefix id of the component.          |