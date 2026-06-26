<template>
  <cc-modal shrink
    :title="`${pilotLicense.License?.Source} ${pilotLicense.License?.Name}`"
    :icon="`cc:rank_${pilotLicense.Rank}`"
    :color="pilotLicense.License?.Manufacturer.Color">
    <template #activator="{ open }">
      <cc-button :size="mobile ? 'x-small' : 'small'"
        :prepend-icon="`cc:rank_${pilotLicense.Rank}`"
        color="panel"
        class="text-center"
        block
        @click="open">
        <span class="pr-2">
          {{ pilotLicense.License?.Source }}
          {{ pilotLicense.License?.Name }}
          {{ 'I'.repeat(pilotLicense.Rank) }}
        </span>
        <template #info>
          <v-icon size="x-large"
            :icon="pilotLicense.License?.Manufacturer?.Icon || 'cc:manufacturer'"
            :color="pilotLicense.License?.Manufacturer?.GetColor($vuetify.theme.current.dark) || 'panel'" />
        </template>
      </cc-button>
    </template>
    <v-card class="pb-2"
      flat>
      <v-card-text>
        <CCLicensePanel :license="pilotLicense.License"
          ranked
          :rank="pilotLicense.Rank" />
      </v-card-text>
    </v-card>
  </cc-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import CCLicensePanel from '../panels/CCLicensePanel.vue'
import type { PilotLicense } from '@/classes/pilot/components/license/PilotLicense'

const { smAndDown: mobile } = useDisplay()

const props = defineProps<{
  pilotLicense: PilotLicense
  title?: boolean
}>()

const emit = defineEmits<{ close: [] }>()

const dialog = ref(false)
const color = ref('primary')
</script>
