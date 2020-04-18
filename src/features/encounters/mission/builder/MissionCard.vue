<template>
  <v-container fluid>
    <v-row v-if="!mission" align="center" justify="center" style="width: 100%; height: 100%;">
      <v-col cols="auto">
        <span class="heading h1 subtle--text text--lighten-2">no mission selected</span>
      </v-col>
    </v-row>
    <div v-else>
      <v-row dense class="mt-n6">
        <v-col cols="auto" align-self="center" class="fadeSelect">
          <cc-tooltip simple content="Generate Random Name">
            <v-icon large color="secondary" @click="randomName()">mdi-dice-multiple</v-icon>
          </cc-tooltip>
        </v-col>
        <v-col cols="11">
          <span class="heading mech">
            <cc-short-string-editor large @set="mission.Name = $event">
              <span
                style="display:inline-block;  max-width: 90%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
              >
                {{ mission.Name }}
              </span>
            </cc-short-string-editor>
          </span>
        </v-col>
      </v-row>
      <v-row dense align="center">
        <v-col>
          <v-combobox
            v-model="mission.Labels"
            outlined
            dense
            multiple
            label="User Labels"
            :items="labels"
          />
        </v-col>
        <v-col>
          <v-combobox
            v-model="mission.Campaign"
            outlined
            dense
            label="Campaign"
            :items="campaigns"
          />
        </v-col>
      </v-row>
      <cc-title small class="mb-3">
        Notes
        <cc-text-editor
          label="Edit Mission Notes"
          :original="mission.Note"
          @save="mission.Note = $event"
        />
      </cc-title>
      <p v-html="mission.Note" />
      <cc-title small class="mt-3">
        ENCOUNTER STRUCTURE
      </cc-title>
      <v-row dense>
        <v-col>
          <v-fade-transition>
            <v-timeline v-if="mission.Steps.length" dense>
              <v-slide-x-reverse-transition group hide-on-leave>
                <v-timeline-item
                  v-for="(step, idx) in mission.Steps"
                  :key="idx"
                  :color="step.StepType === 'Encounter' ? 'primary' : 'secondary'"
                  :icon="step.StepType === 'Encounter' ? 'mdi-sword-cross' : 'mdi-restore'"
                  fill-dot
                >
                  <v-card v-if="step">
                    <mission-step-element
                      v-if="step.StepType === 'Encounter'"
                      color="primary"
                      icon="mdi-sword-cross"
                      :index="idx"
                      :step="step"
                      :mission-length="mission.Steps.length"
                      @move-up="mission.MoveStepUp(idx)"
                      @move-down="mission.MoveStepDown(idx)"
                      @remove="mission.RemoveStep(idx)"
                    >
                      <div slot="title" class="accent--text">
                        {{ step.Name }}
                        <cc-slashes />
                        <span class="caption text--text">PR</span>
                        <span class="heading h3 accent--text">
                          {{ step.Power.toString().padStart(4, '0') }}
                        </span>
                      </div>
                      <div slot="items">
                        <v-dialog width="70vw">
                          <template v-slot:activator="{ on }">
                            <v-btn icon color="primary" v-on="on">
                              <v-icon>
                                mdi-information-outline
                              </v-icon>
                            </v-btn>
                          </template>
                          <encounter-panel :encounter="step" readonly />
                        </v-dialog>
                      </div>
                      <v-row dense>
                        <v-col>
                          <span class="overline accent--text">SITREP</span>
                          <br />
                          <span class="flavor-text">{{ step.Sitrep.name }}</span>
                        </v-col>
                        <v-col>
                          <span class="overline accent--text">ENVIRONMENT</span>
                          <br />
                          <span class="flavor-text">{{ step.Environment }}</span>
                        </v-col>
                        <v-col>
                          <span v-if="step.Labels" class="overline accent--text">LABELS</span>
                          <br />
                          <v-chip v-for="l in step.Labels" :key="l" small class="mx-1">
                            {{ l }}
                          </v-chip>
                        </v-col>
                      </v-row>
                    </mission-step-element>
                    <mission-step-element
                      v-else
                      color="secondary"
                      icon="mdi-refresh"
                      :index="idx"
                      :step="step"
                      :mission-length="mission.Steps.length"
                      @move-up="mission.MoveStepUp(idx)"
                      @move-down="mission.MoveStepDown(idx)"
                      @remove="mission.RemoveStep(idx)"
                    >
                      <div slot="title" class="secondary--text">
                        {{ step.IsLong ? 'Full' : 'Short' }} Rest
                      </div>
                      <div slot="items">
                        <v-btn-toggle
                          v-model="step.IsLong"
                          tile
                          color="primary"
                          mandatory
                          dense
                          borderless
                          class="mt-n1"
                        >
                          <v-btn small text :value="false">
                            Short
                          </v-btn>
                          <v-btn small text :value="true">
                            Full
                          </v-btn>
                        </v-btn-toggle>
                      </div>
                    </mission-step-element>
                  </v-card>
                </v-timeline-item>
              </v-slide-x-reverse-transition>
            </v-timeline>
          </v-fade-transition>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-btn block color="accent" outlined @click="$refs.selectDialog.show()">
            <v-icon left>mdi-plus</v-icon>
            Add Encounter
          </v-btn>
        </v-col>
        <v-col>
          <v-btn block color="secondary" outlined @click="mission.AddRest()">
            <v-icon left>mdi-plus</v-icon>
            Add Rest
          </v-btn>
        </v-col>
      </v-row>
      <br />
      <cc-solo-dialog ref="selectDialog" no-confirm title="ADD ENCOUNTER" fullscreen no-pad>
        <encounter-selector @select="addEncounter($event)" />
      </cc-solo-dialog>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import EncounterSelector from './EncounterSelector.vue'
import EncounterPanel from './EncounterPanel.vue'
import MissionStepElement from './MissionStepElement.vue'
import { getModule } from 'vuex-module-decorators'
import { mission } from '@/io/Generators'
import { MissionStore } from '@/store'
import { Encounter } from '@/class'

export default Vue.extend({
  name: 'mission-card',
  components: { EncounterSelector, MissionStepElement, EncounterPanel },
  props: {
    id: {
      type: String,
      required: false,
      default: null,
    },
    labels: {
      type: Array,
      required: false,
      default: () => [],
    },
    campaigns: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  computed: {
    mission() {
      const store = getModule(MissionStore, this.$store)
      return store.Missions.find(x => x.ID === this.id)
    },
  },
  created() {
    const store = getModule(MissionStore, this.$store)
    store.Missions.forEach(m => m.ValidateSteps())
  },
  methods: {
    randomName() {
      this.mission.Name = mission()
    },
    addEncounter(e: Encounter) {
      this.mission.AddEncounter(e)
      this.$refs.selectDialog.hide()
    },
  },
})
</script>

<style>
.hide-label textarea {
  margin-top: 4px !important;
}
</style>
