<template>
  <cc-button
    :size="mobile ? 'x-small' : 'small'"
    :prepend-icon="`cc:rank_${pilotLicense.Rank}`"
    color="panel"
    class="text-center"
    readonly
    block>
    <span class="pr-2">
      {{ pilotLicense.Stub.Source }}
      {{ pilotLicense.Stub.Name }}
      {{ 'I'.repeat(pilotLicense.Rank) }}
    </span>
    <template #info>
      <cc-broken-reference force :item="pilotLicense.Stub" />
    </template>
  </cc-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import type { PilotLicense } from '@/classes/pilot/components/license/PilotLicense'

const { smAndDown: mobile } = useDisplay()

const props = defineProps<{
  pilotLicense: PilotLicense
  readonly?: boolean
}>()

const emit = defineEmits<{ remove: [] }>()

const dialog = ref(false)
const color = ref('primary')

function remove() {
  emit('remove');
}
</script>
