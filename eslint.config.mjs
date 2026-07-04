import next from "eslint-config-next";

/**
 * ESLint 9 flat config. `eslint-config-next` bundles the Next.js rules plus
 * jsx-a11y and react-hooks (core-web-vitals ruleset), so a11y regressions
 * (missing alt text, invalid ARIA, etc.) fail lint.
 */
const config = [
  ...next,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
];

export default config;
