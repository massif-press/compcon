<template>
  <v-btn variant="outlined" tile size="x-small" color="secondary">
    <v-icon start icon="mdi-translate" />
    {{ lang }}
    <v-menu activator="parent" max-width="500px">
      <v-card border tile>
        <v-card-text>
          <cc-alert
            variant="tonal"
            icon="mdi-alert"
            color="warning"
            title="EXPERIMENTAL PREVIEW"
            density="compact">
            This is an experimental preview of the language selection feature. Non-English
            translation is currently machine-generated and may be inaccurate.
          </cc-alert>
          <v-list density="compact" slim>
            <v-list-item
              v-for="lang in languages"
              :base-color="lang.value === selected ? 'accent' : ''"
              :value="lang.value"
              :title="lang.title"
              @click="selected = lang.value" />
          </v-list>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-btn>
</template>

<script lang="ts">
import { NavStore } from '@/stores';
export default {
  name: 'temp-language-selector',
  data: () => ({
    languages: [
      {
        title: 'English',
        value: 'en',
      },
      {
        title: 'Español',
        value: 'es',
      },
      {
        title: 'Deutsch',
        value: 'de',
      },
      {
        title: 'Français',
        value: 'fr',
      },
      {
        title: 'Italiano',
        value: 'it',
      },
      {
        title: 'Русский',
        value: 'ru',
      },
      {
        title: '日本語',
        value: 'ja',
      },
      {
        title: '한국어',
        value: 'ko',
      },
      {
        title: '中文',
        value: 'zh',
      },
    ],
  }),
  computed: {
    selected: {
      get: () => NavStore().Language,
      set: (value: string) => NavStore().setLanguage(value),
    },
    lang() {
      return NavStore().Language;
    },
  },
  methods: {
    setLang(lang: string) {
      NavStore().setLanguage(lang);
    },
  },
};
</script>
