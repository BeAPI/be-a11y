import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: ['body-scroll-lock'],
  },
  build: {
    commonjsOptions: {
      include: [/body-scroll-lock/, /node_modules/],
    },
  },
})
