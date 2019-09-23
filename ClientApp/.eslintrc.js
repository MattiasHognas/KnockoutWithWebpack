module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        // ecmaFeatures: {
        //     jsx: true
        // }
    },
    plugins: [
        "@typescript-eslint",
        // "react"
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
        "plugin:@typescript-eslint/recommended",
        // "plugin:react/recommended"
    ],
    settings: {
        // react: {
        //     version: "detect"
        // }
    },
    rules: {
        //...
    }
};