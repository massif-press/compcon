<template>
  <selector title="Pilot Talents">
    <template v-slot:left-column>
      <v-row>
        <v-col xs12>
          <div v-for="pTalent in pilot.Talents" :key="`summary_${pTalent.talent.id}`">
            <v-row v-if="pTalent.Talent.err">
              <v-col shrink>
                <span class="grey--text">// MISSING DATA //</span>
              </v-col>
              <v-col shrink>
                <v-btn icon flat color="error" @click="remove(pTalent)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col xs12>
                <v-icon small color="primary">cci-rank-{{ pTalent.Rank }}</v-icon>
                <strong>{{ pTalent.Talent.Name }}</strong>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
      <v-divider class="ma-2 ml-4 mr-4" />
      <v-row>
        <v-col xs12>
          <v-alert
            outline
            color="success"
            icon="check_circle"
            :value="!pilot.IsMissingTalents && !(points.selectedCurrent < points.selectedMin)"
          >
            Talent Selection Complete
          </v-alert>
          <v-alert
            outline
            color="warning"
            icon="priority_high"
            :value="pilot.MaxTalentPoints > pilot.CurrentTalentPoints"
          >
            {{ pilot.MaxTalentPoints - pilot.CurrentTalentPoints }} Talent Points remaining
          </v-alert>
          <v-alert
            outline
            color="warning"
            icon="priority_high"
            :value="points.selectedCurrent < points.selectedMin"
          >
            Must select a minimum of {{ points.selectedMin }} talents
          </v-alert>
          <v-btn block flat small :disabled="!talents.length" @click="resetTalents">
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <template v-slot:right-column>
      <v-expansion-panel expand focusable v-model="panels">
        <talent-item
          v-for="talent in talents"
          :key="talent.ID"
          selectable
          :available="pilot.MaxTalentPoints > pilot.CurrentTalentPoints"
          :talent="talent"
          :pilotTalent="pilotTalent(talent)"
          @add="addTalent(talent)"
          @remove="removeTalent(talent)"
          :new-pilot="newPilot"
        />
      </v-expansion-panel>
    </template>
  </selector>
</template>

<script lang="ts">
import Vue from 'vue'
import { Talent, PilotTalent, Pilot } from '@/class'
import { TalentItem } from '../SheetComponents'
import Selector from './Selector.vue'
import { rules } from 'lancer-data'

export default Vue.extend({
  name: 'talent-selector',
  props: {
    pilot: Pilot,
    newPilot: Boolean,
    levelUp: Boolean,
  },
  components: { Selector, TalentItem },
  data: () => ({
    talents: [],
    panels: [],
  }),
  computed: {
    points() {
      var vm = this as any
      return {
        selectedCurrent: vm.pilot.Talents.length,
        selectedMin: rules.minimum_pilot_talents,
      }
    },
  },
  methods: {
    pilotTalent(talent: Talent): PilotTalent | null {
      const pt = this.pilot.Talents.find(x => x.Talent.ID === talent.ID)
      return pt ? pt : null
    },
    addTalent(talent: Talent) {
      this.pilot.AddTalent(talent)

      if (this.newPilot) this.panels = []

      if ((this.newPilot || this.levelUp) && !this.pilot.IsMissingTalents) {
        window.scrollTo(0, document.body.scrollHeight)
      }
    },
    removeTalent(talent: Talent) {
      this.pilot.RemoveTalent(talent)
    },
    resetTalents() {
      this.pilot.ClearTalents()
      this.panels = []
    },
  },
  created() {
    this.talents = this.$store.getters.getItemCollection('Talents')
  },
})
</script>
