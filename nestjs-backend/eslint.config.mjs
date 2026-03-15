import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig(
  {
    files: ['src/**/*.{ts,mts}'],
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
  },
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignorePrimitives: true, ignoreConditionalTests: true },
      ],
      '@typescript-eslint/consistent-type-imports': ['error'],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': [
        'error',
        { ignoreIIFE: true, ignoreVoid: true },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: false },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-base-to-string': 'warn',
      'unused-imports/no-unused-imports': 'error',

      'no-duplicate-case': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/prefer-ts-expect-error': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/method-signature-style': ['error'],

      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      curly: 'error',
    },
  },
);
