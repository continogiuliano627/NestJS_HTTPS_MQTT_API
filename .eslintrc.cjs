module.exports = {
  root: true,

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.eslint.json"
  },

  env: {
    node: true,
    es2021: true
  },

  plugins: ["@typescript-eslint", "prettier", "unused-imports"],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended"
  ],

  rules: {
    /* Limpieza */
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
    ],
    "unused-imports/no-unused-imports": "error",

    /* Types */
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",

    /* Prettier */
    "prettier/prettier": ["error"]
  },

  overrides: [
    {
      files: ["*.cjs", "*.js"],
      parserOptions: {
        project: null
      }
    }
  ],
  overrides: [
  {
    files: ["src/**/*.controller.ts", "src/**/*.service.ts", "src/**/*.module.ts"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "off"
    }
  },
  {
    files: ["*.cjs", "*.js"],
    parserOptions: {
      project: null
    }
  }
],

  ignorePatterns: ["node_modules", "dist"]
};
