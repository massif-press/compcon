<template>
  <cc-titled-panel :title="encounter.Name">
    <v-row dense class="mt-n1">
      <v-col v-if="encounter.Campaign" cols="auto">
        <div class="overline">CAMPAIGN</div>
        {{ encounter.Campaign }}
      </v-col>
      <v-col v-if="encounter.Labels.length">
        <div class="overline">LABELS</div>
        <v-chip v-for="l in encounter.Labels" :key="l" small class="mx-1">{{ l }}</v-chip>
      </v-col>
      <v-col cols="auto" class="ml-auto">
        <b class="caption">TOTAL POWER RATING</b>
        <br />
        <span class="heading h2 primary--text">
          {{ encounter.Power.toString().padStart(4, '0') }}
        </span>
      </v-col>
    </v-row>
    <p v-if="encounter.Note" class="flavor-text mb-0" v-html="encounter.Note" />
    <v-row dense no-gutters class="my-2">
      <v-col cols="2"><v-divider class="mt-3" /></v-col>
      <span class="heading h3 primary--text px-2">COMBATANTS</span>
      <v-col><v-divider class="mt-3" /></v-col>
    </v-row>
    <v-row dense class="mr-2 mt-n1 ml-2">
      <v-col v-if="forces.enemy.length" class="caption ml-2">
        <div class="stat-text red--text">ENEMY</div>
        <npc-chip v-for="n in forces.enemy" :key="n.ID" :npc="n" readonly />
      </v-col>
      <v-divider v-if="forces.allied.length" vertical />
      <v-col v-if="forces.allied.length" class="caption ml-2">
        <div class="stat-text blue--text">ALLIED</div>
        <npc-chip v-for="n in forces.allied" :key="n.ID" :npc="n" readonly />
      </v-col>
      <v-divider v-if="forces.allied.length || forces.enemy.length" vertical />
      <v-col v-if="forces.neutral.length" class="caption ml-2">
        <div class="stat-text grey--text text--darken-1">NEUTRAL</div>
        <npc-chip v-for="n in forces.neutral" :key="n.ID" :npc="n" readonly />
      </v-col>
    </v-row>
    <v-row dense no-gutters class="my-2">
      <v-col cols="2"><v-divider class="mt-3" /></v-col>
      <span class="heading h3 primary--text px-2">REINFORCEMENTS</span>
      <v-col><v-divider class="mt-3" /></v-col>
    </v-row>
    <v-row dense class="mr-2 mt-n1 ml-2">
      <v-col v-if="reinforcements.enemy.length" class="caption ml-2">
        <div class="stat-text red--text">ENEMY</div>
        <npc-chip v-for="n in reinforcements.enemy" :key="n.ID" :npc="n" readonly />
      </v-col>
      <v-divider v-if="reinforcements.allied.length" vertical />
      <v-col v-if="reinforcements.allied.length" class="caption ml-2">
        <div class="stat-text blue--text">ALLIED</div>
        <npc-chip v-for="n in reinforcements.allied" :key="n.ID" :npc="n" readonly />
      </v-col>
      <v-divider v-if="reinforcements.allied.length || reinforcements.enemy.length" vertical />
      <v-col v-if="reinforcements.neutral.length" class="caption ml-2">
        <div class="stat-text grey--text text--darken-1">NEUTRAL</div>
        <npc-chip v-for="n in reinforcements.neutral" :key="n.ID" :npc="n" readonly />
      </v-col>
    </v-row>
    <div v-if="!readonly">
      <v-divider class="my-3" />
      <v-btn large block color="secondary" @click="$emit('select', encounter)">
        <v-icon left>mdi-plus</v-icon>
        Add Encounter
      </v-btn>
    </div>
  </cc-titled-panel>
</template>

<script lang="ts">
import Vue from 'vue'
import NpcChip from '../../encounter/components/NpcChip.vue'
import { EncounterSide } from '@/class'

export default Vue.extend({
  name: 'encounter-panel',
  components: { NpcChip },
  props: {
    encounter: {
      type: Object,
      required: true,
    },
    sideSelect: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
    },
  },
  computed: {
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
})
</script>
