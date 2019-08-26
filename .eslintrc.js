module.exports = {
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint', 'vuetify'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:vue/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    camelcase: 'off',
    '@typescript-eslint/camelcase': ['error', { properties: 'never' }],
    '@typescript-eslint/interface-name-prefix': 0,
    'vue/max-attributes-per-line': 'off',
    'vue/name-property-casing': ['error', 'kebab-case'],
  },
}
