module.exports = {
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
