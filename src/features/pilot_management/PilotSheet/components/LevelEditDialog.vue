<template>
  <v-card-text class="py-2 px-0">
    <cc-alert v-if="!pilot.IsLevelEdit" icon="mdi-alert" title="warning" color="warning">
      Editing this Pilot's level may prevent certain achievements from being unlocked with this
      Pilot. If you want to use this Pilot to unlock Pilot-related achievements, use the Level Up
      wizard instead.
    </cc-alert>

    <cc-alert v-else icon="mdi-alert" title="alert" color="error">
      This pilot's level has been edited. This will prevent certain achievements from being unlocked
      with this Pilot.
    </cc-alert>

    <v-card class="mt-2 pa-2 flavor-text" flat tile>
      This tool skips the level up wizard. Pilot attributes gained through levelling up, such as
      skill triggers, licenses, talents, mech skills, and CORE bonuses will have to be updated
      manually
    </v-card>

    <v-row dense justify="space-around" align="center" class="text-center mt-2">
      <v-col cols="auto">
        <div class="text-cc-overline">CURRENT LEVEL:</div>
        <div class="heading h1" style="line-height: 42px">
          {{ pilot.Level }}
        </div>
      </v-col>

      <v-col cols="auto">
        <v-icon size="x-large">mdi-arrow-right</v-icon>
      </v-col>

      <v-col cols="auto">
        <div class="text-cc-overline mb-2">NEW LEVEL:</div>
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
      Set Pilot Level
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
