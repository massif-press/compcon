<template>
  <v-col cols="4" class="mb-1 text-center">
    <v-card flat class="ma-2" color="grey lighten-2">
      <v-card-text class="stat-header pt-1 pb-1">
        <contributor
          :label="attr"
          :value="signed ? (val > -1 ? '+' : '-') + val : val"
          :contributors="contributors"
        />
      </v-card-text>
      <v-card-text class="pa-0 pt-1 pb-2">
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
import { Contributor } from '../../components/UI'

export default Vue.extend({
  name: 'statblock-item',
  components: { Contributor },
  props: {
    attr: String,
    val: Number,
    signed: Boolean,
    contributors: Array,
  },
})
</script>

<style scoped>
.stat-header {
  background-color: #bdbdbd;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 3px;
}

.value {
  font-size: 2.5em;
  line-height: 1em;
  /* font-weight: 700; */
}
</style>
