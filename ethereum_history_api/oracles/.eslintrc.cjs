module.exports = {
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'json-bigint',
            message: 'Use  ./src/utils/json-bigint instead'
          }
        ]
      }
    ]
  }
};
