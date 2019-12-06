<template>
  <cc-solo-dialog ref="dialog" icon="mdi-printer" large no-confirm title="Print Character Sheets">
    <div>
      <v-card-text class="flavor-text">
        <span>A flavorful description...</span>
        <v-select
          v-model="mechSelect"
          :items="pilot.Mechs"
          item-text="Name"
          item-value="ID"
          label="Include Mech (optional)"
          outlined
        />
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
          <v-overlay absolute :value="true" color="grey lighten-1" opacity="0.85">
            <span class="heading h2 text--text">Feature In Development</span>
          </v-overlay>
        </v-card>
        <v-card flat tile>
          <fieldset>
            <legend class="clipped-small heading h3">Pilot Sheet Options&emsp;</legend>
            include:
            <print-option-select multiple title="Include" :items="pilotIncludeOptions" />
          </fieldset>
          <v-overlay absolute :value="true" color="grey lighten-1" opacity="0.85">
            <span class="heading h2 text--text">Feature In Development</span>
          </v-overlay>
        </v-card>
        <v-scroll-y-transition>
          <v-card v-if="mechSelect" flat tile>
            <fieldset>
              <legend class="clipped-small heading h3">Mech Sheet Options&emsp;</legend>
              include:
              <print-option-select multiple title="Include" :items="mechIncludeOptions" />
            </fieldset>
            <v-overlay absolute :value="true" color="grey lighten-1" opacity="0.85">
              <span class="heading h2 text--text">Feature In Development</span>
            </v-overlay>
          </v-card>
        </v-scroll-y-transition>
        <v-card flat tile>
          <fieldset>
            <legend>Extras</legend>
            <print-option-select multiple title="Also Print" :items="extraOptions" />
          </fieldset>
          <v-overlay absolute :value="true" color="grey lighten-1" opacity="0.85">
            <span class="heading h2 text--text">Feature In Development</span>
          </v-overlay>
        </v-card>
      </v-card-text>
      <!-- <v-btn class="my-2" color="primary" block outlined>Print Preview</v-btn> -->
      <v-btn class="my-2" color="primary" large block @click="print">Print</v-btn>
      <cc-tooltip simple content="Feature In Development">
        <v-btn class="my-2" small text block disabled>Print Blank Character Sheets</v-btn>
      </cc-tooltip>
    </div>
  </cc-solo-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import PrintOptionSelect from './PrintOptionSelect.vue'

export default Vue.extend({
  name: 'print-dialog',
  components: { PrintOptionSelect },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    mechSelect: null,
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
      { text: 'Appearance Notes' },
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
    print() {
      this.$router.push(`../print/${this.pilot.ID}/${this.mechSelect}`)
      //   openPrintOptions() {
      //   if (this.pilot.ActiveConfig) {
      //     this.printDialog = true
      //   } else {
      //     this.$store.dispatch('setPrintOptions', {
      //       loadout_index: this.activeLoadoutIdx,
      //     })
      //     this.$router.push('/print-pilot')
      //   }
      // },
      // print: function(includeMech: boolean, mechID?: string) {
      //   this.printDialog = false
      //   let mech = null
      //   if (mechID) {
      //     mech = this.pilot.Mechs.find(x => x.ID === mechID)
      //   }
      //   this.$store.dispatch('setPrintOptions', {
      //     combo: includeMech,
      //     mech: mech,
      //   })
      //   if (includeMech) {
      //     this.$router.push('/print-all')
      //   } else {
      //     this.$router.push('/print-pilot')
      //   }
      //   this.printMech = null
      // }
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
