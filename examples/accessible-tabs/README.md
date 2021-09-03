# Accessible Tabs

## Get started

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

If you want to add new tabs, dupplicate the button and panel markup without forgot to increment the id and aria attributes.

Next, in jour JS file, import Tabs class and initialize it :
```js
import Tabs from '/path/to/Tabs.js';

Tabs.initFromPreset();
```

If you want to change the classes of the component, you can also initialize it :
```html
<div class="tabulation">
    <div class="tabulation-list" role="tablist" aria-label="Parer un ananas">
        <button class="tabulation-tab" role="tab" aria-selected="true" aria-controls="tab-panel-1" id="tab-1">Tab 1</button>
        <button class="tabulation-tab" role="tab" aria-selected="false" tabindex="-1" aria-controls="tab-panel-2" id="tab-2">Tab 2</button>
    </div>

    <div class="tabulation-panel" tabindex="0" role="tabpanel" id="tab-panel-1" aria-labelledby="tab-1">
        <!-- Your content here -->
    </div>
    <div class="tabulation-panel" tabindex="0" role="tabpanel" id="tab-panel-2" aria-labelledby="tab-2" hidden>
        <!-- Your content here -->
    </div>
</div>
```

```js
import Tabs from '/path/to/Tabs.js';

Tabs.init('.tabulation', {
    auto: true,
});
```

## Options

| name               | type    | default                | description                                                                |
|--------------------|---------|------------------------|----------------------------------------------------------------------------|
| `auto`             | boolean | `true`                 | Determines if you have to press Enter button on a tab to reveal the panel. |
| `tabListSelector`  | string  | `button[role="tab"]`   | The selector of the tab list.                                              |
| `tabPanelSelector` | string  | `div[role="tabpanel"]` | The selector of the panel(s).                                              |
