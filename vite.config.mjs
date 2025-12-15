import { defineConfig } from 'vite'
import { dependencies } from './package.json';
import license from 'rollup-plugin-license'
import { resolve } from 'path'

const externalPackages = [
  ...Object.keys(dependencies || {}),
];

// Creating regexes of the packages to make sure subpaths of the
// packages are also treated as external
const regexesOfPackages = externalPackages.map(
  (packageName) => new RegExp(`^${packageName}(/.*)?`),
);

export default defineConfig({
  resolve: {
    alias: {
      '@utils': resolve(__dirname, './src/utils'),
    },
  },
  optimizeDeps: {
    include: ['body-scroll-lock'],
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'be-a11y.ts'),
      name: '@beapi/be-a11y',
      fileName: 'be-a11y',
    },
    rollupOptions: {
      output: [
        {
          dir: 'dist',
          format: 'es',
          preserveModules: true,
          entryFileNames: '[name].js',
        },
      ],
      external: regexesOfPackages,
      plugins: [
        license({
          thirdParty: {
            output: resolve(__dirname, './dist/vendor.LICENSE.txt'),
          },
        }),
      ],
    },
  },
})
