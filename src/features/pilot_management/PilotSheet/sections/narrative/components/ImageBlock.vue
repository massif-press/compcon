<template>
  <div class="text-center mr-6">
    <div class="border">
      <cc-img v-if="pilot.Portrait" :src="pilot.Portrait" max-width="100%" />
    </div>
    <cc-dialog v-if="!pilot.IsRemote" :title="$t('pm.sheet.setPilotPortrait')" icon="cc:pilot" tabs :close-on-click="false" major full-height max-width="90vw">
      <template #activator="{ open }">
        <v-btn color="secondary" size="small" block variant="tonal" @click="open">
          <v-icon start>mdi-circle-edit-outline</v-icon>
          {{ $t('pm.sheet.setPilotPortrait') }}
        </v-btn>
      </template>
      <cc-image-selector ref="imageSelector" :item="pilot" type="pilot" avatar />
    </cc-dialog>
  </div>
</template>

<script setup lang="ts">
import { Pilot } from '@/classes/pilot/Pilot'

defineOptions({ name: 'image-block' })

const props = defineProps<{
  pilot: Pilot
}>()
</script>
