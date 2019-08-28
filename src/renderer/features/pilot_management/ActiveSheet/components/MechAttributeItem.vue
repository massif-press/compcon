<template>
  <v-col xs4 class="ma-1 text-center">
    <v-card dark flat>
      <v-card-text class="pa-0 effect-text" style="background-color: #616161">
        <span style="text-transform: uppercase">{{ attr }}</span>
      </v-card-text>
      <v-card-text class="pa-1">
        <span class="value">
          <span v-if="signed">{{ val > -1 ? '+' : '-' }}</span>
          {{ Math.abs(val) }}
        </span>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'mech-attribute-item',
  props: {
    attr: String,
    val: Number,
    signed: Boolean,
  },
})
</script>

<style scoped>
.value {
  font-size: 2em;
  line-height: 1em;
  font-weight: 700;
}
</style>
