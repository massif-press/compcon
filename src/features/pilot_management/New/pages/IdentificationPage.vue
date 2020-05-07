<template>
  <cc-stepper-content :complete="pilot.HasIdent" exit="pilot_management" @complete="$emit('next')">
    <cc-title large>New Pilot Registration&emsp;</cc-title>
    <h2 class="heading">
      UAD IDENT Service
      <cc-slashes />
      &nbsp;RM-4 Personnel::Pilot (C)
    </h2>
    <v-container class="flavor-text" style="font-size: 14px">
      <span>
        Welcome to the Union Administrative Department's IDENT registration service. IDENT is the
        omninet-based certification system that guides the user through the UAD's pilot registration
        process. IDENT helps ensure pilots meet regulatory and policy requirements through the use
        of NHP-directed data validation protocols. Union Regulars that have already been issued an
        RM-4 IDENT fingerprint should not complete this form unless instructed to by their
        commanding officer.
      </span>
      <v-alert type="warning" color="accent" outlined class="mt-2" dense>
        <b>
          All fields marked with the
          <v-icon small color="error">mdi-alert</v-icon>
          &nbsp;glyph must be populated.
        </b>
        <br />
        <span class="overline">
          By submitting this form you attest that your responses are truthful and accurate to the
          best of your knowledge. Knowingly providing false or or incomplete information is
          punishable under DoJ/HR AR 303-J.
        </span>
      </v-alert>
    </v-container>
    <v-row class="mx-6">
      <v-col cols="5" class="mr-auto">
        <span class="overline">RM-4-01 // FULL NAME OR PRIMARY ALIAS</span>
        <v-text-field
          v-model="pilot.Name"
          outlined
          label="Name"
          hide-details
          @change="$emit('set', { attr: 'Name', val: $event })"
        >
          <template v-slot:prepend>
            <cc-tooltip simple content="Generate Random Name">
              <v-icon color="secondary" @click="randomName()">mdi-dice-multiple</v-icon>
            </cc-tooltip>
          </template>
          <template v-slot:append-outer>
            <v-icon v-if="!pilot.Name" color="error">mdi-alert</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </template>
        </v-text-field>

        <span class="overline">
          RM-4-02 // APPROVED CALLSIGN (OR CADET DESIGNATION, IF APPLICABLE)
        </span>
        <v-text-field v-model="pilot.Callsign" outlined label="Callsign" hide-details>
          <template v-slot:prepend>
            <cc-tooltip simple content="Generate Random Callsign">
              <v-icon color="secondary" @click="randomCallsign()">mdi-dice-multiple</v-icon>
            </cc-tooltip>
          </template>
          <template v-slot:append-outer>
            <v-icon v-if="!pilot.Callsign" color="error">mdi-alert</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </template>
        </v-text-field>

        <span class="overline">RM-4-03 // PRIOR OCCUPATION OR POSITION (ANSWER 17b ON RM-2-C)</span>
        <v-text-field v-model="pilot.Background" outlined label="Background" hide-details>
          <template v-slot:prepend>
            <cc-tooltip simple content="Select Predefined Background">
              <cc-background-selector @select="$emit('set', { attr: 'Background', val: $event })" />
            </cc-tooltip>
          </template>
          <template v-slot:append-outer>
            <v-icon v-if="!pilot.Background" color="grey">mdi-circle-outline</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </template>
        </v-text-field>

        <span class="overline">RM-4-04 // ATTACHED BIOGRAPHICAL DOSSIER RM-4b SUPPLEMENTAL</span>
        <text-entry-popup
          label="Pilot Biography"
          :prepopulate="pilot.History"
          @save="$emit('set', { attr: 'History', val: $event })"
        >
          <span v-if="!pilot.History">
            <v-icon left>mdi-plus</v-icon>
            Add Pilot Biography
          </span>
          <span v-else>
            <v-icon left>mdi-circle-edit-outline</v-icon>
            Edit Pilot Biography
          </span>
          <div style="position: absolute; right: -53px">
            <v-icon v-if="!pilot.History" color="grey">mdi-circle-outline</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </div>
        </text-entry-popup>

        <span class="overline">RM-4-05 // ATTACHED OHM HEALTH EXAMINATION RESULTS</span>
        <text-entry-popup
          label="Pilot Description"
          :prepopulate="pilot.TextAppearance"
          @save="$emit('set', { attr: 'TextAppearance', val: $event })"
        >
          <span v-if="!pilot.TextAppearance">
            <v-icon left>mdi-plus</v-icon>
            Add Pilot Description
          </span>
          <span v-else>
            <v-icon left>mdi-circle-edit-outline</v-icon>
            Edit Pilot Description
          </span>
          <div style="position: absolute; right: -53px">
            <v-icon v-if="!pilot.TextAppearance" color="grey">mdi-circle-outline</v-icon>
            <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
          </div>
        </text-entry-popup>
      </v-col>
      <v-col cols="1" class="ml-auto mr-auto text-center">
        <v-divider vertical />
      </v-col>
      <v-col cols="5" class="ml-auto">
        <span class="overline">
          RM-4-06 // ATTACHED OHM IMAGING SCAN (MUST INCLUDE RETINAL DATA)
        </span>
        <div class="border mr-8 ml-auto mr-auto" style="width: 300px; height: 300px">
          <!-- TODO: no data image -->
          <v-img v-if="pilot.Portrait" :key="pilot.Image" :src="pilot.Portrait" aspect-ratio="1" />
          <v-img v-else src="https://via.placeholder.com/550" />
        </div>
        <div class="mr-8 mt-3">
          <v-btn outlined large block color="secondary" @click="$refs.imageSelector.open()">
            <span v-if="!pilot.Portrait">
              <v-icon left>mdi-plus</v-icon>
              Add Pilot Image
            </span>
            <span v-else>
              <v-icon left>mdi-circle-edit-outline</v-icon>
              Edit Pilot Image
            </span>
            <div style="position: absolute; right: -53px">
              <v-icon v-if="!pilot.Portrait" color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
            </div>
          </v-btn>
          <cc-image-selector-web
            v-if="$platform === 'web'"
            ref="imageSelector"
            :item="pilot"
            type="pilot"
          />
          <cc-image-selector v-else ref="imageSelector" :item="pilot" type="pilot" />
        </div>
      </v-col>
    </v-row>
    <div slot="other" class="text-center">
      <v-btn
        color="accent"
        class="mx-2"
        :disabled="!pilot.HasIdent"
        large
        outlined
        @click="$emit('templates')"
      >
        Select Character Template
      </v-btn>
      <div class="overline stark--text">Recommended for New Players</div>
    </div>
  </cc-stepper-content>
</template>

<script lang="ts">
import Vue from 'vue'
import { name, callsign } from '@/io/Generators'
import TextEntryPopup from './components/TextEntryPopup.vue'

export default Vue.extend({
  name: 'identification-page',
  components: { TextEntryPopup },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  methods: {
    randomCallsign() {
      this.$emit('set', { attr: 'Callsign', val: callsign() })
      this.$forceUpdate()
    },
    async randomName() {
      const generatedName = await name()
      this.$emit('set', { attr: 'Name', val: generatedName })
      this.$forceUpdate()
    },
  },
})
</script>
