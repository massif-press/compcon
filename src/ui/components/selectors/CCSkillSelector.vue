<template>
  <selector
    title="Pilot Skill Triggers"
    height="60vh"
    :success="!pilot.SkillsController.IsMissingSkills && enoughSelections"
  >
    <template v-slot:left-column>
      <div
        v-for="(pSkill, i) in pilot.SkillsController.Skills"
        :key="`summary_${pSkill.Skill.ID}_${i}`"
        @click="scroll(pSkill.Skill.ID)"
      >
        <missing-item
          v-if="pSkill.Skill.err"
          @remove="pilot.SkillsController.RemoveSkill(pSkill)"
        />
        <v-chip v-else label color="panel" style="width: 100%" class="my-1 pa-1">
          <v-chip dark color="accent" small>
            +
            <b>{{ pSkill.Bonus }}</b>
          </v-chip>
          &nbsp;
          <strong>{{ pSkill.Skill.Trigger }}</strong>
        </v-chip>
      </div>
      <v-divider v-if="pilot.SkillsController.Skills.length" class="ma-2 ml-4 mr-4" />
      <v-row>
        <v-col>
          <v-alert
            outlined
            :prominent="$vuetify.breakpoint.mdAndUp"
            dense
            border="left"
            color="success"
            icon="check_circle"
            class="stat-text"
            :value="!pilot.SkillsController.IsMissingSkills && enoughSelections"
          >
            Skill Selection Complete
          </v-alert>
          <v-alert
            outlined
            :prominent="$vuetify.breakpoint.mdAndUp"
            dense
            border="left"
            color="accent"
            icon="warning"
            class="stat-text"
            :value="
              pilot.SkillsController.MaxSkillPoints > pilot.SkillsController.CurrentSkillPoints
            "
          >
            {{ pilot.SkillsController.MaxSkillPoints - pilot.SkillsController.CurrentSkillPoints }}
            Skill Points remaining
          </v-alert>
          <v-alert
            outlined
            :prominent="$vuetify.breakpoint.mdAndUp"
            dense
            border="left"
            color="accent"
            icon="warning"
            class="stat-text"
            :value="!enoughSelections"
          >
            Must select a minimum of {{ selectedMin }} skills
          </v-alert>
          <v-btn
            block
            text
            small
            :disabled="!pilot.SkillsController.Skills.length"
            @click="pilot.SkillsController.ClearSkills()"
          >
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </template>

    <template v-slot:right-column>
      <div v-for="h in headers" :key="`h_${h.attr}`" class="mb-4">
        <v-divider v-if="$vuetify.breakpoint.smAndDown" class="my-2" />
        <span v-if="h.attr !== 'Custom'" class="overline">Your Ability To</span>
        <cc-title v-if="$vuetify.breakpoint.mdAndUp" small>{{ h.description }}</cc-title>
        <div v-else class="heading h3 accent--text mb-1">
          {{ h.description }}
        </div>
        <skill-select-item
          v-for="(s, i) in skills[h.attr]"
          :id="`skill_${s.ID}`"
          :key="`skill_${h.attr}_${i}`"
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
import Vue from 'vue'
import SkillSelectItem from './components/_SkillSelectItem.vue'
import AddCustomSkill from './components/_AddCustomSkill.vue'
import MissingItem from './components/_MissingItem.vue'
import Selector from './components/_SelectorBase.vue'
import { getModule } from 'vuex-module-decorators'
import { CompendiumStore } from '@/store'
import { Rules, Pilot } from '@/class'
import { rules } from '@massif/lancer-data'

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
      const cs = this.pilot.SkillsController.Skills.filter(x => x.IsCustom)
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
      return !(this.pilot.SkillsController.Skills.length < this.selectedMin)
    },
    selectionComplete(): boolean {
      return (this.newPilot || this.levelUp) && !this.pilot.SkillsController.IsMissingSkills
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
  methods: {
    scroll(id) {
      if (this.levelUp)
        this.$vuetify.goTo(`#skill_${id}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
        })
      else
        this.$vuetify.goTo(`#skill_${id}`, {
          duration: 150,
          easing: 'easeInOutQuad',
          offset: 25,
          container: '.v-dialog--active',
        })
    },
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
