import {PlaywrightTestConfig, devices} from '@playwright/test'
const viteConfig = require('./vite.config.ts')

const config: PlaywrightTestConfig = {
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx vite',
    url: 'http://127.0.0.1:5173/',
    reuseExistingServer: true,
    timeout: 2000,
  },
  use: {
    ctPort: 8081,
    ctViteConfig: viteConfig,
  },
}

module.exports = config
