<template>
  <selector
    title="Pilot Skill Triggers"
    height="60vh"
    :success="!pilot.IsMissingSkills && enoughSelections"
  >
    <template v-slot:left-column>
      <div v-for="(pSkill, i) in pilot.Skills" :key="`summary_${pSkill.Skill.ID}_${i}`">
        <missing-item v-if="pSkill.Skill.err" @remove="pilot.RemoveSkill(pSkill)" />
        <v-chip v-else label color="panel" style="width: 100%" class="my-1 pa-1">
          <v-chip dark color="accent" small>
            +
            <b>{{ pSkill.Bonus }}</b>
          </v-chip>
          &nbsp;
          <strong>{{ pSkill.Skill.Trigger }}</strong>
        </v-chip>
      </div>
      <v-divider v-if="pilot.Skills.length" class="ma-2 ml-4 mr-4" />
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
            :value="!pilot.IsMissingSkills && enoughSelections"
          >
            Skill Selection Complete
          </v-alert>
          <v-alert
            outlined
            prominent
            dense
            border="left"
            color="accent"
            icon="warning"
            class="stat-text"
            :value="pilot.MaxSkillPoints > pilot.CurrentSkillPoints"
          >
            {{ pilot.MaxSkillPoints - pilot.CurrentSkillPoints }} Skill Points remaining
          </v-alert>
          <v-alert
            outlined
            prominent
            dense
            border="left"
            color="accent"
            icon="warning"
            class="stat-text"
            :value="!enoughSelections"
          >
            Must select a minimum of {{ selectedMin }} skills
          </v-alert>
          <v-btn block text small :disabled="!pilot.Skills.length" @click="pilot.ClearSkills()">
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <template v-slot:right-column>
      <div v-for="h in headers" :key="`h_${h.attr}`" class="mb-4">
        <span v-if="h.attr !== 'Custom'" class="overline">Your Ability To</span>
        <cc-title small>{{ h.description }}</cc-title>
        <skill-select-item
          v-for="(s, i) in skills[h.attr]"
          :key="`skill_${h.attr}_${i}`"
          :skill="s"
          :canAdd="pilot.CanAddSkill(s)"
          :canRemove="pilot.CanRemoveSkill(s)"
          @add="pilot.AddSkill(s)"
          @remove="pilot.RemoveSkill(s)"
        />
      </div>
      <add-custom-skill :pilot="pilot" @add-custom="pilot.AddCustomSkill($event)" />
    </template>
  </selector>
</template>

<script lang="ts">
import Vue from 'vue'
import SkillSelectItem from './components/_SkillSelectItem.vue'
import AddCustomSkill from './components/_AddCustomSkill.vue'
import MissingItem from './components/_MissingItem.vue'
import Selector from './components/_SelectorBase.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { Rules, Pilot } from '@/class'
import { rules } from 'lancer-data'

export default Vue.extend({
  name: 'skill-selector',
  components: { Selector, SkillSelectItem, AddCustomSkill, MissingItem },
  props: {
    pilot: Pilot,
    levelUp: Boolean,
  },
  data: () => ({
    staticSkills: [],
    headers: [],
  }),
  computed: {
    skills() {
      const cs = this.pilot.Skills.filter(x => x.IsCustom)
      if (cs.length) return { ...this.staticSkills, Custom: cs.map(x => x.Skill) }
      return this.staticSkills
    },
    newPilot(): boolean {
      return this.pilot.Level === 0
    },
    selectedMin(): number {
      return Rules.MinimumPilotSkills
    },
    enoughSelections(): boolean {
      return !(this.pilot.Skills.length < this.selectedMin)
    },
    selectionComplete(): boolean {
      return (this.newPilot || this.levelUp) && !this.pilot.IsMissingSkills
    },
  },
  watch: {
    selectionComplete(bool) {
      if (bool) window.scrollTo(0, document.body.scrollHeight)
    },
  },
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.staticSkills = this.$_.groupBy(compendium.Skills, 'Family')
    this.headers = rules.skill_headers
  },
})
</script>

<style scoped>
strong {
  min-height: 30px;
  display: inline-flex;
  align-items: center;
}
</style>
