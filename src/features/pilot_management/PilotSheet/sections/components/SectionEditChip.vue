<template>
  <cc-tooltip inline simple :content="label">
    <v-chip
      size="small"
      label
      class="mr-2"
      :class="{ 'fade-select': !highlight }"
      :color="highlight ? 'warning' : 'white'"
      @click="$emit('open-selector')"
    >
      {{ current }}/{{ max }}&nbsp;
      <v-icon icon="mdi-circle-edit-outline" />
    </v-chip>
  </cc-tooltip>
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
};
</script>
