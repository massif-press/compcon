<template>
  <v-container fluid>
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
    <cc-title small class="mb-2">
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
    <cc-title small>
      SITREP
    </cc-title>
    sitrep (type, objective, pc victory condition, enemy victory condition, no victor (based on
    sitrep, editable))
    <cc-title small>
      Combatants
    </cc-title>
    enemies
    <br />
    reinforcements
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'

export default Vue.extend({
  name: 'encounter-card',
  props: {
    encounter: {
      type: Object,
      required: true,
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
    environmentData() {
      return getModule(CompendiumStore, this.$store).Environments
    },
    environments() {
      return ['Nominal'].concat(this.environmentData.map(x => x.name))
    },
    sitrepData() {
      return getModule(CompendiumStore, this.$store).Sitreps
    },
    sitreps() {
      return ['Custom'].concat(this.environmentData.map(x => x.name))
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
  },
})
</script>
