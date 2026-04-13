[![Be API Github Banner](.github/banner-github.png)](https://beapi.fr)

# Be a11y

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/BeAPI/be-a11y/graphs/commit-activity)

This repository contains a collection of useful accessible components such as tabs, accordion, modal dialog...

## Installation

Start by installing the package.

```bash
pnpm add @beapi/be-a11y # or npm install @beapi/be-a11y --save or yarn add @beapi/be-a11y
```

Then, import in your JavaScript file the component you need.

```js
import { Accordion } from '@beapi/be-a11y';

Accordion.init('#my-accordion', {
    allowMultiple: true,
});
```

For more details about components, check the documentations:

* [Accordion](examples/accessible-accordion/)
* [Dialog](examples/accessible-dialog/)
* [Dropdown](examples/accessible-dropdown/)
* [Link](examples/accessible-link/)
* [Modal](examples/accessible-modal/)
* [Slider](examples/accessible-slider/)
* [Tabs](examples/accessible-tabs/)
* [Toggle](examples/accessible-toggle/)

## Want to contribute?

Project works with [Vite ⚡](https://vitejs.dev/) and [Playwright 🎭](https://playwright.dev/).

### Development

```bash
pnpm # Install dependencies

pnpm dev # Start development server
```

### Build

In `examples` directory you can find sample of components. First of all you have to build the JS with the following command.

```bash
pnpm build
```

Then, you can launch a local server.

```bash
pnpm preview
```

### Test your code

You can run UI tests with the following command.

```bash
pnpm test
```
