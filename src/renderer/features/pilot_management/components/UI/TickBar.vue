<template>
  <v-flex shrink>
    <v-layout row>
      <v-flex shrink v-if="!readonly">
        <v-tooltip left v-if="!noClear">
          <v-btn
            slot="activator"
            flat
            icon
            class="ma-0 pt-0"
            dark
            :small="small"
            relative
            :color="color"
            @click="clear"
          >
            <v-icon :large="large" :small="small">clear</v-icon>
          </v-btn>
          <span>Clear</span>
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
          :empty-icon="emptyIcon ? emptyIcon : 'mdi-hexagon-outline'"
          :full-icon="fullIcon ? fullIcon : 'mdi-hexagon'"
          :color="color"
          :background-color="bgColor ? bgColor : 'grey darken-1'"
        />
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'tick-bar',
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
    noClear: Boolean,
  },
  data: () => ({
    model: 0,
    lock: true,
  }),
  methods: {
    clear() {
      this.model = 0
      this.$emit('update', 0)
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
