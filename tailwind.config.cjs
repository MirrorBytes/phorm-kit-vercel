const { tailwindExtractor } = require('tailwindcss/lib/lib/purgeUnusedStyles');
const plugin = require('tailwindcss/plugin');

module.exports = {
	purge: {
		content: ['./src/**/*.{html,js,svelte,ts}'],
		options: {
			defaultExtractor: (content) => [
				// If this stops working, please open an issue at https://github.com/svelte-add/tailwindcss/issues rather than bothering Tailwind Labs about it
				...tailwindExtractor(content),
				// Match Svelte class: directives (https://github.com/tailwindlabs/tailwindcss/discussions/1731)
				...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
					([_match, group, ..._rest]) => group
				)
			],
			keyframes: true
		}
	},
	theme: {
		letterSpacing: {
			tightest: '-.075em',
			tighter: '-.05em',
			tight: '-.025em',
			normal: '0',
			wide: '.025em',
			wider: '.05em',
			widest: '.2em'
		},
		extend: {
			colors: {
				cerulean: {
					50: '#f0f9fb',
					100: '#daf7f8',
					200: '#adeef1',
					300: '#75e1eb',
					400: '#30c8e2',
					500: '#11a8d5',
					600: '#0d87be',
					700: '#126c99',
					800: '#135371',
					900: '#124358'
				},
				scarlet: {
					50: '#fcf8f6',
					100: '#fcefee',
					200: '#fad5db',
					300: '#f9b1ba',
					400: '#fa7c86',
					500: '#fa5158',
					600: '#f3323a',
					700: '#d52634',
					800: '#aa1f2e',
					900: '#861a27'
				}
			},
			typography: {
				DEFAULT: {
					css: [
						{
							'ul > li::before': {
								display: 'none'
							}
						}
					]
				},
				sm: {
					css: [
						{
							'ul > li::before': {
								display: 'none'
							}
						}
					]
				},
				lg: {
					css: [
						{
							'ul > li::before': {
								display: 'none'
							}
						}
					]
				},
				xl: {
					css: [
						{
							'ul > li::before': {
								display: 'none'
							}
						}
					]
				},
				'2xl': {
					css: [
						{
							'ul > li::before': {
								display: 'none'
							}
						}
					]
				}
			}
		}
	},
	variants: {
		extend: {
			margin: ['responsive', 'important', 'hover', 'focus', 'first', 'last'],
			padding: ['responsive', 'important', 'hover', 'focus', 'first', 'last'],
			textColor: ['responsive', 'important', 'hover']
		}
	},
	plugins: [
		require('@tailwindcss/typography'), // eslint-disable-line global-require
		require('@tailwindcss/forms'), // eslint-disable-line global-require
		plugin(({ addVariant }) => {
			addVariant('important', ({ container }) => {
				container.walkRules((rule) => {
					rule.selector = `.\\!${rule.selector.slice(1)}`;
					rule.walkDecls((decl) => {
						decl.important = true;
					});
				});
			});
		})
	]
};
