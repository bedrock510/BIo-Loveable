/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        goldAccent: '#BFA05A',
        bgDark: '#0b0b0b',
        panel: '#0f1113',
        accentLight: '#efe6cf',
        wgwText: '#F5F5F4'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
