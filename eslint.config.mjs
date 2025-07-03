import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

/** @type {import('eslint').Linter.defineConfig} */
export default defineConfig([
  { ignores: ['node_modules', 'dist', 'build', 'coverage', '.jest-cache'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], plugins: { js }, extends: ['js/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prefer-const': 'warn',
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);
