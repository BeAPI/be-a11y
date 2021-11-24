import Accordion from './classes/Accordion'
import Modal from './classes/Modal'
import Tabs from './classes/Tabs'
import Toggle from './classes/Toggle'
import './css/style.css'

// Accordion
Accordion.preset = {
  '#accordion-demo-1': {},
  '#accordion-demo-2': { hasAnimation: true },
  '#accordion-demo-3': { allowMultiple: true },
  '#accordion-demo-4': { forceExpand: false },
}

Accordion.initFromPreset()

// Modal
Modal.preset = {
  '.modal': {
    labelSelector: '.modal__title',
    closeButtonSelector: '.modal__close',
  },
}

Modal.initFromPreset()

// Tabs
Tabs.preset = {
  '#tab-demo-1': {},
  '#tab-demo-2': {
    auto: true,
  },
}

Tabs.initFromPreset()

// Toggle
Toggle.preset = {
  'button[aria-controls="toggle-1"]': {},
  'button[aria-controls="toggle-2"]': {
    hasAnimation: true,
  },
  'button[aria-controls="toggle-3"]': {
    onClick: function () {
      window.alert('You have successfully clicked on the button.')
    },
  },
  'button[aria-controls="toggle-4"]': {
    mediaQuery: window.matchMedia('(max-width: 1024px)'),
  },
  'button[aria-controls="toggle-5"]': {
    isOpened: true,
  },
}

Toggle.initFromPreset()
