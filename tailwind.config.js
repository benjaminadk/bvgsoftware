const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./components/**/*.js', './pages/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: {
          0: '#F7F7F7',
          1: '#F2F2F2',
          2: '#E6E6E6',
          3: '#D9D9D9',
          4: '#CCCCCC',
          5: '#BFBFBF',
          6: '#B3B3B3',
          7: '#A6A6A6',
          8: '#999999',
          9: '#8C8C8C',
          10: '#808080'
        },
        link: '#ef3b7d',
        'link-hover': '#d3366f',
        'inline-code': '#ffe7f0',
        copy: '#76d9e6'
      },
      spacing: {
        28: '7rem',
        'inline-code': '.05rem'
      },
      letterSpacing: {
        tighter: '-.04em'
      },
      lineHeight: {
        tight: 1.2
      },
      fontFamily: {
        sans: ['Ubuntu', ...defaultTheme.fontFamily.sans],
        mono: ['"Ubuntu Mono"', ...defaultTheme.fontFamily.mono]
      },
      fontSize: {
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '2.5rem',
        '6xl': '2.75rem',
        '7xl': '4.5rem',
        '8xl': '6.25rem'
      },
      boxShadow: {
        small: '0 5px 10px rgba(0, 0, 0, 0.12)',
        medium: '0 8px 30px rgba(0, 0, 0, 0.12)'
      },
      inset: {
        '35m': '-35px',
        '35': '35px',
        '50': '50px'
      }
    }
  },
  plugins: [require('tailwindcss-debug-screens')]
}
