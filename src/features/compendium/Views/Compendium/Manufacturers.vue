<template>
  <v-container>
    <div class="heading mt-n4" :class="mobile ? 'h2' : 'h1'">MANUFACTURERS</div>
    <v-row>
      <v-col cols="12" lg="auto">
        <v-tabs
          v-model="tabModel"
          :direction="$vuetify.display.lgAndUp ? 'vertical' : 'horizontal'"
          :vertical="$vuetify.display.lgAndUp"
          :slider-height="12"
          slider-color="secondary"
          density="compact"
          icons-and-text
          show-arrows>
          <v-tab v-for="(m, i) in manufacturers" ripple>
            <cc-logo
              v-if="m.Svg || m.LogoIsExternal"
              size="large"
              :source="m"
              :color="tabModel == i ? 'white' : 'black'" />
            <v-icon v-else size="35" :icon="m.Icon" start />
            {{ m.ID }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col>
        <v-window v-model="tabModel">
          <v-window-item v-for="m in manufacturers">
            <cc-panel color="panel-dark" style="position: relative">
              <cc-lcp-info :item="m" style="position: absolute; top: 4px; right: 4px" />
              <div
                :class="`heading ${$vuetify.display.lgAndUp ? 'mech' : 'h2'}`"
                :style="`color: ${m.Color};`">
                <span style="overflow-wrap: normal !important">
                  {{ m.Name }}
                </span>
              </div>
              <v-card-text class="pr-4 pt-0">
                <div
                  v-if="m.Svg"
                  v-html="cleanSvg(m.Svg)"
                  style="float: right; width: 22vw; height: 22vw"
                  :style="{
                    filter: `invert(${$vuetify.theme.current.dark ? 1 : 0})`,
                  }" />
                <svg
                  v-else-if="!mobile && m.isExternalSvg && m.isCorsSafe"
                  :data-src="m.Logo + '#Content'"
                  style="float: right; min-height: 22vw; width: 22vw; height: 22vw"></svg>
                <img
                  v-else-if="!mobile"
                  :src="m.Logo"
                  :alt="m.Name"
                  :style="{
                    filter: `invert(${$vuetify.theme.current.dark ? 1 : 0})`,
                  }"
                  style="float: right; width: 22vw; height: 22vw" />

                <blockquote v-html-safe="m.Quote" class="quote-block" />
                <v-divider class="ma-2" style="width: 30vw" />
                <p v-html-safe="m.Description" class="body-text stark-text-text mb-2" />
              </v-card-text>
            </cc-panel>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import DOMPurify from 'dompurify';
import { CompendiumStore } from '@/stores';

export default {
  name: 'manufacturers',
  data: () => ({
    tabModel: 0,
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    manufacturers() {
      return CompendiumStore().Manufacturers.filter((x) => !x.IsHidden);
    },
  },
  methods: {
    iconColor(m): string {
      return m.Color;
    },
    cleanSvg(svg: string): string {
      return DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } });
    },
  },
};
</script>

<style scoped>
.quote-block {
  border-left: 6px solid rgb(var(--v-theme-panel));
  border-radius: 3px;
  padding-left: 12px;
  font-size: 1.3rem;
}
</style>
