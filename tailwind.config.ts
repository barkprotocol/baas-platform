import type { Config } from 'tailwindcss';
import type { PluginUtils } from 'tailwindcss/types/config'; // Import PluginUtils for type safety

const config: Config = {
  darkMode: ['class'],
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius, 0.5rem)',
  			md: 'calc(var(--radius, 0.5rem) - 2px)',
  			sm: 'calc(var(--radius, 0.5rem) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background, 255, 236%, 230%))',
  			foreground: 'hsl(var(--foreground, 30, 50%, 20%))',
  			card: {
  				DEFAULT: 'hsl(var(--card, 255, 236%, 230%))',
  				foreground: 'hsl(var(--card-foreground, 30, 50%, 20%))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover, 255, 236%, 230%))',
  				foreground: 'hsl(var(--popover-foreground, 30, 50%, 20%))'
  			},
  			primary: {
  				DEFAULT: '#D0BFB4',
  				foreground: 'hsl(var(--primary-foreground, 30, 50%, 20%))'
  			},
  			secondary: {
  				DEFAULT: '#D0BFB4',
  				foreground: 'hsl(var(--secondary-foreground, 30, 50%, 20%))'
  			},
  			muted: {
  				DEFAULT: '#dccec5',
  				foreground: 'hsl(var(--muted-foreground, 30, 50%, 20%))'
  			},
  			accent: {
  				DEFAULT: '#cab4a7',
  				foreground: 'hsl(var(--accent-foreground, 30, 50%, 20%))'
  			},
  			destructive: {
  				DEFAULT: '#c7b7aa',
  				foreground: 'hsl(var(--destructive-foreground, 255, 236%, 230%))'
  			},
  			border: '#D0BFB4',
  			input: '#c7b7aa',
  			ring: '#ddd4cb',
  			chart: {
  				'1': '#D0BFB4',
  				'2': '#BBA597',
  				'3': '#a0806f',
  				'4': '#bba597',
  				'5': '#53403b'
  			},
  			sand: '#D0BFB4',
  			'dark-sand': '#BBA597'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'fade-out': {
  				'0%': {
  					opacity: '1'
  				},
  				'100%': {
  					opacity: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.3s ease-out',
  			'fade-out': 'fade-out 0.3s ease-out'
  		},
  		minHeight: {
  			screen: '100vh'
  		},
  		height: {
  			screen: '100vh'
  		},
  		fontFamily: {
  			sans: ['Poppins', 'sans-serif'],
  			serif: ['Syne', 'serif'],
  			mono: ['Space Mono', 'monospace'],
  			title: ['Oswald', 'sans-serif']
  		},
  		boxShadow: {
  			'custom-light': '0 2px 10px rgba(0, 0, 0, 0.05)',
  			'custom-dark': '0 2px 10px rgba(255, 255, 255, 0.05)'
  		}
  	}
  },
  plugins: [
    require('tailwindcss-react-aria-components'),
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    function ({ addVariant }: PluginUtils) {
      addVariant('dark-hover', '.dark &:hover');
    },
  ],
};

export default config;