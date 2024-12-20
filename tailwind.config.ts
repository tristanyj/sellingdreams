import type { Config } from 'tailwindcss';
import { slate } from 'tailwindcss/colors';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        crimson: ['Crimson Pro', 'serif'],
        josefin: ['Josefin Sans', 'sans-serif'],
      },
      colors: {
        primary: slate,
      },
    },
  },
};
