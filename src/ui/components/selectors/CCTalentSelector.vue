<template>
  <selector
    title="Pilot Talents"
    height="60vh"
    :success="!pilot.IsMissingTalents && enoughSelections"
  >
    <template v-slot:left-column>
      <v-row v-for="(pTalent, i) in pilot.Talents" :key="`summary_${pTalent.talent.id}_${i}`">
        <missing-item v-if="pTalent.Talent.err" @remove="remove(pTalent)" />
        <span v-else>
          <v-icon small color="primary">cci-rank-{{ pTalent.Rank }}</v-icon>
          <strong>{{ pTalent.Talent.Name }}</strong>
        </span>
      </v-row>
      <v-divider v-if="pilot.Talents.length" class="ma-2 ml-4 mr-4" />
      <v-row>
        <v-col>
          <v-alert
            outlined
            prominent
            dense
            border="left"
            color="success"
            icon="check_circle"
            class="stat-text"
            :value="!pilot.IsMissingTalents && enoughSelections"
          >
            Talent Selection Complete
          </v-alert>
          <v-alert
            outlined
            prominent
            dense
            border="left"
            color="primary"
            icon="warning"
            class="stat-text"
            :value="pilot.MaxTalentPoints > pilot.CurrentTalentPoints"
          >
            {{ pilot.MaxTalentPoints - pilot.CurrentTalentPoints }} Talent selections remaining
          </v-alert>
          <v-alert
            outlined
            prominent
            dense
            border="left"
            color="primary"
            icon="warning"
            class="stat-text"
            :value="!enoughSelections"
          >
            Must select a minimum of {{ selectedMin }} talents
          </v-alert>
          <v-btn block text small :disabled="!talents.length" @click="pilot.ClearTalents()">
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <template v-slot:right-column>
      <talent-select-item
        v-for="talent in talents"
        :key="talent.ID"
        :available="pilot.MaxTalentPoints > pilot.CurrentTalentPoints"
        :talent="talent"
        :pilot-rank="pilot.getTalentRank(talent.ID)"
        :new-pilot="newPilot"
        @add="pilot.AddTalent(talent)"
        @remove="pilot.RemoveTalent(talent)"
      />
    </template>
  </selector>
</template>

<script lang="ts">
import Vue from 'vue'
import Selector from './components/_SelectorBase.vue'
import MissingItem from './components/_MissingItem.vue'
import TalentSelectItem from './components/_TalentSelectItem.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { Pilot, Talent } from '@/class'
import { rules } from 'lancer-data'

export default Vue.extend({
  name: 'talent-selector',
  components: { Selector, TalentSelectItem, MissingItem },
  props: {
    pilot: Pilot,
    levelUp: Boolean,
  },
  computed: {
    newPilot(): boolean {
      return this.pilot.Level === 0
    },
    selectedMin(): number {
      return rules.minimum_pilot_talents
    },
    enoughSelections(): boolean {
      return !(this.pilot.Talents.length < this.selectedMin)
    },
    selectionComplete(): boolean {
      return (this.newPilot || this.levelUp) && !this.pilot.IsMissingTalents
    },
    talents(): Talent[] {
      const compendium = getModule(CompendiumStore, this.$store)
      return compendium.Talents
    },
  },
  watch: {
    selectionComplete() {
      window.scrollTo(0, document.body.scrollHeight)
    },
  },
})
</script>
