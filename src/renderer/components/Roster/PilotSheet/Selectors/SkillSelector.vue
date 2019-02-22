<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs3>
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
                <v-layout>
                  <v-flex xs12>
                    <strong>{{skillById(skill.id).trigger}}</strong>
                    <v-tooltip :disabled="!skill.specialty && !skill.flaw" right>
                      <v-chip slot="activator"
                        :dark="!skill.specialty || !skill.flaw" 
                        :color="chipColor(skill)"
                        small>
                        <v-avatar v-if="skill.specialty && skill.flaw"><v-icon small>trending_flat</v-icon></v-avatar>
                        <v-avatar v-else-if="skill.specialty"><v-icon small>star</v-icon></v-avatar>
                        <v-avatar v-else-if="skill.flaw"><v-icon small>thumb_down</v-icon></v-avatar>
                        +<b>{{skill.bonus}}</b>
                      </v-chip>
                      <span v-if="skill.specialty && skill.flaw">+0 Accuracy</span>
                      <span v-else-if="skill.specialty">+1 Accuracy</span>
                      <span v-else-if="skill.flaw">-1 Accuracy</span>
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
            <v-alert outline color="warning" icon="priority_high" :value="points.specialtyCurrent < points.specialtyMax">
              {{points.specialtyCurrent}}/{{points.specialtyMax}} Specialties selected
            </v-alert>
            <v-alert outline color="warning" icon="priority_high" :value="points.flawCurrent < points.flawMax">
              {{points.flawCurrent}}/{{points.flawMax}} Flaws selected
            </v-alert>
            <v-alert outline color="warning" icon="priority_high" :value="points.selectedCurrent < points.selectedMin">
              Must select a minimum of {{points.selectedMin}} skills
            </v-alert>
            <v-btn v-if="!newPilot || !this.levelUp" block :disabled="!selectionComplete" @click="saveSkills">Save</v-btn>
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
          :skillData="skill" :skills="skills" @skill-click="setSkill" />
        <br>
        <v-layout>
          <v-flex class="skill-header">
            <h5>&emsp;Your pilot’s ability to perform skillfully and accurately under pressure</h5>
          </v-flex>
        </v-layout>
        <skill-selector-item v-for="skill in arrangedSkills.dex" :key="skills.length + skill.id" :isNewPilot="newPilot" 
          :skillData="skill" :skills="skills" @skill-click="setSkill"  />
        <br>
        <v-layout>
          <v-flex class="skill-header">
            <h5>&emsp;Your pilot’s ability to notice details, think creatively, and prepare</h5>
          </v-flex>
        </v-layout>
        <skill-selector-item v-for="skill in arrangedSkills.int" :key="skills.length + skill.id" :isNewPilot="newPilot" 
          :skillData="skill" :skills="skills" @skill-click="setSkill"  />
        <br>
        <v-layout>
          <v-flex class="skill-header">
            <h5>&emsp;Your pilot’s ability to talk, lead, change minds, make connections, and requisition resources</h5>
          </v-flex>
        </v-layout>
        <skill-selector-item v-for="skill in arrangedSkills.cha" :key="skills.length + skill.id" :isNewPilot="newPilot" 
          :skillData="skill" :skills="skills" @skill-click="setSkill" />
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
      specializeLimit: false,
      flawLimit: false,
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
          specialtyCurrent: this.skills.filter(x => x.specialty).length,
          specialtyMax: 2 + Math.floor(this.pLevel / 3),
          flawCurrent: this.skills.filter(x => x.flaw).length,
          flawMax: 2,
          selectedCurrent: this.skills.filter(x => x.bonus).length,
          selectedMin: 4
        }
      },
      selectionComplete: function () {
        return this.points.pointsCurrent === this.points.pointsMax &&
          this.points.specialtyCurrent === this.points.specialtyMax &&
          this.points.flawCurrent === this.points.flawMax &&
          this.points.selectedCurrent >= this.points.selectedMin
      }
    },
    methods: {
      setSkill (selectionEvent) {
        var selectedIndex = this.skills.findIndex(x => x.id === selectionEvent.id)
        if (selectedIndex === -1) {
          switch (selectionEvent.action) {
            case ('addBonus'):
              this.skills.push({id: selectionEvent.id, bonus: 2})
              break
            case ('toggleSpecialty'):
              this.skills.push({id: selectionEvent.id, bonus: 0, specialty: true})
              break
            case ('toggleFlaw'):
              this.skills.push({id: selectionEvent.id, bonus: 0, flaw: true})
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
            case ('toggleSpecialty'):
              s.specialty = !s.specialty
              if (s.bonus === 0 && !(s.specialty || s.flaw)) this.skills.splice(selectedIndex, 1)
              else this.$set(this.skills, selectedIndex, s)
              break
            case ('toggleFlaw'):
              s.flaw = !s.flaw
              if (s.bonus === 0 && !(s.specialty || s.flaw)) this.skills.splice(selectedIndex, 1)
              else this.$set(this.skills, selectedIndex, s)
              break
            default:
              break
          }
        }
        this.$forceUpdate()
        this.pointLimit = this.points.pointsCurrent >= this.points.pointsMax
        this.specializeLimit = this.points.specialtyCurrent >= this.points.specialtyMax
        this.flawLimit = this.points.flawCurrent >= this.points.flawMax
        this.skills = skillSort(this.skills)

        if ((this.newPilot || this.levelUp) && this.selectionComplete) {
          window.scrollTo(0, document.body.scrollHeight)
        }
      },
      saveSkills () {
        this.$emit('set-skills', this.skills)
      },
      resetSkills () {
        this.skills.splice(0, this.skills.length)
        this.$forceUpdate()
        this.pointLimit = this.points.pointsCurrent >= this.points.pointsMax
        this.specializeLimit = this.points.specialtyCurrent >= this.points.specialtyMax
        this.flawLimit = this.points.flawCurrent >= this.points.flawMax
        this.skills = skillSort(this.skills)
      },
      skillById: function (id) {
        return this.skillData.find(x => x.id === id)
      },
      chipColor: function (skill) {
        if ((skill.specialty && skill.flaw)) return ''
        if (skill.specialty) return 'green'
        else if (skill.flaw) return 'red'
        else return 'blue'
      },
      initialize: function () {
        this.pLevel = this.pilotLevel
        this.skills = skillSort(JSON.parse(JSON.stringify(this.pilotSkills)))
        this.pointLimit = this.points.pointsCurrent >= this.points.pointsMax
        this.specializeLimit = this.points.specialtyCurrent >= this.points.specialtyMax
        this.flawLimit = this.points.flawCurrent >= this.points.flawMax
      }
    },
    mounted () {
      if (this.newPilot) this.pLevel = 0
      else this.pLevel = this.pilotLevel
      this.skills = (this.pLevel || this.newPilot) === 0 ? skillSort(this.pilotSkills) : skillSort(JSON.parse(JSON.stringify(this.pilotSkills)))
      this.pointLimit = this.points.pointsCurrent >= this.points.pointsMax
      this.specializeLimit = this.points.specialtyCurrent >= this.points.specialtyMax
      this.flawLimit = this.points.flawCurrent >= this.points.flawMax
      this.skillData = this.$store.getters.getItemCollection('Skills')
      this.arrangedSkills = {
        str: this.skillData.filter(x => x.family === 'str'),
        dex: this.skillData.filter(x => x.family === 'dex'),
        int: this.skillData.filter(x => x.family === 'int'),
        cha: this.skillData.filter(x => x.family === 'cha')
      }

      var vm = this
      window.addEventListener('scroll', function (e) {
        vm.scrollPosition = window.scrollY
      })
    },
    destroy () {
      window.removeEventListener('scroll', this.updateScroll)
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

