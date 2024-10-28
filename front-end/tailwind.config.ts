import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      sans: ['"Afacad Flux"', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [],
};

export default config;
