<template>
  <v-card-text class="py-2 px-0">
    <cc-alert v-if="!pilot.IsLevelEdit" icon="mdi-alert" title="warning" color="warning">
      {{ $t('pm.sheet.editingThisPilotSLevelMay') }}
    </cc-alert>

    <cc-alert v-else icon="mdi-alert" title="alert" color="error">
      {{ $t('pm.sheet.thisPilotSLevelHasBeen') }}
    </cc-alert>

    <v-card class="mt-2 pa-2 flavor-text" flat tile>
      {{ $t('pm.sheet.thisToolSkipsTheLevelUp') }}
    </v-card>

    <v-row dense justify="space-around" align="center" class="text-center mt-2">
      <v-col cols="auto">
        <div class="text-cc-overline">{{ $t('pm.sheet.currentLEVEL') }}</div>
        <div class="heading h1" style="line-height: 42px">
          {{ pilot.Level }}
        </div>
      </v-col>

      <v-col cols="auto">
        <v-icon size="x-large">mdi-arrow-right</v-icon>
      </v-col>

      <v-col cols="auto">
        <div class="text-cc-overline mb-2">{{ $t('pm.sheet.newLEVEL') }}</div>
        <cc-select v-model.number="newLevel" :items="levels" type="number" color="primary" />
      </v-col>
    </v-row>

    <cc-button
      block
      color="primary"
      prepend-icon="cc:pilot"
      class="mt-6"
      :disabled="newLevel === pilot.Level"
      @click="setLevel">
      {{ $t('pm.sheet.setPilotLevel') }}
    </cc-button>
  </v-card-text>
</template>

<script setup lang="ts">
import type { Pilot } from '@/classes/pilot/Pilot'
import { ref, onMounted } from 'vue'
import { Rules } from '@/classes/utility/Rules'

defineOptions({ name: 'level-edit-dialog' })

const props = defineProps<{
  pilot: Pilot
}>()

const emit = defineEmits<{
  'close': []
}>()

const alert = ref(true)
const newLevel = ref(0)
const levels = ref(Array.from(Array(Rules.MaxPilotLevel + 1).keys()))

function setLevel() {
      props.pilot.Level = (newLevel.value as Number) || 0;
      props.pilot.IsLevelEdit = true;
      emit('close');
    }

onMounted(() => {
newLevel.value = props.pilot.Level;
})
</script>
