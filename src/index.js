import Accordion from './classes/Accordion'
import Modal from './classes/Modal'
import Tabs from './classes/Tabs'
import Toggle from './classes/Toggle'
import './css/style.css'

Accordion.preset = {
  '#accordion-demo-1': {},
  '#accordion-demo-2': { hasAnimation: true },
  '#accordion-demo-3': { allowMultiple: true },
  '#accordion-demo-4': { forceExpand: false },
}

Accordion.initFromPreset()
Modal.initFromPreset()
Tabs.initFromPreset()
Toggle.initFromPreset()
