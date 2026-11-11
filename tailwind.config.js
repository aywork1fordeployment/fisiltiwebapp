/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#090A0F', // Dış arka plan
          900: '#11131A', // Ana kabin
          850: '#151822', // Sahne ve header/alt bar
          800: '#181B26', // Kart ve araç çubuğu yüzeyleri
          750: '#1E2230', // Hover ve input yüzeyleri
          judge: '#1A1E2B', // Yargıç mesaj balonu
          suspect: '#242938', // Şüpheli mesaj balonu
          drawer: '#131520', // Aynanın Arkası çekmecesi
        },
        spotlight: {
          light: '#fef08a',
          DEFAULT: '#F59E0B',
          dark: '#b45309',
        },
        authority: {
          DEFAULT: '#E11D48',
          dark: '#9f1239',
        }
      },
      fontFamily: {
        sans: ['Outfit', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      keyframes: {
        'pendulum': {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' },
        },
        'pendulum-wild': {
          '0%, 100%': { transform: 'rotate(-12deg)' },
          '50%': { transform: 'rotate(12deg)' },
        },
        'screen-shake': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '20%': { transform: 'translate(-3px, 3px) rotate(-0.5deg)' },
          '40%': { transform: 'translate(3px, -2px) rotate(0.5deg)' },
          '60%': { transform: 'translate(-2px, 2px) rotate(0deg)' },
          '80%': { transform: 'translate(2px, -1px) rotate(0.5deg)' },
        },
        'stamp-slam': {
          '0%': { transform: 'scale(2.5) rotate(-22deg)', opacity: '0' },
          '70%': { transform: 'scale(0.95) rotate(-5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-6deg)', opacity: '1' },
        },
      },
      animation: {
        'pendulum': 'pendulum 4s ease-in-out infinite',
        'pendulum-wild': 'pendulum-wild 1s ease-in-out infinite',
        'screen-shake': 'screen-shake 0.35s ease-in-out',
        'stamp-slam': 'stamp-slam 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }
    },
  },
  plugins: [],
}
