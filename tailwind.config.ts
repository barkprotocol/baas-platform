import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'], // Enables dark mode control via class
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}', // Added lib directory if you use it
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // Optional: if you store pages outside 'app'
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius, 0.5rem)', // Added default fallback for large
        md: 'calc(var(--radius, 0.5rem) - 2px)', // Fallback for medium
        sm: 'calc(var(--radius, 0.5rem) - 4px)', // Fallback for small
      },
      colors: {
        background: 'hsl(var(--background, 255, 236%, 230%))', // Light background
        foreground: 'hsl(var(--foreground, 30, 50%, 20%))', // Dark foreground
        card: {
          DEFAULT: 'hsl(var(--card, 255, 236%, 230%))', // Card background
          foreground: 'hsl(var(--card-foreground, 30, 50%, 20%))', // Card text
        },
        popover: {
          DEFAULT: 'hsl(var(--popover, 255, 236%, 230%))', // Popover background
          foreground: 'hsl(var(--popover-foreground, 30, 50%, 20%))', // Popover text
        },
        primary: {
          DEFAULT: '#D0BFB4', // Custom primary color: Sand
          foreground: 'hsl(var(--primary-foreground, 30, 50%, 20%))', // Dark text on primary
        },
        secondary: {
          DEFAULT: '#BBA597', // Custom secondary color: Darker Sand
          foreground: 'hsl(var(--secondary-foreground, 30, 50%, 20%))',
        },
        muted: {
          DEFAULT: '#D0BFB4', // Muted color: Sand
          foreground: 'hsl(var(--muted-foreground, 30, 50%, 20%))',
        },
        accent: {
          DEFAULT: '#dccec5', // Accent color: Light Beige
          foreground: 'hsl(var(--accent-foreground, 30, 50%, 20%))',
        },
        destructive: {
          DEFAULT: '#c7b7aa', // Destructive color: Light Brown
          foreground: 'hsl(var(--destructive-foreground, 255, 236%, 230%))',
        },
        border: '#D0BFB4', // Border color: Sand
        input: '#D0BFB4', // Input field color
        ring: '#ddd4cb', // Ring color for focus
        chart: {
          '1': '#D0BFB4', // Chart color 1: Sand
          '2': '#BBA597', // Chart color 2: Darker Sand
          '3': '#a0806f', // Chart color 3: Light Brown
          '4': '#bba597', // Chart color 4: Bronze
          '5': '#53403b', // Chart color 5: Dark Brown
        },
        sand: '#D0BFB4', // Custom sand color
        'dark-sand': '#BBA597', // Custom darker sand
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-react-aria-components'),
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

export default config;
