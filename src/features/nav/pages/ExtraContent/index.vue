<template>
  <cc-modal v-model="modal"
    :title="$t('nav.contentManager.packManagement')"
    icon="cc:content_manager">
    <cc-tabs modal
      fixed>
      <template #tabs>
        <v-tab>
          <v-icon start
            icon="mdi-list-box" />
          {{ $t('nav.contentManager.contentPacks') }}
        </v-tab>
        <v-tab>
          <v-icon start
            icon="mdi-download" />
          {{ $t('nav.contentManager.installLcp') }}
        </v-tab>
        <v-tab>
          <v-icon start
            icon="mdi-format-list-text" />
          {{ $t('nav.contentManager.lcpDirectory') }}
        </v-tab>
        <v-tab>
          <v-icon start
            icon="mdi-list-status" />
          {{ $t('nav.contentManager.contentConfig') }}
        </v-tab>
      </template>
      <v-window-item>
        <v-card-text :style="mobile ? 'margin-top: 8px' : ''">
          <packs-list />
          <v2-imports />
        </v-card-text>
      </v-window-item>
      <v-window-item>
        <pack-install />
      </v-window-item>
      <v-window-item>
        <packs-directory />
      </v-window-item>
      <v-window-item>
        <pack-config />
      </v-window-item>
    </cc-tabs>
  </cc-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import PacksList from './PacksList.vue'
import PackInstall from './PackInstall.vue'
import PacksDirectory from './PacksDirectory.vue'
import PackConfig from './PackConfig.vue'
import V2Imports from './components/v2Imports.vue'

const props = defineProps<{ modelValue?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const { smAndDown: mobile } = useDisplay()

const modal = ref(props.modelValue ?? false)

watch(() => props.modelValue, val => { modal.value = val ?? false })
watch(modal, val => { emit('update:modelValue', val) })
</script>
