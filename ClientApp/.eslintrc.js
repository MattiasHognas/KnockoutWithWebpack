const path = require('path');
module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: path.resolve(__dirname, './../tsconfig.json'),
        tsconfigRootDir: __dirname,
        ecmaVersion: 6,
        sourceType: "module"
    },
    plugins: [
        "@typescript-eslint"
    ],
    env: {
        browser: true,
        commonjs: true,
        node: true,
        es6: true,
        jest: true
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    settings: {
    },
    rules: {
    }
};