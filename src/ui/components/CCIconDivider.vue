<template>
  <v-row align="center" :dense="dense">
    <v-col><v-divider /></v-col>
    <v-col cols="auto"><v-icon color="panel-border" :icon="icon" /></v-col>
    <v-col><v-divider /></v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'CCIconDivider',
  props: {
    icon: {
      type: String,
      required: true,
    },
    dense: {
      type: Boolean,
    },
  },
};
</script>
