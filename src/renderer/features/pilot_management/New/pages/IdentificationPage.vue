<template>
  <cc-stepper-content :complete="canContinue" exit="pilot_management" @complete="$emit('next')">
    <cc-title large>New Pilot Registration&emsp;</cc-title>
    <h2 class="heading">
      UAD IDENT Service
      <cc-slashes />&nbsp;RM-4 Personnel::Pilot (C)
    </h2>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>Welcome to the Union Administrative Department's IDENT registration service. IDENT is the omninet-based certification system that guides the user through the UAD's pilot registration process. IDENT helps ensure pilots meet regulatory and policy requirements through the use of NHP-directed data validation protocols. Union Regulars that have already been issued an RM-4 IDENT fingerprint should not complete this form unless instructed to by their commanding officer.</span>
      <v-alert type="warning" color="primary" outlined class="mt-2">
        <b>
          All fields marked with the
          <v-icon small color="error">mdi-alert</v-icon>&nbsp;glyph must be populated.
        </b>
        <br />
        <span
          class="overline"
        >By submitting this form you attest that your responses are truthful and accurate to the best of your knowledge. Knowingly providing false or or incomplete information is punishable under DoJ/HR AR 303-J.</span>
      </v-alert>
    </v-container>
    <v-row class="mx-6">
      <v-col cols="5" class="mr-auto">
        <span class="overline">RM-4-01 // FULL NAME OR PRIMARY ALIAS, EXCLUDING HONORIFICS</span>
        <v-text-field v-model="newPilot.Name" outlined label="Name" hide-details>
          <template v-slot:prepend>
            <cc-tooltip simple content="Generate Random Name">
              <v-icon @click="randomName">mdi-dice-multiple</v-icon>
            </cc-tooltip>
          </template>
          <template v-slot:append-outer>
            <v-icon v-if="!newPilot.Name" color="error">mdi-alert</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </template>
        </v-text-field>

        <span class="overline">RM-4-02 // APPROVED CALLSIGN (OR CADET DESINGATION, IF APPLICABLE)</span>
        <v-text-field v-model="newPilot.Callsign" outlined label="Callsign" hide-details>
          <template v-slot:prepend>
            <cc-tooltip simple content="Generate Random Callsign">
              <v-icon @click="randomCallsign">mdi-dice-multiple</v-icon>
            </cc-tooltip>
          </template>
          <template v-slot:append-outer>
            <v-icon v-if="!newPilot.Callsign" color="error">mdi-alert</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </template>
        </v-text-field>

        <span class="overline">RM-4-03 // PRIOR OCCUPATION OR POSITION (ANSWER 17b ON FORM RM-2-C)</span>
        <v-text-field v-model="newPilot.Background" outlined label="Background" hide-details>
          <template v-slot:prepend>
            <cc-tooltip simple content="Select Predefined Background">
              <cc-background-selector @select="newPilot.Background = $event" />
            </cc-tooltip>
          </template>
          <template v-slot:append-outer>
            <v-icon v-if="!newPilot.Background" color="grey">mdi-circle-outline</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </template>
        </v-text-field>

        <span class="overline">RM-4-04 // ATTACHED BIOGRAPHICAL DOSSIER RM-4b SUPPLIMENTAL</span>
        <text-entry-popup
          label="Pilot Biography"
          :prepopulate="newPilot.History"
          @save="newPilot.History = $event"
        >
          <span v-if="!newPilot.History">
            <v-icon left>mdi-plus</v-icon>Add Pilot Biography
          </span>
          <span v-else>
            <v-icon left>mdi-circle-edit-outline</v-icon>Edit Pilot Biography
          </span>
          <div style="position: absolute; right: -53px">
            <v-icon v-if="!newPilot.History" color="grey">mdi-circle-outline</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </div>
        </text-entry-popup>

        <span class="overline">RM-4-05 // ATTACHED OHM HEALTH EXAMINATION RESULTS</span>
        <text-entry-popup
          label="Pilot Description"
          :prepopulate="newPilot.TextAppearance"
          @save="newPilot.TextAppearance = $event"
        >
          <span v-if="!newPilot.TextAppearance">
            <v-icon left>mdi-plus</v-icon>Add Pilot Description
          </span>
          <span v-else>
            <v-icon left>mdi-circle-edit-outline</v-icon>Edit Pilot Description
          </span>
          <div style="position: absolute; right: -53px">
            <v-icon v-if="!newPilot.TextAppearance" color="grey">mdi-circle-outline</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </div>
        </text-entry-popup>
      </v-col>
      <v-col cols="1" class="ml-auto mr-auto text-center">
        <v-divider vertical />
      </v-col>
      <v-col cols="5" class="ml-auto">
        <span class="overline">RM-4-06 // ATTACHED OHM IMAGING SCAN (MUST INCLUDE RETINAL DATA)</span>
        <div class="border mr-8 ml-auto mr-auto" style="width: 300px; height: 300px">
          <!-- TODO: no data image -->
          <v-img v-if="newPilot.Portrait" :src="newPilot.Portrait" aspect-ratio="1" />
          <v-img v-else src="https://via.placeholder.com/550" />
        </div>
        <div class="mr-8 mt-3">
          <v-btn outlined large block color="grey darken-3" @click="$refs.imageSelector.open()">
            <span v-if="!newPilot.Portrait">
              <v-icon left>mdi-plus</v-icon>Add Pilot Image
            </span>
            <span v-else>
              <v-icon left>mdi-circle-edit-outline</v-icon>Edit Pilot Image
            </span>
            <div style="position: absolute; right: -53px">
              <v-icon v-if="!newPilot.Portrait" color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
            </div>
          </v-btn>
          <cc-image-selector ref="imageSelector" :pilot="newPilot" />
        </div>
      </v-col>
    </v-row>
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'
import { randomName, randomCallsign } from '@/io/Generators'
import TextEntryPopup from './components/TextEntryPopup.vue'

export default Vue.extend({
  name: 'identification-page',
  components: { TextEntryPopup },
  props: {
    newPilot: {
      type: Object,
      required: true,
    },
  },
  computed: {
    canContinue(): boolean {
      return !!(this.newPilot.Name && this.newPilot.Callsign)
    },
  },
  methods: {
    randomCallsign() {
      this.newPilot.Callsign = randomCallsign()
      this.$forceUpdate()
    },
    randomName() {
      this.newPilot.Name = randomName()
      this.$forceUpdate()
    },
  },
})
</script>