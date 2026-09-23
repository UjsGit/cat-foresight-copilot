/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cat: {
          yellow: '#F5B800',
          yellowLight: '#FFD13B',
          yellowDark: '#D49B00',
          black: '#0E1117',
          surface: '#171B24',
          surfaceLight: '#202634',
          surfaceElevated: '#282F40',
          border: '#2F374A',
          borderHighlight: '#4A5568',
        },
        safety: {
          critical: '#EF4444',
          criticalDark: '#991B1B',
          warning: '#F59E0B',
          warningDark: '#92400E',
          info: '#3B82F6',
          infoDark: '#1E40AF',
          success: '#10B981',
          successDark: '#065F46'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'cockpit': '0 4px 20px -2px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        'hud-glow': '0 0 15px rgba(245, 184, 0, 0.25)',
        'alert-glow': '0 0 25px rgba(239, 68, 68, 0.45)',
      }
    },
  },
  plugins: [],
}
