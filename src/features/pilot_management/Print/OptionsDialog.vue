<template>
  <cc-solo-dialog
    ref="dialog"
    icon="mdi-printer"
    large
    title="Print Options"
    @confirm="$emit('set', options)">
    <v-card-text class="flavor-text">
      <v-card flat tile>
        <fieldset class="pa-2">
          <legend class="clipped-small heading h3">General Print Options&emsp;</legend>
          <print-option-select
            v-model="options.layout"
            mandatory
            title="Layout"
            :items="layoutOptions" />
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
                v-model="options.content"
                mandatory
                title="Content"
                :items="contentOptions" />
            </v-col>
            <v-col>
              <print-option-select
                v-model="options.orientation"
                mandatory
                title="Orientation"
                :items="orientationOptions" />
            </v-col>
            <v-col>
              <print-option-select
                v-model="options.bonds"
                mandatory
                title="Bonds"
                :items="bondsOptions" />
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col>
              <print-option-select
                v-model="options.paper"
                mandatory
                title="Paper"
                :items="paperOptions" />
              <v-col>
                <print-option-select
                  v-model="options.card"
                  mandatory
                  title="Card Options"
                  :items="cardOptions" />
              </v-col>
            </v-col>
          </v-row>
        </fieldset>
      </v-card>
      <v-scroll-y-transition>
        <v-card v-if="pilotIncludeOptions.length > 0" flat tile>
          <fieldset class="pa-2">
            <legend class="clipped-small heading h3">Pilot Sheet Options&emsp;</legend>
            <print-option-select
              v-model="options.pilotInclude"
              multiple
              widen
              :items="pilotIncludeOptions" />
          </fieldset>
        </v-card>
      </v-scroll-y-transition>
      <v-scroll-y-transition>
        <v-card v-if="mechIncludeOptions.length > 0" flat tile>
          <fieldset class="pa-2">
            <legend class="clipped-small heading h3">Mech Sheet Options&emsp;</legend>
            <print-option-select
              v-model="options.mechInclude"
              multiple
              widen
              :items="mechIncludeOptions" />
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
  </cc-solo-dialog>
</template>

<script lang="ts">
import PrintOptionSelect from './PrintOptionSelect.vue';

export default {
  name: 'print-options-dialog',
  components: { PrintOptionSelect },
  watch: {
    options: {
      handler() {
        this.$emit('set', this.options);
      },
      deep: true,
    },
  },
  props: {
    hasBonds: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    options: {
      layout: { title: 'Standard', icon: 'mdi-book-open' },
      orientation: { title: 'Portrait', icon: 'mdi-file' },
      content: { title: 'Pilot', icon: 'cc:pilot' },
      bonds: { title: 'Include', icon: 'mdi-link' },
      paper: { title: 'Letter', icon: 'mdi-text-box-check-outline' },
      pilotInclude: [],
      mechInclude: [],
      extras: [],
      card: [],
    },
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
    contentOptions: [
      { title: 'Pilot', icon: 'cc:pilot' },
      { title: 'Blank', icon: 'mdi-checkbox-blank-badge-outline' },
    ],
    bondsOptions: [
      { title: 'Include', icon: 'mdi-link' },
      { title: 'Omit', icon: 'mdi-link-off' },
    ],
    paperOptions: [
      { title: 'Letter', icon: 'mdi-text-box-check-outline' },
      { title: 'A4', icon: 'mdi-file-star-four-points-outline' },
    ],
    cardOptions: [
      { title: 'Include Standard Actions', icon: 'mdi-hexagon-slice-3 ' },
      { title: 'Include Status/Condition Cards', icon: 'cc:eclipse' },
    ],
  }),
  created() {
    this.$emit('set', this.options);
  },
  methods: {
    show() {
      (this.$refs.dialog as any).show();
    },
    hide() {
      (this.$refs.dialog as any).hide();
    },
  },
  computed: {
    pilotIncludeOptions() {
      switch (this.options.layout.title) {
        case 'Minimal':
          return [];
        case 'Terse':
          return [
            { title: 'Pilot Portrait' },
            { title: 'Separate Talent Detail' },
            { title: 'Appearance Notes' },
            { title: 'Pilot Biography' },
            { title: 'Pilot Notes' },
            { title: 'Extra Equipment Space' },
            { title: 'Extra Reserve Space' },
            { title: 'Append Unlined Section' },
            { title: 'Append Lined Section' },
          ];

        case 'Standard':
          return [
            { title: 'Show Expanded Tags' },
            { title: 'Separate Talent Detail' },
            { title: 'Appearance Notes' },
            { title: 'Extra Equipment Space' },
            { title: 'Extra Reserve Space' },
            { title: 'Append Unlined Section' },
            { title: 'Append Lined Section' },
          ];
        case 'Expanded':
          return [
            { title: 'Show Expanded Tags' },
            { title: 'Separate Talent Detail' },
            { title: 'Extra Equipment Space' },
            { title: 'Extra Reserve Space' },
            { title: 'Append Unlined Section' },
            { title: 'Append Lined Section' },
          ];
        default:
          return [];
      }
    },
    mechIncludeOptions() {
      switch (this.options.layout.title) {
        case 'Minimal':
          return [{ title: 'Extra Mount Panel' }, { title: 'Extra System Space' }];
        case 'Terse':
          return [
            { title: 'Mech Image' },
            { title: 'Mech Notes' },
            { title: 'Extra Mount Panel' },
            { title: 'Extra System Space' },
            { title: 'Append Unlined Section' },
            { title: 'Append Lined Section' },
          ];
        case 'Standard':
          return [
            { title: 'Show Expanded Tags' },
            { title: 'Extra Mount Panel' },
            { title: 'Extra System Space' },
            { title: 'Append Unlined Section' },
            { title: 'Append Lined Section' },
          ];
        case 'Expanded':
          return [
            { title: 'Extra Mount Panel' },
            { title: 'Extra System Space' },
            { title: 'Append Unlined Section' },
            { title: 'Print Alternate Loadouts' },
            { title: 'Append Lined Section' },
          ];
        default:
          return [];
      }
    },
    extraOptions() {
      switch (this.options.layout.title) {
        default:
          return [
            { title: 'Relevant Tag Reference' },
            { title: 'Relevant Trigger Reference' },
            { title: 'Combat Quick Reference' },
            { title: 'Action Reference' },
            { title: 'Downtime Quick Reference' },
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
