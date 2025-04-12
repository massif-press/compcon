<template>
  <v-card-text class="flavor-text">
    <v-card flat tile>
      <fieldset class="pa-2">
        <legend class="clipped-small heading h3">General Print Options&emsp;</legend>
        <v-row v-if="options.layout.title !== 'Cards'">
          <v-col>
            <print-option-select
              v-model="options.paper"
              mandatory
              title="Paper"
              :items="paperOptions" />
          </v-col>
          <v-col>
            <print-option-select
              v-model="options.orientation"
              mandatory
              title="Orientation"
              :items="orientationOptions" />
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <print-option-select
              v-model="options.paper"
              mandatory
              title="Paper"
              :items="paperOptions" />
          </v-col>
        </v-row>
      </fieldset>
    </v-card>
    <v-scroll-y-transition>
      <v-card v-if="includeOptions.length > 0" flat tile>
        <fieldset class="pa-2">
          <legend class="clipped-small heading h3">Options&emsp;</legend>
          <print-option-select v-model="options.include" multiple widen :items="includeOptions" />
        </fieldset>
      </v-card>
    </v-scroll-y-transition>
    <v-card flat tile>
      <fieldset class="pa-2">
        <legend>Extras</legend>
        <print-option-select v-model="options.extras" multiple :items="extraOptions" />
      </fieldset>
    </v-card>
  </v-card-text>
</template>

<script lang="ts">
import PrintOptionSelect from './PrintOptionSelect.vue';

export default {
  name: 'print-options-dialog',
  components: { PrintOptionSelect },
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    orientationOptions: [
      { title: 'Portrait', icon: 'mdi-file' },
      { title: 'Landscape', icon: 'mdi-note' },
    ],
    paperOptions: [
      { title: 'Letter', icon: 'mdi-text-box-check-outline' },
      { title: 'A4', icon: 'mdi-file-star-four-points-outline' },
    ],
  }),
  computed: {
    includeOptions() {
      switch (this.options.layout.title) {
        case 'Minimal':
          return [];
        default:
          return [
            { title: 'Include Image' },
            { title: 'Include Map' },
            { title: 'Append Lined Section' },
            { title: 'Append Unlined Section' },
          ];
      }
    },
    extraOptions() {
      switch (this.options.layout.title) {
        default:
          return [
            { title: 'GM Tracker' },
            { title: 'Tag Reference' },
            { title: 'Combat Quick Reference' },
            { title: 'Action Reference' },
          ];
      }
    },
  },
};
</script>

<style scoped>
fieldset {
  border-color: rgb(var(--v-theme-primary));
  border-radius: 2px;
  margin-bottom: 12px;
  padding: 4px;
}

legend {
  background-color: rgb(var(--v-theme-primary));
  color: #fff;
  padding: 3px 6px;
}
</style>
