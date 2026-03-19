<template>
  <div v-html-safe="item.GetDescription()" />
</template>

<script lang="ts">
export default {
  name: 'cc-tag-card',
  props: {
    item: { type: Object, required: true },
    notes: { type: Boolean },
    smallTags: { type: Boolean },
    dense: { type: Boolean },
    charts: { type: Boolean },
    collapseActions: { type: Boolean },
    tier: { type: Number },
  },
};
</script>
