module.exports = {
  content: ['./src/**/*.html', './src/**/*.js'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        beapi: '#ffe600',
        dark: '#161516',
        'dark-border': '#535054',
      },
      backgroundImage: {
        'dark-bg': 'radial-gradient(79.39% 71.29% at 71.03% 24.17%, #333035 0%, #161516 100%)',
        'light-bg': 'radial-gradient(79.39% 71.29% at 71.03% 24.17%, #f5f5f5 0%, #ffffff 100%)',
      },
    },
    container: {
      center: true,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
