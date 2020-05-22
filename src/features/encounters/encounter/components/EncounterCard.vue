<template>
  <v-container fluid>
    <v-row v-if="!encounter" align="center" justify="center" style="width: 100%; height: 100%;">
      <v-col cols="auto">
        <span class="heading h1 subtle--text text--lighten-2">no encounter selected</span>
      </v-col>
    </v-row>
    <div v-else>
      <v-row dense class="mt-n6">
        <v-col cols="10">
          <span class="heading mech">
            <cc-short-string-editor large @set="encounter.Name = $event">
              <span
                style="display:inline-block;  max-width: 90%; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;"
              >
                {{ encounter.Name }}
              </span>
            </cc-short-string-editor>
          </span>
        </v-col>
        <v-col cols="2" class="ml-auto text-center mt-n1">
          <cc-tooltip
            title="Power Rating"
            content="The Power Rating is an attempt to calculate the relative strength of an NPC (or encounters’ worth of NPCs) based on tier and applied templates, compared to mission’s Pilot and their current level. It should, generally, produce results more or less in line with the Balancing Combat section on pp. 283 of the LANCER Core Book.<br> That said, this is an experimental feature that is still very heavily in development, and does not (yet) always produce reliable results. Moreover, this tool doesn’t consider NPC or player team composition, synergies, strengths, and weaknesses. Nor does this tool consider map layout, mission objectives, or reinforcement schedules.<br>While we will continue to work on this tool to produce more accurate, actionable results, please use it only as a general indicator of relative NPC strength."
          >
            <div class="active--text heading h1">
              {{ encounter.Power.toString().padStart(4, '0') }}
            </div>
            <div class="overline mt-n3">TOTAL POWER RATING</div>
          </cc-tooltip>
        </v-col>
      </v-row>
      <v-row dense align="center">
        <v-col>
          <v-combobox
            v-model="encounter.Labels"
            outlined
            dense
            multiple
            label="User Labels"
            :items="labels"
          />
        </v-col>
        <v-col>
          <v-combobox
            v-model="encounter.Campaign"
            outlined
            dense
            label="Campaign"
            :items="campaigns"
          />
        </v-col>
      </v-row>
      <cc-title small class="mb-3">
        Narrative Description
        <cc-text-editor
          label="Edit Narrative Description"
          :original="encounter.NarrativeNotes"
          @save="encounter.NarrativeNotes = $event"
        />
      </cc-title>
      <p v-html="encounter.NarrativeNotes" />
      <cc-title small class="mb-3">
        Location
        <cc-text-editor
          label="Edit Location Description"
          :original="encounter.Location"
          @save="encounter.Location = $event"
        />
      </cc-title>
      <v-row dense align="start" class="mt-n2">
        <v-col cols="7">
          <p v-html="encounter.Location" />
          <v-divider class="my-3" />
          <v-combobox
            v-model="encounter.Environment"
            outlined
            dense
            label="Environment"
            :items="environments"
            @change="setEnvironment()"
          />
          <v-textarea
            v-if="encounter.Environment !== 'Nominal'"
            v-model="encounter.EnvironmentDetails"
            filled
            label="Environment Detail"
            auto-grow
            hide-details
            rows="2"
            class="mt-n4"
          />
        </v-col>
        <v-col cols="5">
          <v-card flat outlined>
            <v-card-text class="pa-1">
              <v-img
                v-if="encounter.Map"
                :key="encounter.Map"
                :src="encounter.Map"
                aspect-ratio="1"
              />
              <v-btn outlined small block color="secondary" @click="$refs.imageSelector.open()">
                <span v-if="!encounter.Map">
                  <v-icon left>mdi-plus</v-icon>
                  Add Encounter Map
                </span>
                <span v-else>
                  <v-icon left>mdi-circle-edit-outline</v-icon>
                  Edit Encounter Map
                </span>
              </v-btn>
              <cc-image-selector-web
                v-if="$platform === 'web'"
                ref="imageSelector"
                :item="encounter"
                type="map"
              />
              <cc-image-selector v-else ref="imageSelector" :item="encounter" type="map" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <cc-title small class="mb-3">
        SITREP
      </cc-title>
      <v-select
        v-model="selRep"
        item-text="name"
        outlined
        dense
        label="Engagement Type"
        :items="sitreps"
        @change="encounter.Sitrep = sitreps.find(x => x.name === selRep)"
      />
      <v-textarea
        v-model="encounter.Sitrep.description"
        filled
        label="Description"
        auto-grow
        hide-details
        rows="1"
        class="mt-n4"
      />
      <v-divider class="mt-2" />
      <v-row dense justify="center">
        <v-col class="text-center">
          <span class="heading h3 accent--text">PC victory</span>
          <v-textarea
            v-model="encounter.Sitrep.pcVictory"
            filled
            dense
            label="Victory Conditions"
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 mb-2"
          />
        </v-col>
        <v-divider vertical class="mx-2" />
        <v-col class="text-center">
          <span class="heading h3 accent--text">enemy victory</span>
          <v-textarea
            v-model="encounter.Sitrep.enemyVictory"
            filled
            dense
            label="Victory Conditions"
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 mb-2"
          />
        </v-col>
        <v-divider vertical class="mx-2" />
        <v-col class="text-center">
          <span class="heading h3 accent--text">no victor</span>
          <v-textarea
            v-model="encounter.Sitrep.noVictory"
            filled
            dense
            label="Stalemate Conditions"
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 mb-2"
          />
        </v-col>
      </v-row>
      <v-divider />
      <v-row dense justify="center">
        <v-col class="text-center">
          <span class="heading h3 accent--text">Deployment</span>
          <v-textarea
            v-model="encounter.Sitrep.deployment"
            filled
            dense
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 mb-2 hide-label"
          />
        </v-col>
        <v-divider vertical class="mx-2" />
        <v-col class="text-center">
          <span class="heading h3 accent--text">Extraction</span>
          <v-textarea
            v-model="encounter.Sitrep.extraction"
            filled
            dense
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 mb-2 hide-label"
          />
        </v-col>
      </v-row>
      <v-divider />
      <v-row dense justify="center">
        <v-col class="text-center">
          <span class="heading h3 accent--text">Control Zones</span>
          <v-textarea
            v-model="encounter.Sitrep.controlZone"
            filled
            dense
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 hide-label"
          />
        </v-col>
        <v-divider vertical class="mx-2" />
        <v-col class="text-center">
          <span class="heading h3 accent--text">Objective</span>
          <v-textarea
            v-model="encounter.Sitrep.objective"
            filled
            dense
            auto-grow
            hide-details
            rows="2"
            class="mt-n1 hide-label"
          />
        </v-col>
      </v-row>
      <cc-title small class="mt-3">
        COMBATANTS
      </cc-title>
      <v-row dense>
        <v-col cols="8">
          <fieldset>
            <legend class="heading h3 accent--text mx-2">FORCES</legend>
            <div v-if="forces.enemy.length" class="caption ml-2">ENEMY</div>
            <v-divider v-if="forces.enemy.length" />
            <npc-chip
              v-for="(n, i) in forces.enemy"
              :key="`fe_${n.ID}_${i}`"
              :npc="n"
              @remove="encounter.RemoveNpc(n, 'Enemy')"
              @clone="encounter.AddNpc(n, 'Enemy')"
            />
            <div v-if="forces.allied.length" class="caption ml-2">ALLIED</div>
            <v-divider v-if="forces.allied.length" />
            <npc-chip
              v-for="(n, i) in forces.allied"
              :key="`fa_${n.ID}_${i}`"
              :npc="n"
              @remove="encounter.RemoveNpc(n, 'Ally')"
              @clone="encounter.AddNpc(n, 'Ally')"
            />
            <div v-if="forces.neutral.length" class="caption ml-2">NEUTRAL</div>
            <v-divider v-if="forces.neutral.length" />
            <npc-chip
              v-for="(n, i) in forces.neutral"
              :key="`fn_${n.ID}_${i}`"
              :npc="n"
              @remove="encounter.RemoveNpc(n, 'Neutral')"
              @clone="encounter.AddNpc(n, 'Neutral')"
            />
            <div class="mx-6">
              <v-btn
                color="primary"
                block
                small
                outlined
                class="my-2"
                @click="$refs.npcDialog.show()"
              >
                <v-icon left>mdi-plus</v-icon>
                Add NPC
              </v-btn>
            </div>
          </fieldset>
        </v-col>
        <v-col cols="4">
          <fieldset>
            <legend class="heading h3 accent--text mx-2">REINFORCEMENTS</legend>
            <div v-if="reinforcements.enemy.length" class="caption ml-2">ENEMY</div>
            <v-divider v-if="forces.enemy.length" />
            <npc-chip
              v-for="(n, i) in reinforcements.enemy"
              :key="`re_${n.ID}_${i}`"
              :npc="n"
              @remove="encounter.RemoveReinforcement(n, 'Enemy')"
              @clone="encounter.AddReinforcement(n, 'Enemy')"
            />
            <div v-if="reinforcements.allied.length" class="caption ml-2">ALLIED</div>
            <v-divider v-if="forces.allied.length" />
            <npc-chip
              v-for="(n, i) in reinforcements.allied"
              :key="`ra_${n.ID}_${i}`"
              :npc="n"
              @remove="encounter.RemoveReinforcement(n, 'Ally')"
              @clone="encounter.AddReinforcement(n, 'Ally')"
            />
            <div v-if="reinforcements.neutral.length" class="caption ml-2">NEUTRAL</div>
            <v-divider v-if="forces.neutral.length" />
            <npc-chip
              v-for="(n, i) in reinforcements.neutral"
              :key="`rn_${n.ID}_${i}`"
              :npc="n"
              @remove="encounter.RemoveReinforcement(n, 'Neutral')"
              @clone="encounter.AddReinforcement(n, 'Neutral')"
            />
            <div class="mx-6">
              <v-btn
                color="primary"
                block
                small
                outlined
                class="my-2"
                @click="$refs.reinforcementDialog.show()"
              >
                <v-icon left>mdi-plus</v-icon>
                Add NPC
              </v-btn>
            </div>
          </fieldset>
        </v-col>
      </v-row>
      <v-divider class="my-3" />
      <cc-title small class="mb-3">
        GM Notes
        <cc-text-editor
          label="Edit GM Notes"
          :original="encounter.Note"
          @save="encounter.Note = $event"
        />
      </cc-title>
      <p :key="encounter.Note.length" v-html="encounter.Note" />
      <br />
      <cc-solo-dialog ref="npcDialog" no-confirm title="ADD NPC" fullscreen no-pad>
        <npc-selector @select="addNpc($event)" />
      </cc-solo-dialog>
      <cc-solo-dialog
        ref="reinforcementDialog"
        no-confirm
        title="ADD NPC REINFORCEMENT"
        fullscreen
        no-pad
      >
        <npc-selector @select="addReinforcement($event)" />
      </cc-solo-dialog>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import NpcChip from './NpcChip.vue'
