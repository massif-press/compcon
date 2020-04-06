<template>
  <v-container>
    <v-row dense>
      <v-col cols="5" class="ml-auto mr-auto">
        <v-alert
          :value="true"
          :type="pilot.IsMissingHASE ? 'info' : 'success'"
          outlined
          class="stat-text"
        >
          {{ pilot.CurrentHASEPoints }}/{{ pilot.MaxHASEPoints }} Mech Skills selected
        </v-alert>
        <div class="text-center mt-n2">
          <v-btn small class="fadeSelect" color="info" outlined @click="pilot.resetHASE()">
            Reset Mech Skills
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <cc-title>HULL</cc-title>
    <span class="flavor-text">
      Your HULL skill describes your ability to build and pilot durable, heavy mechs that can take
      punches and keep going
    </span>
    <v-row dense>
      <v-col cols="auto" class="ml-auto mr-auto">
        <v-btn
          color="secondary"
          :disabled="!pilot.MechSkills.Hull"
          fab
          x-small
          left
          bottom
          class="d-inline elevation-0"
          @click="remove('Hull')"
        >
          <v-icon>remove</v-icon>
        </v-btn>
        <cc-rating :model="pilot.MechSkills.Hull" />
        <v-btn
          :disabled="!pilot.IsMissingHASE"
          color="secondary"
          fab
          x-small
          right
          bottom
          class="d-inline elevation-0"
          @click="add('Hull')"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense class="mt-n3 mb-6">
      <v-col cols="auto" class="ml-auto mr-auto">
        <span class="heading h3">
          MECH HP
          <span class="accent--text">+{{ pilot.MechSkills.Hull * 2 }}</span>
        </span>
        <cc-slashes class="ml-1 mr-1" />
        <span class="heading h3">
          REPAIR CAPACITY
          <span class="accent--text">+{{ Math.floor(pilot.MechSkills.Hull / 2) }}</span>
        </span>
      </v-col>
    </v-row>

    <cc-title>AGILITY</cc-title>
    <span class="flavor-text">
      Your AGILITY skill describes your ability to build and pilot fast, evasive mechs
    </span>
    <v-row dense>
      <v-col cols="auto" class="ml-auto mr-auto">
        <v-btn
          color="secondary"
          :disabled="!pilot.MechSkills.Agi"
          fab
          x-small
          left
          bottom
          class="d-inline elevation-0"
          @click="remove('Agi')"
        >
          <v-icon>remove</v-icon>
        </v-btn>
        <cc-rating :model="pilot.MechSkills.Agi" />
        <v-btn
          :disabled="!pilot.IsMissingHASE"
          color="secondary"
          class="d-inline elevation-0"
          fab
          x-small
          right
          bottom
          @click="add('Agi')"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row dense class="mt-n3 mb-6">
      <v-col cols="auto" class="ml-auto mr-auto">
        <span class="heading h3">EVASION</span>
        <span class="heading h3 accent--text">+{{ pilot.MechSkills.Agi }}</span>
        <cc-slashes class="ml-1 mr-1" />
        <span class="heading h3">SPEED</span>
        <span class="heading h3 accent--text">+{{ Math.floor(pilot.MechSkills.Agi / 2) }}</span>
      </v-col>
    </v-row>

    <cc-title>SYSTEMS</cc-title>
    <span class="flavor-text">
      Your SYSTEMS skill describes your ability to build and pilot technical mechs with powerful
      electronic warfare tools
    </span>
    <v-row dense>
      <v-col cols="auto" class="ml-auto mr-auto">
        <v-btn
          color="secondary"
          :disabled="!pilot.MechSkills.Sys"
          fab
          x-small
          left
          bottom
          class="d-inline elevation-0"
          @click="remove('Sys')"
        >
          <v-icon>remove</v-icon>
        </v-btn>
        <cc-rating :model="pilot.MechSkills.Sys" />
        <v-btn
          class="d-inline elevation-0"
          color="secondary"
          :disabled="!pilot.IsMissingHASE"
          fab
          x-small
          right
          bottom
          @click="add('Sys')"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row dense class="mt-n3 mb-6">
      <v-col cols="auto" class="ml-auto mr-auto">
        <span class="heading h3">ELECTRONIC DEFENSE</span>
        <span class="heading h3 accent--text">+{{ pilot.MechSkills.Sys }}</span>
        <cc-slashes class="ml-1 mr-1" />
        <span class="heading h3">TECH ATTACK</span>
        <span class="heading h3 accent--text">+{{ pilot.MechSkills.Sys }}</span>
        <cc-slashes class="ml-1 mr-1" />
        <span class="heading h3">SP</span>
        <span class="heading h3 accent--text">+{{ Math.floor(pilot.MechSkills.Sys / 2) }}</span>
      </v-col>
    </v-row>

    <cc-title>Engineering</cc-title>
    <span class="flavor-text">
      Your ENGINEERING skill describes your ability to build and pilot mechs with powerful reactors,
      supplies and support systems
    </span>
    <v-row dense>
      <v-col cols="auto" class="ml-auto mr-auto">
        <v-btn
          color="secondary"
          :disabled="!pilot.MechSkills.Eng"
          fab
          x-small
          left
          bottom
          class="d-inline elevation-0"
          @click="remove('Eng')"
        >
          <v-icon>remove</v-icon>
        </v-btn>
        <cc-rating :model="pilot.MechSkills.Eng" />
        <v-btn
          class="d-inline elevation-0"
          color="secondary"
          :disabled="!pilot.IsMissingHASE"
          fab
          x-small
          right
          bottom
          @click="add('Eng')"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row dense class="mt-n3 mb-6">
      <v-col cols="auto" class="ml-auto mr-auto">
        <span class="heading h3">HEAT CAPACITY</span>
        <span class="heading h3 accent--text">+{{ pilot.MechSkills.Eng }}</span>

        <cc-slashes class="ml-1 mr-1" />

        <span class="heading h3">LIMITED SYSTEMS BONUS</span>
        <span class="heading h3 accent--text">+{{ Math.floor(pilot.MechSkills.Eng / 2) }}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot, HASE } from '@/class'

export default Vue.extend({
  name: 'cc-mech-skills-selector',
  props: {
    pilot: Pilot,
  },
  watch: {
    'pilot.IsMissingHASE': function(newVal) {
      if (newVal === false) window.scrollTo(0, document.body.scrollHeight)
    },
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
})
</script>

<style scoped>
.bonus-text {
  position: relative;
  bottom: 20px;
}
</style>
