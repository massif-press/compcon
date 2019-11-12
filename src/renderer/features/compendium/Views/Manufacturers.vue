<template>
  <v-container fluid px-5>
    <h1 class="heading">MANUFACTURERS</h1>
    <v-tabs
      v-model="tabModel"
      vertical
      background-color="primary"
      :slider-size="12"
      slider-color="active"
      icons-and-text
    >
      <v-tab v-for="(m, i) in manufacturers" :key="m.ID" ripple>
        <cc-logo size="large" :source="m" :color="tabModel == i ? 'white' : 'black'" />
        {{ m.ID }}
      </v-tab>
      <v-tab-item v-for="m in manufacturers" :key="m.ID + 'desc'">
        <v-card flat class="px-3 py-3">
          <v-card-title class="heading mech pb-4" :style="`color: ${m.Color}`">{{ m.Name }}</v-card-title>
          <v-card-text class="mt-1 ml-2 pr-4 pt-0">
            <div style="float: right; margin-left: 20px; margin-right: 50px">
              <v-img :src="m.LogoSRC" min-width="300px" min-height="300px" />
            </div>
            <blockquote class="quote-block fluff-text grey--text text--darken-4" v-html="m.Quote" />
            <v-divider class="ma-2" style="width: 800px" />
            <p class="body-text black--text" v-html="m.Description" />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'manufacturers',
  data: () => ({
    tabModel: 0,
    manufacturers: {},
  }),
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.manufacturers = compendium.Manufacturers
  },
})
</script>

<style scoped>
.quote-block {
  border-left: 10px solid var(--v-panel-base);
  padding-left: 6px;
  padding-top: 4px;
}
</style>
