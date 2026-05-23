<template>
  <component
    :is="
      hover
        ? 'integratedInfoHover'
        : panel
        ? 'integratedInfoPanel'
        : 'integratedInfoPopup'
    "
    :item="item"
  />
</template>

<script setup lang="ts">
import integratedInfoHover from './_integratedInfoHover.vue';
import integratedInfoPanel from './_integratedInfoPanel.vue';
import integratedInfoPopup from './_integratedInfoPopup.vue';

const props = withDefaults(defineProps<{
  item: object
  popup?: boolean
  panel?: boolean
  hover?: boolean
}>(), {
  popup: true,
})
</script>
