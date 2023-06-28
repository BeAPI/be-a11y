# Accessible Tabs

Component of tabs that reveal content when you click it.

* [See accessible specificies](https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html)
* [Demo](https://codepen.io/beapi/full/eYRBpQj)

## Getting started

### Install the package

We can install the package from NPM or Yarn.

```bash
yarn add @beapi/be-a11y
```

Then import the component in your JavaScript.

```js
import { Tabs } from '@beapi/be-a11y';
```

### Add Tabs HTML Layout

Copy the following markup on your HTML file :

```html
<div class="tabs">
    <div class="tabs__tablist" role="tablist" aria-label="Parer un ananas">
        <button class="tabs__tab" role="tab" aria-selected="true" aria-controls="tab-panel-1" id="tab-1">Tab 1</button>
        <button class="tabs__tab" role="tab" aria-selected="false" tabindex="-1" aria-controls="tab-panel-2" id="tab-2">Tab 2</button>
        <button class="tabs__tab" role="tab" aria-selected="false" tabindex="-1" aria-controls="tab-panel-3" id="tab-3">Tab 3</button>
        <!-- ... -->
    </div>

    <div class="tabs__panel" tabindex="0" role="tabpanel" id="tab-panel-1" aria-labelledby="tab-1">
        <!-- Your content here -->
    </div>
    <div class="tabs__panel" tabindex="0" role="tabpanel" id="tab-panel-2" aria-labelledby="tab-2" hidden>
        <!-- Your content here -->
    </div>
    <div class="tabs__panel" tabindex="0" role="tabpanel" id="tab-panel-3" aria-labelledby="tab-3" hidden>
        <!-- Your content here -->
    </div>
    <!-- ... -->
</div>
```

### Initialize the component

Finally, we need to initialize this component in JavaScript.

```js
import { Tabs } from '@beapi/be-a11y';

Tabs.init('.tabs', {
  // Options here
});
```

If you have multiple tabs with different HTML markup, you can set a preset and initialize all at once.

```js
import { Tabs } from '@beapi/be-a11y';

Tabs.preset = {
  '#tabs-1': {
    auto: false,
  },
  '#tabs-2': {
    auto: true,
  },
};

Tabs.initFromPreset();
```

> **Warning**
> There is no embedded style. It's up to you to style the component as you see fit.

### Options

| name               | type    | default                | description                                                                |
|--------------------|---------|------------------------|----------------------------------------------------------------------------|
| `auto`             | boolean | `false`                | Determines if you have to press Enter button on a tab to reveal the panel. |
| `tabListSelector`  | string  | `button[role="tab"]`   | The selector of the tab list.                                              |
| `tabPanelSelector` | string  | `div[role="tabpanel"]` | The selector of the panel(s).                                              |                  |
