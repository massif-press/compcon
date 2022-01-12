<template>
  <selector
    title="Pilot Talents"
    height="60vh"
    :success="!pilot.IsMissingTalents && enoughSelections"
  >
    <template v-slot:left-column>
      <v-row
        v-for="(pTalent, i) in pilot.Talents"
        :key="`summary_${pTalent.Talent.ID}_${i}`"
        class="my-2"
      >
        <missing-item v-if="pTalent.Talent.err" @remove="remove(pTalent)" />
        <span v-else>
          <v-icon color="accent">cci-rank-{{ pTalent.Rank }}</v-icon>
          <strong>{{ pTalent.Talent.Name }}</strong>
          <v-icon right class="fadeSelect" @click="scroll(pTalent.Talent.ID)">
            mdi-chevron-right
          </v-icon>
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
            style="width: 95%"
            :value="!pilot.IsMissingTalents && enoughSelections"
          >
            Talent Selection Complete
          </v-alert>
          <v-alert
            outlined
            prominent
            dense
            border="left"
            color="accent"
            icon="warning"
            class="stat-text"
            style="width: 95%"
            :value="pilot.MaxTalentPoints > pilot.CurrentTalentPoints"
          >
            {{ pilot.MaxTalentPoints - pilot.CurrentTalentPoints }} Talent selections remaining
          </v-alert>
          <v-alert
            outlined
            prominent
            dense
            border="left"
            color="accent"
            icon="warning"
            class="stat-text"
            style="width: 95%"
            :value="!enoughSelections && newPilot"
          >
            Must select a minimum of {{ selectedMin }} talents
          </v-alert>
          <div class="my-2">
            <v-btn block text small :disabled="!talents.length" @click="pilot.ClearTalents()">
              Reset
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>

    <template v-slot:right-column>
      <v-row dense align="center">
        <v-col cols="10" lg="5">
          <v-text-field
            v-model="search"
            prepend-icon="mdi-magnify"
            color="accent"
            label="Search Talents"
            dense
            hide-details
            class="mb-2"
            outlined
            clearable
          />
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn-toggle v-model="ctype" mandatory>
            <v-btn value="full"><v-icon>mdi-view-stream</v-icon></v-btn>
            <v-btn value="terse"><v-icon>mdi-view-list</v-icon></v-btn>
            <v-btn value="small"><v-icon>mdi-view-comfy</v-icon></v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <v-row id="talent-list" dense justify="center">
        <cc-talent
          v-for="(t, i) in talents"
          :id="`e_${t.ID}`"
          :key="`t_${i}`"
          :talent="t"
          :rank="pilot.getTalentRank(t.ID)"
          :terse="ctype === 'terse'"
          :small="ctype === 'small'"
          :can-add="canAdd(t.ID)"
          selectable
          @add="pilot.AddTalent(t)"
          @remove="pilot.RemoveTalent(t)"
        />
      </v-row>
    </template>
  </selector>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import Selector from './components/_SelectorBase.vue'
import MissingItem from './components/_MissingItem.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { Rules, Pilot, Talent } from '@/class'
import { accentInclude } from '@/classes/utility/accent_fold'

export default Vue.extend({
  name: 'talent-selector',
  components: { Selector, MissingItem },
  props: {
    pilot: Pilot,
    levelUp: Boolean,
  },
  data: () => ({
    search: '',
    ctype: 'full',
  }),
  computed: {
    newPilot(): boolean {
      return this.pilot.Level === 0
    },
    selectedMin(): number {
      return Rules.MinimumPilotTalents
    },
    enoughSelections(): boolean {
      // we should only care about the minimum pilot talents in non-levelup (creation)
      return this.pilot.Level === 0 || !(this.pilot.Talents.length < this.selectedMin)
    },
    selectionComplete(): boolean {
      return (this.newPilot || this.levelUp) && !this.pilot.IsMissingTalents
    },
    talents(): Talent[] {
      const compendium = getModule(CompendiumStore, this.$store)
      const talents = compendium.Talents.filter(x => !x.IsHidden)
      if (this.search) return talents.filter(x => accentInclude(x.Name, this.search))

      return talents
    },
  },
  watch: {
    selectionComplete(bool) {
      if (bool) window.scrollTo(0, document.body.scrollHeight)
    },
  },
  methods: {
    canAdd(id) {
      if (this.newPilot) {
        return this.pilot.getTalentRank(id) === 0 && this.pilot.IsMissingTalents
      }
      return this.pilot.IsMissingTalents
    },
    scroll(id) {
      if (this.levelUp)
        this.$vuetify.goTo(`#e_${id}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
        })
      else
        this.$vuetify.goTo(`#e_${id}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
          container: '.v-dialog--active',
        })
    },
  },
})
</script>
