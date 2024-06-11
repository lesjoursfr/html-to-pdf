import eslint from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import * as espree from "espree";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 2022,
        globals: {
          ...globals.es2022,
          ...globals.node,
        },
      },
    },
  },
  prettierConfig,
  {
    ignores: [
      "package.json",
      "node_modules/*",
      ".yarn/*",
      "lib/*",
      "tests/*.pdf",
    ],
  },
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["src/electron.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
    languageOptions: {
      parser: espree,
      sourceType: "commonjs",
      ecmaVersion: 2022,
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
    },
  }
);
