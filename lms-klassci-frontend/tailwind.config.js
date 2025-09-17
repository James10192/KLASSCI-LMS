/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'liquid-glass': {
          'blue': {
            50: 'rgba(59, 130, 246, 0.05)',
            100: 'rgba(59, 130, 246, 0.1)',
            200: 'rgba(59, 130, 246, 0.2)',
            300: 'rgba(59, 130, 246, 0.3)',
            400: 'rgba(59, 130, 246, 0.4)',
            500: 'rgba(59, 130, 246, 0.5)',
          },
          'indigo': {
            50: 'rgba(99, 102, 241, 0.05)',
            100: 'rgba(99, 102, 241, 0.1)',
            200: 'rgba(99, 102, 241, 0.2)',
            300: 'rgba(99, 102, 241, 0.3)',
            400: 'rgba(99, 102, 241, 0.4)',
            500: 'rgba(99, 102, 241, 0.5)',
          },
          'purple': {
            50: 'rgba(139, 92, 246, 0.05)',
            100: 'rgba(139, 92, 246, 0.1)',
            200: 'rgba(139, 92, 246, 0.2)',
            300: 'rgba(139, 92, 246, 0.3)',
            400: 'rgba(139, 92, 246, 0.4)',
            500: 'rgba(139, 92, 246, 0.5)',
          }
        }
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'float-fast': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'liquid-distortion': 'liquid-distortion 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
        'liquid-distortion': {
          '0%, 100%': {
            filter: 'blur(0px) contrast(1) brightness(1)',
            transform: 'scale(1) rotate(0deg)'
          },
          '25%': {
            filter: 'blur(1px) contrast(1.1) brightness(1.1)',
            transform: 'scale(1.02) rotate(1deg)'
          },
          '50%': {
            filter: 'blur(2px) contrast(1.2) brightness(1.2)',
            transform: 'scale(1.05) rotate(0deg)'
          },
          '75%': {
            filter: 'blur(1px) contrast(1.1) brightness(1.1)',
            transform: 'scale(1.02) rotate(-1deg)'
          },
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}