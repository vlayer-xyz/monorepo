module.exports = {
  root: true,
  ignorePatterns: ['**/.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  env: {
    es2021: true
  },
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
  rules: {
    // Override specific rules
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      {
        assertionStyle: 'as',
        objectLiteralTypeAssertions: 'allow'
      }
    ],
    'no-magic-numbers': ['error', { ignore: [0, 1, 16, 256, '0n', '1n'] }]
  },
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    },
    {
      files: ['*.test.ts'],
      rules: {
        'no-magic-numbers': 'off'
      }
    }
  ]
};
