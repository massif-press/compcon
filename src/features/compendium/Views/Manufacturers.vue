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
        <v-card flat class="px-3 py-3 panel">
          <v-card-title class="heading mech pb-4" :style="`color: ${m.Color}`">
            {{ m.Name }}
          </v-card-title>
          <v-card-text class="mt-1 ml-2 pr-4 pt-0">
            <div style="float: right; margin-left: 20px; margin-right: 50px">
              <v-img :src="m.Logo" min-width="300px" min-height="300px" />
            </div>
            <blockquote class="quote-block fluff-text text--text" v-html="m.Quote" />
            <v-divider class="ma-2" style="width: 800px" />
            <p class="body-text stark-text--text" v-html="m.Description" />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

@Component
export default class Manufacturers extends Vue {
  public tabModel = 0

  private compendiumStore = getModule(CompendiumStore, this.$store)
  get manufacturers() { return this.compendiumStore.Manufacturers }

}
</script>

<style scoped>
.quote-block {
  border-left: 10px solid var(--v-text-base);
  padding-left: 6px;
  padding-top: 4px;
}
</style>