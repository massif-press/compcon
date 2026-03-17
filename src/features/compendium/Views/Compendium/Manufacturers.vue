<template>
  <v-container>
    <div class="heading mt-n4"
      :class="mobile ? 'h2' : 'h1'">MANUFACTURERS</div>
    <v-row>
      <v-col cols="12"
        lg="2">
        <v-tabs v-model="tabModel"
          :direction="$vuetify.display.lgAndUp ? 'vertical' : 'horizontal'"
          :vertical="$vuetify.display.lgAndUp"
          :slider-height="12"
          slider-color="secondary"
          density="compact"
          icons-and-text
          show-arrows>
          <v-tab v-for="(m, i) in manufacturers"
            :key="m.ID"
            ripple>
            <v-row dense
              align="center">
              <v-col cols="auto">
                <cc-logo size="large"
                  :source="m"
                  :color="tabModel === i ? m.Color : ''" />
              </v-col>
              <v-col>
                {{ m.ID }}
              </v-col>
            </v-row>
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col>
        <v-window v-model="tabModel">
          <v-window-item v-for="m in manufacturers"
            :key="`manufacturer-${m.ID}`">
            <cc-panel color="panel-dark"
              :density="mobile ? 'compact' : ''"
              style="position: relative">
              <cc-lcp-info :item="m"
                style="position: absolute; top: 4px; right: 4px" />
              <div :class="`heading ${$vuetify.display.lgAndUp ? 'mech' : 'h2'}`"
                :style="`color: ${m.Color};`">
                <span style="overflow-wrap: normal !important">
                  {{ m.Name }}
                </span>
              </div>
              <v-card-text class="pr-4 pt-0">
                <div v-if="!mobile"
                  style="float: right; width: 22vw; height: 22vw">
                  <cc-logo width="22vw"
                    :source="m"
                    :color="m.Color" />
                </div>
                <blockquote v-html-safe="m.Quote"
                  class="quote-block" />
                <v-divider v-if="!mobile"
                  class="ma-2"
                  style="width: 30vw" />
                <p v-html-safe="m.Description"
                  class="body-text stark-text-text mb-2" />
              </v-card-text>
            </cc-panel>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
import { useMobile } from '@/mixins/useMobile';


export default {
  name: 'Manufacturers',
  mixins: [useMobile],
  data: () => ({
    tabModel: 0,
    loading: false,
  }),
  computed: {
    manufacturers() {
      return CompendiumStore().Manufacturers.filter((x) => !x.IsHidden);
    },
  },
};
</script>

<style scoped>
.quote-block {
  border-left: 6px solid rgb(var(--v-theme-panel));
  border-radius: 0px;
  padding-left: 12px;
  font-size: 1.15rem;
}
</style>
