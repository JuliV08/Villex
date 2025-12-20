import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cromáticos premium
        primary: {
          50: '#f0fdff',
          100: '#ccfbff',
          200: '#99f6ff',
          300: '#5cefff',
          400: '#00e5ff', // cyan principal
          500: '#00c8e6',
          600: '#00a3bf',
          700: '#007a8c',
          800: '#005c6a',
          900: '#003d47',
        },
        accent: {
          magenta: '#ff00ff',
          violet: '#8b5cf6',
          purple: '#a855f7',
          pink: '#ec4899',
        },
        dark: {
          50: '#f7f7f8',
          100: '#eeeef0',
          200: '#d9d9de',
          300: '#b8b8c1',
          400: '#91919e',
          500: '#737383',
          600: '#5d5d6a',
          700: '#4c4c56',
          800: '#141419', // fondo principal
          900: '#0a0a0d', // fondo más oscuro
          950: '#050507',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glow-cyan': 'radial-gradient(ellipse at center, rgba(0, 229, 255, 0.15) 0%, transparent 70%)',
        'glow-magenta': 'radial-gradient(ellipse at center, rgba(255, 0, 255, 0.15) 0%, transparent 70%)',
        'glow-violet': 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        'hero-gradient': 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(255, 0, 255, 0.1) 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(0, 229, 255, 0.3)',
        'glow-md': '0 0 40px rgba(0, 229, 255, 0.4)',
        'glow-lg': '0 0 60px rgba(0, 229, 255, 0.5)',
        'glow-magenta': '0 0 40px rgba(255, 0, 255, 0.4)',
        'glow-violet': '0 0 40px rgba(139, 92, 246, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '16px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}

export default config
