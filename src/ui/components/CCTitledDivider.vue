<template>
  <v-row dense align="center">
    <v-col :cols="offset"><v-divider /></v-col>
    <v-col cols="auto">
      <div :class="`heading h${heading} text-${color}`">
        {{ title }}
        <span v-if="subtitle" class="text-caption text-text" style="opacity: 0.75">
          {{ subtitle }}</span
        >
      </div>
    </v-col>
    <v-col><v-divider /></v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'CCTitledDivider',
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: false,
    },
    offset: {
      type: Number,
      required: false,
      default: 1,
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
    heading: {
      type: String,
      required: false,
      default: '3',
    },
  },
};
</script>
