/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'klassci': {
          'blue': {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e4d9b',  // Brand primary
            900: '#1a3f7a',
          },
          'orange': {
            50: '#fff3e0',
            100: '#ffccbc',
            200: '#ffab91',
            300: '#ff8a65',
            400: '#ff6b47',
            500: '#ff5722',
            600: '#ff4500',  // Brand secondary
            700: '#ea580c',
            800: '#c2410c',
            900: '#7c2d12',
          }
        },
        'liquid-glass': {
          'klassci-blue': {
            50: 'rgba(30, 77, 155, 0.05)',   // Bleu KLASSCI avec transparence
            100: 'rgba(30, 77, 155, 0.1)',
            200: 'rgba(30, 77, 155, 0.2)',
            300: 'rgba(30, 77, 155, 0.3)',
            400: 'rgba(30, 77, 155, 0.4)',
            500: 'rgba(30, 77, 155, 0.5)',
          },
          'klassci-orange': {
            50: 'rgba(255, 69, 0, 0.05)',    // Orange KLASSCI avec transparence
            100: 'rgba(255, 69, 0, 0.1)',
            200: 'rgba(255, 69, 0, 0.2)',
            300: 'rgba(255, 69, 0, 0.3)',
            400: 'rgba(255, 69, 0, 0.4)',
            500: 'rgba(255, 69, 0, 0.5)',
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
          '0%': { boxShadow: '0 0 20px rgba(30, 77, 155, 0.4)' },    // Bleu KLASSCI
          '100%': { boxShadow: '0 0 40px rgba(30, 77, 155, 0.8)' },
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