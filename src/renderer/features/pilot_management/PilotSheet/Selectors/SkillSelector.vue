<template>
  <selector title="Pilot Skill Triggers">
    <template v-slot:left-column>
      <v-layout>
        <v-flex xs12>
          <div v-for="(pSkill, i) in pilot.Skills" :key="`summary_${pSkill.Skill.ID}_${i}`">
            <v-layout v-if="pSkill.err">
              <v-flex shrink>
                <span class="grey--text">// MISSING DATA //</span>
                <br />
              </v-flex>
              <v-flex shrink>
                <v-btn icon flat color="error" @click="subtract(pSkill)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-layout v-else>
              <v-flex xs12>
                <v-chip dark color="primary" outline small>
                  +
                  <b>{{ pSkill.Bonus }}</b>
                </v-chip>
                <strong>{{ pSkill.Skill.Trigger }}</strong>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
      <v-divider class="ma-2 ml-4 mr-4" />
      <v-layout>
        <v-flex xs12>
          <v-alert
            outline
            color="success"
            icon="check_circle"
            :value="!pilot.IsMissingSkills && !(points.selectedCurrent < points.selectedMin)"
          >
            Skill Selection Complete
          </v-alert>
          <v-alert
            outline
            color="warning"
            icon="priority_high"
            :value="pilot.MaxSkillPoints > pilot.CurrentSkillPoints"
          >
            {{ pilot.MaxSkillPoints - pilot.CurrentSkillPoints }} Skill Points remaining
          </v-alert>
          <v-alert
            outline
            color="warning"
            icon="priority_high"
            :value="points.selectedCurrent < points.selectedMin"
          >
            Must select a minimum of {{ points.selectedMin }} skills
          </v-alert>
          <v-btn block flat small :disabled="!pilot.Skills.length" @click="resetSkills">
            Reset
          </v-btn>
        </v-flex>
      </v-layout>
    </template>

    <template v-slot:right-column>
      <div v-for="h in headers" :key="`h_${h.attr}`" class="mb-4">
        <v-flex class="skill-header minor-title" v-html="h.description" />
        <v-layout v-for="skill in skills[h.attr]" :key="skills.length + skill.ID">
          <v-flex xs11>
            <skill-item :skill="skill" />
          </v-flex>
          <v-flex>
            <v-card style="height: 100%" class="text-center ma-0 pa-0">
              <div class="centered">
                <v-tooltip top>
                  <v-btn
                    class="ma-0"
                    color="primary"
                    icon
                    flat
                    slot="activator"
                    :disabled="!canAdd(skill)"
                    @click="add(skill)"
                  >
                    <v-icon v-html="newPilot ? 'check' : 'arrow_upward'" />
                  </v-btn>
                  <span>Increase Skill Bonus</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn
                    class="ma-0"
                    icon
                    flat
                    slot="activator"
                    :disabled="!canSubtract(skill)"
                    @click="subtract(skill)"
                  >
                    <v-icon v-html="newPilot ? 'cancel' : 'arrow_downward'" />
                  </v-btn>
                  <span v-html="newPilot ? 'Remove Skill Trigger' : 'Decrease Skill Bonus'" />
                </v-tooltip>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </div>

      <div class="mb-4">
        <v-flex class="skill-header minor-title" v-html="'Custom Skill Triggers'" />
        <v-layout>
          <v-flex xs11>
            <v-layout>
              <v-flex xs3>
                <div class="centered text-xs-left pl-3">
                  <span class="subheading font-weight-bold">New Custom Skill</span>
                </div>
              </v-flex>
              <v-flex xs9>
                <v-text-field v-model="newSkill" box hide-details label="New Skill Trigger" />
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-card style="height: 100%" class="text-center ma-0 pa-0">
              <div class="centered">
                <v-tooltip top>
                  <v-btn
                    class="ma-0"
                    color="primary"
                    icon
                    flat
                    slot="activator"
                    :disabled="pilot.CurrentSkillPoints >= pilot.MaxSkillPoints || !newSkill"
                    @click="addCustomSkill()"
                  >
                    <v-icon v-html="'add'" />
                  </v-btn>
                  <span>Add Custom Skill</span>
                </v-tooltip>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout v-for="pskill in customSkills" :key="pskill.Skill.Name">
          <v-flex xs11>
            <skill-item :skill="pskill.Skill" />
          </v-flex>
          <v-flex>
            <v-card style="height: 100%" class="text-center ma-0 pa-0">
              <div class="centered">
                <v-tooltip top>
                  <v-btn
                    class="ma-0"
                    color="primary"
                    icon
                    flat
                    slot="activator"
                    :disabled="!canAdd(pskill.Skill)"
                    @click="add(pskill.Skill)"
                  >
                    <v-icon v-html="newPilot ? 'check' : 'arrow_upward'" />
                  </v-btn>
                  <span>Increase Skill Bonus</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn
                    class="ma-0"
                    icon
                    flat
                    slot="activator"
                    :disabled="!canSubtract(pskill.Skill)"
                    @click="subtract(pskill.Skill)"
                  >
                    <v-icon v-html="newPilot ? 'cancel' : 'arrow_downward'" />
                  </v-btn>
                  <span v-html="newPilot ? 'Remove Skill Trigger' : 'Decrease Skill Bonus'" />
                </v-tooltip>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
    </template>
  </selector>
</template>

<script lang="ts">
import Vue from 'vue'
import io from '@/features/_shared/data_io'
import _ from 'lodash'
import { SkillItem } from '../SheetComponents'
import Selector from './Selector.vue'
import { rules } from 'lancer-data'
import { Pilot, Skill, PilotSkill, CustomSkill } from '@/class'

export default Vue.extend({
  name: 'skill-selector',
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
        description:
          'Your pilot’s ability to use, resist, and apply direct force, physical or otherwise',
      },
      {
        attr: 'dex',
        description: 'Your pilot’s ability to perform skillfully and accurately under pressure',
      },
      {
        attr: 'int',
        description: 'Your pilot’s ability to notice details, think creatively, and prepare',
      },
      {
        attr: 'cha',
        description:
          'Your pilot’s ability to talk, lead, change minds, make connections, and requisition resources',
      },
    ],
    pLevel: 0,
    scrollPosition: null,
  }),
  components: { Selector, SkillItem },
  computed: {
    customSkills() {
      return this.pilot.Skills.filter(x => x.IsCustom)
    },
    points() {
      var vm = this as any
      return {
        selectedCurrent: vm.pilot.Skills.length,
        selectedMin: rules.minimum_pilot_skills,
      }
    },
  },
  methods: {
    addCustomSkill() {
      this.pilot.AddSkill(new CustomSkill(this.newSkill))
      this.newSkill = ''
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
  created() {
    var vm = this as any
    vm.skills = _.groupBy(vm.$store.getters.getItemCollection('Skills'), 'Family')
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

.skill-header {
  text-align: center;
  padding: 5px;
}

strong {
  min-height: 30px;
  display: inline-flex;
  align-items: center;
}
</style>
