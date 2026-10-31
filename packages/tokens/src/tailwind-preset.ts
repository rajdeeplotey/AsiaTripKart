import type { Config } from 'tailwindcss';

// Maps Tailwind utilities onto the CSS variables in tokens.css so a theme switch needs no rebuild.
const preset = {
  theme: {
    screens: { sm: '360px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1920px' },
    container: { center: true, padding: { DEFAULT: '16px', lg: '32px' }, screens: { xl: '1280px' } },
    extend: {
      colors: {
        primary: { DEFAULT: 'rgb(var(--brand-primary-rgb) / <alpha-value>)', 600: 'var(--brand-primary-600)', 800: 'rgb(var(--brand-primary-800-rgb) / <alpha-value>)', 50: 'var(--brand-primary-50)' },
        accent: {
          DEFAULT: 'var(--brand-accent)',
          600: 'var(--brand-accent-600)',
          700: 'var(--brand-accent-700)',
          800: 'var(--brand-accent-800)',
          text: 'var(--brand-accent-text)',
        },
        cta: { DEFAULT: 'var(--brand-accent-700)', hover: 'var(--brand-accent-800)', label: 'var(--cta-label)' },
        gold: 'var(--brand-gold)',
        ink: { 900: 'rgb(var(--ink-900-rgb) / <alpha-value>)', 600: 'var(--ink-600)', 500: 'var(--ink-500)', 400: 'var(--ink-400)' },
        surface: { DEFAULT: 'rgb(var(--surface-rgb) / <alpha-value>)', warm: 'var(--surface-warm)' },
        line: { DEFAULT: 'var(--line)', strong: 'var(--line-strong)' },
        success: { DEFAULT: 'var(--success)', text: 'var(--success-text)', bg: 'var(--success-bg)' },
        danger: { DEFAULT: 'var(--danger)', bg: 'var(--danger-bg)' },
      },
      fontFamily: { display: ['var(--font-display)'], body: ['var(--font-body)'] },
      fontSize: {
        display: ['var(--text-display)', { lineHeight: '1.1' }],
        h1: ['var(--text-h1)', { lineHeight: '1.15' }],
        h2: ['var(--text-h2)', { lineHeight: '1.2' }],
        h3: ['var(--text-h3)', { lineHeight: '1.3' }],
        h4: ['var(--text-h4)', { lineHeight: '1.4' }],
        body: ['var(--text-body)', { lineHeight: '1.6' }],
        small: ['var(--text-small)', { lineHeight: '1.5' }],
        micro: ['var(--text-micro)', { lineHeight: '1.4', letterSpacing: '0.04em' }],
      },
      borderRadius: { sm: 'var(--radius-sm)', md: 'var(--radius-md)', card: 'var(--radius-card)', pill: 'var(--radius-pill)' },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        header: 'var(--shadow-header)',
        panel: 'var(--shadow-panel)',
      },
      maxWidth: { container: 'var(--container-max)', megamenu: 'var(--megamenu-max)' },
      height: { 'header-utility': 'var(--header-utility-h)', header: 'var(--header-h)', 'header-sticky': 'var(--header-sticky-h)' },
      transitionTimingFunction: { standard: 'var(--ease-standard)', exit: 'var(--ease-exit)' },
      zIndex: { header: '40', megamenu: '50', drawer: '60', modal: '70', toast: '80' },
    },
  },
} satisfies Partial<Config>;

export default preset;
