import { storiesOf } from '@storybook/html'
import { useEffect } from '@storybook/client-api'

import Modal from '../Modal'
import '../../../css/index.css'
import '../style.css'

import DefaultModal from './DefaultModal.html?raw'

storiesOf('1. Components/Modal', module).add('Default', () => {
  useEffect(() => {
    Modal.init('.modal', {
      labelSelector: '.modal__title',
      closeButtonSelector: '.modal__close',
    })
  }, [])

  return DefaultModal
})
