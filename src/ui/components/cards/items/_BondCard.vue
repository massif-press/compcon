<template>
  <cc-bond-info :bond="item" hide-title />
</template>

<script lang="ts">
export default {
  name: 'cc-bond-card',
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