import NpcSelector from './NpcSelector.vue'
import { getModule } from 'vuex-module-decorators'
import { EncounterStore, CompendiumStore } from '@/store'
import { Npc, EncounterSide } from '@/class'

export default Vue.extend({
  name: 'encounter-card',
  components: { NpcSelector, NpcChip },
  props: {
    encounter: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selRep: 'Standard Combat',
    ctest: ['a', 'b', 'c'],
  }),
  computed: {
    labels() {
      const store = getModule(EncounterStore, this.$store)
      return store.Encounters.flatMap(x => x.Labels).filter(x => x)
    },
    campaigns() {
      const store = getModule(EncounterStore, this.$store)
      return store.Encounters.map(x => x.Campaign).filter(x => x)
    },
    environmentData() {
      return getModule(CompendiumStore, this.$store).Environments
    },
    environments() {
      return ['Nominal'].concat(this.environmentData.map(x => x.name))
    },
    sitreps() {
      return getModule(CompendiumStore, this.$store).Sitreps
    },
    forces() {
      return {
        enemy: this.encounter.Npcs('Enemy'),
        allied: this.encounter.Npcs('Ally'),
        neutral: this.encounter.Npcs('Neutral'),
      }
    },
    reinforcements() {
      return {
        enemy: this.encounter.Reinforcements('Enemy'),
        allied: this.encounter.Reinforcements('Ally'),
        neutral: this.encounter.Reinforcements('Neutral'),
      }
    },
  },
  methods: {
    setEnvironment() {
      if (this.encounter.Environment === 'Nominal') this.encounter.EnvironmentDetails = ''
      else if (this.environmentData.some(x => x.name === this.encounter.Environment))
        this.encounter.EnvironmentDetails = this.environmentData.find(
          x => x.name === this.encounter.Environment
        ).description
    },
    addNpc(event: { npc: Npc; side: EncounterSide }) {
      this.encounter.AddNpc(event.npc, event.side)
      this.$refs.npcDialog.hide()
    },
    addReinforcement(event: { npc: Npc; side: EncounterSide }) {
      this.encounter.AddReinforcement(event.npc, event.side)
      this.$refs.reinforcementDialog.hide()
    },
  },
})
</script>

<style>
.hide-label textarea {
  margin-top: 4px !important;
}
</style>
