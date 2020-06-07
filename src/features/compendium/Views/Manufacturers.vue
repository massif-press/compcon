<template>
  <v-container fluid px-5>
    <h1 v-resize-text="{ maxFontSize: '36pt' }" class="heading">MANUFACTURERS</h1>
    <v-tabs
      v-model="tabModel"
      :vertical="$vuetify.breakpoint.lgAndUp"
      background-color="primary"
      :slider-size="12"
      slider-color="active"
      icons-and-text
      show-arrows
    >
      <v-tab v-for="(m, i) in manufacturers" :key="m.ID" ripple>
        <cc-logo size="large" :source="m" :color="tabModel == i ? 'white' : 'black'" />
        {{ m.ID }}
      </v-tab>
      <v-tab-item v-for="m in manufacturers" :key="m.ID + 'desc'">
        <v-card flat class="px-3 py-3 panel clipped-x-large">
          <v-card-title
            :class="`heading ${$vuetify.breakpoint.lgAndUp ? 'mech pb-3' : 'h2'}`"
            :style="`color: ${m.Color}; word-break: break-word!important`"
          >
            <span style="overflow-wrap: normal!important;">
              {{ m.Name }}
            </span>
          </v-card-title>
          <v-card-text class="mt-1 pr-4 pt-0">
            <div
              v-if="$vuetify.breakpoint.lgAndUp"
              style="float: right; margin-left: 20px; margin-right: 50px; min-height: 22vw"
            >
              <svg
                :style="`width:22vw; height:22vw; fill:${m.Color}; stroke:#fff; stroke-width: 8px;`"
              >
                <use :href="m.Logo + '#Content'"></use>
              </svg>
            </div>
            <blockquote class="quote-block fluff-text text--text" v-html="m.Quote" />
            <v-divider class="ma-2" style="width: 800px" />
            <p
              class="body-text stark-text--text mb-2"
              style="min-height: 400px;"
              v-html="m.Description"
            />
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
  get manufacturers() {
    return this.compendiumStore.Manufacturers
  }
}
</script>

<style scoped>
.quote-block {
  border-left: 8px solid var(--v-panel-darken1);
  padding-left: 6px;
}
</style>
