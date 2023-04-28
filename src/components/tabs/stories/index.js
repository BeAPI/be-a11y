import { storiesOf } from '@storybook/html'
import { useEffect } from '@storybook/client-api'

import Tabs from '../Tabs'
import '../../../css/index.css'
import '../style.css'

import DefaultTabs from './DefaultTabs.html?raw'
import AutomaticDefault from './AutomaticDefault.html?raw'

storiesOf('1. Components/Tabs', module)
  .add('Default', () => {
    useEffect(() => {
      Tabs.init('#tab-demo')
    }, [])

    return DefaultTabs
  })
  .add('Automatic', () => {
    useEffect(() => {
      Tabs.init('#tab-demo', {
        auto: true,
      })
    }, [])

    return AutomaticDefault
  })
