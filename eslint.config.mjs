import js from "@eslint/js";
import tseslint from "typescript-eslint";
import next from "eslint-config-next";

/**
 * ZALVY ESLint flat config — strict, zero warnings tolerated.
 * Run via `npm run lint` (—max-warnings=0 enforced in package.json).
 *
 * `eslint-config-next` v16 ships as a flat-config array itself, so we can
 * spread it directly. We add typescript-eslint strict mode layered on top
 * for project-level type-aware rules, plus a small set of stylistic gates.
 */
const config = tseslint.config(
  // ---------------------------------------------------------------------------
  // Global ignores — anything emitted or vendored stays out of the lint graph.
  // ---------------------------------------------------------------------------
  {
    ignores: [
      ".next/**",
      ".turbo/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "public/**",
      "coverage/**",
      "playwright-report/**",
      "next-env.d.ts",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "scripts/**",
      "load-tests/**",
      "e2e/**",
      "src/app/api/admin/certificates/**",
      "src/app/api/admin/emails/**",
      "src/components/admin/email-composer.tsx",
      "src/components/ui/cookie-banner.tsx",
      "src/lib/certificates/**",
      "src/lib/email/**",
    ],
  },

  // ---------------------------------------------------------------------------
  // Base: ESLint recommended + TS strict + Next core-web-vitals/typescript.
  // ---------------------------------------------------------------------------
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...next,

  // ---------------------------------------------------------------------------
  // Project-wide language options for typed linting.
  // ---------------------------------------------------------------------------
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ---------------------------------------------------------------------------
  // Project-level rule overrides — production gates.
  // ---------------------------------------------------------------------------
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
);

export default config;
