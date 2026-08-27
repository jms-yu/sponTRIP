/**
 * Root ESLint config, extended by each workspace.
 * Kept deliberately small — this team's safety net is CI mechanical checks
 * and tests, not lint rule sophistication.
 */
module.exports = {
  root: true,
  env: {
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    ".expo/",
    "coverage/",
    "supabase/functions/**", // Deno runtime — linted/typechecked separately via `deno check`
    "apps/mobile/.expo/**",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-console": "off",
  },
};
