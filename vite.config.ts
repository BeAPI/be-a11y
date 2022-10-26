import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: ['body-scroll-lock'],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'index.js'),
      name: '@beapi/be-a11y',
      fileName: 'be-a11y',
    },
  },
})
