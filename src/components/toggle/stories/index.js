import { storiesOf } from '@storybook/html'
import { useEffect } from '@storybook/client-api'

import Toggle from '../Toggle'
import '../../../css/index.css'
import '../style.css'

import DefaultToggle from './DefaultToggle.html?raw'
import AnimatedToggle from './AnimatedToggle.html?raw'
import CallbackToggle from './CallbackToggle.html?raw'
import MediaQueryToggle from './MediaQueryToggle.html?raw'
import OpenedToggle from './OpenedToggle.html?raw'

storiesOf('1. Components/Toggle', module)
  .add('Default', () => {
    useEffect(() => {
      Toggle.init('button[aria-controls="toggle"]')
    }, [])

    return DefaultToggle
  })
  .add('Animatation enabled', () => {
    useEffect(() => {
      Toggle.init('button[aria-controls="toggle"]', {
        hasAnimation: true,
      })
    }, [])

    return AnimatedToggle
  })
  .add('With callbacks', () => {
    useEffect(() => {
      Toggle.init('button[aria-controls="toggle"]', {
        onClick: function () {
          window.alert('You have successfully clicked on the button.')
        },
      })
    }, [])

    return CallbackToggle
  })
  .add('With matchMedia', () => {
    useEffect(() => {
      Toggle.init('button[aria-controls="toggle"]', {
        mediaQuery: window.matchMedia('(max-width: 1024px)'),
      })
    }, [])

    return MediaQueryToggle
  })
  .add('Opened by default', () => {
    useEffect(() => {
      Toggle.init('button[aria-controls="toggle"]', {
        isOpened: true,
      })
    }, [])

    return OpenedToggle
  })
