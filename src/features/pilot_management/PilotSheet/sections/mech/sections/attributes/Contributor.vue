<template>
  <cc-tooltip :title="title" :content="content">
    <span class="pa-1">{{ label?.toUpperCase() }}</span>
  </cc-tooltip>
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
