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
    files: ['src/classes/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // Match only the bare `@/class` / `*/class` barrel specifier
              // itself — not any path that happens to contain a `class/`
              // segment (e.g. `@/classes/npc/class/NpcClass` is legitimate).
              regex: '(^|/)@?/?class$|(^|/)class$',
              message:
                "Import directly from the source module — not the @/class barrel — inside src/classes/. Run 'grep' to find the canonical path.",
            },
          ],
        },
      ],
    },
  },
  {
    // R-020 / Theme C1: src/ui/ is a reusable component library and must not
    // reach into feature stores. Components receive data via typed props or by
    // injecting one of the providers in '@/ui/providers'.
    files: ['src/ui/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/stores$|(^|/)features/[^/]+/store',
              message:
                "src/ui/ must not import feature stores (R-020). Receive data via a typed prop, or inject a provider from '@/ui/providers'.",
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'amplify/', 'public/', 'src/assets/srd/**'],
  },
  prettierConfig,
]
