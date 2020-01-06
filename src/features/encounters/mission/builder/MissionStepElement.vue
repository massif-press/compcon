<template>
  <v-alert :color="color" :icon="icon" outlined prominent dense border="left">
    <v-row dense align="center">
      <v-col cols="auto">
        <v-btn icon :disabled="index === 0" @click="$emit('move-up')">
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <br />
        <v-btn icon :disabled="index === missionLength" @click="$emit('move-down')">
          <v-icon>mdi-arrow-down</v-icon>
        </v-btn>
      </v-col>
      <v-col>
        <v-row dense class="mt-n2">
          <v-col>
            <span class="heading h3">
              <slot name="title" />
            </span>
          </v-col>
          <v-col cols="auto" class="ml-auto mr-3">
            <slot name="items" />
          </v-col>
        </v-row>
        <slot />
        <v-textarea
          v-model="step.Note"
          label="Notes"
          dense
          hide-details
          filled
          auto-grow
          rows="1"
        />
      </v-col>
      <v-col cols="auto">
        <v-btn icon color="error" @click="$emit('remove')">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'mission-step-element',
  props: {
    step: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: 'Primary',
    },
    icon: {
      type: String,
      required: false,
      default: '',
    },
    index: {
      type: Number,
      required: true,
    },
    missionLength: {
      type: Number,
      required: true,
    },
  },
})
</script>
