/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cinematic palette
        cinema: {
          red: '#E50914',
          'red-dark': '#B20710',
          'red-glow': '#FF1A1A',
          black: '#0A0A0A',
          'black-soft': '#111111',
          'black-card': '#1A1A1A',
          'black-elevated': '#222222',
          silver: '#A0A0A8',
          'silver-light': '#C8C8D0',
          'silver-dark': '#606068',
          gold: '#D4AF37',
          'gold-light': '#F0CC50',
        },
        neon: {
          red: '#FF0033',
          blue: '#00D4FF',
          purple: '#9B59B6',
          green: '#00FF7F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cinema-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A0000 50%, #0A0A0A 100%)',
        'hero-gradient': 'linear-gradient(to right, rgba(10,10,10,0.95) 40%, rgba(10,10,10,0) 100%)',
        'card-gradient': 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0) 60%)',
        'red-glow-gradient': 'radial-gradient(circle, rgba(229,9,20,0.3) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon-red': '0 0 20px rgba(229, 9, 20, 0.5), 0 0 40px rgba(229, 9, 20, 0.25)',
        'neon-red-sm': '0 0 10px rgba(229, 9, 20, 0.4)',
        'neon-red-lg': '0 0 40px rgba(229, 9, 20, 0.6), 0 0 80px rgba(229, 9, 20, 0.3)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 20px rgba(229, 9, 20, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'cinema': '0 25px 50px rgba(0, 0, 0, 0.9)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'glow-red': 'glowRed 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'roulette': 'roulette 0.1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(229,9,20,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(229,9,20,0.8), 0 0 60px rgba(229,9,20,0.4)' },
        },
        glowRed: {
          '0%, 100%': { textShadow: '0 0 10px rgba(229,9,20,0.5)' },
          '50%': { textShadow: '0 0 30px rgba(229,9,20,1), 0 0 60px rgba(229,9,20,0.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        roulette: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
      },
      transitionTimingFunction: {
        'cinema': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};
