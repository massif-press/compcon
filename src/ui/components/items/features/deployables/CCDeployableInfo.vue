<template>
  <component
    :is="hover ? 'deployableInfoHover' : panel ? 'deployableInfoPanel' : 'deployableInfoPopup'"
    :deployable="deployable"
    :tier="tier"
    :owner="owner" />
</template>

<script setup lang="ts">
import deployableInfoHover from './_deployableInfoHover.vue';
import deployableInfoPanel from './_deployableInfoPanel.vue';
import deployableInfoPopup from './_deployableInfoPopup.vue';

const props = withDefaults(defineProps<{
  deployable: object
  popup?: boolean
  panel?: boolean
  hover?: boolean
  tier?: number
  owner?: object | null
}>(), {
  popup: true,
  owner: null,
})
</script>
