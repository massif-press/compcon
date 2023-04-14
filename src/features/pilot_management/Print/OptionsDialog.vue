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
          <legend class="clipped-small heading h3">
            General Print Options&emsp;
          </legend>
          <print-option-select
            mandatory
            title="Layout"
            :items="layoutOptions"
          />
          <print-option-select
            mandatory
            title="Font Size"
            :items="fontSizeOptions"
          />
          <print-option-select
            mandatory
            title="Print Trackable Stats as:"
            :items="trackableStatOptions"
          />
        </fieldset>
        <v-overlay absolute :value="true" color="panel" opacity="0.85">
          <span class="heading h2 text-text">Feature In Development</span>
        </v-overlay>
      </v-card>
      <v-card flat tile>
        <fieldset>
          <legend class="clipped-small heading h3">
            Pilot Sheet Options&emsp;
          </legend>
          include:
          <print-option-select
            multiple
            title="Include"
            :items="pilotIncludeOptions"
          />
        </fieldset>
        <v-overlay absolute :value="true" color="panel" opacity="0.85">
          <span class="heading h2 text-text">Feature In Development</span>
        </v-overlay>
      </v-card>
      <v-scroll-y-transition>
        <v-card flat tile>
          <fieldset>
            <legend class="clipped-small heading h3">
              Mech Sheet Options&emsp;
            </legend>
            include:
            <print-option-select
              multiple
              title="Include"
              :items="mechIncludeOptions"
            />
          </fieldset>
          <v-overlay absolute :value="true" color="panel" opacity="0.85">
            <span class="heading h2 text-text">Feature In Development</span>
          </v-overlay>
        </v-card>
      </v-scroll-y-transition>
      <v-card flat tile>
        <fieldset>
          <legend>Extras</legend>
          <print-option-select
            multiple
            title="Also Print"
            :items="extraOptions"
          />
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
      { title: 'Graphic/Portrait', icon: 'mdi-file' },
      { title: 'Graphic/Landscape', icon: 'mdi-note' },
      { title: 'Text-Only/Portrait', icon: 'mdi-file-document-outline' },
      {
        title: 'Text-Only/Landscape',
        icon: 'mdi-file-document-outline-outline',
      },
    ],
    fontSizeOptions: [
      { title: 'Small', icon: 'mdi-format-font-size-decrease' },
      { title: 'Regular', icon: 'mdi-format-text-variant' },
      { title: 'Large', icon: 'mdi-format-font-size-increase' },
    ],
    trackableStatOptions: [
      { title: 'Numbers', icon: 'mdi-numeric' },
      { title: 'Pips', icon: 'mdi-checkbox-multiple-marked-outline' },
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
