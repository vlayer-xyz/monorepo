module.exports = {
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": './tsconfig.json'
    },
    'env': {
        "browser": true,
        "es2021": true
    },
    extends: [
        'eslint:recommended',
        'standard-with-typescript'
    ],
    rules: {
        // Override specific rules
        'space-before-function-paren': ['error', 'never'],
        '@typescript-eslint/space-before-function-paren': ["error", "never"],
        "semi": "off",
        "@typescript-eslint/semi": ["error", "always"]
    },
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
}
