<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs3 class="pr-3">
        <div :class="scrollPosition > 200 ? 'scroll-fix' : ''">
        <v-layout>
          <v-flex style="text-align: center">
          <br>
          <h3>Pilot Skills</h3>
          <hr>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <div v-for="skill in skills" :key="`summary_${skill.id}`">
                <v-layout v-if="skillById(skill.id).err">
                  <v-flex shrink>
                  <span class="grey--text">// MISSING DATA //</span><br><span v-if="skill.brew" class="caption grey--text">({{skill.brew}})</span>
                  </v-flex>
                  <v-flex shrink>
                    <v-btn icon flat color="error" @click="setSkill({id: skill.id, action: 'remove'})"><v-icon>delete</v-icon></v-btn>
                  </v-flex>
                </v-layout>
                <v-layout v-else>
                  <v-flex xs12>
                    <strong>{{skillById(skill.id).trigger}}</strong>
                    <v-tooltip :disabled="!skill.specialty && !skill.flaw" right>
                      <v-chip slot="activator" dark color="primary" small>
                        +<b>{{skill.bonus}}</b>
                      </v-chip>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
            </div>
          </v-flex> 
        </v-layout>
        <v-layout><v-flex xs12><hr></v-flex></v-layout>
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
        </div>
      </v-flex>

      <v-flex id="scroll-area">
        <v-layout>
          <v-flex class="skill-header">
            <h5>&emsp;Your pilot’s ability to use, resist, and apply direct force, physical or otherwise</h5>
          </v-flex>
        </v-layout>
        <skill-selector-item v-for="skill in arrangedSkills.str" :key="skills.length + skill.id" :isNewPilot="newPilot" 
          :skillData="skill" :can-add="canAdd(skill)" :can-subtract="canSubtract(skill)" @skill-click="setSkill" />
        <br>
        <v-layout>
          <v-flex class="skill-header">
            <h5>&emsp;Your pilot’s ability to perform skillfully and accurately under pressure</h5>
          </v-flex>
        </v-layout>
        <skill-selector-item v-for="skill in arrangedSkills.dex" :key="skills.length + skill.id" :isNewPilot="newPilot" 
          :skillData="skill" :can-add="canAdd(skill)" :can-subtract="canSubtract(skill)" @skill-click="setSkill"  />
        <br>
        <v-layout>
          <v-flex class="skill-header">
            <h5>&emsp;Your pilot’s ability to notice details, think creatively, and prepare</h5>
          </v-flex>
        </v-layout>
        <skill-selector-item v-for="skill in arrangedSkills.int" :key="skills.length + skill.id" :isNewPilot="newPilot" 
          :skillData="skill" :can-add="canAdd(skill)" :can-subtract="canSubtract(skill)" @skill-click="setSkill"  />
        <br>
        <v-layout>
          <v-flex class="skill-header">
            <h5>&emsp;Your pilot’s ability to talk, lead, change minds, make connections, and requisition resources</h5>
          </v-flex>
        </v-layout>
        <skill-selector-item v-for="skill in arrangedSkills.cha" :key="skills.length + skill.id" :isNewPilot="newPilot" 
          :skillData="skill" :can-add="canAdd(skill)" :can-subtract="canSubtract(skill)" @skill-click="setSkill" />
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
  import SkillSelectorItem from './SkillSelectorItem'

  function skillSort (skills) {
    return skills.sort(function (a, b) {
      if (a.specialty && !b.specialty) return -1
      else if (!a.specialty && b.specialty) return 1
      else if (a.flaw && !b.flaw) return 1
      else if (!a.flaw && b.flaw) return -1
      else return 0
    })
  }

  export default {
    name: 'skill-selector',
    props: {
      pilotSkills: {
        type: Array
      },
      pilotLevel: {
        type: Number
      },
      newPilot: {
        type: Boolean
      },
      levelUp: {
        type: Boolean
      }
    },
    data: () => ({
      skills: [],
      pointLimit: false,
      skillData: [],
      arrangedSkills: [],
      pLevel: 0,
      scrollPosition: null
    }),
    components: { SkillSelectorItem },
    computed: {
      points: function () {
        return {
          pointsCurrent: (this.skills.reduce((a, b) => +a + +b.bonus, 0)) / 2,
          pointsMax: 4 + this.pLevel,
          selectedCurrent: this.skills.filter(x => x.bonus).length,
          selectedMin: 4
        }
      },
      selectionComplete: function () {
        return this.points.pointsCurrent === this.points.pointsMax &&
          this.points.selectedCurrent >= this.points.selectedMin
      }
    },
    methods: {
      setSkill (selectionEvent) {
        var selectedIndex = this.skills.findIndex(x => x.id === selectionEvent.id)
        if (selectedIndex === -1) {
          switch (selectionEvent.action) {
            case ('addBonus'):
              var newSkill = {id: selectionEvent.id, bonus: 2}
              if (selectionEvent.brew) newSkill.brew = selectionEvent.brew
              this.skills.push(newSkill)
              break
            default:
              break
          }
        } else {
          var s = JSON.parse(JSON.stringify(this.skills[selectedIndex]))
          switch (selectionEvent.action) {
            case ('addBonus'):
              s.bonus += 2
              this.$set(this.skills, selectedIndex, s)
              break
            case ('subtractBonus'):
              s.bonus -= 2
              if (s.bonus === 0 && !(s.specialty || s.flaw)) this.skills.splice(selectedIndex, 1)
              else this.$set(this.skills, selectedIndex, s)
              break
            case ('remove'):
              this.skills.splice(selectedIndex, 1)
              break
            default:
              break
          }
        }
        this.$forceUpdate()
        this.pointLimit = this.points.pointsCurrent >= this.points.pointsMax
        this.skills = skillSort(this.skills)

        if ((this.newPilot || this.levelUp) && this.selectionComplete) {
          if (this.levelUp) this.$emit('set-skills', this.skills)
          window.scrollTo(0, document.body.scrollHeight)
        }
      },
      saveSkills () {
        this.$emit('set-skills', this.skills)
      },
      resetSkills () {
        this.skills.splice(0, this.skills.length)
        this.$forceUpdate()
        this.pointLimit = false
        this.skills = skillSort(this.skills)
      },
      skillById: function (id) {
        return this.skillData.find(x => x.id === id) || {err: true}
      },
      initialize: function () {
        this.pLevel = this.pilotLevel
        this.skills = skillSort(JSON.parse(JSON.stringify(this.pilotSkills)))
        this.pointLimit = this.points.pointsCurrent >= this.points.pointsMax
      },
      canAdd: function (skill) {
        if (this.newPilot) {
          return this.skills.length < 4
        } else {
          var s = this.skills.find(x => x.id === skill.id)
          var underLimit = this.points.pointsCurrent < this.points.pointsMax
          return s ? underLimit && s.bonus < 6 : underLimit
        }
      },
      canSubtract: function (skill) {
        return this.skills.some(x => x.id === skill.id)
      }
    },
    mounted () {
      this.pLevel = this.pilotLevel ? this.pilotLevel : 0
      this.skills = this.newPilot ? skillSort(this.pilotSkills) : skillSort(JSON.parse(JSON.stringify(this.pilotSkills)))
      this.pointLimit = this.points.pointsCurrent >= this.points.pointsMax
      this.skillData = this.$store.getters.getItemCollection('Skills')
      this.arrangedSkills = {
        str: this.skillData.filter(x => x.family === 'str'),
        dex: this.skillData.filter(x => x.family === 'dex'),
        int: this.skillData.filter(x => x.family === 'int'),
        cha: this.skillData.filter(x => x.family === 'cha')
      }
    }
  }
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
   padding-top: 5px;
 }

 strong {
    min-height: 30px;
    display: inline-flex;
    align-items: center;
  }
</style>

