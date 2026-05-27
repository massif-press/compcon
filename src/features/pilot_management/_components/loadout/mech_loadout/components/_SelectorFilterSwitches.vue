<template>
  <cc-switch :model-value="unlicensed"
    :label="mobile && 'Show Unlicensed'"
    color="error"
    :tooltip="!mobile && unlicensed
      ? 'Unlicensed equipment: SHOWN'
      : 'Unlicensed equipment: HIDDEN'
      "
    :prepend-icon="!mobile && 'cc:system'"
    on-icon="mdi-lock-open"
    off-icon="mdi-lock"
    @update:model-value="$emit('update:unlicensed', $event)" />
  <br />
  <cc-switch :model-value="overSp"
    :label="mobile && 'Show Exceeds SP'"
    color="error"
    :tooltip="!mobile && overSp
      ? 'Systems exceeding SP Capacity: SHOWN'
      : 'Systems exceeding SP Capacity: HIDDEN'
      "
    :prepend-icon="!mobile && 'cc:system_point'"
    on-icon="mdi-lock-open"
    off-icon="mdi-lock"
    @update:model-value="$emit('update:overSp', $event)" />
  <slot />
</template>

<script setup lang="ts">
defineProps<{
  unlicensed: boolean
  overSp: boolean
  mobile: boolean
}>()

defineEmits<{
  'update:unlicensed': [val: boolean]
  'update:overSp': [val: boolean]
}>()
</script>
