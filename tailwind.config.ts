import type { Config } from 'tailwindcss';
import { slate } from 'tailwindcss/colors';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        lexend: ['Bricolage Grotesque', 'cursive'],
        garamond: ['EB Garamond', 'serif'],
        crimson: ['Crimson Text', 'serif'],
      },
      colors: {
        primary: slate,
      },
    },
  },
};
