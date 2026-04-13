/**
 * Multi-page demo build for GitHub Pages (`pnpm build:demo`).
 */
import { defineConfig } from 'vite'
import { existsSync, readdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * GitHub Pages project site base path (e.g. /be-a11y/).
 * Set via DEMO_BASE when building for gh-pages; defaults to / for local preview.
 */
const base = process.env.DEMO_BASE ?? '/'
const normalizedBase = base === '/' ? '/' : base.endsWith('/') ? base : `${base}/`

const exampleHtmlFiles = readdirSync(resolve(__dirname, 'examples'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => resolve(__dirname, 'examples', d.name, 'index.html'))
  .filter((f) => existsSync(f))

export default defineConfig({
  base: normalizedBase,
  root: __dirname,
  resolve: {
    alias: {
      '@utils': resolve(__dirname, './src/utils'),
    },
  },
  optimizeDeps: {
    include: ['body-scroll-lock'],
  },
  build: {
    outDir: 'demo-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: [resolve(__dirname, 'index.html'), ...exampleHtmlFiles],
    },
  },
})
