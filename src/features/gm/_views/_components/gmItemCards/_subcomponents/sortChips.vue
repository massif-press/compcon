<template>
  <div style="position: absolute; bottom: 4px; right: 4px">
    <v-chip v-if="grouping" size="x-small" label class="pa-0 mx-1"
      ><span class="bg-primary pa-2">{{ (grouping as any).title }}</span>
      <span v-if="(grouping as any).value" class="px-2">{{ (grouping as any).value }}</span></v-chip
    >
    <v-chip v-if="sorting" size="x-small" label class="pa-0 mx-1"
      ><span class="bg-secondary-darken-2 pa-2">{{ (sorting as any).title }}</span>
      <span v-if="(sorting as any).value" class="px-2">{{ (sorting as any).value }}</span></v-chip
    >
  </div>
</template>

<script lang="ts">
export default {
  name: 'gm-card-sort-chip-display',
  props: {
    grouping: { type: [Object, String], required: false, default: '' },
    sorting: { type: [Object, String], required: false, default: '' },
  },
};
</script>
