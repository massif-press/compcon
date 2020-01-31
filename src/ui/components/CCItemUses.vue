<template>
  <div class="mt-n1">
    <v-icon
      v-for="n in max"
      :key="`chk_${item.ID}-${n}`"
      class="d-inline ma-0"
      :small="small"
      :large="large"
      :color="color"
      @click.stop="set(n)"
      v-html="n <= current ? fullIcon : emptyIcon"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'cc-item-uses',
  props: {
    item: {
      type: Object,
      required: true,
    },
    bonus: {
      type: Number,
      required: false,
      default: 0,
    },
    small: {
      type: Boolean,
    },
    large: {
      type: Boolean,
    },
    emptyIcon: {
      type: String,
      required: false,
      default: 'mdi-hexagon-outline',
    },
    fullIcon: {
      type: String,
      required: false,
      default: 'mdi-hexagon-slice-6',
    },
    color: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  computed: {
    max() {
      return this.item.MaxUses + this.bonus
    },
    current() {
      return this.item.Uses
    },
  },
  methods: {
    set(val) {
      if (val > this.current) Vue.set(this.item, 'Uses', this.item.Uses + 1)
      else Vue.set(this.item, 'Uses', this.item.Uses - 1)
    },
  },
})
</script>
