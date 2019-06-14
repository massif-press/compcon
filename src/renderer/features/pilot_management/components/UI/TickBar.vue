<template>
  <v-flex shrink>
    <v-tooltip left v-if="!readonly">
      <v-btn
        slot="activator"
        flat
        icon
        class="ma-0 pt-0"
        :style="large ? 'bottom: 12px; left: 5px' : 'left:10px'"
        dark
        relative
        :color="color"
        @click="clear"
      >
        <v-icon :large="large" :small="small">clear</v-icon>
      </v-btn>
      <span>Clear</span>
    </v-tooltip>
    <v-rating
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
    },
    data: () => ({
      model: 0,
    }),
    methods: {
      clear() {
        this.model = 0
        this.$emit('update', 0)
      },
    },
    watch: {
      model(val: number) {
        if (val && !isNaN(val)) {
          this.$emit('update', val)
        }
      },
    },
    created() {
      if (this.current && !this.readonly) {
        this.model = this.current > this.max ? this.max : this.current
      } else if (this.readonly) this.model = this.max
      else this.model = 0
    },
  })
</script>
