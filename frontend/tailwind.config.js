/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cognitune: {
          blue: '#e3f2fd',
          green: '#e8f5e9',
          yellow: '#fffde7',
          purple: '#f3e5f5',
          pink: '#fce4ec',
          teal: '#e0f7fa',
          gray: '#f8fafc',
        },
      },
    },
  },
  plugins: [],
}
