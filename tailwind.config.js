/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#FDF6E3',
          100: '#F5E6D3',
          200: '#E6D5BC',
          300: '#D4B794',
          400: '#C19B76',
          500: '#A67C5B',
          600: '#8B5E3D',
          700: '#6F4326',
          800: '#462B1F',
          900: '#2C1810',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#D4AF37',
              '&:hover': {
                color: '#B59530',
              },
            },
            blockquote: {
              borderLeftColor: '#D4AF37',
              color: 'inherit',
            },
            code: {
              color: 'inherit',
              background: 'rgba(212, 175, 55, 0.1)',
            },
          },
        },
      },
      scale: {
        '102': '1.02',
      },
      animation: {
        'in': 'in 0.3s ease-out',
      },
      keyframes: {
        in: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};