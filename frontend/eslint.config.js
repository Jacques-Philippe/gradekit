import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";
import prettier from "eslint-config-prettier";

export default [
  // Ignore build output
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  // Base JS rules
  js.configs.recommended,

  // Vue + TS files
  {
    files: ["**/*.ts", "**/*.vue"],

    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },

    plugins: {
      vue,
      "@typescript-eslint": tseslint,
    },

    rules: {
      /* ---- General ---- */
      "no-console": "off",
      "no-debugger": "warn",

      /* ---- Vue ---- */
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",

      /* ---- TypeScript ---- */
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },

  // Disable formatting rules that conflict with Prettier
  prettier,
];
