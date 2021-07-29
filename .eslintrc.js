module.exports = {
    extends: 'eslint-config-standard-with-typescript',
    parserOptions: {
        project: './tsconfig.json'
    },
    rules: {
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/member-delimiter-style': ['error', { singleline: { delimiter: 'semi', requireLast: false }, multiline: { delimiter: 'semi', requireLast: true } }]
    }
};
