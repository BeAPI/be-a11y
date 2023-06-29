import { resolve } from 'path'
import { defineConfig } from 'vite'
import license from 'rollup-plugin-license'

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
      plugins: [
        license({
          thirdParty: {
            output: resolve(__dirname, './dist/vendor.LICENSE.txt'),
          },
        }),
      ],
  },
})
