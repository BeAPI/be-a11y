# Accessible CssSlider

Build an accessible  arround your markup.

* [See accessible specificies](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
* [Demo](https://codepen.io/beapi/pen/GRYEzJo)

## Getting started

### Install the package

We can install the package from NPM or Yarn.
```bash
yarn add @beapi/be-a11y
```

Then import the component in your JavaScript.
```js
import { CssSlider } from '@beapi/be-a11y';
```

### Add Dropdown HTML Layout
Copy the following markup on your HTML file :

```html
<div class="css-slider" aria-label="Type de carrousel">
    <ul class="css-slider__items">
        <li class="css-slider__item" aria-label="Item 1 sur 3">
            ...
        </li>
        <li class="css-slider__item" aria-label="Item 2 sur 3">
            ...
        </li>
        <li class="css-slider__item" aria-label="Item 3 sur 3">
            ...
        </li>
    </ul>
    <div class="css-slider__nav">
        <button class="css-slider__prev">Previous</button>
        <button class="css-slider__next">Next</button>
    </div>
    <div class="css-slider__live-region sr-only"><!-- current item will be announced here based on item aria-label --></div>
</div>
```

### Initialize the component
Finally, we need to initialize this component in JavaScript.

```js
import { CssSlider } from '@beapi/be-a11y';

CssSlider.init('.dropdown', {
  // Options here
});
```

If you have multiple css slider with different options, you can set a preset and initialize all at once.

```js
import { CssSlider } from '@beapi/be-a11y';

CssSlider.preset = {
  '.css-slider--images': {
    infinite: true,
  },
  '.css-slider--cards': {
    dots: true,
  },
};

CssSlider.initFromPreset();
```

> **Warning**
> There is no embedded style. It's up to you to style the component as you see fit.

### Options

| name                 | type                      | default                         | description                                             |
|----------------------|---------------------------|---------------------------------|---------------------------------------------------------|
| `posAttr`            | string                    | `data-pos`                      | Attribute that will contain the position of the item    |
| `dirAttr`            | string                    | `data-dir`                      | Attribute that will contain the last move direction     |
| `currentAttr`        | string                    | `data-current`                  | Attribute that will contain the current index           |
| `dotsListClass`      | string                    | `css-slider__dots`              | Class of the dots list that will be generated           |
| `activeClass`        | string                    | `css-slider__active`            | Class of the current button in dots list                |
| `hiddenNavClass`     | string                    | `css-slider--hide-nav`          | Class added if there is less of 2 item                  |
| `counterClass`       | string                    | `css-slider__counter`           | Class of the counter that will be generated             |
| `items`              | string                    | `.css-slider__items`            | Selector of the items container                         |
| `item`               | string                    | `.css-slider__item`             | Selector of the item                                    |
| `prev`               | string                    | `.css-slider__prev`             | Selector of previous button                             |
| `next`               | string                    | `.css-slider__next`             | Selector of the next button                             |
| `customLinks`        | string                    | `.css-slider__custom-links`     | Selector of the custom dot links list                   |
| `liveRegion`         | string                    | `.css-slider__live-region`      | Selector of the live region (announce the current item) |
| `current`            | number                    | `0`                             | Index of the first item to display                      |
| `adaptiveHeight`     | boolean                   | `true`                          | Adpate height of the items container on item change     |
| `infinite`           | boolean                   | `false`                         | Infinite loop                                           |
| `dots`               | boolean                   | `false`                         | Generate dots list                                      |
| `counter`            | boolean                   | `false`                         | Generate counter                                        |
| `maxPrevPos`         | number                    | `-Infinity`                     | Max Number of previous position from index 0            |
| `maxNextPos`         | number                    | `Infinity`                      | Max number of next position from index 0                |
| `touch`              | boolean                   | `true`                          | Enable swipe                                            |
| `clickableItem`      | boolean                   | `false`                         | Enable click on item to change current index            |
| `onSetPosition`      | function                  | `function(index, pos) {}`       | Callback on set item position                           |
| `onGoto`             | function                  | `function(index, dir) {}`       | Callback on go to index                                 |
| `onClickItem`        | function                  | `function(evt, item, index) {}` | Callback on click item                                  |


