<template>
  <div>
    <v-expansion-panels focusable
      accordion
      tile
      flat>
      <v-expansion-panel class="bg-transparent">
        <v-expansion-panel-title class="pl-1 pr-3">
          <v-row no-gutters>
            <v-col cols="12"
              md="3">
              <div class="centered text-left pl-2">
                <div class="stat-text">{{ skill.Trigger }} <cc-button v-if="isCustom"
                    variant="text"
                    :icon="editMode ? 'mdi-check' : 'mdi-pencil'"
                    size="x-small"
                    @click="setEditMode()" /></div>
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
                v-model="draft.name"
                class="mb-2"
                @click.stop />
              <cc-text-field v-if="editMode"
                v-model="draft.description"
                @click.stop />
              <div v-else
                class="body-text pl-2">{{ skill.Description }}</div>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
        <v-expansion-panel-text v-if="skill.Detail">
          <cc-text-area v-if="editMode"
            v-model="draft.detail" />
          <p v-else
            class="text-left flavor-text mb-0">{{ skill.Detail }}</p>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Skill } from '@/classes/pilot/components/skill/Skill'
import type CustomSkill from '@/classes/pilot/components/skill/CustomSkill'

const props = withDefaults(defineProps<{
  bonus?: number
  skill: Skill | CustomSkill
  isCustom?: boolean
}>(), {
  bonus: 0,
})

const emit = defineEmits<{
  'update:skill': [skill: Skill | CustomSkill]
}>()

const editMode = ref(false)
const draft = ref({ name: '', description: '', detail: '' })

function setEditMode() {
  if (editMode.value) {
    const custom = props.skill as CustomSkill
    custom.Name = draft.value.name
    custom.Description = draft.value.description
    custom.Detail = draft.value.detail
    emit('update:skill', props.skill)
  } else {
    draft.value = {
      name: props.skill.Name,
      description: props.skill.Description,
      detail: props.skill.Detail,
    }
  }
  editMode.value = !editMode.value
}
</script>
