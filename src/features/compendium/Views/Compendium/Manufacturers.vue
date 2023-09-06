<template>
  <v-container px-5>
    <div class="heading h1">MANUFACTURERS</div>
    <v-tabs
      v-model="tabModel"
      :vertical="$vuetify.display.lgAndUp"
      background-color="accent"
      :slider-size="12"
      slider-color="active"
      icons-and-text
      show-arrows
    >
      <v-tab v-for="(m, i) in manufacturers" ripple>
        <cc-logo
          v-if="m.LogoIsExternal"
          size="large"
          :source="m"
          :color="tabModel == i ? 'white' : 'black'"
        />
        <v-icon v-else size="40" :icon="m.Icon" />
        {{ m.ID }}
      </v-tab>
    </v-tabs>
    <v-window v-model="tabModel">
      <v-window-item v-for="m in manufacturers">
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
              style="float: right; margin-left: 20px; margin-right: 50px; min-height: 22vw"
            />
            <blockquote v-html-safe="m.Quote" class="quote-block fluff-text text-text" />
            <v-divider class="ma-2" style="width: 30vw" />
            <p v-html-safe="m.Description" class="body-text stark-text-text mb-2" />
          </v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script lang="ts">
import { CompendiumStore } from '@/stores';
export default {
  name: 'manufacturers',
  data: () => ({
    tabModel: 0,
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
  border-left: 8px solid rgb(var(--v-theme-panel-darken1));
  padding-left: 6px;
}
</style>
