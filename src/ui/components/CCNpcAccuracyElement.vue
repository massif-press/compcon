<template>
  <v-tooltip location="top">
    <template #activator="{ props }">
      <v-icon v-bind="props"
        class="mt-n1"
        :size="small ? 'small' : '28'"
        :icon="accuracy < 0 ? 'cc:difficulty' : 'cc:accuracy'" />
      <b class="px-1 heading">{{ accuracy }}</b>
    </template>
    <span>{{ accuracy < 0
      ? 'Difficulty'
      : 'Accuracy'
        }}</span>
  </v-tooltip>
</template>

    <script setup lang="ts">
const props = withDefaults(defineProps<{
  accuracy: number
  small?: boolean
}>(), {
  small: false
})
</script>