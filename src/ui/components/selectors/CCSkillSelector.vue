<template>
  <selector
    title="Pilot Skill Triggers"
    :success="!pilot.SkillsController.IsMissingSkills && enoughSelections"
  >
    <template #left-column>
      <div
        v-for="pSkill in pilot.SkillsController.Skills"
        label
        color="panel"
        style="width: 100%"
        class="ma-1"
        @click="scroll(pSkill.Skill.ID)"
      >
        <v-chip dark color="accent">
          +
          <b>{{ pSkill.Bonus }}</b>
        </v-chip>
        &nbsp;
        <b class="text-stark">{{ pSkill.Skill.Trigger }}</b>
      </div>
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
            text="Skill Selection Complete"
          />
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
            Skill Points remaining`"
          />

          <v-alert
            v-show="!enoughSelections"
            variant="outlined"
            density="compact"
            color="accent"
            icon="mdi-alert"
            class="stat-text py-1 mb-2"
            :text="`Must select a minimum of ${selectedMin} skills`"
          />
          <v-btn
            block
            variant="text"
            :disabled="!pilot.SkillsController.Skills.length"
            @click="pilot.SkillsController.ClearSkills()"
          >
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <template #right-column>
      <div v-for="h in headers" class="mb-4">
        <div v-if="h.attr !== 'Custom'" class="text-overline">Your Ability To</div>
        <cc-title small class="py-1 mb-2">{{ h.description }}</cc-title>
        <skill-select-item
          v-for="s in skills[h.attr]"
          :id="`skill_${s.ID}`"
          :skill="s"
          :can-add="pilot.SkillsController.CanAddSkill(s)"
          :can-remove="pilot.SkillsController.CanRemoveSkill(s)"
          @add="pilot.SkillsController.AddSkill(s)"
          @remove="pilot.SkillsController.RemoveSkill(s)"
        />
      </div>
      <add-custom-skill
        :pilot="pilot"
        @add-custom="pilot.SkillsController.AddCustomSkill($event)"
      />
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

import _ from 'lodash';

export default {
  name: 'skill-selector',
  components: { Selector, SkillSelectItem, AddCustomSkill, MissingItem },
  props: {
    pilot: { type: Pilot, required: true },
    levelUp: Boolean,
  },
  data: () => ({
    staticSkills: [] as any,
    headers: [] as any[],
  }),
  computed: {
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
  },
  watch: {
    selectionComplete(bool) {
      if (bool) window.scrollTo(0, document.body.scrollHeight);
    },
  },
  created() {
    const compendium = CompendiumStore();
    this.staticSkills = _.groupBy(compendium.Skills, 'Family');
    this.headers = rules.skill_headers;
  },
  methods: {
    scroll(id) {
      if (this.levelUp) this.scrollTo(`#skill_${id}`);
      else this.scrollTo(`#skill_${id}`);
    },
    scrollTo(e: any): void {
      const el = document.getElementById(e);
      if (el) {
        const yOffset = -60;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
  },
};
</script>
