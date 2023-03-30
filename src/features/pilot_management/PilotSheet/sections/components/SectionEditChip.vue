<template>
  <span>
    <cc-tooltip inline simple :content="label">
      <v-chip
        small
        label
        dark
        :class="{ 'fade-select': !highlight }"
        :color="highlight ? 'warning' : 'pilot'"
        style="margin-bottom: 1px"
        @click="$emit('open-selector')"
      >
        {{ current }}/{{ max }}&nbsp;
        <v-icon icon="mdi-circle-edit-outline" />
      </v-chip>
    </cc-tooltip>
  </span>
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
