<template>
  <div>
    <v-row>
      <v-col cols="7">
        <fieldset>
          <legend class="heading h3 accent--text mx-2">COMBATANTS</legend>
          <npc-chip
            v-for="(n, i) in mission.ActiveNpcs.filter(x => x.Side === 'Enemy')"
            :key="`cmbt_e_${n.ID}_${i}`"
            :npc="n"
            readonly
            color="red darken-1"
          />
          <npc-chip
            v-for="(n, i) in mission.ActiveNpcs.filter(x => x.Side === 'Ally')"
            :key="`cmbt_a_${n.ID}_${i}`"
            :npc="n"
            readonly
            color="blue darken-1"
          />
          <npc-chip
            v-for="(n, i) in mission.ActiveNpcs.filter(x => x.Side === 'Neutral')"
            :key="`cmbt_n_${n.ID}_${i}`"
            :npc="n"
            readonly
            color="grey darken-1"
          />
        </fieldset>
        <fieldset>
          <legend class="heading h3 accent--text mx-2">PILOTS</legend>
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
          <legend class="heading h3 accent--text mx-2">REINFORCEMENTS</legend>
          <div
            v-if="!mission.ActiveReinforcements.length"
            class="text-center subtle--text heading h3 mt-3 mb-4"
          >
            // NO REINFORCEMENTS REMAINING //
          </div>
          <npc-chip
            v-for="(n, i) in mission.ActiveReinforcements.filter(x => x.Side === 'Enemy')"
            :key="`rein_e_${n.ID}_${i}`"
            :npc="n"
            readonly
            reinforce
            color="red darken-1"
            @move="mission.MoveReinforcement(n)"
          />
          <npc-chip
            v-for="(n, i) in mission.ActiveReinforcements.filter(x => x.Side === 'Ally')"
            :key="`rein_a_${n.ID}_${i}`"
            :npc="n"
            readonly
            reinforce
            color="blue darken-1"
            @move="mission.MoveReinforcement(n)"
          />
          <npc-chip
            v-for="(n, i) in mission.ActiveReinforcements.filter(x => x.Side === 'Neutral')"
            :key="`rein_n_${n.ID}_${i}`"
            :npc="n"
            readonly
            reinforce
            color="grey darken-1"
            @move="mission.MoveReinforcement(n)"
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
import { Pilot, Npc, EncounterSide } from '@/class'

export default Vue.extend({
  name: 'reinforcements-modal',
  components: { NpcChip, PilotSelector, NpcSelector },
  props: {
    mission: {
      type: Object,
      required: true,
    },
  },
  methods: {
    addPilot(pilot: Pilot) {
      this.mission.AddPilot(pilot)
      this.$refs.pilotDialog.hide()
    },
    addNpc(event: { npc: Npc; side: EncounterSide }) {
      this.mission.AddActiveReinforcement(event.npc, event.side)
      this.$refs.npcDialog.hide()
    },
  },
})
</script>
