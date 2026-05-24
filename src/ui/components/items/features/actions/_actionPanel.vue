<template>
  <cc-alert density="compact"
    :color="action.Color">
    <v-row dense
      align="center">
      <v-col cols="auto"
        v-if="!hideIcon">
        <v-icon size="large"
          :icon="action.Icon" />
      </v-col>
      <v-col cols="auto">
        <span class="heading h3">
          {{ action.Name }}
        </span>
      </v-col>
      <v-col v-if="action.Activation !== 'None'"
        cols="auto"
        class="ml-auto mr-2">
        <cc-chip size="small">
          {{ action.Activation.toUpperCase() }}
        </cc-chip>
      </v-col>
    </v-row>
    <action-base :action="action"
      :tier="tier" />
  </cc-alert>
</template>

<script setup lang="ts">
import { Action } from '@/classes/Action';
import ActionBase from './_actionBase.vue'
const props = withDefaults(defineProps<{
  action: Action
  tier?: number
  hideIcon?: boolean
}>(), {
  hideIcon: false,
})
</script>
