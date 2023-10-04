<template>
  <cc-solo-dialog
    ref="dialog"
    icon="mdi-printer"
    large
    title="Print Options"
    @confirm="$emit('set', options)"
  >
    <v-card-text class="flavor-text">
      <v-card flat tile>
        <fieldset class="pa-2">
          <legend class="clipped-small heading h3">General Print Options&emsp;</legend>
          <print-option-select mandatory title="Layout" :items="layoutOptions" />
          <v-row>
            <v-col>
              <print-option-select mandatory title="Orientation" :items="orientationOptions" />
            </v-col>
            <v-col>
              <print-option-select mandatory title="Stat Tracking" :items="trackableStatOptions" />
            </v-col>
          </v-row>
        </fieldset>
      </v-card>
      <v-card flat tile>
        <fieldset class="pa-2">
          <legend class="clipped-small heading h3">Pilot Sheet Options&emsp;</legend>
          <print-option-select multiple title="Include" :items="pilotIncludeOptions" />
        </fieldset>
        <v-overlay absolute :value="true" color="panel" opacity="0.85">
          <span class="heading h2 text-text">Feature In Development</span>
        </v-overlay>
      </v-card>
      <v-scroll-y-transition>
        <v-card flat tile>
          <fieldset class="pa-2">
            <legend class="clipped-small heading h3">Mech Sheet Options&emsp;</legend>
            <print-option-select multiple title="Include" :items="mechIncludeOptions" />
          </fieldset>
          <v-overlay absolute :value="true" color="panel" opacity="0.85">
            <span class="heading h2 text-text">Feature In Development</span>
          </v-overlay>
        </v-card>
      </v-scroll-y-transition>
      <v-card flat tile>
        <fieldset class="pa-2">
          <legend>Extras</legend>
          <print-option-select multiple title="Also Print" :items="extraOptions" />
        </fieldset>
        <v-overlay absolute :value="true" color="panel" opacity="0.85">
          <span class="heading h2 text-text">Feature In Development</span>
        </v-overlay>
      </v-card>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import PrintOptionSelect from './PrintOptionSelect.vue';

export default {
  name: 'print-options-dialog',
  components: { PrintOptionSelect },
  data: () => ({
    options: null,
    layoutOptions: [
      { title: 'Minimal', icon: 'mdi-text-short' },
      { title: 'Terse', icon: 'mdi-file-document-outline' },
      { title: 'Standard', icon: 'mdi-book-open' },
      { title: 'Expanded', icon: 'mdi-book-open-page-variant-outline' },
      { title: 'Cards', icon: 'mdi-cards-outline' },
    ],
    orientationOptions: [
      { title: 'Portrait', icon: 'mdi-file' },
      { title: 'Landscape', icon: 'mdi-note' },
    ],

    trackableStatOptions: [
      { title: 'Numbers', icon: 'mdi-numeric' },
      { title: 'Pips', icon: 'mdi-hexagon-multiple-outline' },
    ],
    pilotIncludeOptions: [
      { title: 'Pilot Portrait' },
      { title: 'Appearance Notes' },
      { title: 'Extended Info' },
      { title: 'Pilot Biography' },
      { title: 'Item Notes' },
      { title: 'Pilot Notes' },
      { title: 'Portrait Sketch Panel' },
      { title: 'Blank Lined Panel' },
      { title: 'Blank Unlined Panel' },
      { title: 'Extra Equipment Space' },
      { title: 'Blank Panel: Top' },
      { title: 'Blank Panel: Middle' },
      { title: 'Blank Panel: Bottom' },
      { title: 'Append Unlined Section' },
      { title: 'Append Lined Section' },
    ],
    mechIncludeOptions: [
      { title: 'Mech Image' },
      { title: 'Mech Notes' },
      { title: 'Item Notes' },
      { title: 'Extra Mount Panel' },
      { title: 'Extra System Space' },
      { title: 'Sketch Panel' },
      { title: 'Blank Lined Panel' },
      { title: 'Blank Unlined Panel' },
      { title: 'Append Unlined Section' },
      { title: 'Append Lined Section' },
    ],
    extraOptions: [
      { title: 'Relevant Tag Info' },
      { title: 'Relevant Action Reference' },
      { title: 'Combat Quick Reference' },
      { title: 'Downtime Quick Reference' },
    ],
  }),
  methods: {
    show() {
      (this.$refs.dialog as any).show();
    },
    hide() {
      (this.$refs.dialog as any).hide();
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
