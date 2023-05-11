<template>
  <div>
    <v-btn variant="outlined" size="small" class="mx-3" color="secondary"
      ><v-icon start icon="mdi-translate" />{{ lang }}
      <v-menu activator="parent" width="500px">
        <v-card>
          <v-card-text>
            <v-alert
              icon="mdi-alert"
              color="error"
              title="EXPERIMENTAL PREVIEW"
              variant="outlined"
              density="compact"
            >
              This is an experimental preview of the language selection feature. Non-English
              translation is currently machine-generated and may be inaccurate.</v-alert
            >
            <v-list>
              <v-list-item
                v-for="lang in languages"
                :key="lang.title"
                :title="lang.title"
                @click="setLang(lang.value)"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-btn>
  </div>
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
