import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // CI: serve the multi-page demo build (examples/*) from demo-dist — same as `pnpm build:demo` / GitHub Pages.
    // Local: dev server with root vite config so tests hit /examples/... without a prior build.
    command: process.env.CI
      ? 'npx vite preview --config vite.demo.config.mjs --port 5173'
      : 'npx vite dev --port 5173',
    url: 'http://localhost:5173/',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
