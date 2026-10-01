import "@tailwindcss/postcss";

/**
 * PostCSS pipeline for ZALVY.
 * Tailwind v4 is a first-class PostCSS plugin; autoprefixer is bundled, no separate config needed.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
