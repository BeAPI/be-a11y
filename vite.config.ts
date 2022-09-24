import { resolve } from 'path'
import { defineConfig } from 'vite'

const publicPath = 'examples'

export default defineConfig({
  optimizeDeps: {
    include: ['body-scroll-lock'],
  },
  build: {
    commonjsOptions: {
      include: [/body-scroll-lock/, /node_modules/],
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        accordion: resolve(__dirname, `${publicPath}/accessible-accordion/index.html`),
        dropdown: resolve(__dirname, `${publicPath}/accessible-dropdown/index.html`),
        modal: resolve(__dirname, `${publicPath}/accessible-modal/index.html`),
        tabs: resolve(__dirname, `${publicPath}/accessible-tabs/index.html`),
        toggle: resolve(__dirname, `${publicPath}/accessible-toggle/index.html`),
      },
    },
  },
})
