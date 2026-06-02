/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7fa',
          100: '#e4ebf2',
          500: '#1e3a8a',
          600: '#1d4ed8',
          700: '#1d40af'
        },
        ai: {
          purple: '#8b5cf6',
          violet: '#7c3aed',
          fuchsia: '#d946ef',
          light: '#f5f3ff'
        },
        automation: {
          orange: '#f97316',
          amber: '#f59e0b',
          light: '#fff7ed'
        }
      }
    },
  },
  plugins: [],
}
