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

    <div v-if="editable">
      <v-divider class="my-2" />
      <v-btn
        v-if="!override"
        block
        size="x-small"
        variant="outlined"
        class="fade-select"
        @click="override = !override">
        Override Max Value
      </v-btn>
      <div v-if="override">
        <div class="text-cc-overline">Edit Max Value</div>
        <slot name="edit-max-value" />
        <v-row dense class="mt-1">
          <v-col>
            <v-btn block size="x-small" flat tile color="primary" @click="override = !override">
              Reset to Default
            </v-btn>
          </v-col>
          <v-col>
            <v-btn block size="x-small" flat tile color="success" @click="override = !override">
              Save
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>
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
    editable: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['set', 'reset'],
  data: () => ({
    override: false,
  }),
};
</script>
