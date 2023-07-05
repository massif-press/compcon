<template>
  <cc-stepper-content
    :complete="pilot.HasIdent"
    :mandatory="!quickstart"
    exit="pilot_management"
    @complete="$emit('next')"
  >
    <cc-title large>New Pilot Registration&emsp;</cc-title>
    <div v-show="$vuetify.display.mdAndUp">
      <h2 class="heading">
        UAD IDENT Service
        <cc-slashes />
        &nbsp;RM-4 Personnel::Pilot (C)
      </h2>
      <v-container class="flavor-text" style="font-size: 14px">
        <div class="mt-n2">
          Welcome to the Union Administrative Department's IDENT registration service. IDENT is the
          omninet-based certification system that guides the user through the UAD's pilot
          registration process. IDENT helps ensure pilots meet regulatory and policy requirements
          through the use of NHP-directed data validation protocols. Union Regulars that have
          already been issued an RM-4 IDENT fingerprint should not complete this form unless
          instructed to by their commanding officer.
        </div>
        <v-alert
          type="warning"
          color="accent"
          variant="outlined"
          class="mt-2 mb-1"
          density="compact"
          prominent
        >
          <b>
            All fields marked with the
            <v-icon color="error">mdi-alert</v-icon>
            glyph must be populated.
          </b>
          <div class="text-overline" style="line-height: 13px">
            By submitting this form you attest that your responses are truthful and accurate to the
            best of your knowledge. Knowingly providing false or or incomplete information is
            punishable under DoJ/HR AR 303-J.
          </div>
        </v-alert>
      </v-container>
    </div>
    <v-row>
      <v-col cols="12" md="5" class="mr-auto">
        <div class="my-2">
          <div v-if="$vuetify.display.mdAndUp" class="text-caption">
            RM-4-01 // FULL NAME OR PRIMARY ALIAS
          </div>
          <v-text-field
            v-model="pilot.Name"
            variant="outlined"
            label="Name"
            hide-details
            density="compact"
            class="my-1"
            @change="$emit('set', { attr: 'Name', val: $event })"
          >
            <template #prepend>
              <cc-tooltip simple content="Generate Random Name">
                <v-icon color="secondary" @click="randomName()">mdi-dice-multiple</v-icon>
              </cc-tooltip>
            </template>
            <template #append>
              <v-icon v-if="!pilot.Name" color="error">mdi-alert</v-icon>
              <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
            </template>
          </v-text-field>
        </div>

        <div class="my-4">
          <div v-if="$vuetify.display.mdAndUp" class="text-caption">
            RM-4-02 // APPROVED CALLSIGN (OR CADET DESIGNATION, IF APPLICABLE)
          </div>

          <v-text-field
            v-model="pilot.Callsign"
            variant="outlined"
            label="Callsign"
            density="compact"
            class="my-1"
            hide-details
          >
            <template #prepend>
              <cc-tooltip simple content="Generate Random Callsign">
                <v-icon color="secondary" @click="randomCallsign()">mdi-dice-multiple</v-icon>
              </cc-tooltip>
            </template>
            <template #append>
              <v-icon v-if="!pilot.Callsign" color="error">mdi-alert</v-icon>
              <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
            </template>
          </v-text-field>
        </div>

        <div class="my-4">
          <div v-if="$vuetify.display.mdAndUp" class="text-caption">
            RM-4-03 // PRIOR OCCUPATION OR POSITION (ANSWER 17b ON RM-2-C)
          </div>
          <v-text-field
            v-model="pilot.Background"
            variant="outlined"
            label="Background"
            density="compact"
            class="my-1"
            hide-details
          >
            <template #prepend>
              <cc-tooltip simple content="Select Predefined Background">
                <cc-background-selector
                  @select="$emit('set', { attr: 'Background', val: $event })"
                />
              </cc-tooltip>
            </template>
            <template #append>
              <v-icon v-if="!pilot.Background" color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
            </template>
          </v-text-field>
        </div>

        <div class="my-4">
          <div v-if="$vuetify.display.mdAndUp" class="text-caption">
            RM-4-04 // ATTACHED BIOGRAPHICAL DOSSIER (RM-4b SUPPLEMENTAL)
          </div>
          <v-row align="center">
            <v-col cols="auto">
              <cc-text-editor
                ref="bio"
                label="Pilot Biography"
                color="secondary"
                :original="pilot.History"
                @save="$emit('set', { attr: 'History', val: $event })"
              />
            </v-col>
            <v-col>
              <v-btn variant="outlined" block color="secondary" @click="($refs.bio as any).show()">
                <div v-if="!pilot.History">Add Pilot Biography</div>
                <div v-else>Edit Pilot Biography</div>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-icon v-if="!pilot.History" color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
            </v-col>
          </v-row>
        </div>

        <div class="my-4">
          <div v-if="$vuetify.display.mdAndUp" class="text-caption">
            RM-4-05 // ATTACHED OHM HEALTH EXAMINATION RESULTS
          </div>
          {{ pilot.textAppearance }}
          <v-row align="center">
            <v-col cols="auto">
              <cc-text-editor
                ref="appearance"
                label="Pilot Description"
                color="secondary"
                :original="pilot.TextAppearance"
                @save="$emit('set', { attr: 'TextAppearance', val: $event })"
              />
            </v-col>
            <v-col>
              <v-btn
                variant="outlined"
                block
                color="secondary"
                @click="($refs.appearance as any).show()"
              >
                <div v-if="!pilot.TextAppearance">Add Pilot Description</div>
                <div v-else>Edit Pilot Description</div>
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-icon v-if="!pilot.TextAppearance" color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col v-if="$vuetify.display.mdAndUp" cols="1" class="ml-auto mr-auto text-center">
        <v-divider vertical />
      </v-col>
      <v-col cols="12" md="5" class="ml-auto">
        <div v-if="$vuetify.display.mdAndUp" class="text-caption">
          RM-4-06 // ATTACHED OHM IMAGING SCAN (MUST INCLUDE RETINAL DATA)
        </div>
        <div class="border mr-8 ml-auto mr-auto" style="width: 300px; height: 300px">
          <v-img v-if="pilot.Portrait" :src="pilot.Portrait" aspect-ratio="1" />
        </div>
        <div class="mr-8 mt-3">
          <v-btn
            variant="outlined"
            large
            block
            color="secondary"
            @click="($refs.imageSelector as any).open()"
          >
            <div v-if="!pilot.Portrait">
              <v-icon start>mdi-plus</v-icon>
              Add Pilot Image
            </div>
            <div v-else>
              <v-icon start>mdi-circle-edit-outline</v-icon>
              Edit Pilot Image
            </div>
            <div style="position: absolute; right: -53px">
              <v-icon v-if="!pilot.Portrait" color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
            </div>
          </v-btn>
          <cc-image-selector ref="imageSelector" :item="pilot" type="pilot" />
        </div>
      </v-col>
    </v-row>
    <div slot="other" class="text-center">
      <v-btn color="accent" class="mx-2" large @click="$emit('templates')">
        Select Character Template
      </v-btn>
      <div class="text-overline text-stark">Recommended for New Players</div>
    </div>
  </cc-stepper-content>
</template>

<script lang="ts">
import { name, callsign } from '@/io/Generators';
import TextEntryPopup from './components/TextEntryPopup.vue';
import { CCTextEditor } from '@/ui/globals';

export default {
  name: 'identification-page',
  components: { TextEntryPopup, CCTextEditor },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    quickstart: { type: Boolean },
  },
  emits: ['set', 'templates', 'next'],
  methods: {
    async randomCallsign() {
      const generatedCallsign = await callsign();
      this.$emit('set', { attr: 'Callsign', val: generatedCallsign });
      this.$forceUpdate();
    },
    async randomName() {
      const generatedName = await name();
      this.$emit('set', { attr: 'Name', val: generatedName });
      this.$forceUpdate();
    },
  },
};
</script>
