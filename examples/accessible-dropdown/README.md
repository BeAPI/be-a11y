# Accessible Dropdown

Build an accessible dropdown arround your markup.

* [See accessible specificies](https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html)
* [Demo](https://codepen.io/beapi/full/eYRBJJb)

## Get started

Copy the following markup on your HTML file :

```html
<div class="list" data-placeholder="Choose a category">
    <button type="button">Book</button>
    <button type="button">Movies</button>
    <button type="button">Music</button>
    <button type="button">Video games</button>
    <button type="button">Paint</button>
</div>
```

In `Dropdown.js` file, add the following preset :
```js
Dropdown.preset = {
  '.list': {
      // options here
  },
}
```

Next, in jour JS file, import Dropdown class and initialize it :
```js
import Dropdown from '/path/to/Dropdown.js';

Dropdown.initFromPreset();
```

## Options

| name                 | type                       | default            | description                                        |
|----------------------|----------------------------|--------------------|----------------------------------------------------|
| `defaultValueAttr`   | string                     | `data-placeholder` | Defines the data attribute to get the placeholder. |
| `matchMedia`         | null or matchMedia object  | `null`             | Set dropdown for a specific media query.           |
| `prefixClassName`    | string                     | `dropdown`         | The prefix class name of the component.            |
| `transitionDuration` | number                     | `500`              | Open and close animation duration in ms.           |