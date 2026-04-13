# Accessible Link

The Link component is designed to enhance the accessibility of links that open in new tabs. It allows you to add specific text and icons to indicate to users that the link will open in a new tab. This is particularly useful for screen reader users, as it provides them with additional information about the link's behavior.

* [Demo — Default](https://codepen.io/beapi/full/JoPeWgV)
* [Demo — With icon](https://codepen.io/beapi/full/GgKwmgq)
* [Demo — With custom icon](https://codepen.io/beapi/full/KwPrmpQ)

## Getting started

### Install the package

We can install the package from NPM or Yarn.

```bash
yarn add @beapi/be-a11y
```

Then import the component in your JavaScript.

```js
import { Link } from '@beapi/be-a11y';
```

### Initialize the component

Then, initialize this component in JavaScript by targeting for example all links opened in a new tab.

```js
import { Link } from '@beapi/be-a11y';

Link.init('a[target="_blank"]', {
  // Options here
});
```

If you have multiple links with different options, you can set a preset and initialize all at once.

```js
import { Link } from '@beapi/be-a11y';

Link.preset = {
  '#wrapper-1 a[target="_blank"]': {
    hasIcon: true,
    iconSize: 16,
  },
  '#wrapper-2 a[target="_blank"]': {
    hasIcon: true,
  },
};

Link.initFromPreset();
```

> **Warning**
> There is no embedded style. It's up to you to style the component as you see fit.

| name                   | type                      | default            | description                                     |
|------------------------|---------------------------|--------------------|-------------------------------------------------|
| `hasIcon`   | boolean       | `false`            | if `true`, a default icon will be displayed. |
| `iconSize`       | number                    | `24`           | The default icon size.                                |
| `replaceIcon`        | string                    | '' | Plain text of your SVG or image HTML markup to display a custom icon.                                 |
| `screenReaderText`        | string                    | `"(opened in a new tab)"` | Screen reader only text.                                 |
| `screenReaderClassName`        | string                    | `"sr-only"` | Classname of screen ready only text span element.                                 |
