import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#18191c',
          card: '#1e1f22',
          terminal: '#0f1013',
          hover: '#25262b',
        },
        border: {
          DEFAULT: '#2c2e33',
          hover: '#4a4b50',
        },
        text: {
          DEFAULT: '#c1c2c5',
          muted: '#868e96',
          heading: '#ffffff',
        },
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#fbbf24',
        },
        profit: '#10b981',
        loss: '#ef4444',
        code: '#06b6d4',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'cursor-blink': 'blink 1s steps(2, start) infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
