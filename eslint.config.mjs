import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import pluginA11y from 'eslint-plugin-vuejs-accessibility'
import intlifyVueI18n from '@intlify/eslint-plugin-vue-i18n'
import prettierConfig from 'eslint-config-prettier'

// Theme L (i18n) no-raw-text options, shared between the warn-by-default block
// and the per-directory error ratchet below.
const noRawTextOptions = {
  // Ignore strings with no letters (symbols, numbers, punctuation) and
  // product/proper names that are intentionally not translated.
  ignorePattern: '^[^a-zA-Z]+$',
  ignoreText: [
    'COMP/CON',
    'LANCER',
    'C/C',
    'GMS',
    'SSC',
    'HORUS',
    'IPS-N',
    'HA',
    // Universal keyboard keys, brand domains, and the version marker — not localized.
    'CMD',
    'CTRL',
    'ESC',
    'massifpress.com',
    'massifpress@gmail.com',
    'v.',
    'GitHub',
    'Lancer',
    'v2',
  ],
  // Icon-name content nodes are not user-facing copy.
  ignoreNodes: ['v-icon', 'cc-logo'],
}

// Theme L ratchet: directories whose inline UI text is fully migrated to $t.
// no-raw-text is escalated to `error` here so regressions fail CI. Grows one
// entry per completed feature batch (see .todos/theme-L-i18n-action-plan.md).
const migratedI18nDirs = [
  'src/features/nav/**/*.vue',
  'src/features/compendium/**/*.vue',
  'src/features/main_menu/**/*.vue',
  'src/features/gm/**/*.vue',
  'src/features/active_mode/**/*.vue',
  'src/ui/**/*.vue',
]

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
    files: ['src/**/*.vue'],
    plugins: { 'vuejs-accessibility': pluginA11y },
    rules: {
      'vuejs-accessibility/alt-text': 'warn',
      'vuejs-accessibility/anchor-has-content': 'warn',
      'vuejs-accessibility/aria-props': 'warn',
      'vuejs-accessibility/aria-role': 'warn',
      'vuejs-accessibility/aria-unsupported-elements': 'warn',
      'vuejs-accessibility/click-events-have-key-events': 'warn',
      'vuejs-accessibility/form-control-has-label': 'warn',
      'vuejs-accessibility/heading-has-content': 'warn',
      'vuejs-accessibility/iframe-has-title': 'warn',
      'vuejs-accessibility/interactive-supports-focus': 'warn',
      'vuejs-accessibility/label-has-for': 'warn',
      'vuejs-accessibility/media-has-caption': 'warn',
      'vuejs-accessibility/mouse-events-have-key-events': 'warn',
      'vuejs-accessibility/no-access-key': 'warn',
      'vuejs-accessibility/no-autofocus': 'warn',
      'vuejs-accessibility/no-distracting-elements': 'warn',
      'vuejs-accessibility/no-redundant-roles': 'warn',
      'vuejs-accessibility/no-static-element-interactions': 'warn',
      'vuejs-accessibility/role-has-required-aria-props': 'warn',
      'vuejs-accessibility/tabindex-no-positive': 'warn',
    },
  },
  {
    // Theme L (i18n): flag untranslated template literals. Warn-only during the
    // incremental UI extraction; ratcheted to error per-directory as features migrate.
    files: ['src/**/*.vue'],
    plugins: { '@intlify/vue-i18n': intlifyVueI18n },
    rules: {
      '@intlify/vue-i18n/no-raw-text': ['warn', noRawTextOptions],
    },
  },
  ...(migratedI18nDirs.length
    ? [
        {
          // Theme L ratchet: migrated directories — no-raw-text is an error here.
          files: migratedI18nDirs,
          plugins: { '@intlify/vue-i18n': intlifyVueI18n },
          rules: {
            '@intlify/vue-i18n/no-raw-text': ['error', noRawTextOptions],
          },
        },
      ]
    : []),
  {
    // Long-form flavor/fluff and the dev-only test harness are intentionally not
    // wrapped in $t (Theme L §3.5). Exclude them from no-raw-text. startup_logs
    // are imperative TypeIt flavor chains (deferred to L4); horus_chat is
    // do-not-translate authored art. The print/ref reference cards reproduce
    // verbatim LANCER SRD rules text (combat reference + structure/stress damage
    // tables) — rules translation is L3, not UI string extraction (Theme L §3.5).
    files: [
      'src/features/ui_test/**/*.vue',
      'src/features/main_menu/_components/startup_logs/**',
      'src/ui/components/print/CombatRef.vue',
      'src/ui/components/tables/CCRefStructureTable.vue',
      'src/ui/components/tables/CCRefStressTable.vue',
      'src/features/active_mode/runner/gm/InfoPanels/QuickReferencePanel.vue',
    ],
    rules: {
      '@intlify/vue-i18n/no-raw-text': 'off',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'amplify/', 'public/', 'src/assets/srd/**'],
  },
  prettierConfig,
]
