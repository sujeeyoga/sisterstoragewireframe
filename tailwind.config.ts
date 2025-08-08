import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Sister Storage color palette
				purple: {
					50: '#F8F5FF',
					100: '#E5DEFF',
					200: '#D6BCFA',
					300: '#B794F4',
					400: '#9B87F5',
					500: '#8B5CF6',
					600: '#7E69AB',
					700: '#6E59A5',
					800: '#553C9A',
					900: '#44337A',
				},
				gray: {
					50: '#F9FAFB',
					100: '#F3F4F6',
					200: '#E5E7EB',
					300: '#D1D5DB',
					400: '#9F9EA1',
					500: '#8A898C',
					600: '#4B5563',
					700: '#403E43',
					800: '#221F26',
					900: '#1A1A1A',
				},
				sister: {
					'purple': '#9B87F5',
					'dark-purple': '#7E69AB',
					'light-purple': '#E5DEFF',
					'soft-green': '#F2FCE2',
					'soft-yellow': '#FEF7CD',
					'soft-pink': '#FFDEE2',
					'soft-peach': '#FDE1D3',
					'soft-blue': '#D3E4FD',
					'soft-gray': '#F1F0FB',
					'charcoal': '#403E43',
					'white': '#FFFFFF',
					// New Sister Storage brand colors
					'pink': '#E90064',
					'orange': '#FF8021',
					'black': '#000000',
					'gray': '#F4F4F4',
					'peach': '#FFDCBD',
					'light-pink': '#FE5FA4',
					'gold': '#FFA51E',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				// Updated breath-fade-up animation keyframes with slower timing
				'breath-fade-up': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(30px) scale(0.95)' 
					},
					'60%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1.02)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1)' 
					}
				},
				// Staggered variants with different delays
				'breath-fade-up-1': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(30px) scale(0.95)' 
					},
					'60%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1.02)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1)' 
					}
				},
				'breath-fade-up-2': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(30px) scale(0.95)' 
					},
					'60%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1.02)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1)' 
					}
				},
				'breath-fade-up-3': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(30px) scale(0.95)' 
					},
					'60%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1.02)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1)' 
					}
				},
				'breath-fade-up-4': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(30px) scale(0.95)' 
					},
					'60%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1.02)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1)' 
					}
				},
				'breath-fade-up-5': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(30px) scale(0.95)' 
					},
					'60%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1.02)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1)' 
					}
				},
				// New scroll-triggered fade animations
				'scroll-fade-in': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(30px) scale(0.95)' 
					},
					'100%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1)' 
					}
				},
				'scroll-fade-out': {
					'0%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1)' 
					},
					'100%': { 
						opacity: '0', 
						transform: 'translateY(-30px) scale(0.95)' 
					}
				},
				// New hero image/video transition animations
				'slide-in-left': {
					'0%': { 
						transform: 'translateX(-100%)' 
					},
					'100%': { 
						transform: 'translateX(0)' 
					}
				},
				'fade-out-smooth': {
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
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-up': 'fade-up 0.5s ease-out',
				// Pixel-perfect breath animations with precise timing
				'breath-fade-up': 'breath-fade-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'breath-fade-up-1': 'breath-fade-up-1 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'breath-fade-up-2': 'breath-fade-up-2 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'breath-fade-up-3': 'breath-fade-up-3 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'breath-fade-up-4': 'breath-fade-up-4 2.0s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'breath-fade-up-5': 'breath-fade-up-5 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				// Performance-optimized animations
				'scale-bounce': 'scale-bounce 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
				'slide-in-elegant': 'slide-in-elegant 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'marquee': 'marquee 30s linear infinite',
				// Scroll-triggered animations
				'scroll-fade-in': 'scroll-fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				'scroll-fade-out': 'scroll-fade-out 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
				// New hero animations
				'slide-in-left': 'slide-in-left 2s ease-out forwards',
				'fade-out-smooth': 'fade-out-smooth 1s ease-out forwards',
				// Sister Storage announcement bar animations
				'ss-slide-in-out': 'ss-slide-in-out var(--ss-slide-duration, 12s) ease-in-out infinite',
				'ss-marquee-left': 'ss-marquee-left var(--ss-marquee-duration, 20s) linear infinite',
			},
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
				display: ['Poppins', 'sans-serif'],
				poppins: ['Poppins', 'sans-serif'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
