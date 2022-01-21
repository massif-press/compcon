<template>
  <v-container px-5>
    <div class="heading h1">MANUFACTURERS</div>
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
            <span style="overflow-wrap: normal !important">
              {{ m.Name }}
            </span>
          </v-card-title>
          <v-card-text class="mt-1 pr-4 pt-0">
            <!-- <img :src="`https://compcon-image-assets.s3.amazonaws.com/icons/gms.svg`" /> -->
            <div
              v-if="$vuetify.breakpoint.lgAndUp"
              style="float: right; margin-left: 20px; margin-right: 50px; min-height: 22vw"
            >
              <img
                v-if="m.LogoIsExternal"
                :src="m.Logo"
                :alt="m.Name"
                :style="{
                  maxWidth: '22vw',
                  height: '22vw',
                  filter: `invert(${$vuetify.theme.dark ? 1 : 0})`,
                }"
              />
              <img
                v-else
                :src="`/static/img/logo/${m.Logo}.svg`"
                :style="`width:22vw; height:22vw; filter: invert(${$vuetify.theme.dark ? 1 : 0});`"
              />
            </div>
            <blockquote v-html-safe="m.Quote" class="quote-block fluff-text text--text" />
            <v-divider class="ma-2" style="width: 800px" />
            <p
              v-html-safe="m.Description"
              class="body-text stark-text--text mb-2"
              style="min-height: 400px"
            />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import Vue from 'vue'

export default Vue.extend({
  name: 'manufacturers',
  data: () => ({
    tabModel: 0,
  }),
  computed: {
    manufacturers() {
      return getModule(CompendiumStore, this.$store).Manufacturers.filter(x => !x.IsHidden)
    },
  },
})
</script>

<style scoped>
.quote-block {
  border-left: 8px solid var(--v-panel-darken1);
  padding-left: 6px;
}
</style>
