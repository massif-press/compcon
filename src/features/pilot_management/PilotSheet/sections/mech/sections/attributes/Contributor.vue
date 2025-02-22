<template>
  <v-tooltip>
    <template #activator="{ props }">
      <span class="pa-1" v-bind="props">{{ label?.toUpperCase() }}</span>
    </template>
    <div class="heading h5" v-text="title" />
    <v-divider />
    <p class="py-2" v-html="content" />
  </v-tooltip>
</template>

<script lang="ts">
export default {
  name: 'contributor',
  props: {
    label: String,
    value: [Number, String],
    contributors: Array,
    reverse: Boolean,
  },
  computed: {
    title(): string {
      return this.reverse ? `${this.label} ${this.value}` : `${this.value} ${this.label}`;
    },
    content(): string {
      if (!this.contributors || this.contributors.length === 0) return '';
      return this.contributors.join('<br />');
    },
  },
};
</script>
