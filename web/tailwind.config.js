module.exports = {
  mode: 'jit',
  darkMode: 'media',
  content: [
    './public/**/*.html',
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Montserrat'],
      },
    },
  },
  plugins: [],
}
