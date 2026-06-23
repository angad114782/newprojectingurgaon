/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Dynamic gradient classes from DB (location cards, etc.)
    { pattern: /^from-/ },
    { pattern: /^to-/ },
    { pattern: /^via-/ },
    { pattern: /^bg-gradient-/ },
    // Dynamic color classes from admin
    { pattern: /^text-(red|green|blue|yellow|orange|purple|pink|gray|slate|zinc|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /^bg-(red|green|blue|yellow|orange|purple|pink|gray|slate|zinc|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-(50|100|200|300|400|500|600|700|800|900)/ },
    { pattern: /^border-(red|green|blue|yellow|orange|purple|pink|gray|slate|zinc|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-(50|100|200|300|400|500|600|700|800|900)/ },
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:        '#1B4F72',
          DEFAULT:     '#1A4F72',
          bg:          '#1C5278',
          deep:        '#154360',
          accent:      '#F97316',
          'accent-alt':'#EA6C10',
          mint:        '#FFF7ED',
          text:        '#1A1A2E',
          muted:       '#64748B',
          border:      '#E2E8F0',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        card:        '0 4px 24px rgba(27,79,114,0.10)',
        'card-hover':'0 8px 40px rgba(27,79,114,0.18)',
        premium:     '0 2px 16px rgba(27,79,114,0.12)',
      },
    },
  },
  plugins: [],
};
