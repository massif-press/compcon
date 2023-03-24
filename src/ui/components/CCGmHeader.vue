<template>
  <v-row dense>
    <v-col :cols="flip ? '' : 1">
      <hr class="mt-3" />
    </v-col>
    <v-col cols="auto" class="mt-n2">
      <span :class="`heading h2 ${color}--text`">{{ title }}</span>
    </v-col>
    <v-col :cols="flip ? 1 : ''">
      <hr class="mt-3" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
export default {
  name: 'CCGmHeader',
  props: {
    title: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'accent',
    },
    flip: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>
