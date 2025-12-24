import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  // 忽略文件（替代 .eslintignore）
  {
    ignores: ['node_modules', 'dist', 'build'],
  },

  // JS / JSX 规则
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        window: 'readonly',
        document: 'readonly',
        __POWERED_BY_QIANKUN__: 'readonly',
        __SOURCE_PREFIX__: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React 17+ 不需要 React in scope
      'react/react-in-jsx-scope': 'off',

      // Prettier 接管格式化
      'prettier/prettier': 'error',
      'react/prop-types': 'off',
    },
  },
];
