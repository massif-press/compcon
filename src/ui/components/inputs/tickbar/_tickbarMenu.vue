<template>
  <v-card tile class="pa-3" border>
    <div class="mb-2">
      <v-icon start :icon="icon" class="mt-n1" />
      <span class="heading">{{ label }}</span>
    </div>

    <slot />
    <v-row dense class="mt-1">
      <v-col>
        <v-btn flat color="primary" size="x-small" block tile @click="$emit('reset')">Reset</v-btn>
      </v-col>
      <v-col>
        <v-btn flat color="primary" size="x-small" block tile @click="$emit('set', 0)">Clear</v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { over } from 'lodash';

export default {
  name: '_tickbarMenu',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: 'mdi-keyboard-variant',
    },
    label: {
      type: String,
      default: 'Value',
    },
  },
  emits: ['set', 'reset'],
};
</script>
