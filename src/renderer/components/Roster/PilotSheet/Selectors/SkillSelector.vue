<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs3 style="border: 1px solid slategray">
        <v-layout>
          <v-flex style="text-align: center">
            <br>
          <h3>Pilot Skills</h3>
          <hr>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex>
            <div v-for="skill in skills" :key="`summary_${skill.id}`">
                <v-layout>
                  <v-flex xs1><b>+{{skill.bonus}}</b></v-flex>
                  <v-flex>{{skillById(skill.id).trigger}} &nbsp;
                    <b-badge v-if="skill.specialty" variant="success" v-b-tooltip title="+1 Accuracy">Speciality</b-badge> 
                    <b-badge v-else-if="skill.flaw" variant="danger" v-b-tooltip title="-1 Accuracy">Flaw</b-badge> 
                  </v-flex>
                </v-layout>
            </div>
          </v-flex> 
        </v-layout>
        <v-layout><v-flex><hr></v-flex></v-layout>
        <v-layout>
          <v-flex>
            <v-alert outline color="success" :value="selectionComplete" fade>
              Skill Selection Complete
            </v-alert>
            <v-alert outline :value="points.pointsMax > points.pointsCurrent" fade>
              {{points.pointsMax  - points.pointsCurrent}} Skill Points remaining
            </v-alert>
            <v-alert outline :value="points.specialtyCurrent < points.specialtyMax" fade>
              {{points.specialtyCurrent}}/{{points.specialtyMax}} Specialties selected
            </v-alert>
            <v-alert outline color="danger" :value="points.flawCurrent < points.flawMax" fade>
              {{points.flawCurrent}}/{{points.flawMax}} Flaws selected
            </v-alert>
            <v-alert outline color="danger" :value="points.selectedCurrent < points.selectedMin" fade>
              Must select a minimum of {{points.selectedMin}} skills
            </v-alert>
          </v-flex>
        </v-layout>
        <v-layout align-end>
          <v-flex xs12>
            <v-btn block :disabled="!selectionComplete" @click="saveSkills">Save</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex id="scroll-area">
        <v-layout>
          <v-flex class="skill-header">
            <h6>&emsp;Your pilot’s ability to use, resist, and apply direct force, physical or otherwise</h6>
          </v-flex>
        </v-layout>
        <skill-selector-item v-for="skill in arrangedSkills.str" :key="skill.id" 
          :skillData="skill" :skills="skills" @skill-click="setSkill" />
        <br>
        <v-layout>
          <v-flex class="skill-header">
            <h6>&emsp;Your pilot’s ability to perform skillfully and accurately under pressure</h6>
          </v-flex>
        </v-layout>
        <skill-selector-item v-for="skill in arrangedSkills.dex" :key="skill.id" 
          :skillData="skill" :skills="skills" @skill-click="setSkill"  />
        <br>
        <v-layout>
          <v-flex class="skill-header">
            <h6>&emsp;Your pilot’s ability to notice details, think creatively, and prepare</h6>
          </v-flex>
        </v-layout>
        <skill-selector-item v-for="skill in arrangedSkills.int" :key="skill.id" 
          :skillData="skill" :skills="skills" @skill-click="setSkill"  />
        <br>
        <v-layout>
          <v-flex class="skill-header">
            <h6>&emsp;Your pilot’s ability to talk, lead, change minds, make connections, and requisition resources</h6>
          </v-flex>
        </v-layout>
        <skill-selector-item v-for="skill in arrangedSkills.cha" :key="skill.id" 
          :skillData="skill" :skills="skills" @skill-click="setSkill" />
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
  import SkillSelectorItem from './SkillSelectorItem'
  // minimum of 4 skills selected
  // 2 background skills get +1 accuracy (specialty)
  // 2 other skills get -1 accuracy (flawed)
  // minimum bonus is +2
  // every 3 levels you gain a specialty
  // taking a specialty in a flaw cancels it out
  // maximum skill bonus is +6

  function initialData () {
    return {
      skills: [],
      pointLimit: false,
      specializeLimit: false,
      flawLimit: false
    }
  }

  export default {
    name: 'skill-selector',
    props: ['pilotSkills', 'pilotLevel'],
    data: () => ({
      skills: [],
      pointLimit: false,
      specializeLimit: false,
      flawLimit: false
    }),
    components: { SkillSelectorItem },
    computed: {
      skillData: function () {
        return this.$store.getters.getItemCollection('Skills')
      },
      arrangedSkills: function () {
        return {
          str: this.skillData.filter(x => x.family === 'str'),
          dex: this.skillData.filter(x => x.family === 'dex'),
          int: this.skillData.filter(x => x.family === 'int'),
          cha: this.skillData.filter(x => x.family === 'cha')
        }
      },
      points: function () {
        return {
          pointsCurrent: (this.skills.reduce((a, b) => +a + +b.bonus, 0)) / 2,
          pointsMax: 4 + this.pilotLevel,
          specialtyCurrent: this.skills.filter(x => x.specialty).length,
          specialtyMax: 2 + Math.floor(this.pilotLevel / 3),
          flawCurrent: this.skills.filter(x => x.flaw).length,
          flawMax: 2,
          selectedCurrent: this.skills.filter(x => !x.flaw).length,
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
      },
      saveSkills () {
        this.$emit('set-skills', this.skills)
      },
      skillById: function (id) {
        return this.skillData.find(x => x.id === id)
      },
      initialize: function () {
        this.data = initialData()
      }
    },
    mounted () {
      this.skills = JSON.parse(JSON.stringify(this.pilotSkills))
      this.pointLimit = this.points.pointsCurrent >= this.points.pointsMax
      this.specializeLimit = this.points.specialtyCurrent >= this.points.specialtyMax
      this.flawLimit = this.points.flawCurrent >= this.points.flawMax
    }
  }
</script>

<style scoped>
 #scroll-area {
   overflow-y: scroll;
   height: 88vh;
 }

 .skill-header {
   text-align: center;
   padding-top: 5px;
 }
</style>

