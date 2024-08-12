module.exports = {
  root: true,
  extends: ['@feedbase/eslint-config/next.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  ignorePatterns: ['dist', '.eslintrc.js', 'postcss.config.js', 'tailwind.config.js'],
  settings: {
    'import/resolver': {
      typescript: {
        project: ['packages/*/tsconfig.json', 'apps/*/tsconfig.json', 'tsconfig.json'],
      },
    },
  },
  globals: {
    Messages: 'readonly',
    NodeJS: true,
  },
};
