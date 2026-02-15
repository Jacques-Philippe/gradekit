import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import prettier from "eslint-config-prettier";

export default [
  // Ignore generated files
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript recommended rules (flat-config aware)
  ...tseslint.configs.recommended,

  // Vue + TS integration
  {
    files: ["**/*.vue"],

    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        window: "readonly",
        KeyboardEvent: "readonly",
      },
    },

    plugins: {
      vue,
    },

    rules: {
      // Vue ergonomics
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
    },
  },

  // Disable formatting rules that conflict with Prettier
  prettier,
];
