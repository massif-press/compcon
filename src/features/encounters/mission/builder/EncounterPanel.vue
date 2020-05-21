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
        <cc-tooltip
          title="Power Rating"
          content="The Power Rating is an attempt to calculate the relative strength of an NPC (or encounters’ worth of NPCs) based on tier and applied templates, compared to mission’s Pilot and their current level. It should, generally, produce results more or less in line with the Balancing Combat section on pp. 283 of the LANCER Core Book.<br> That said, this is an experimental feature that is still very heavily in development, and does not (yet) always produce reliable results. Moreover, this tool doesn’t consider NPC or player team composition, synergies, strengths, and weaknesses. Nor does this tool consider map layout, mission objectives, or reinforcement schedules.<br>While we will continue to work on this tool to produce more accurate, actionable results, please use it only as a general indicator of relative NPC strength."
        >
          <div>
            <b class="caption">TOTAL POWER RATING</b>
            <br />
            <span class="heading h2 accent--text">
              {{ encounter.Power.toString().padStart(4, '0') }}
            </span>
          </div>
        </cc-tooltip>
      </v-col>
    </v-row>
    <p v-if="encounter.Note" class="flavor-text mb-0" v-html="encounter.Note" />
    <v-row dense no-gutters class="my-2">
      <v-col cols="2"><v-divider class="mt-3" /></v-col>
      <span class="heading h3 accent--text px-2">COMBATANTS</span>
      <v-col><v-divider class="mt-3" /></v-col>
    </v-row>
    <v-row dense class="mr-2 mt-n1 ml-2">
      <v-col v-if="forces.enemy.length" class="caption ml-2">
        <div class="stat-text red--text">ENEMY</div>
        <npc-chip v-for="(n, i) in forces.enemy" :key="`fe_${n.ID}_${i}`" :npc="n" readonly />
      </v-col>
      <v-divider v-if="forces.allied.length" vertical />
      <v-col v-if="forces.allied.length" class="caption ml-2">
        <div class="stat-text blue--text">ALLIED</div>
        <npc-chip v-for="(n, i) in forces.allied" :key="`fa_${n.ID}_${i}`" :npc="n" readonly />
      </v-col>
      <v-divider v-if="forces.allied.length || forces.enemy.length" vertical />
      <v-col v-if="forces.neutral.length" class="caption ml-2">
        <div class="stat-text subtle--text text--darken-1">NEUTRAL</div>
        <npc-chip v-for="(n, i) in forces.neutral" :key="`fn_${n.ID}_${i}`" :npc="n" readonly />
      </v-col>
    </v-row>
    <v-row dense no-gutters class="my-2">
      <v-col cols="2"><v-divider class="mt-3" /></v-col>
      <span class="heading h3 accent--text px-2">REINFORCEMENTS</span>
      <v-col><v-divider class="mt-3" /></v-col>
    </v-row>
    <v-row dense class="mr-2 mt-n1 ml-2">
      <v-col v-if="reinforcements.enemy.length" class="caption ml-2">
        <div class="stat-text red--text">ENEMY</div>
        <npc-chip
          v-for="(n, i) in reinforcements.enemy"
          :key="`re_${n.ID}_${i}`"
          :npc="n"
          readonly
        />
      </v-col>
      <v-divider v-if="reinforcements.allied.length" vertical />
      <v-col v-if="reinforcements.allied.length" class="caption ml-2">
        <div class="stat-text blue--text">ALLIED</div>
        <npc-chip
          v-for="(n, i) in reinforcements.allied"
          :key="`ra_${n.ID}_${i}`"
          :npc="n"
          readonly
        />
      </v-col>
      <v-divider v-if="reinforcements.allied.length || reinforcements.enemy.length" vertical />
      <v-col v-if="reinforcements.neutral.length" class="caption ml-2">
        <div class="stat-text subtle--text text--darken-1">NEUTRAL</div>
        <npc-chip
          v-for="(n, i) in reinforcements.neutral"
          :key="`rn_${n.ID}_${i}`"
          :npc="n"
          readonly
        />
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
})
</script>
