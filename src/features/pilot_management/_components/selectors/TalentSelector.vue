<template>
  <selector
    title="Pilot Talents"
    :success="pilot.TalentsController.HasFullTalents && enoughSelections"
    :modal="modal"
  >
    <template #left-column>
      <v-row
        v-for="pTalent in pilot.TalentsController.Talents"
        dense
        align="center"
        color="panel"
        style="width: 100%"
        class="px-1"
        @click="scroll(pTalent.Talent.ID)"
      >
        <v-col cols="auto">
          <v-icon color="accent" :icon="`cc:rank_${pTalent.Rank}`" />
        </v-col>
        <v-col class="mb-n1">
          <b>{{ pTalent.Talent.Name }}</b>
        </v-col>
        <v-col cols="auto">
          <v-btn icon size="x-small" variant="plain" @click="scroll(pTalent.Talent.ID)">
            <v-icon size="25" icon="mdi-menu-right" />
          </v-btn>
        </v-col>
      </v-row>
      <v-divider v-if="pilot.TalentsController.Talents.length" class="ma-2" />
      <v-row>
        <v-col class="ma-1">
          <v-alert
            v-show="pilot.TalentsController.HasFullTalents && enoughSelections"
            variant="outlined"
            density="compact"
            color="success"
            icon="mdi-check-circle"
            class="stat-text py-1 mb-2"
            text="Talent Selection Complete"
          />
          <v-alert
            v-show="
              pilot.TalentsController.MaxTalentPoints > pilot.TalentsController.CurrentTalentPoints
            "
            variant="outlined"
            density="compact"
            color="accent"
            icon="mdi-alert"
            class="stat-text py-1 mb-2"
            :text="`${
              pilot.TalentsController.MaxTalentPoints - pilot.TalentsController.CurrentTalentPoints
            }
            Talent selections remaining`"
          />
          <v-alert
            v-show="!enoughSelections && newPilot"
            variant="outlined"
            density="compact"
            color="accent"
            icon="mdi-alert"
            class="stat-text py-1 mb-2"
            :text="`Must select a minimum of ${selectedMin} talents`"
          />
          <div class="my-2">
            <v-btn
              block
              variant="text"
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
      <v-row dense align="center" class="pt-2">
        <v-col cols="5">
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
            <v-btn value="full"><v-icon size="x-large" icon="mdi-view-stream" /></v-btn>
            <v-btn value="terse"><v-icon size="x-large" icon="mdi-view-list" /></v-btn>
            <v-btn value="small"><v-icon size="x-large" icon="mdi-view-comfy" /></v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>

      <cc-talent
        v-for="t in talents"
        :id="`talent_${t.ID}`"
        :talent="t"
        :rank="pilot.TalentsController.getTalentRank(t.ID)"
        :terse="ctype === 'terse'"
        :small="ctype === 'small'"
        :can-add="canAdd(t.ID)"
        selectable
        @add="pilot.TalentsController.AddTalent(t)"
        @remove="pilot.TalentsController.RemoveTalent(t)"
      />
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
    pilot: { type: Pilot, required: true },
    levelUp: Boolean,
    modal: Boolean,
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
      return (
        this.pilot.Level === 0 || !(this.pilot.TalentsController.Talents.length < this.selectedMin)
      );
    },
    selectionComplete(): boolean {
      return (this.newPilot || this.levelUp) && this.pilot.TalentsController.HasFullTalents;
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
          !this.pilot.TalentsController.HasFullTalents
        );
      }
      return !this.pilot.TalentsController.HasFullTalents;
    },
    scroll(id) {
      this.scrollTo(`talent_${id}`);
    },
    scrollTo(e: any): void {
      const el = document.getElementById(e);
      if (el) {
        const ce = document.getElementById('content-col');
        if (ce) {
          const yOffset = -70;
          const y = el.offsetTop + yOffset;

          ce.scrollTo({ top: y, behavior: 'smooth' });
        } else {
          const yOffset = -60;
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset;

          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    },
  },
};
</script>
