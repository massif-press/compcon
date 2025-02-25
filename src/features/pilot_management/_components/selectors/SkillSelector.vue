<template>
  <selector
    title="Pilot Skill Triggers"
    :success="!pilot.SkillsController.IsMissingSkills && enoughSelections"
    :flat="flat"
    :modal="modal">
    <template #left-column>
      <v-row v-for="pSkill in pilot.SkillsController.Skills" dense align="center" class="px-2">
        <v-col cols="auto">
          <v-chip color="accent" size="small">
            +
            <b>{{ pSkill.Bonus }}</b>
          </v-chip>
        </v-col>
        <v-col>
          <b class="text-stark">{{ pSkill.Skill.Trigger }}</b>
        </v-col>
        <v-col cols="auto">
          <v-btn icon size="x-small" variant="plain" @click="scroll(pSkill.Skill.ID)">
            <v-icon size="25" icon="mdi-menu-right" />
          </v-btn>
        </v-col>
      </v-row>
      <v-divider v-if="pilot.SkillsController.Skills.length" class="ma-2" />
      <v-row>
        <v-col class="ma-1">
          <v-alert
            v-show="!pilot.SkillsController.IsMissingSkills && enoughSelections"
            variant="outlined"
            density="compact"
            color="success"
            icon="mdi-check-circle"
            class="stat-text py-1 mb-2"
            text="Skill Selection Complete" />
          <v-alert
            v-show="
              pilot.SkillsController.MaxSkillPoints > pilot.SkillsController.CurrentSkillPoints
            "
            variant="outlined"
            density="compact"
            color="accent"
            icon="mdi-alert"
            class="stat-text py-1 mb-2"
            :text="`${
              pilot.SkillsController.MaxSkillPoints - pilot.SkillsController.CurrentSkillPoints
            }
            Skill Points remaining`" />

          <v-alert
            v-show="!enoughSelections"
            variant="outlined"
            density="compact"
            color="accent"
            icon="mdi-alert"
            class="stat-text py-1 mb-2"
            :text="`Must select a minimum of ${selectedMin} skills`" />
          <v-btn
            block
            variant="text"
            :disabled="!pilot.SkillsController.Skills.length"
            @click="pilot.SkillsController.ClearSkills()">
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <template #float>
      <v-card
        v-if="!pilot.SkillsController.IsMissingSkills && enoughSelections"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="success"
        v-text="'Skill Selection Complete'" />
      <v-card
        v-if="pilot.SkillsController.MaxSkillPoints > pilot.SkillsController.CurrentSkillPoints"
        flat
        tile
        class="text-cc-overline"
        :class="mobile ? 'pa-1' : 'pa-2'"
        variant="outlined"
        density="compact"
        color="accent"
        v-text="
          `${pilot.SkillsController.MaxSkillPoints - pilot.SkillsController.CurrentSkillPoints}
            Skill Points remaining`
        " />

      <cc-button
        variant="text"
        size="x-small"
        block
        :disabled="!pilot.SkillsController.Skills.length"
        @click="pilot.SkillsController.ClearSkills()">
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
      <div v-for="h in headers" class="mb-4">
        <div v-if="h.attr !== 'Custom'" class="text-cc-overline">Your Ability To</div>
        <div v-if="mobile" class="text-cc-overline text-accent mb-2">{{ h.description }}</div>
        <cc-title v-else class="py-1 mb-2">{{ h.description }}</cc-title>
        <skill-select-item
          v-for="s in skills[h.attr]"
          :id="`skill_${s.ID}`"
          :skill="s"
          :bonus="pilot.SkillsController.GetSkill(s.ID)?.Bonus || 0"
          :can-add="pilot.SkillsController.CanAddSkill(s)"
          :can-remove="pilot.SkillsController.CanRemoveSkill(s)"
          @add="pilot.SkillsController.AddSkill(s)"
          @remove="pilot.SkillsController.RemoveSkill(s)" />
      </div>
      <add-custom-skill
        :pilot="pilot"
        @add-custom="pilot.SkillsController.AddCustomSkill($event)" />
      <div style="height: 12px" />
    </template>
  </selector>
</template>

<script lang="ts">
import SkillSelectItem from './components/_SkillSelectItem.vue';
import AddCustomSkill from './components/_AddCustomSkill.vue';
import MissingItem from './components/_MissingItem.vue';
import Selector from './components/_SelectorBase.vue';

import { CompendiumStore } from '@/stores';
import { Rules, Pilot, CompendiumItem } from '@/class';
import { rules } from '@massif/lancer-data';

import scrollTo from '@/util/scrollTo';

import _ from 'lodash';

export default {
  name: 'skill-selector',
  components: { Selector, SkillSelectItem, AddCustomSkill, MissingItem },
  props: {
    pilot: { type: Pilot, required: true },
    levelUp: Boolean,
    modal: Boolean,
    flat: Boolean,
  },
  data: () => ({
    search: '',
    jump: '',
  }),
  computed: {
    mobile() {
      return this.$vuetify.display.smAndDown;
    },
    staticSkills() {
      return _.groupBy(CompendiumStore().Skills, 'Family');
    },
    flatSkills() {
      return CompendiumStore().Skills;
    },
    headers() {
      return rules.skill_headers;
    },
    skills() {
      const cs = this.pilot.SkillsController.Skills.filter((x) => x.IsCustom);
      if (cs.length) return { ...this.staticSkills, Custom: cs.map((x) => x.Skill) };
      return this.staticSkills;
    },
    newPilot(): boolean {
      return this.pilot.Level === 0;
    },
    selectedMin(): number {
      return Rules.MinimumPilotSkills;
    },
    enoughSelections(): boolean {
      return !(this.pilot.SkillsController.Skills.length < this.selectedMin);
    },
    selectionComplete(): boolean {
      return (this.newPilot || this.levelUp) && !this.pilot.SkillsController.IsMissingSkills;
    },
    jumpItems() {
      return [
        ...this.pilot.SkillsController.Skills.map((x) => ({
          title: x.Skill.Trigger,
          value: x.Skill.ID,
          subtitle: `// Pilot Rank: ${x.Rank} (+${x.Bonus})`,
        })),
        ...this.flatSkills
          .filter((x) => !this.pilot.SkillsController.Skills.find((y) => y.Skill.ID === x.ID))
          .map((x) => ({
            title: x.Trigger,
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
    scroll(id) {
      this.scrollTo(`skill_${id}`);
    },
    scrollTo(e: any): void {
      const el = document.getElementById(e);
      if (el) scrollTo(el, this.modal);
    },
  },
};
</script>
