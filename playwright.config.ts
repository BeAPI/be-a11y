import {PlaywrightTestConfig, devices} from '@playwright/test'

const config: PlaywrightTestConfig = {
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: process.env.CI ? 'npx vite preview --port 5173' : 'npx vite dev',
    url: 'http://localhost:5173/',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },
}

export default config
