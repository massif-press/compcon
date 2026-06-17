<template>
  <v-row no-gutters
    align="center">
    <v-col>
      <cc-skill-item :bonus="bonus"
        :skill="skill" />
    </v-col>
    <v-col cols="auto"
      class="py-2">
      <span class="px-2">
        <v-tooltip location="top"
          :text="$t('pm.tooltips.increaseSkillBonus')">
          <template #activator="{ props }">
            <cc-button v-bind="props"
              icon="mdi-plus"
              size="small"
              color="success"
              variant="outlined"
              :disabled="!canAdd"
              @click="$emit('add')" />
          </template>
        </v-tooltip>
      </span>
      <div v-if="mobile"
        class="my-2" />
      <span class="px-2">
        <v-tooltip location="top"
          :text="$t('pm.tooltips.decreaseSkillBonus')">
          <template #activator="{ props }">
            <cc-button v-bind="props"
              icon="mdi-minus"
              size="small"
              color="error"
              variant="outlined"
              :disabled="!canRemove"
              @click="$emit('remove')" />
          </template>
        </v-tooltip>
      </span>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { Skill } from '@/classes/pilot/components';
import { useDisplay } from 'vuetify'

defineProps({
  skill: {
    type: Skill,
    required: true,
  },
  canAdd: {
    type: Boolean,
    required: true,
  },
  canRemove: {
    type: Boolean,
    required: true,
  },
  bonus: {
    type: Number,
    required: false,
    default: 0,
  },
})

const { smAndDown: mobile } = useDisplay()

defineEmits<{
  add: []
  remove: []
}>()
</script>
