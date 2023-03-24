<template>
  <v-container px-5>
    <div class="heading h1">MANUFACTURERS</div>
    <v-tabs
      v-model="tabModel"
      :vertical="$vuetify.display.lgAndUp"
      background-color="primary"
      :slider-size="12"
      slider-color="active"
      icons-and-text
      show-arrows
    >
      <v-tab v-for="(m, i) in manufacturers" :key="m.ID" ripple>
        <cc-logo
          size="large"
          :source="m"
          :color="tabModel == i ? 'white' : 'black'"
        />
        {{ m.ID }}
      </v-tab>
      <v-tab-item v-for="m in manufacturers" :key="m.ID + 'desc'">
        <v-card flat class="px-3 py-3 panel clipped-x-large">
          <v-card-title
            :class="`heading ${$vuetify.display.lgAndUp ? 'mech pb-3' : 'h2'}`"
            :style="`color: ${m.Color}; word-break: break-word!important`"
          >
            <span style="overflow-wrap: normal !important">
              {{ m.Name }}
            </span>
          </v-card-title>
          <v-card-text class="mt-1 pr-4 pt-0">
            <cc-logo-splash
              v-if="$vuetify.display.lgAndUp"
              :source="m"
              style="
                float: right;
                margin-left: 20px;
                margin-right: 50px;
                min-height: 22vw;
              "
            />
            <blockquote
              v-html-safe="m.Quote"
              class="quote-block fluff-text text--text"
            />
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
import { CompendiumStore } from '@/store';
export default {
  name: 'manufacturers',
  data: () => ({
    tabModel: 0,
  }),
  computed: {
    manufacturers() {
      return this.getModule(CompendiumStore).Manufacturers.filter(
        (x) => !x.IsHidden
      );
    },
  },
};
</script>

<style scoped>
.quote-block {
  border-left: 8px solid rgb(var(--v-theme-panel-darken1));
  padding-left: 6px;
}
</style>
