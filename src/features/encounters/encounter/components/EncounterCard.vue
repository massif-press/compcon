<template>
  <v-container fluid>
    <v-row v-if="!encounter" align="center" justify="center" style="width: 100%; height: 100%;">
      <v-col cols="auto">
        <span class="heading h1 grey--text text--lighten-2">no encounter selected</span>
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
          <div class="active--text heading h1">
            {{ encounter.Power.toString().padStart(4, '0') }}
          </div>
          <div class="overline mt-n3">TOTAL POWER RATING</div>
        </v-col>
      </v-row>
      <v-row dense align="center">
        <v-col>
          <v-combobox
            v-model="encounter.Labels"
            outlined
            small-chips
            deletable-chips
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
      <v-textarea
        v-model="encounter.NarrativeNotes"
        outlined
        label="Narrative Description"
        auto-grow
        rows="2"
        class="mt-n3"
      />
      <cc-title small class="mb-3">
        Location
      </cc-title>
      <v-row dense align="start" class="mt-n2">
        <v-col cols="7">
          <v-textarea
            v-model="encounter.Location"
            outlined
            label="Location Description"
            hide-details
            auto-grow
            rows="2"
          />
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
              <!-- TODO: no data image -->
              <v-img
                v-if="encounter.Map"
                :key="encounter.Map"
                :src="encounter.Map"
                aspect-ratio="1"
              />
              <v-img v-else src="https://via.placeholder.com/550" />
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
      <v-combobox
        v-model="encounter.Sitrep"
        item-text="name"
        outlined
        dense
        label="Engagement Type"
        :items="sitreps"
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
          <span class="heading h3 primary--text">PC victory</span>
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
          <span class="heading h3 primary--text">enemy victory</span>
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
          <span class="heading h3 primary--text">no victor</span>
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
          <span class="heading h3 primary--text">Deployment</span>
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
          <span class="heading h3 primary--text">Extraction</span>
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
          <span class="heading h3 primary--text">Control Zones</span>
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
          <span class="heading h3 primary--text">Objective</span>
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
            <legend class="heading h3 primary--text mx-2">FORCES</legend>
            <div v-if="forces.enemy.length" class="caption ml-2">ENEMY</div>
            <v-divider v-if="forces.enemy.length" />
            <npc-chip v-for="n in forces.enemy" :key="n.ID" :npc="n" @remove="remove(n)" />
            <div v-if="forces.allied.length" class="caption ml-2">ALLIED</div>
            <v-divider v-if="forces.allied.length" />
            <npc-chip v-for="n in forces.allied" :key="n.ID" :npc="n" @remove="remove(n)" />
            <div v-if="forces.neutral.length" class="caption ml-2">NEUTRAL</div>
            <v-divider v-if="forces.neutral.length" />
            <npc-chip v-for="n in forces.neutral" :key="n.ID" :npc="n" @remove="remove(n)" />
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
            <legend class="heading h3 primary--text mx-2">REINFORCEMENTS</legend>
            <div v-if="reinforcements.enemy.length" class="caption ml-2">ENEMY</div>
            <v-divider v-if="forces.enemy.length" />
            <npc-chip
              v-for="n in reinforcements.enemy"
              :key="n.ID"
              :npc="n"
              @remove="removeRF(n)"
            />
            <div v-if="reinforcements.allied.length" class="caption ml-2">ALLIED</div>
            <v-divider v-if="forces.allied.length" />
            <npc-chip
              v-for="n in reinforcements.allied"
              :key="n.ID"
              :npc="n"
              @remove="removeRF(n)"
            />
            <div v-if="reinforcements.neutral.length" class="caption ml-2">NEUTRAL</div>
            <v-divider v-if="forces.neutral.length" />
            <npc-chip
              v-for="n in reinforcements.neutral"
              :key="n.ID"
              :npc="n"
              @remove="removeRF(n)"
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
      <v-row>
        <v-textarea v-model="encounter.GmNotes" outlined label="GM Notes" auto-grow rows="2" />
      </v-row>
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
import { EncounterSide, Npc } from '@/class'

export default Vue.extend({
  name: 'encounter-card',
  components: { NpcSelector, NpcChip },
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
    encounter() {
      const store = getModule(EncounterStore, this.$store)
      return store.Encounters.find(x => x.ID === this.id)
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
        enemy: this.encounter.Npcs.filter(x => x.Side === EncounterSide.Enemy),
        allied: this.encounter.Npcs.filter(x => x.Side === EncounterSide.Ally),
        neutral: this.encounter.Npcs.filter(x => x.Side === EncounterSide.Neutral),
      }
    },
    reinforcements() {
      return {
        enemy: this.encounter.Reinforcements.filter(x => x.Side === EncounterSide.Enemy),
        allied: this.encounter.Reinforcements.filter(x => x.Side === EncounterSide.Ally),
        neutral: this.encounter.Reinforcements.filter(x => x.Side === EncounterSide.Neutral),
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
    addNpc(npc: Npc) {
      this.encounter.Npcs.push(npc)
      this.$refs.npcDialog.hide()
    },
    addReinforcement(npc: Npc) {
      this.encounter.Reinforcements.push(npc)
      this.$refs.reinforcementDialog.hide()
    },
    remove(npc: Npc) {
      const idx = this.encounter.Npcs.findIndex(x => x.ID === npc.ID)
      if (idx > -1) this.encounter.Npcs.splice(idx, 1)
    },
    removeRF(npc: Npc) {
      const idx = this.encounter.Reinforcements.findIndex(x => x.ID === npc.ID)
      if (idx > -1) this.encounter.Reinforcements.splice(idx, 1)
    },
  },
})
</script>

<style>
.hide-label textarea {
  margin-top: 4px !important;
}
</style>
