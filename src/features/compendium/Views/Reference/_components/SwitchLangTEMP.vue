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
              :key="lang.value"
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

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NavStore } from '@/stores';

defineOptions({ name: 'temp-language-selector' })

const languages = ref([
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
    ])

const selected = computed({
  get: () => NavStore().Language,
  set: (value: string) => NavStore().setLanguage(value),
})
const lang = computed(() => {
      return NavStore().Language;
    })

function setLang(lang: string) {
      NavStore().setLanguage(lang);
    }
</script>
