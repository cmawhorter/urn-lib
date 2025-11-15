import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
    ],
  },
  {languageOptions: { globals: {...globals.node, ...globals.es2020} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/**/*.js'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'all', argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'error',
    },
  },
  {
    files: ['test/**/*.ts', 'test/**/*.js'],
    languageOptions: {globals: {...globals.mocha}},
    rules: {
      '@typescript-eslint/no-explicit-any': 1,
      '@typescript-eslint/no-unused-expressions': ['warn', { allowShortCircuit: true }],
      '@typescript-eslint/no-unused-vars': 0,
      'no-console': 1,
    },
  },
];
