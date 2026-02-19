import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
const tsconfigPath = path.join(__dirname, 'tsconfig.json');

export default defineConfig([
  globalIgnores([
    '**/node_modules',
    '**/.vscode',
    '**/.github',
    '**/blob-report',
    '**/cleanup-results',
    '**/playwright-report',
    '**/test-results',
    '**/scripts',
  ]),
  {
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:playwright/recommended'
    ),
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: [tsconfigPath],
      },
    },
    rules: {
      'no-console': 'warn',
      'playwright/no-networkidle': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      'no-fallthrough': 'error',
    },
  },
]);
