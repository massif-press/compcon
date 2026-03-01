import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import prettierConfig from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  {
    files: ['src/**/*.{ts,vue}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'warn',
      'vue/require-prop-types': 'warn',
      'vue/first-attribute-linebreak': 'off',
      'vue/valid-v-slot': 'off',
      'vue/no-mutating-props': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      'vue/valid-v-for': 'warn',
      'vue/valid-v-bind': 'warn',
      'vue/require-v-for-key': 'warn',
      'vue/no-deprecated-v-on-native-modifier': 'warn',
      'vue/no-use-v-if-with-v-for': 'warn',
      'no-case-declarations': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'amplify/', 'public/', 'src/assets/srd/**'],
  },
  prettierConfig,
]
