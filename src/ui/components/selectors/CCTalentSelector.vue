<template>
  <selector
    title="Pilot Talents"
    height="60vh"
    :success="!pilot.TalentsController.IsMissingTalents && enoughSelections"
  >
    <template #left-column>
      <v-row v-for="(pTalent, i) in pilot.TalentsController.Talents" class="my-2">
        <missing-item v-if="pTalent.Talent.err" @remove="remove(pTalent)" />
        <span v-else>
          <v-icon color="accent">cc:rank_{{ pTalent.Rank }}</v-icon>
          <strong>{{ pTalent.Talent.Name }}</strong>
          <v-icon end class="fade-select" @click="scroll(pTalent.Talent.ID)">
            mdi-chevron-right
          </v-icon>
        </span>
      </v-row>
      <v-divider v-if="pilot.TalentsController.Talents.length" class="ma-2 ml-4 mr-4" />
      <v-row>
        <v-col>
          <v-alert
            variant="outlined"
            prominent
            density="compact"
            color="success"
            icon="check_circle"
            class="stat-text"
            style="width: 95%"
            :value="!pilot.TalentsController.IsMissingTalents && enoughSelections"
          >
            Talent Selection Complete
          </v-alert>
          <v-alert
            variant="outlined"
            prominent
            density="compact"
            color="accent"
            icon="warning"
            class="stat-text"
            style="width: 95%"
            :value="
              pilot.TalentsController.MaxTalentPoints > pilot.TalentsController.CurrentTalentPoints
            "
          >
            {{
              pilot.TalentsController.MaxTalentPoints - pilot.TalentsController.CurrentTalentPoints
            }}
            Talent selections remaining
          </v-alert>
          <v-alert
            variant="outlined"
            prominent
            density="compact"
            color="accent"
            icon="warning"
            class="stat-text"
            style="width: 95%"
            :value="!enoughSelections && newPilot"
          >
            Must select a minimum of {{ selectedMin }} talents
          </v-alert>
          <div class="my-2">
            <v-btn
              block
              text
              small
              :disabled="!talents.length"
              @click="pilot.TalentsController.ClearTalents()"
            >
              Reset
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>

    <template #right-column>
      <v-row density="compact" align="center">
        <v-col cols="10" lg="5">
          <v-text-field
            v-model="search"
            prepend-icon="mdi-magnify"
            color="accent"
            label="Search Talents"
            density="compact"
            hide-details
            class="mb-2"
            variant="outlined"
            clearable
          />
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <v-btn-toggle v-model="ctype" mandatory>
            <v-btn value="full"><v-icon icon="mdi-view-stream" /></v-btn>
            <v-btn value="terse"><v-icon icon="mdi-view-list" /></v-btn>
            <v-btn value="small"><v-icon icon="mdi-view-comfy" /></v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <v-row id="talent-list" density="compact" justify="center">
        <cc-talent
          v-for="(t, i) in talents"
          :id="`e_${t.ID}`"
          :talent="t"
          :rank="pilot.TalentsController.getTalentRank(t.ID)"
          :terse="ctype === 'terse'"
          :small="ctype === 'small'"
          :can-add="canAdd(t.ID)"
          selectable
          @add="pilot.TalentsController.AddTalent(t)"
          @remove="pilot.TalentsController.RemoveTalent(t)"
        />
      </v-row>
    </template>
  </selector>
</template>

<script lang="ts">
import _ from 'lodash';
import Selector from './components/_SelectorBase.vue';
import MissingItem from './components/_MissingItem.vue';

import { CompendiumStore } from '@/stores';
import { Rules, Pilot, Talent } from '@/class';
import { accentInclude } from '@/classes/utility/accent_fold';

export default {
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
      return this.pilot.Level === 0;
    },
    selectedMin(): number {
      return Rules.MinimumPilotTalents;
    },
    enoughSelections(): boolean {
      // we should only care about the minimum pilot talents in non-levelup (creation)
      return (
        this.pilot.Level === 0 || !(this.pilot.TalentsController.Talents.length < this.selectedMin)
      );
    },
    selectionComplete(): boolean {
      return (this.newPilot || this.levelUp) && !this.pilot.TalentsController.IsMissingTalents;
    },
    talents(): Talent[] {
      const compendium = CompendiumStore();
      const talents = compendium.Talents.filter((x) => !x.IsHidden);
      if (this.search) return talents.filter((x) => accentInclude(x.Name, this.search));

      return talents;
    },
  },
  watch: {
    selectionComplete(bool) {
      if (bool) window.scrollTo(0, document.body.scrollHeight);
    },
  },
  methods: {
    canAdd(id) {
      if (this.newPilot) {
        return (
          this.pilot.TalentsController.getTalentRank(id) === 0 &&
          this.pilot.TalentsController.IsMissingTalents
        );
      }
      return this.pilot.TalentsController.IsMissingTalents;
    },
    scroll(id) {
      if (this.levelUp)
        this.$vuetify.goTo(`#e_${id}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
        });
      else
        this.$vuetify.goTo(`#e_${id}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
          container: '.v-dialog--active',
        });
    },
  },
};
</script>
