<template>
  <stepper-content
    :complete="pilot.HasIdent"
    mandatory
    exit="pilot_management"
    @complete="$emit('next')">
    <cc-title offset>New Pilot Registration</cc-title>
    <div class="heading h2">
      UAD IDENT Service
      <cc-slashes />
      RM-4 Personnel::Pilot (C)
    </div>
    <p class="flavor-text" style="font-size: 14px">
      Welcome to the Union Administrative Department's IDENT registration service. IDENT is the
      omninet-based certification system that guides the user through the UAD's pilot registration
      process. IDENT helps ensure pilots meet regulatory and policy requirements through the use of
      NHP-directed data validation protocols. Union Regulars that have already been issued an RM-4
      IDENT fingerprint should not complete this form unless instructed to by their commanding
      officer.
    </p>
    <v-alert color="accent" variant="outlined" density="compact" class="mt-2">
      <div class="heading">
        All fields marked with the
        <v-icon color="error" size="small" class="mt-n1">mdi-alert</v-icon>
        glyph must be populated.
      </div>
      <p class="text-cc-overline">
        By submitting this form you attest that your responses are truthful and accurate to the best
        of your knowledge. Knowingly providing false or or incomplete information is punishable
        under DoJ/HR AR 303-J.
      </p>
    </v-alert>

    <v-row dense>
      <v-col cols="12" md="5" class="mr-auto">
        <div class="my-2">
          <div v-if="!mobile" class="text-caption">RM-4-01 // FULL NAME OR PRIMARY ALIAS</div>
          <div v-else class="text-caption">PILOT NAME</div>
          <cc-text-field
            v-model="pilot.Name"
            variant="outlined"
            placeholder="Name"
            :icon="pilot.Name ? 'mdi-check-circle-outline' : 'mdi-alert'"
            :color="pilot.Name ? 'success' : 'error'"
            class="my-1 d-inline">
            <template #extra>
              <cc-button
                icon="mdi-dice-multiple"
                variant="outlined"
                size="small"
                tooltip="Generate random name"
                @click="randomName()" />
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div v-if="!mobile" class="text-caption">
            RM-4-02 // APPROVED CALLSIGN (OR CADET DESIGNATION, IF APPLICABLE)
          </div>
          <div v-else class="text-caption">CALLSIGN</div>
          <cc-text-field
            v-model="pilot.Callsign"
            variant="outlined"
            placeholder="Callsign"
            :icon="pilot.Callsign ? 'mdi-check-circle-outline' : 'mdi-alert'"
            :color="pilot.Callsign ? 'success' : 'error'"
            class="my-1 d-inline">
            <template #extra>
              <cc-button
                icon="mdi-dice-multiple"
                variant="outlined"
                size="small"
                tooltip="Generate random callsign"
                @click="randomCallsign()" />
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div v-if="!mobile" class="text-caption">
            RM-4-03 // PRIOR OCCUPATION OR POSITION (ANSWER 17b ON RM-2-C)
          </div>
          <div v-else class="text-caption">BACKGROUND</div>
          <cc-text-field
            v-model="pilot.Background"
            variant="outlined"
            placeholder="Background"
            :icon="pilot.Background ? 'mdi-check-circle-outline' : 'mdi-circle-outline'"
            :color="pilot.Background ? 'success' : 'light-panel'"
            class="my-1 d-inline">
            <template #extra>
              <v-tooltip text="Select Predefined Background">
                <template #activator="{ props }">
                  <span v-bind="props">
                    <background-selector
                      @select="$emit('set', { attr: 'Background', val: $event })" />
                  </span>
                </template>
              </v-tooltip>
            </template>
          </cc-text-field>
        </div>

        <div class="my-4">
          <div v-if="!mobile" class="text-caption">
            RM-4-04 // ATTACHED BIOGRAPHICAL DOSSIER (RM-4b SUPPLEMENTAL)
          </div>
          <div v-else class="text-caption">BIOGRAPHY</div>
          <v-row align="center" dense>
            <v-col>
              <cc-button
                block
                size="small"
                :color="!pilot.History ? 'light-panel' : 'success'"
                @click="bioDialog = true">
                <div v-if="!pilot.History">Add Pilot Biography</div>
                <div v-else>Edit Pilot Biography</div>
                <cc-text-editor-dialog
                  v-model="bioDialog"
                  title="edit Pilot Biography"
                  :original="pilot.History"
                  @save="$emit('set', { attr: 'History', val: $event })" />
              </cc-button>
            </v-col>
            <v-col cols="auto" class="ml-2">
              <v-icon v-if="!pilot.History" color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
            </v-col>
          </v-row>
        </div>

        <div class="my-4">
          <div v-if="!mobile" class="text-caption">
            RM-4-05 // ATTACHED OHM HEALTH EXAMINATION RESULTS
          </div>
          <div v-else class="text-caption">APPEARANCE</div>
          <v-row align="center" dense>
            <v-col>
              <cc-button
                block
                size="small"
                :color="!pilot.TextAppearance ? 'light-panel' : 'success'"
                @click="appearanceDialog = true">
                <div v-if="!pilot.TextAppearance">Add Pilot Description</div>
                <div v-else>Edit Pilot Description</div>
                <cc-text-editor-dialog
                  v-model="appearanceDialog"
                  title="edit Pilot Description"
                  :original="pilot.TextAppearance"
                  @save="$emit('set', { attr: 'TextAppearance', val: $event })" />
              </cc-button>
            </v-col>
            <v-col cols="auto" class="ml-2">
              <v-icon v-if="!pilot.TextAppearance" color="grey">mdi-circle-outline</v-icon>
              <v-icon v-else color="success">mdi-check-circle-outline</v-icon>
            </v-col>
          </v-row>
        </div>

        <div class="my-4">
          <div v-if="!mobile" class="text-caption">
            RM-4-δ // EXTERNAL LICENSE DATA TRANSFER (IF APPLICABLE)
          </div>
          <div v-else class="text-caption">STARTING LL</div>
          <cc-number-field
            v-model.number="pilot.Level"
            type="number"
            label="Starting License Level"
            :max="12"
            :min="0"
            :color="pilot.Level ? 'warning' : 'success'"
            tooltip="Start this Pilot at a specific license level. Recommended for advanced users."
            tooltip-icon="mdi-alert"
            class="my-1 d-inline" />
        </div>
      </v-col>
      <v-col cols="12" md="auto" class="mx-auto mt-2" style="max-width: 325px">
        <div v-if="!mobile" class="text-caption">
          RM-4-06 // ATTACHED OHM IMAGING SCAN
          <div class="mt-n1 text-disabled">(MUST INCLUDE RETINAL DATA)</div>
        </div>
        <div class="border mr-8 ml-auto mr-auto" style="width: 300px; height: 300px">
          <cc-img v-if="pilot.Portrait" :src="pilot.Portrait" aspect-ratio="1" />
        </div>
        <div class="mt-3">
          <cc-button
            block
            size="small"
            :color="pilot.Portrait ? 'success' : 'panel'"
            :append-icon="pilot.Portrait ? '' : 'mdi-check-circle-outline'"
            :prepend-icon="pilot.Portrait ? 'mdi-circle-edit-outline' : 'mdi-plus'"
            @click="($refs.imageSelector as any).open()">
            {{ pilot.Portrait ? 'Edit Pilot Image' : 'Add Pilot Image' }}
          </cc-button>
          <cc-image-selector ref="imageSelector" :item="pilot" type="pilot" />
        </div>
      </v-col>
    </v-row>
    <v-row dense class="text-center mt-6 pt-2 pb-1 px-3 bg-surface">
      <v-col cols="12" sm="6">
        <cc-button
          size="x-small"
          block
          color="primary"
          :disabled="!pilot.HasIdent"
          @click="savePilot">
          Skip New Pilot Registration
        </cc-button>
        <div class="text-caption text-disabled"><i>Recommended for Advanced Users</i></div>
      </v-col>
      <v-spacer />
      <v-col cols="12" sm="6">
        <cc-button
          size="x-small"
          block
          color="primary"
          :disabled="!pilot.HasIdent"
          @click="$emit('templates')">
          Select Character Template
        </cc-button>
        <div class="text-caption text-disabled"><i>Recommended for New Players</i></div>
      </v-col>
    </v-row>
  </stepper-content>
</template>

<script lang="ts">
import { PilotStore } from '@/stores';
import StepperContent from '../../_components/StepperContent.vue';
import BackgroundSelector from '../../_components/selectors/BackgroundSelector.vue';
import { name, callsign } from '@/io/Generators';
import { CCTextEditor } from '@/ui/globals';
import { Pilot } from '@/class';

export default {
  name: 'identification-page',
  components: { CCTextEditor, StepperContent, BackgroundSelector },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
    groupID: { type: String },
  },
  data: () => ({
    bioDialog: false,
    appearanceDialog: false,
  }),
  emits: ['set', 'templates', 'next', 'done'],
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
  },
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
    async savePilot() {
      this.pilot.Callsign = this.pilot.Callsign;
      this.pilot.Name = this.pilot.Name;
      PilotStore().AddPilot(this.pilot as Pilot, this.groupID);
      await this.$emit('done');
    },
  },
};
</script>
