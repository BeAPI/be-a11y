# Accessible Accordion

Component of accordion that reveal content when you click it.

* [See accessible specificies](https://www.w3.org/TR/wai-aria-practices-1.1/examples/accordion/accordion.html)
* [Demo](https://codepen.io/beapi/full/eYRBJJb)

## Get started

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

In `Accordion.js` file, add the following preset :
```js
Accordion.preset = {
  '.accordion': {},
}
```

Next, in jour JS file, import Accordion class and initialize it :
```js
import Accordion from '/path/to/Accordion.js';

Accordion.initFromPreset();
```

If you want to change the classes of the component, you can also initialize it :
```html
<div class="accor">
  <h3>
    <button aria-expanded="true" class="accor-trigger">
      <span class="accor-title">
        Tab title
      </span>
    </button>
  </h3>
  <div class="accor-panel" role="region">
    <!-- Your content here -->
  </div>
  <h3>
    <button aria-expanded="false" class="accor-trigger">
      <span class="accor-title">
        Tab title
      </span>
    </button>
  </h3>
  <div class="accor-panel" role="region" style="display: none;">
    <!-- Your content here -->
  </div>
  <h3>
    <button aria-expanded="false" class="accor-trigger">
      <span class="accor-title">
        Tab title
      </span>
    </button>
  </h3>
  <div class="accor-panel" role="region" style="display: none;">
    <!-- Your content here -->
  </div>
  <!-- ... -->
</div>
```

```js
import Accordion from '/path/to/Accordion.js';

Accordion.init('.accor', {
  panelSelector: '.accor-panel',
  prefixId: 'Accordion',
  triggerSelector: '.accor-trigger',
});
```

## Options

| name              | type    | default               | description                                             |
|-------------------|---------|-----------------------|---------------------------------------------------------|
| `allowMultiple`   | boolean | `false`               | Allow accordion to open panels at the same time.        |
| `forceExpand`     | boolean | `true`                | If true, the accordion has at least one panel opened.   |
| `hasAnimation`    | boolean | `false`               | If true, the panel has a slideDown / slideUp animation. |
| `panelSelector`   | string  | `.accordion__panel`   | The selector of the panels.                             |
| `prefixId`        | string  | `accordion`           | The prefix id of the component.                         |
| `triggerSelector` | string  | `.accordion__trigger` | The selector of the trigger buttons.                    |                      |