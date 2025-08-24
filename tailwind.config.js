/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brown: {
          50: '#FEFBF3',
          100: '#FDF4E1',
          200: '#F9E6C3',
          300: '#F2D49A',
          400: '#E8BD6F',
          500: '#D4A574',
          600: '#B8845A',
          700: '#956B47',
          800: '#6B4D35',
          900: '#4A3426',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
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
        '105': '1.05',
      },
      animation: {
        'in': 'in 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        in: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};