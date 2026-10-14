<template>
  <cc-dialog
    :color="action.Color"
    :icon="action.Icon"
    :title="action.Name"
  >
    <template #activator="{ open }">
      <cc-button
        size="x-small"
        color="panel"
        icon="mdi-information-outline"
        @click="open"
      />
    </template>
    <action-base
      :action="action"
      :tier="tier"
    />
  </cc-dialog>
</template>

<script setup lang="ts">
  import type { Action } from '@/classes/Action'
  import ActionBase from './_actionBase.vue'

  defineOptions({ name: 'ActionInfoButton' })

  defineProps<{
    action: Action
    tier?: number
  }>()
</script>
