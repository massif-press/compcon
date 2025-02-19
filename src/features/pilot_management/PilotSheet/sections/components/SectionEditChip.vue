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

<script lang="ts">
export default {
  name: 'section-edit-chip',
  props: {
    highlight: {
      type: Boolean,
      required: true,
    },
    current: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  emits: ['open-selector'],
};
</script>
