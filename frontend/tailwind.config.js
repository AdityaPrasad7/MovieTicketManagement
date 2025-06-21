/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      minHeight: {
        'screen': '100vh',
      },
      height: {
        'screen': '100vh',
      },
      width: {
        'screen': '100vw',
      },
    },
  },
  plugins: [],
} 