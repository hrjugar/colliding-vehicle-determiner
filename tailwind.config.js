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
    },
    animation: {
      'slide-appear': 'slideAppear 0.2s ease-out'
    }
  },
};

export const variants = {
  extend: {
    fill: ['hover', 'focus', 'group-hover', 'group-focus']
  }
}

export const plugins = [];

