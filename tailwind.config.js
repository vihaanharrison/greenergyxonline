/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          card: 'hsl(var(--surface-card))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        earth: {
          DEFAULT: 'hsl(var(--earth))',
          foreground: 'hsl(var(--earth))'
        },
        positive: {
          DEFAULT: 'hsl(var(--positive))',
          foreground: 'hsl(var(--positive))'
        },
        track: 'hsl(var(--track))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))'
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)']
      },
      maxWidth: {
        'feed': '640px',
        'editorial': '1200px'
      },
      boxShadow: {
        'hard': '3px 3px 0 0 hsl(74 8% 13%)',
        'hard-sm': '2px 2px 0 0 hsl(74 8% 13%)',
        'hard-green': '3px 3px 0 0 hsl(111 45% 32%)',
        'hard-lg': '5px 5px 0 0 hsl(74 8% 13%)'
      },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.97)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'xp-pop': { '0%': { transform: 'scale(0.8)', opacity: '0' }, '40%': { transform: 'scale(1.08)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        'tier-rise': { '0%': { transform: 'translateY(10px) scale(0.96)', opacity: '0' }, '100%': { transform: 'translateY(0) scale(1)', opacity: '1' } }
      },
      animation: {
        'fade-up': 'fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        'xp-pop': 'xp-pop 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'tier-rise': 'tier-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
