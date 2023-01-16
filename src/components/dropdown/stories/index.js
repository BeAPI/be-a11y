import { storiesOf } from '@storybook/html'
import { useEffect } from '@storybook/client-api'

import Dropdown from '../Dropdown'
import '../../../css/index.css'
import '../style.css'

import DefaultDropdown from './Dropdown.html?raw'
import AutomaticSelectionDropdown from './AutomaticSelectionDropdown.html?raw'
import SpecificSelectionDropdown from './SpecificSelectionDropdown.html?raw'
import CallbackDropdown from './CallbackDropdown.html?raw'
import MediaQueryDropdown from './MediaQueryDropdown.html?raw'

storiesOf('1. Components/Dropdown', module)
  .add('Default', () => {
    useEffect(() => {
      Dropdown.init('#dropdown-1')
    }, [])

    return DefaultDropdown
  })
  .add('Automatic Selection', () => {
    useEffect(() => {
      Dropdown.init('#dropdown-2', {
        automaticSelection: true,
      })
    }, [])

    return AutomaticSelectionDropdown
  })
  .add('Specific item selection', () => {
    useEffect(() => {
      Dropdown.init('#dropdown-3', {
        automaticSelection: '.current',
      })
    }, [])

    return SpecificSelectionDropdown
  })
  .add('With callbacks', () => {
    useEffect(() => {
      Dropdown.init('#dropdown-4', {
        onChange: function () {
          alert('changed')
        },
        onClose: function () {
          alert('closed')
        },
        onListItemClick: function () {
          alert('List item click')
        },
        onOpen: function () {
          alert('opened')
        },
      })
    }, [])

    return CallbackDropdown
  })
  .add('With matchMedia', () => {
    useEffect(() => {
      Dropdown.init('#dropdown-5', {
        matchMedia: window.matchMedia('(max-width: 1024px)'),
      })
    }, [])

    return MediaQueryDropdown
  })