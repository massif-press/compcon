<template>
  <cc-panel
    v-if="profile[`On${capitalizeAction}`]"
    density="compact"
    icon="cc:weapon"
    class="my-1"
    :title="`On ${namedAction}`">
    <div v-html-safe="profile[`On${capitalizeAction}`].Detail" />
  </cc-panel>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  profile: object
  action: string
}>()

const capitalizeAction = computed(() => props.action.charAt(0).toUpperCase() + props.action.slice(1))
const namedAction = computed(() => props.action === 'crit' ? 'critical hit' : props.action)
</script>
