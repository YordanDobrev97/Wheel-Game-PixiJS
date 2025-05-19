// eslint.config.js
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            parser: parserTs,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': eslintPluginTs,
            import: eslintPluginImport,
        },
        rules: {
            ...eslintPluginTs.configs.recommended.rules,
            'import/order': [
                'warn',
                {
                    groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
                    'newlines-between': 'always',
                },
            ],
            '@typescript-eslint/no-unused-vars': ['warn'],
        },
    },
    js.configs.recommended,
    prettier,
    {
        ignores: ['dist', 'node_modules'],
    },
];
