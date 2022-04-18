<template>
  <v-row dense justify="end" align="center">
    <v-col cols="auto">
      <v-btn-toggle v-model="item.Tier" dense mandatory active-class="accent--text" class="mb-2">
        <v-btn :value="1">
          <v-icon left>cci-rank-1</v-icon>
          Tier 1
        </v-btn>
        <v-btn :value="2">
          <v-icon left>cci-rank-2</v-icon>
          Tier 2
        </v-btn>
        <v-btn :value="3">
          <v-icon left>cci-rank-3</v-icon>
          Tier 3
        </v-btn>
      </v-btn-toggle>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'npc-tier-selector',
  props: { item: { type: Object, required: true } },
})
</script>
