/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bgvoid: '#05070a',
        navy: {
          900: '#070b14',
          800: '#0c1220',
          700: '#111a2c',
          600: '#182439',
        },
        cyberCyan: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        cyberEmerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        sev: {
          critical: '#f43f5e',
          high: '#f97316',
          medium: '#eab308',
          low: '#38bdf8',
          info: '#94a3b8',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glowCyan: '0 0 20px rgba(34,211,238,0.35)',
        glowEmerald: '0 0 20px rgba(52,211,153,0.35)',
        glowRed: '0 0 20px rgba(244,63,94,0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};