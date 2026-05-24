<template>
  <cc-dialog :color="action.Color"
    :icon="action.Icon"
    :title="action.Name"
    :close-on-click="closeOnClick">
    <template #activator="{ open }">
      <cc-button size="x-small"
        block
        :color="action.Color"
        :prepend-icon="prependIcon"
        @click="open">
        {{ action.Name }}
      </cc-button>
    </template>
    <action-base :action="action"
      :tier="tier" />
  </cc-dialog>
</template>

<script setup lang="ts">
import { Action } from '@/classes/Action';
import ActionBase from './_actionBase.vue'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  action: Action
  tier?: number
  hideIcon?: boolean
  closeOnClick?: boolean
}>(), {
  hideIcon: false,
  closeOnClick: true,
})

const prependIcon = computed(() => {
  if (props.hideIcon) return '';
  return props.action.Icon;
})
</script>
