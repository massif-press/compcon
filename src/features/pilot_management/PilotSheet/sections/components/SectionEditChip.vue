<template>
  <v-tooltip :text="label">
    <template #activator="{ props }">
      <v-chip
        v-bind="props"
        size="small"
        label
        tile
        class="mr-2 ml-n2"
        :class="{ 'fade-select': !highlight }"
        :color="highlight ? 'warning' : ''"
        @click.stop="$emit('open-selector')">
        {{ current }}/{{ max }}&nbsp;
        <v-icon icon="mdi-circle-edit-outline" />
      </v-chip>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
defineOptions({ name: 'section-edit-chip' })

const props = defineProps<{
  highlight: boolean
  current: number
  max: number
  label: string
}>()

const emit = defineEmits<{
  'open-selector': []
}>()
</script>
