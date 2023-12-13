/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#07b6f0',
					100: '#ccf1fd',
					200: '#98e3fc',
					300: '#65d5fa',
					400: '#31c7f9',
					500: '#07b6f0',
					600: '#0690be',
					700: '#046c8e',
					800: '#03485f',
					900: '#01242f',
				},
				secondary: {
					DEFAULT: '#011936',
					100: '#a6cdfd',
					200: '#4d9cfb',
					300: '#056be9',
					400: '#034290',
					500: '#011936',
					600: '#01142c',
					700: '#010f21',
					800: '#000a16',
					900: '#00050b',
				},
				shade: {
					DEFAULT: '#465362',
					100: '#d7dce3',
					200: '#afbac6',
					300: '#8797aa',
					400: '#62758a',
					500: '#465362',
					600: '#38434f',
					700: '#2a323b',
					800: '#1c2127',
					900: '#0e1114',
				},
				highlight: {
					DEFAULT: '#f6bd60',
					100: '#fdf2df',
					200: '#fbe4bf',
					300: '#f9d7a0',
					400: '#f8ca80',
					500: '#f6bd60',
					600: '#f2a11f',
					700: '#c27c0b',
					800: '#815308',
					900: '#412904',
				},
				accent: {
					DEFAULT: '#84bc9c',
					100: '#e7f2eb',
					200: '#cee4d8',
					300: '#b6d7c4',
					400: '#9ec9b1',
					500: '#84bc9c',
					600: '#5ca57c',
					700: '#447c5d',
					800: '#2e533e',
					900: '#17291f',
				},
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@headlessui/tailwindcss'),
	],
};
