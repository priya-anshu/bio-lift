/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./*.html",
    "./*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Night Mode Colors
        'night': {
          'bg': '#000000',
          'card': '#111111',
          'accent': '#FF2C2C',
          'text-primary': '#FFFFFF',
          'text-secondary': '#AAAAAA',
          'border': '#333333',
          'hover': '#1a1a1a'
        },
        // Day Mode Colors
        'day': {
          'bg': '#F8F9FA',
          'card': '#FFFFFF',
          'accent-primary': '#007BFF',
          'accent-secondary': '#28A745',
          'text-primary': '#222222',
          'text-secondary': '#555555',
          'border': '#E9ECEF',
          'hover': '#F1F3F4'
        }
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'poppins': ['Poppins', 'sans-serif'],
        'urbanist': ['Urbanist', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(255, 44, 44, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 123, 255, 0.3)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
} 