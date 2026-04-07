import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * `react-hooks/set-state-in-effect` and `react-hooks/immutability` are React Compiler–oriented
 * rules that flag many valid patterns (matchMedia sync, ref callbacks, modal reset). We keep
 * `recommended` hooks rules (e.g. rules-of-hooks) and disable these until the codebase opts
 * into the compiler workflow.
 */
export default defineConfig([
  globalIgnores(['dist', 'playwright-report', 'test-results']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['server/**/*.ts'],
    languageOptions: {
      globals: globals.nodeBuiltin,
    },
    rules: {
      // Loose JSON / persistence boundaries; prefer typed records in new code.
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
])
