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
            :title="$t('compendium.titles.experimentalPreview')"
            density="compact">
            {{ $t('compendium.reference.experimentalLangNote') }}
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
import { SUPPORTED_LOCALES } from '@/i18n';

defineOptions({ name: 'temp-language-selector' })

const languages = ref(SUPPORTED_LOCALES.map(l => ({ title: l.name, value: l.code })))

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
