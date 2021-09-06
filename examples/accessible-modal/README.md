# Accessible Modal

In user interface design for computer applications, a modal window is a graphical control element subordinate to an application's main window.

* [See accessible specificies](https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html)
* [Demo](https://codepen.io/beapi/full/mdwOVBm)

## Get started

Copy the following markup on your HTML file :

```html
<button type="button" aria-controls="dialog-1" data-modal="dialog-1">Open modal dialog</button>

<div class="modal" tabindex="-1" role="dialog" aria-modal="true" style="display: none;">
    <div class="modal__inner">
        <!-- Your content here -->

        <button type="button" class="modal__close">Close</button>
    </div>
</div>
```

Next, in jour JS file, import Modal class and initialize it :
```js
import Modal from '/path/to/Modal.js';

Modal.initFromPreset();
```

If you want to change the classes of the component, you can also initialize it :
```html
<button type="button" aria-controls="dialog-1" data-modal="dialog-1">Open modal dialog</button>

<div class="my-modal" tabindex="-1" role="dialog" aria-modal="true" style="display: none;">
    <div class="my-modal-inner">
        <h2 id="modal-title">My awesome modal</h2>
        <p id="modal-description">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse sunt explicabo vero sed nemo eveniet ullam error, commodi recusandae iste repudiandae culpa harum quisquam ipsa facere in quis. Eaque, labore.</p>

        <button type="button" class="my-modal-close">Close</button>
    </div>
</div>
```

```js
import Modal from '/path/to/Modal.js';

Modal.init('.my-modal', {
    prefixId: 'modal',
    labelSelector: '#modal-title',
    descriptionSelector: '#modal-description',
    closeButtonSelector: '.my-modal-close',
});
```

## Options

| name                  | type            | default  | description                                                             |
|-----------------------|-----------------|----------|-------------------------------------------------------------------------|
| `prefixId`            | string          | `dialog` | The prefix id of the component.                                         |
| `labelSelector`       | boolean\|string | `false`  | The selector of the modal label (for the attribute `aria-labelledby`).  |
| `descriptionSelector` | boolean\|string | `false`  | The selector of the modal label (for the attribute `aria-describedby`). |
| `closeButtonSelector` | boolean\|string | `false`  | The selector of the modal's close button.                               |