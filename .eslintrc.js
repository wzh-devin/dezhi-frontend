/**
 * 2025/11/3 21:14.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description eslint 配置文件
 * @version 1.0.0
 * @since 1.0.0
 */
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ],
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    env: {
        browser: true,
        es2021: true
    },
    settings: {
        react: {
            version: 'detect'
        }
    }
}
