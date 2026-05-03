/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Sora"', 'sans-serif'],
      },
      colors: {
        ink: '#0A141B',
        tide: '#0E2A38',
        mint: '#77FFC2',
        coral: '#FF8B6A',
        sand: '#F6EFE6',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(119,255,194,0.32), 0 20px 80px rgba(6, 22, 30, 0.35)',
      },
    },
  },
  plugins: [],
};
