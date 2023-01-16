import { storiesOf } from '@storybook/html'
import { useEffect } from '@storybook/client-api'

import Accordion from '../Accordion'
import '../../../css/index.css'
import '../style.css'

import DefaultAccordion from './Accordion.html?raw'
import AnimatedAccordion from './AnimatedAccordion.html?raw'
import AllowMultipleAccordion from './AllowMultipleAccordion.html?raw'
import AllClosableAccordion from './AllClosableAccordion.html?raw'
import ClosedAccordion from './ClosedAccordion.html?raw'
import CallbackAccordion from './CallbackAccordion.html?raw'

storiesOf('1. Components/Accordion', module)
  .add('Default', () => {
    useEffect(() => {
      Accordion.init('#accordion-demo-1')
    }, [])

    return DefaultAccordion
  })
  .add('Animation enabled', () => {
    useEffect(() => {
      Accordion.init('#accordion-demo-2', { hasAnimation: true })
    }, [])

    return AnimatedAccordion
  })
  .add('Multiple openable panels', () => {
    useEffect(() => {
      Accordion.init('#accordion-demo-3', { allowMultiple: true })
    }, [])

    return AllowMultipleAccordion
  })
  .add('All panels closable', () => {
    useEffect(() => {
      Accordion.init('#accordion-demo-4', { forceExpand: false })
    }, [])

    return AllClosableAccordion
  })
  .add('Accordion closed by default', () => {
    useEffect(() => {
      Accordion.init('#accordion-demo-5', { closedDefault: true })
    }, [])

    return ClosedAccordion
  })
  .add('With callbacks', () => {
    useEffect(() => {
      Accordion.init('#accordion-demo-6', {
        forceExpand: false,
        onClose: function (panel) {
          alert(`${panel.id} closed`)
        },
        onOpen: function (panel) {
          alert(`${panel.id} opened`)
        },
      })
    }, [])

    return CallbackAccordion
  })
