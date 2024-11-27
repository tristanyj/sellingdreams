import type { Config } from 'tailwindcss';
import { slate } from 'tailwindcss/colors';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        lexend: ['Bricolage Grotesque', 'cursive'],
      },
      colors: {
        primary: slate,
      },
    },
  },
};
