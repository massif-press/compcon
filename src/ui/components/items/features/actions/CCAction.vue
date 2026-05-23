<template>
  <component :is="cType"
    :action="action"
    :no-action="noAction"
    :activations="activations"
    :unusable="unusable"
    :disabled="disabled"
    :tier="tier"
    :hide-icon="hideIcon"
    :close-on-click="closeOnClick"></component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ActionPanel from './_actionPanel.vue';
import ActionPopup from './_actionPopup.vue';
import ActionHover from './_actionHover.vue';
import ActionButton from './_actionButton.vue';

const props = withDefaults(defineProps<{
  action: object
  hover?: boolean
  popup?: boolean
  panel?: boolean
  noAction?: boolean
  active?: boolean
  disabled?: boolean
  unusable?: boolean
  activations?: number
  tier?: number
  hideIcon?: boolean
  closeOnClick?: boolean
}>(), {
  popup: true,
  activations: 2,
  hideIcon: false,
  closeOnClick: true,
})

const cType = computed(() => {
  if (props.active) return ActionButton;
  if (props.hover) return ActionHover;
  return props.panel ? ActionPanel : ActionPopup;
})
</script>
