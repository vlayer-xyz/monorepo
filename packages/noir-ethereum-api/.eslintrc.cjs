module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
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
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
    }
}
