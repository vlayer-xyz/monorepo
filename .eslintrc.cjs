const allowMagicNumbersInTests = {
  files: ['*.test.ts'],
  rules: {
    'no-magic-numbers': 'off'
  }
};

const parseConfigFilesAsScripts = {
  files: ['.eslintrc.{js,cjs}'],
  parserOptions: {
    sourceType: 'script'
  },
  env: {
    node: true
  }
};

module.exports = {
  root: true,
  ignorePatterns: ['**/.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  env: {
    es2021: true
  },
  extends: ['plugin:@typescript-eslint/recommended-type-checked', 'prettier', 'plugin:prettier/recommended'],
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
  overrides: [parseConfigFilesAsScripts, allowMagicNumbersInTests]
};
