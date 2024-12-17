# Accessible Accordion

Component of accordion that reveal content when you click it.

* [See accessible specificies](https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html)
* [Demo](https://codepen.io/beapi/full/eYRBJJb)

## Getting started

### Install the package

We can install the package from NPM or Yarn.

```bash
yarn add @beapi/be-a11y
```

Then import the component in your JavaScript.

```js
import { Accordion } from '@beapi/be-a11y';
```

### Add Accordion HTML Layout

Copy the following markup on your HTML file :

```html
<div class="accordion">
  <h3>
    <button aria-expanded="true" class="accordion__trigger">
      <span class="accordion__title">
        Tab title
      </span>
    </button>
  </h3>
  <div class="accordion__panel" role="region">
    <!-- Your content here -->
  </div>
  <h3>
    <button aria-expanded="false" class="accordion__trigger">
      <span class="accordion__title">
        Tab title
      </span>
    </button>
  </h3>
  <div class="accordion__panel" role="region" style="display: none;">
    <!-- Your content here -->
  </div>
  <h3>
    <button aria-expanded="false" class="accordion__trigger">
      <span class="accordion__title">
        Tab title
      </span>
    </button>
  </h3>
  <div class="accordion__panel" role="region" style="display: none;">
    <!-- Your content here -->
  </div>
  <!-- ... -->
</div>
```

### Initialize the component

Finally, we need to initialize this component in JavaScript.

```js
import { Accordion } from '@beapi/be-a11y';

Accordion.init('.accordion', {
  // Options here
});
```

If you have multiple accordions with different HTML markup, you can set a preset and initialize all at once.

```js
import { Accordion } from '@beapi/be-a11y';

Accordion.preset = {
  '#accordion-1': {
    allowMultiple: true,
  },
  '#accordion-2': {
    forceExpand: false,
    hasAnimation: true,
  },
};

Accordion.initFromPreset();
```

> **Warning**
> There is no embedded style. It's up to you to style the component as you see fit.

### Options

| name                | type                      | default               | description                                             |
|---------------------|---------------------------|-----------------------|---------------------------------------------------------|
| `allowMultiple`     | boolean                   | `false`               | Allow accordion to open panels at the same time.        |
| `closedDefault`     | boolean                   | `false`               | If true, all panels are closed by default.              |
| `forceExpand`       | boolean                   | `true`                | If true, the accordion has at least one panel opened.   |
| `hasAnimation`      | boolean                   | `false`               | If true, the panel has a slideDown / slideUp animation. |
| `mediaQuery`        | null or matchMedia object | `null`                | Set dropdown for a specific media query.                |
| `onClose`           | null or function          | `null`                | Opened panel callback.                                  |
| `onOpen`            | null or function          | `null`                | Closed panel callback.                                  |
| `onReachBreakpoint` | null or function          | `null`                | Event when the media query is reached if `mediaQuery` option is filled. |
| `panelSelector`     | string                    | `.accordion__panel`   | The selector of the panels.                             |
| `prefixId`          | string                    | `accordion`           | The prefix id of the component.                         |
| `triggerSelector`   | string                    | `.accordion__trigger` | The selector of the trigger buttons.                    |
