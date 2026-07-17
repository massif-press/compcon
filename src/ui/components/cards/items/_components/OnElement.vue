<template>
  <cc-panel
    v-if="profile[`On${capitalizeAction}`]"
    density="compact"
    icon="cc:weapon"
    class="my-1"
    :title="$t(`pm.print.on${action === 'crit' ? 'CRIT' : action.toUpperCase()}`)">
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
</script>
