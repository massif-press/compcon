<template>
  <v-container>
    <v-row justify="space-between">
      <v-col cols="auto">
        <v-btn-toggle>
          <v-btn>class 1</v-btn>
          <v-btn>class 2</v-btn>
          <v-btn>class 3</v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="auto">
        <v-btn-toggle>
          <v-btn>tier 1</v-btn>
          <v-btn>tier 2</v-btn>
          <v-btn>tier 3</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <eidolon-layer-overview />
    <v-row class="mt-2">
      <v-col><v-btn small block color="accent" tile>add layer</v-btn></v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import EidolonLayerOverview from './_subcomponents/EidolonLayerOverview.vue'

export default Vue.extend({
  name: 'eidolon-layers',
  components: { EidolonLayerOverview },
})
</script>
