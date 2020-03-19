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
        <fieldset>
          <legend class="clipped-small heading h3">General Print Options&emsp;</legend>
          <print-option-select mandatory title="Layout" :items="layoutOptions" />
          <print-option-select mandatory title="Font Size" :items="fontSizeOptions" />
          <print-option-select
            mandatory
            title="Print Trackable Stats as:"
            :items="trackableStatOptions"
          />
        </fieldset>
        <v-overlay absolute :value="true" color="panel" opacity="0.85">
          <span class="heading h2 text--text">Feature In Development</span>
        </v-overlay>
      </v-card>
      <v-card flat tile>
        <fieldset>
          <legend class="clipped-small heading h3">Pilot Sheet Options&emsp;</legend>
          include:
          <print-option-select multiple title="Include" :items="pilotIncludeOptions" />
        </fieldset>
        <v-overlay absolute :value="true" color="panel" opacity="0.85">
          <span class="heading h2 text--text">Feature In Development</span>
        </v-overlay>
      </v-card>
      <v-scroll-y-transition>
        <v-card flat tile>
          <fieldset>
            <legend class="clipped-small heading h3">Mech Sheet Options&emsp;</legend>
            include:
            <print-option-select multiple title="Include" :items="mechIncludeOptions" />
          </fieldset>
          <v-overlay absolute :value="true" color="panel" opacity="0.85">
            <span class="heading h2 text--text">Feature In Development</span>
          </v-overlay>
        </v-card>
      </v-scroll-y-transition>
      <v-card flat tile>
        <fieldset>
          <legend>Extras</legend>
          <print-option-select multiple title="Also Print" :items="extraOptions" />
        </fieldset>
        <v-overlay absolute :value="true" color="panel" opacity="0.85">
          <span class="heading h2 text--text">Feature In Development</span>
        </v-overlay>
      </v-card>
    </v-card-text>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import PrintOptionSelect from './PrintOptionSelect.vue'

export default Vue.extend({
  name: 'print-dialog',
  components: { PrintOptionSelect },
  data: () => ({
    options: null,
    layoutOptions: [
      { text: 'Graphic/Portrait', icon: 'mdi-file' },
      { text: 'Graphic/Landscape', icon: 'mdi-note' },
      { text: 'Text-Only/Portrait', icon: 'mdi-file-document-outline' },
      { text: 'Text-Only/Landscape', icon: 'mdi-file-document-box-outline' },
    ],
    fontSizeOptions: [
      { text: 'Small', icon: 'mdi-format-font-size-decrease' },
      { text: 'Regular', icon: 'mdi-format-text-variant' },
      { text: 'Large', icon: 'mdi-format-font-size-increase' },
    ],
    trackableStatOptions: [
      { text: 'Numbers', icon: 'mdi-numeric' },
      { text: 'Pips', icon: 'mdi-checkbox-multiple-marked-outline' },
    ],
    pilotIncludeOptions: [
      { text: 'Pilot Portrait' },
      { text: 'Appearance Notes' },
      { text: 'Extended Info' },
      { text: 'Pilot Biography' },
      { text: 'Item Notes' },
      { text: 'Pilot Notes' },
      { text: 'Portrait Sketch Panel' },
      { text: 'Blank Lined Panel' },
      { text: 'Blank Unlined Panel' },
      { text: 'Extra Equipment Space' },
      { text: 'Blank Panel: Top' },
      { text: 'Blank Panel: Middle' },
      { text: 'Blank Panel: Bottom' },
      { text: 'Append Unlined Section' },
      { text: 'Append Lined Section' },
    ],
    mechIncludeOptions: [
      { text: 'Mech Image' },
      { text: 'Mech Notes' },
      { text: 'Item Notes' },
      { text: 'Extra Mount Panel' },
      { text: 'Extra System Space' },
      { text: 'Sketch Panel' },
      { text: 'Blank Lined Panel' },
      { text: 'Blank Unlined Panel' },
      { text: 'Append Unlined Section' },
      { text: 'Append Lined Section' },
    ],
    extraOptions: [
      { text: 'Relevant Tag Info' },
      { text: 'Combat Quick Reference' },
      { text: 'Downtime Quick Reference' },
    ],
  }),
  methods: {
    show() {
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
    },
  },
})
</script>

<style scoped>
fieldset {
  border-color: var(--v-primary-base);
  border-radius: 2px;
  margin-bottom: 12px;
  padding: 4px;
}

legend {
  background-color: var(--v-primary-base);
  color: #fff;
  padding: 3px 6px;
}
</style>
