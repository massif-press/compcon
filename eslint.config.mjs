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
      // Phase 1: Start permissive, tighten over time
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'warn',
      'vue/require-prop-types': 'warn',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'amplify/', 'public/', 'src/assets/srd/**'],
  },
  prettierConfig,
]
