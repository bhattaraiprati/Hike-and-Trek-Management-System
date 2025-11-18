// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Body text - Inter
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        // Headings - Poppins
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        // Alternative names for clarity
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Custom sizes if needed
        'hero': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      colors: {
        // Nature-inspired color palette
        primary: {
          DEFAULT: '  #1B4332',
          light: '#2D5016'
        },
        secondary: {
          DEFAULT: '#1E3A5F',
          light: '#2C5F8D'
        },
        accent: {
          DEFAULT: '#FF6B35',
          dark: '#E76F51'
        },
        neutral: {
          white: '#F8F9FA',
          gray: '#495057'
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [require("flowbite/plugin")],
}