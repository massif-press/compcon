<template>
  <selector
    title="Pilot Skill Triggers"
    height="60vh"
    :success="!pilot.IsMissingSkills && !(points.selectedCurrent < points.selectedMin)"
  >
    <template v-slot:left-column>
      <div v-for="(pSkill, i) in pilot.Skills" :key="`summary_${pSkill.Skill.ID}_${i}`">
        <v-row v-if="pSkill.err">
          <v-col shrink>
            <span class="grey--text">// MISSING DATA //</span>
            <br />
          </v-col>
          <v-col shrink>
            <v-btn icon text color="error" @click="subtract(pSkill)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-card v-else text tile outlined width="100%" class="my-1 pa-1">
          <v-chip dark color="primary" small>
            +
            <b>{{ pSkill.Bonus }}</b>
          </v-chip>&nbsp;
          <strong>{{ pSkill.Skill.Trigger }}</strong>
        </v-card>
      </div>
      <v-divider v-if="pilot.Skills.length" class="ma-2 ml-4 mr-4" />
      <v-row>
        <v-col cols="12">
          <v-alert
            outlined
            color="success"
            icon="check_circle"
            class="stat-text"
            :value="!pilot.IsMissingSkills && !(points.selectedCurrent < points.selectedMin)"
          >Skill Selection Complete</v-alert>
          <v-alert
            outlined
            color="primary"
            icon="warning"
            class="stat-text"
            :value="pilot.MaxSkillPoints > pilot.CurrentSkillPoints"
          >{{ pilot.MaxSkillPoints - pilot.CurrentSkillPoints }} Skill Points remaining</v-alert>
          <v-alert
            outlined
            color="primary"
            icon="warning"
            class="stat-text"
            :value="points.selectedCurrent < points.selectedMin"
          >Must select a minimum of {{ points.selectedMin }} skills</v-alert>
          <v-btn block flat small :disabled="!pilot.Skills.length" @click="resetSkills">Reset</v-btn>
        </v-col>
      </v-row>
    </template>

    <template v-slot:right-column>
      <div v-for="h in headers" :key="`h_${h.attr}`" class="mb-4">
        <span class="overline">Your Ability To</span>
        <cc-title small>{{ h.description }}</cc-title>
        <skill-select-item
          v-for="s in skills[h.attr]"
          :key="s.ID"
          :skill="s"
          :bonus="getBonus(s)"
          :canAdd="canAdd(s)"
          :canRemove="canSubtract(s)"
          @add="add(s)"
          @remove="subtract(s)"
        />
      </div>
      <cc-title small>Custom Skill Triggers</cc-title>
      <skill-select-item
        v-for="(cs, i) in customSkills"
        :key="`custom_skill_${i}`"
        custom
        :skill="cs"
        :bonus="getBonus(cs)"
        :canAdd="canAdd(cs)"
        :canRemove="canSubtract(cs)"
        @add="add(cs)"
        @remove="subtract(cs)"
      />
      <add-custom-skill :pilot="pilot" />
    </template>
  </selector>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import SkillSelectItem from './components/_SkillSelectItem.vue'
import Selector from './components/_SelectorBase.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { rules } from 'lancer-data'
import { Pilot, Skill, CustomSkill } from '@/class'

export default Vue.extend({
  name: 'skill-selector',
  components: { Selector, SkillSelectItem },
  props: {
    pilot: Pilot,
    newPilot: Boolean,
    levelUp: Boolean,
  },
  data: () => ({
    skills: [],
    newSkill: '',
    headers: [
      {
        attr: 'str',
        description: 'use, resist, and apply direct force, physical or otherwise',
      },
      {
        attr: 'dex',
        description: 'perform skillfully and accurately under pressure',
      },
      {
        attr: 'int',
        description: 'notice details, think creatively, and prepare',
      },
      {
        attr: 'cha',
        description: 'talk, lead, change minds, make connections, and requisition resources',
      },
    ],
    pLevel: 0,
    scrollPosition: null,
  }),
  computed: {
    customSkills() {
      return this.pilot.Skills.filter(x => x.IsCustom)
    },
    points() {
      return {
        selectedCurrent: this.pilot.Skills.length,
        selectedMin: rules.minimum_pilot_skills,
      }
    },
  },
  created() {
    const compendium = getModule(CompendiumStore, this.$store)
    this.skills = _.groupBy(compendium.Skills, 'Family')
  },
  methods: {
    addCustomSkill() {
      this.pilot.AddSkill(new CustomSkill(this.newSkill))
      this.newSkill = ''
    },
    getBonus(skill: Skill) {
      return this.pilot.has('Skill', skill.ID)
        ? this.pilot.skills.find(x => x.Skill.ID === skill.ID).Bonus
        : 0
    },
    add(skill: Skill) {
      var vm = this as any
      vm.pilot.AddSkill(skill)

      if ((vm.newPilot || vm.levelUp) && !vm.pilot.IsMissingSkills) {
        window.scrollTo(0, document.body.scrollHeight)
      }
    },
    subtract(skill: Skill) {
      this.pilot.RemoveSkill(skill)
    },
    close() {
      this.$emit('close')
    },
    resetSkills() {
      this.pilot.ClearSkills()
    },
    canAdd(skill: Skill) {
      var vm = this as any
      if (vm.newPilot) {
        return vm.pilot.Skills.length < 4 && !vm.pilot.has('Skill', skill.ID)
      } else {
        const underLimit = vm.pilot.CurrentSkillPoints < vm.pilot.MaxSkillPoints
        if (!vm.pilot.has('Skill', skill.ID) && underLimit) return true
        const pSkill = this.pilot.Skills.find(x => x.Skill.ID === skill.ID)
        return underLimit && pSkill && pSkill.Rank < rules.max_trigger_rank
      }
    },
    canSubtract(skill: Skill) {
      var vm = this as any
      return vm.pilot.has('Skill', skill.ID)
    },
  },
})
</script>

<style scoped>
.scroll-fix {
  margin: -25vh 0px;
  position: fixed;
  width: 20vw;
}

#scroll-area {
  overflow-y: scroll;
}

strong {
  min-height: 30px;
  display: inline-flex;
  align-items: center;
}
</style>
