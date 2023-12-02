/** @type {import('tailwindcss').Config} */

export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
];

export const theme = {
  extend: {},
};

export const variants = {
  extend: {
    fill: ['hover', 'focus', 'group-hover', 'group-focus']
  }
}

export const plugins = [];

