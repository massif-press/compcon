<template>
  <v-col class="text-center">
    <div class="caption">{{ title.toUpperCase() }}</div>
    <v-row no-gutters justify="center" align="center">
      <v-col cols="auto" class="heading h3 text-accent">
        {{ arr[0] }}
      </v-col>
      <v-col cols="auto" class="px-1">/</v-col>
      <v-col cols="auto" class="heading h3 text-accent">
        {{ arr[1] }}
      </v-col>
      <v-col cols="auto" class="px-1">/</v-col>
      <v-col cols="auto" class="heading h3 text-accent">
        {{ arr[2] }}
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
export default {
  name: 'tiered-attribute',
  props: {
    title: { type: String, required: true },
    arr: { type: Array, required: true },
  },
};
</script>
