<template>
  <div>
    <v-expansion-panels focusable
      accordion
      tile
      flat>
      <v-expansion-panel class="border-sm">
        <v-expansion-panel-title class="pl-1 pr-3">
          <v-row no-gutters>
            <v-col cols="12"
              md="3">
              <div class="centered text-left pl-2">
                <div class="stat-text">{{ skill.Trigger }}</div>
                <div v-if="bonus"
                  class="pa-1">
                  <v-icon v-for="(n) in bonus"
                    :key="`bonus-${n}`"
                    color="accent"
                    size="small">mdi-hexagon</v-icon>
                  <span class="text-cc-overline text-disabled">(+{{ bonus }})</span>
                </div>
              </div>
            </v-col>
            <v-col cols="12"
              md="9"
              align-self="center">
              <cc-text-field v-if="editMode"
                v-model="skill.Description"
                @click.stop />
              <div v-else
                class="body-text pl-2">{{ skill.Description }}</div>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text v-if="skill.Detail">
          <cc-text-area v-if="editMode"
            v-model="skill.Detail" />
          <p v-else
            class="text-left flavor-text mb-0">{{ skill.Detail }}</p>
          <div v-if="isCustom"
            style="position: relative;">
            <div style="position: absolute; bottom: 0; right: 0;">
              <cc-button :icon="editMode ? 'mdi-check' : 'mdi-pencil'"
                size="small"
                @click="setEditMode()" />
            </div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Skill } from '@/classes/pilot/components/skill/Skill'

const props = withDefaults(defineProps<{
  bonus?: number
  skill: Skill
  isCustom?: boolean
}>(), {
  bonus: 0,
})

const emit = defineEmits<{
  'update:skill': [skill: Skill]
}>()

const editMode = ref(false)

function setEditMode() {
  if (editMode.value) {
    emit('update:skill', props.skill)
  }
  editMode.value = !editMode.value
}
</script>
