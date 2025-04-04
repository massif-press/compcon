<template>
  <selector
    title="Pilot Talents"
    :success="pilot.TalentsController.HasFullTalents && enoughSelections"
    :flat="flat"
    :modal="modal">
    <template #float>
      <v-card
        v-if="pilot.TalentsController.HasFullTalents && enoughSelections"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="success"
        v-text="'Talent Selection Complete'" />
      <v-card
        v-if="pilot.TalentsController.MaxTalentPoints > pilot.TalentsController.CurrentTalentPoints"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="accent"
        v-text="
          `${pilot.TalentsController.MaxTalentPoints - pilot.TalentsController.CurrentTalentPoints}
            Talent Selections remaining`
        " />

      <cc-button
        variant="text"
        size="x-small"
        block
        :disabled="!pilot.TalentsController.Talents.length"
        @click="pilot.TalentsController.ClearTalents()">
        Reset
      </cc-button>
    </template>

    <template #jump>
      <div class="px-2">
        <cc-select
          v-model="jump"
          label="jump to"
          color="primary"
          variant="outlined"
          :items="jumpItems" />
      </div>
    </template>

    <template #right-column>
      <cc-talent
        v-for="t in talents"
        :id="`talent_${t.ID}`"
        :talent="t"
        :rank="pilot.TalentsController.getTalentRank(t.ID)"
        :can-add="canAdd(t.ID)"
        hide-change
        selectable
        @add="pilot.TalentsController.AddTalent(t)"
        @remove="pilot.TalentsController.RemoveTalent(t)" />
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
import scrollTo from '@/util/scrollTo';

export default {
  name: 'talent-selector',
  components: { Selector, MissingItem },
  props: {
    pilot: { type: Pilot, required: true },
    levelUp: Boolean,
    modal: Boolean,
    flat: Boolean,
  },
  data: () => ({
    search: '',
    ctype: 'full',
    jump: '',
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
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
    jumpItems() {
      return [
        ...this.pilot.TalentsController.Talents.map((x) => ({
          title: x.Talent.Name,
          value: x.Talent.ID,
          subtitle: `// Pilot Rank ${x.Rank}`,
        })),
        ...this.talents
          .filter((x) => !this.pilot.TalentsController.Talents.some((y) => y.Talent.ID === x.ID))
          .map((x) => ({
            title: x.Name,
            value: x.ID,
          })),
      ];
    },
  },
  watch: {
    jump(val) {
      this.scroll(val);
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
      if (!el) {
        console.warn(`Element with ID ${e} not found`);
        return;
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
  },
};
</script>
