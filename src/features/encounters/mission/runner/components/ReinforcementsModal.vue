<template>
  <div>
    <v-row>
      <v-col cols="7">
        <fieldset>
          <legend class="heading h3 primary--text mx-2">COMBATANTS</legend>
          <npc-chip v-for="n in encounter.Npcs" :key="`cmbt_${n.ID}`" :npc="n" readonly />
        </fieldset>
        <fieldset>
          <legend class="heading h3 primary--text mx-2">PILOTS</legend>
          <v-chip
            v-for="p in mission.Pilots"
            :key="`pilot_${p.ID}`"
            large
            label
            color="primary"
            class="ma-2"
          >
            <v-icon large dark left>cci-pilot</v-icon>
            <span class="heading h3">{{ p.Callsign }}</span>
          </v-chip>
        </fieldset>
      </v-col>
      <v-col cols="5">
        <fieldset>
          <legend class="heading h3 primary--text mx-2">REINFORCEMENTS</legend>
          <div
            v-if="!encounter.Reinforcements.length"
            class="text-center grey--text heading h3 mt-3 mb-4"
          >
            // NO REINFORCEMENTS REMAINING //
          </div>
          <npc-chip
            v-for="n in encounter.Reinforcements"
            :key="`rein_${n.ID}`"
            :npc="n"
            readonly
            reinforce
            @move="encounter.MoveReinforcement(n)"
          />
        </fieldset>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="7">
        <v-btn block color="secondary" @click="$refs.pilotDialog.show()">
          add pilot to mission
        </v-btn>
      </v-col>
      <v-col cols="5">
        <v-btn block color="secondary" @click="$refs.npcDialog.show()">
          add NPC to reinforcement pool
        </v-btn>
      </v-col>
    </v-row>
    <cc-solo-dialog ref="pilotDialog" no-confirm title="ADD PILOT" fullscreen no-pad>
      <pilot-selector :selected-pilots="mission.Pilots" @select="addPilot($event)" />
    </cc-solo-dialog>
    <cc-solo-dialog ref="npcDialog" no-confirm title="ADD NPC" fullscreen no-pad>
      <npc-selector @select="addNpc($event)" />
    </cc-solo-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import NpcChip from '../../../encounter/components/NpcChip.vue'
import NpcSelector from '../../../encounter/components/NpcSelector.vue'
import PilotSelector from '../PilotSelector.vue'
import { Pilot, Npc } from '@/class'

export default Vue.extend({
  name: 'reinforcements-modal',
  components: { NpcChip, PilotSelector, NpcSelector },
  props: {
    mission: {
      type: Object,
      required: true,
    },
    encounter: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addPilot(pilot: Pilot) {
      this.pilots.push(pilot)
      this.$refs.pilotDialog.hide()
    },
    addNpc(npc: Npc) {
      this.encounter.Reinforcements.push(npc)
      this.$refs.npcDialog.hide()
    },
  },
})
</script>
