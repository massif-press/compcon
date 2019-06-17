<template>
  <v-container style="overflow-y: scroll">
    <v-layout align-center justify-center column>
      <v-alert value="true" :type="!pointLimit ? 'info' : 'success'" outline>
        {{ currentPoints }}/{{ maxPoints }} Mech Skills selected
      </v-alert>
    </v-layout>
    <v-layout align-center justify-center column>
      <v-flex><span class="headline">HULL</span></v-flex>
      <v-flex>
        <span class="font-weight-light">
          Your HULL skill describes your ability to build and pilot durable,
          heavy mechs that can take punches and keep going
        </span>
      </v-flex>
      <v-flex>
        <v-btn icon left bottom @click="remove('Hull')">
          <v-icon>remove</v-icon>
        </v-btn>
        <v-rating
          class="d-inline-block"
          v-model="pilot.MechSkills.Hull"
          hover
          x-large
          length="6"
          readonly
          empty-icon="mdi-hexagon-outline"
          full-icon="mdi-hexagon-slice-6"
        />
        <v-btn :disabled="pointLimit" icon right bottom @click="add('Hull')">
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-divider class="ml-4 mr-4 mt-0 pt-0 mb-3" />
    <v-layout align-center justify-center column>
      <v-flex><span class="headline">AGILITY</span></v-flex>
      <v-flex>
        <span class="font-weight-light">
          Your AGILITY skill describes your ability to build and pilot fast,
          evasive mechs
        </span>
      </v-flex>
      <v-flex>
        <v-btn icon left bottom @click="remove('Agi')">
          <v-icon>remove</v-icon>
        </v-btn>
        <v-rating
          class="d-inline-block"
          v-model="pilot.MechSkills.Agi"
          hover
          x-large
          length="6"
          readonly
          empty-icon="mdi-hexagon-outline"
          full-icon="mdi-hexagon-slice-6"
        />
        <v-btn :disabled="pointLimit" icon right bottom @click="add('Agi')">
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-divider class="ml-4 mr-4 mt-0 pt-0 mb-3" />
    <v-layout align-center justify-center column>
      <v-flex><span class="headline">SYSTEMS</span></v-flex>
      <v-flex>
        <span class="font-weight-light">
          Your SYSTEMS skill describes your ability to build and pilot technical
          mechs with powerful electronic warfare tools
        </span>
      </v-flex>
      <v-flex>
        <v-btn icon left bottom @click="remove('Sys')">
          <v-icon>remove</v-icon>
        </v-btn>
        <v-rating
          class="d-inline-block"
          v-model="pilot.MechSkills.Sys"
          hover
          x-large
          length="6"
          readonly
          empty-icon="mdi-hexagon-outline"
          full-icon="mdi-hexagon-slice-6"
        />
        <v-btn :disabled="pointLimit" icon right bottom @click="add('Sys')">
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-divider class="ml-4 mr-4 mt-0 pt-0 mb-3" />
    <v-layout align-center justify-center column>
      <v-flex><span class="headline">ENGINEERING</span></v-flex>
      <v-flex>
        <span class="font-weight-light">
          Your ENGINEERING skill describes your ability to build and pilot mechs
          with powerful reactors, supplies and support systems
        </span>
      </v-flex>
      <v-flex>
        <v-btn icon left bottom @click="remove('Eng')">
          <v-icon>remove</v-icon>
        </v-btn>
        <v-rating
          class="d-inline-block"
          v-model="pilot.MechSkills.Eng"
          hover
          x-large
          length="6"
          readonly
          empty-icon="mdi-hexagon-outline"
          full-icon="mdi-hexagon-slice-6"
        />
        <v-btn :disabled="pointLimit" icon right bottom @click="add('Eng')">
          <v-icon>add</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot, HASE } from '@/class'

export default Vue.extend({
  name: 'mech-skills-selector',
  props: {
    pilot: Pilot,
  },
  methods: {
    add(field: HASE) {
      this.pilot.MechSkills.Increment(field)
    },
    remove(field: HASE) {
      this.pilot.MechSkills.Decrement(field)
    },
    close() {
      this.$emit('close')
    },
  },
  computed: {
    maxPoints(): number {
      return this.pilot.Level + 2
    },
    currentPoints(): number {
      return this.pilot.MechSkills.Sum
    },
    pointLimit(): boolean {
      return this.currentPoints >= this.maxPoints
    },
  },
})
</script>
