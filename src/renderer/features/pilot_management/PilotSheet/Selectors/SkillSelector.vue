<template>
  <selector title="Pilot Skill Triggers">
    <template v-slot:left-column>
      <v-layout>
        <v-flex xs12>
          <div v-for="skill in skills" :key="`summary_${skill.id}`">
            <v-layout v-if="skillById(skill.id).err">
              <v-flex shrink>
              <span class="grey--text">// MISSING DATA //</span><br>
              <span v-if="skill.brew" class="caption grey--text">({{skill.brew}})</span>
              </v-flex>
              <v-flex shrink>
                <v-btn icon flat color="error" @click="setSkill({id: skill.id, action: 'remove'})"><v-icon>delete</v-icon></v-btn>
              </v-flex>
            </v-layout>
            <v-layout v-else>
              <v-flex xs12>
                <v-chip dark color="primary" outline small>+<b>{{skill.bonus}}</b></v-chip>
                <strong>{{skillById(skill.id).trigger}}</strong>
              </v-flex>
            </v-layout>
          </div>
        </v-flex> 
      </v-layout>
      <v-divider class="ma-2 ml-4 mr-4" />
      <v-layout>
        <v-flex xs12>
          <v-alert outline color="success" icon="check_circle" :value="selectionComplete">
            Skill Selection Complete
          </v-alert>
          <v-alert outline color="warning" icon="priority_high" :value="points.pointsMax > points.pointsCurrent">
            {{points.pointsMax  - points.pointsCurrent}} Skill Points remaining
          </v-alert>
          <v-alert outline color="warning" icon="priority_high" :value="points.selectedCurrent < points.selectedMin">
            Must select a minimum of {{points.selectedMin}} skills
          </v-alert>
          <v-btn v-if="!newPilot && !levelUp" block :disabled="!selectionComplete" @click="saveSkills" color="primary">Save</v-btn>
          <v-btn block flat small :disabled="!skills.length" @click="resetSkills">Reset</v-btn>
        </v-flex>
      </v-layout>  
    </template>

    <template v-slot:right-column>
      <div v-for="h in headers" :key="`h_${h.attr}`" class="mb-4">
        <v-flex class="skill-header minor-title" v-html="h.description" />
        <v-layout v-for="skill in arrangedSkills[h.attr]" :key="skills.length + skill.id">
          <v-flex xs11><skill-item :skillData="skill"/></v-flex>
          <v-flex>
            <v-card style="height: 100%" class="text-xs-center ma-0 pa-0">
              <div class="centered">
                <v-tooltip top>
                  <v-btn class="ma-0" color="primary" icon flat slot="activator" :disabled="!canAdd(skill)" @click="add(skill)">
                    <v-icon v-html="newPilot ? 'check' : 'arrow_upward'" />
                  </v-btn>
                  <span>Increase Skill Bonus</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-btn class="ma-0" icon flat slot="activator" :disabled="!canSubtract(skill)" @click="subtract(skill)">
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
  import {SkillItem} from '../SheetComponents'
  import Selector from './Selector.vue'
  import {rules} from 'lancer-data'

  export default Vue.extend({
    name: 'skill-selector',
    props: {
      pilotSkills:  Array,
      pilotLevel: Number,
      newPilot: Boolean,
      levelUp:  Boolean,
    },
    data: () => ({
      skills: [],
      headers: [{
          attr: 'str',
          description: 'Your pilot’s ability to use, resist, and apply direct force, physical or otherwise'
        },{
          attr: 'dex',
          description: 'Your pilot’s ability to perform skillfully and accurately under pressure'
        },{
          attr: 'int',
          description: 'Your pilot’s ability to notice details, think creatively, and prepare'
        },{
          attr: 'cha',
          description: 'Your pilot’s ability to talk, lead, change minds, make connections, and requisition resources'
        },
      ],
      skillData: [],
      arrangedSkills: [],
      pLevel: 0,
      scrollPosition: null
    }),
    components: { Selector, SkillItem },
    computed: {
      points () {
        var vm = this as any
        return {
          pointsCurrent: (vm.skills.reduce((a: any, b: any) => +a + +b.bonus, 0)) / 2,
          pointsMax: rules.minimum_pilot_skills + vm.pLevel,
          selectedCurrent: vm.skills.filter((x: any) => x.bonus).length,
          selectedMin: rules.minimum_pilot_skills
        }
      },
      selectionComplete (): boolean {
        var vm = this as any
        return vm.points.pointsCurrent === vm.points.pointsMax &&
          vm.points.selectedCurrent >= vm.points.selectedMin
      }
    },
    methods: {
      add (skill) {
        var vm = this as any
        var selectedIndex = vm.skills.findIndex((x: any) => x.id === skill.id)
        if (selectedIndex === -1) {
          vm.skills.push({
            id: skill.id,
            bonus: 2,
            brew: skill.brew || null
          })
        } else {
          var s = JSON.parse(JSON.stringify(vm.skills[selectedIndex])) // to maintain Vue reactivity
          s.bonus += 2
          Vue.set(vm.skills, selectedIndex, s)
        }

        if ((vm.newPilot || vm.levelUp) && vm.selectionComplete) {
          if (vm.levelUp) vm.$emit('set-skills', vm.skills)
          window.scrollTo(0, document.body.scrollHeight)
        }
      },
      subtract (skill) {
        var vm = this as any
        var selectedIndex = vm.skills.findIndex((x: any) => x.id === skill.id)
        if (selectedIndex === -1) return
        var s = JSON.parse(JSON.stringify(vm.skills[selectedIndex])) // "
        if (s.bonus === 2) {
          vm.skills.splice(selectedIndex, 1) 
        } else {
          var s = JSON.parse(JSON.stringify(vm.skills[selectedIndex])) // "
          s.bonus -= 2
          Vue.set(vm.skills, selectedIndex, s)
        }
      },
      saveSkills () {
        var vm = this as any
        vm.$emit('set-skills', vm.skills)
      },
      resetSkills () {
        var vm = this as any
        vm.skills.splice(0, vm.skills.length)
        vm.$forceUpdate()
      },
      skillById (id) {
        var vm = this as any
        return vm.skillData.find((x: any) => x.id === id) || {err: true}
      },
      canAdd (skill) {
        var vm = this as any
        if (vm.newPilot) {
          return vm.skills.length < 4 && !vm.skills.find((x: any) => x.id === skill.id)
        } else {
          var s = vm.skills.find((x: any) => x.id === skill.id)
          var underLimit = vm.points.pointsCurrent < vm.points.pointsMax
          return s ? underLimit && s.bonus < 6 : underLimit
        }
      },
      canSubtract (skill) {
        var vm = this as any
        return vm.skills.some((x: any) => x.id === skill.id)
      }
    },
    created () {
      var vm = this as any
      vm.skillData = vm.$store.getters['getItemCollection']('Skills')
      vm.arrangedSkills = {
        str: vm.skillData.filter((x: any) => x.family === 'str'),
        dex: vm.skillData.filter((x: any) => x.family === 'dex'),
        int: vm.skillData.filter((x: any) => x.family === 'int'),
        cha: vm.skillData.filter((x: any) => x.family === 'cha')
      }
    },
    mounted () {
      var vm = this as any
      vm.pLevel = vm.pilotLevel ? vm.pilotLevel : 0
      vm.skills = vm.newPilot ? vm.pilotSkills : JSON.parse(JSON.stringify(vm.pilotSkills))
    }
  })
</script>

<style scoped>

.scroll-fix{
  margin: -25vh 0px;
  position: fixed;
  width: 20vw;
}

 #scroll-area {
   overflow-y: scroll;
 }

 .skill-header {
   text-align: center;
   padding: 5px
 }

 strong {
    min-height: 30px;
    display: inline-flex;
    align-items: center;
  }
</style>

