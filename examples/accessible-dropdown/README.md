# Accessible Dropdown

Build an accessible dropdown arround your markup.

* [See accessible specificies](https://www.w3.org/TR/wai-aria-practices-1.1/examples/listbox/listbox-collapsible.html)
* [Demo](https://codepen.io/beapi/full/VwQbYqN)

## Getting started

### Install the package

We can install the package from NPM or Yarn.

```bash
yarn add @beapi/be-a11y
```

Then import the component in your JavaScript.

```js
import { Dropdown } from '@beapi/be-a11y';
```

### Add Dropdown HTML Layout

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

### Initialize the component

Finally, we need to initialize this component in JavaScript.

```js
import { Dropdown } from '@beapi/be-a11y';

Dropdown.init('.dropdown', {
  // Options here
});
```

If you have multiple dropdown with different HTML markup, you can set a preset and initialize all at once.

```js
import { Dropdown } from '@beapi/be-a11y';

Dropdown.preset = {
  '#dropdown-1': {
    automaticSelection: true,
  },
  '#dropdown-2': {
    mediaQuery: window.matchMedia('(min-width: 1024px)'),
  },
};

Dropdown.initFromPreset();
```

> **Warning**
> There is no embedded style. It's up to you to style the component as you see fit.

### Options

| name                 | type                      | default            | description                                     |
|----------------------|---------------------------|--------------------|-------------------------------------------------|
| `automaticSelection` | boolean \|\| string       | `false`            | if `true`, first item is automatically selected, if `string`, check if element exists and it will be selected. |
| `buttonSelector`     | string                    | `button`           | Button selector.                                |
| `labelSelector`      | string                    | `.dropdown__label` | Label selector.                                 |
| `listSelector`       | string                    | `ul`               | Listbox selector.                               |
| `mediaQuery`         | null or matchMedia object | `null`             | Set dropdown for a specific media query.        |
| `onChange`           | null or function          | `null`             | Event on dropdown change.                       |
| `onClose`            | null or function          | `null`             | Event on dropdown close.                        |
| `onListItemClick`    | null or function          | `null`             | Event on dropdown list item click.              |
| `onOpen`             | null or function          | `null`             | Event on dropdown open.                         |
| `prefixId`           | string                    | `dropdown`         | Define the prefix id of the component.          |

### Methods

You can interract with the Dropdown component by adding or removing items. See example below.

```html
<button id="add-item" type="button">Add new item</button>

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

```js
import { Dropdown } from '@beapi/be-a11y';

Dropdown.init('.dropdown');

const addButton = document.getElementById('add-item');
const dropdownInstance = Dropdown.getInstance('.dropdown');

addButton.addEventListener('click', function() {
  const newListItem = document.createElement('li');
  newListItem.innerText = 'Dummy';

  dropdownInstance.addItem(newListItem);
});
```

| Name             | Params                  | Description                                      |
|------------------|-------------------------|--------------------------------------------------|
| `addItem`        | `listItem: HTMLElement` | Adds a new list item to the dropdown.            |
| `removeItem`     | `listItem: HTMLElement` | Removes a specified list item from the dropdown. |
| `removeAllItems` | None                    | Removes all list items from the dropdown.        |
