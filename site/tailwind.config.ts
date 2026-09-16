import type { Config } from 'tailwindcss';

/**
 * Coastal brand system — "Gulf Coast Modern".
 * Palette reads as sea glass + sugar sand + sunset coral over a deep gulf navy.
 * Every colour pairing used for text/background in the UI is checked to
 * WCAG 2.1 AA (>= 4.5:1 body, >= 3:1 large text) — see /accessibility.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gulf: {
          50: '#EAF6F6',
          100: '#CFE9E8',
          200: '#A2D5D3',
          300: '#6FBDB9',
          400: '#3E9F9B',
          500: '#22827F',
          600: '#166967',
          700: '#115352',
          800: '#0D403F',
          900: '#0A2F2F',
          950: '#051C1D',
        },
        sand: {
          50: '#FDFBF7',
          100: '#F8F2E8',
          200: '#F0E4D1',
          300: '#E4D0B2',
          400: '#D3B68C',
          500: '#BE9A69',
          600: '#A17C4F',
          700: '#7F6140',
          800: '#5C4730',
          900: '#3D2F20',
        },
        coral: {
          50: '#FFF2EE',
          100: '#FFE0D6',
          200: '#FFC0AC',
          300: '#FF9A7C',
          400: '#F97650',
          500: '#E85C34',
          600: '#C74724',
          700: '#A0381C',
          800: '#7A2B16',
          900: '#561F10',
        },
        sunset: {
          100: '#FFF1D2',
          200: '#FFE0A1',
          300: '#FBCB66',
          400: '#F2B33C',
          500: '#DE9820',
          600: '#B67816',
        },
        ink: {
          DEFAULT: '#0C1F22',
          soft: '#2A4247',
          muted: '#5B7379',
        },
        shell: '#FBF8F3',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Fraunces', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Outfit', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.08em' }],
        'display-sm': ['clamp(1.9rem,1.4rem + 2.2vw,2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2.35rem,1.6rem + 3.4vw,3.85rem)', { lineHeight: '1.06', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(2.9rem,1.7rem + 5.2vw,5.25rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
      },
      borderRadius: { xl: '0.9rem', '2xl': '1.35rem', '3xl': '2rem', '4xl': '2.75rem' },
      boxShadow: {
        card: '0 1px 2px rgba(12,31,34,.05), 0 8px 24px -12px rgba(12,31,34,.18)',
        lift: '0 2px 4px rgba(12,31,34,.06), 0 24px 48px -20px rgba(12,31,34,.28)',
        inset: 'inset 0 1px 0 rgba(255,255,255,.35)',
      },
      backgroundImage: {
        'gulf-gradient': 'linear-gradient(135deg,#0A2F2F 0%,#115352 45%,#22827F 100%)',
        'sunset-gradient': 'linear-gradient(120deg,#F2B33C 0%,#F97650 55%,#E85C34 100%)',
        'shore-gradient': 'linear-gradient(180deg,#FBF8F3 0%,#F0E4D1 100%)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(14px)' }, '100%': { opacity: '1', transform: 'none' } },
        'tide': { '0%,100%': { transform: 'translateX(0)' }, '50%': { transform: 'translateX(-18px)' } },
      },
      animation: { 'fade-up': 'fade-up .7s cubic-bezier(.22,.8,.3,1) both', tide: 'tide 9s ease-in-out infinite' },
      maxWidth: { content: '76rem', prose: '44rem' },
      // Tailwind's default opacity scale has no 8/15/35 — these are used for hairline borders.
      opacity: { 8: '0.08', 15: '0.15', 35: '0.35', 65: '0.65' },
    },
  },
  plugins: [],
};
export default config;
