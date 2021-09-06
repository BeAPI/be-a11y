[![Be API Github Banner](.github/banner-github.png)](https://beapi.fr)

# Accessible components
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
![Node.js CI](https://github.com/BeAPI/beapi-frontend-framework/workflows/Node.js%20CI/badge.svg?branch=master)

This repository contains a collection of useful accessible components such as tabs, accordion, modal dialog...

## Installation

Install dependencies
```bash
$ yarn
```

## Build

In `examples` directory you can find sample of components. First of all you have to build the JS with the following command.
```bash
$ yarn build
```

## Components
*   [Accordion](examples/accessible-accordion/)
*   [Fast Access](examples/accessible-fast-access/)
*   [Modal](examples/accessible-modal/)
*   [Tabs](examples/accessible-tabs/)
*   [Toggle](examples/accessible-toggle/)

## Tests

You can run UI tests with the following command.
```bash
$ yarn test
```

## Changelog

### 1.0.3
*   Add FastAccess class
*   Add description to components in docs
*   Add new UI tests
*   Fix Accordion class

### 1.0.2
*   Add Accordion class
*   Add Toggle class
*   Add UI tests
*   Add styles with Tailwind

### 1.0.1
*   Fix AbstractDomElement class
*   Add documentation for components

### 1.0.0
*   Init repo
*   Add webpack, eslint, babel
*   Add Tabs component
