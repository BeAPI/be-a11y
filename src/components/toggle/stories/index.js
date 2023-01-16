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
      Toggle.init('button[aria-controls="toggle-1"]')
    }, [])

    return DefaultToggle
  })
  .add('Animatation enabled', () => {
    useEffect(() => {
      Toggle.init('button[aria-controls="toggle-2"]', {
        hasAnimation: true,
      })
    }, [])

    return AnimatedToggle
  })
  .add('With callbacks', () => {
    useEffect(() => {
      Toggle.init('button[aria-controls="toggle-3"]', {
        onClick: function () {
          window.alert('You have successfully clicked on the button.')
        },
      })
    }, [])

    return CallbackToggle
  })
  .add('With matchMedia', () => {
    useEffect(() => {
      Toggle.init('button[aria-controls="toggle-4"]', {
        mediaQuery: window.matchMedia('(max-width: 1024px)'),
      })
    }, [])

    return MediaQueryToggle
  })
  .add('Opened by default', () => {
    useEffect(() => {
      Toggle.init('button[aria-controls="toggle-5"]', {
        isOpened: true,
      })
    }, [])

    return OpenedToggle
  })
