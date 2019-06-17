<template>
  <v-container fluid px-5>
    <span class="display-1 text-uppercase font-weight-thin">MANUFACTURERS</span>
    <v-card class="mt-3">
      <v-tabs
        v-model="tabModel"
        color="green"
        dark
        slider-color="secondary"
        grow
      >
        <v-tab v-for="m in manufacturers" :key="m.id" ripple>
          {{ m.id }}
        </v-tab>
        <v-tab-item v-for="m in manufacturers" :key="m.id + 'desc'">
          <v-card flat class="px-3 py-3">
            <v-card-title
              class="display-2 text-uppercase font-weight-light pb-0 mb-0"
            >
              {{ m.name }}
            </v-card-title>
            <v-card-text class="mt-1 ml-2 pr-4 pt-0">
              <p v-html="m.description" />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'manufacturers',
  data: () => ({
    tabModel: 0,
    manufacturers: {},
  }),
  created() {
    this.manufacturers = this.$store.getters.getItemCollection('Manufacturers')
  },
})
</script>
