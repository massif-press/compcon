<template>
  <v-flex shrink>
    <v-layout row>
      <v-flex shrink v-if="!readonly">
        <v-tooltip left>
          <v-btn slot="activator" flat icon class="ma-0 pt-0" dark relative @click="clear">
            <v-icon :large="large" :small="small">remove</v-icon>
          </v-btn>
          <span>Mark Use</span>
        </v-tooltip>
      </v-flex>
      <v-flex>
        <v-rating
          :key="current"
          class="d-inline-block"
          dense
          hover
          v-model="model"
          :length="max"
          :readonly="readonly"
          :small="small"
          :large="large"
          :empty-icon="emptyIcon"
          :full-icon="fullIcon"
          :color="color"
          :background-color="bgColor"
        />
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot } from '@/class'
export default Vue.extend({
  name: 'limited-bar',
  props: {
    current: Number,
    max: Number,
    small: Boolean,
    large: Boolean,
    emptyIcon: String,
    fullIcon: String,
    color: String,
    bgColor: String,
    readonly: Boolean,
  },
  data: () => ({
    model: 0,
    lock: true,
  }),
  methods: {
    clear() {
      this.model -= 1
    },
  },
  computed: {
    pilot(): Pilot {
      return this.$store.getters.getPilot
    },
  },
  created() {
    this.lock = true
    if (!this.readonly) {
      this.model = this.current > this.max ? this.max : this.current
    } else this.model = this.max
    this.lock = false
  },
  watch: {
    model(val: number) {
      if (!this.lock && !isNaN(val)) {
        this.$emit('update', val)
      }
    },
  },
})
</script>
