<template>
  <cc-tabs ref="tabs"
    modal
    fixed>
    <template #tabs>
      <v-tab>{{ $t('mainMenu.ui.accountManagement') }}</v-tab>
      <v-tab>{{ $t('mainMenu.ui.cloudData') }}</v-tab>
      <v-tab>{{ $t('mainMenu.ui.contentSubscriptions') }}</v-tab>
      <v-tab>{{ $t('mainMenu.ui.contentPublishing') }}</v-tab>
    </template>
    <v-window-item>
      <Management @set-state="$emit('set-state', $event)" />
    </v-window-item>
    <v-window-item>
      <data-tab @reset="($refs as any).tabs.setTab(0)" />
    </v-window-item>
    <v-window-item>
      <Subscriptions />
    </v-window-item>
    <v-window-item>
      <Publishing />
    </v-window-item>
  </cc-tabs>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import DataTab from './data.vue';
import Management from './management.vue';
import Publishing from './publishing.vue';
import Subscriptions from './subscriptions.vue';

const _display = useDisplay()

defineOptions({ name: 'CloudAccount' })

const emit = defineEmits<{
  'set-state': [payload: any]
}>()

const mobile = computed(() => {
      return _display.mdAndDown.value;
    })
</script>
