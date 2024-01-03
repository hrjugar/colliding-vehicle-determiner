/** @type {import('tailwindcss').Config} */

export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];

export const theme = {
  extend: {
    keyframes: {
        slideAppear: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { opacity: 'translateY(0%)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        }
    },
    animation: {
      'slide-appear': 'slideAppear 0.2s ease-out',
      'scale-up': 'scaleUp 0.2s ease-out both',
    },
    colors: {
      'color-primary': '#171C46',
      'color-primary-inactive': '#626484',
      'color-primary-active': '#BABFE8',
    },
    boxShadow: {
      'around': '0 0 10px 0 rgba(23, 28, 70, 0.2)',
      'around-dark': '0 0 10px 0 rgba(23, 28, 70, 0.5)',
    }
  },
};

export const variants = {
  extend: {
    boxShadow: ['hover'],
    fill: ['hover', 'focus', 'group-hover', 'group-focus'],
    textColor: ['group-hover'],
  }
}

export const plugins = [];

