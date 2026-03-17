<template>
  <v-row dense align="center" class="no-print">
    <v-col><v-divider /></v-col>
    <v-col cols="auto"><i class="text-grey" style="font-size: 11px">Page Break</i></v-col>
    <v-col><v-divider /></v-col>
  </v-row>
  <div style="display: block">
    <div
      style="break-before: page; page-break-before: always; break-inside: avoid; page-break-inside: avoid;" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'page-break',
};
</script>
