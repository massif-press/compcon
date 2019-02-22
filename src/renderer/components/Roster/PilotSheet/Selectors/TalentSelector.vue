<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs3>
        <div :class="scrollPosition > 200 ? 'scroll-fix' : ''">
        <v-layout>
          <v-flex style="text-align: center">
          <br>
          <h3>Pilot Talents</h3>
          <hr>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <div v-for="talent in talents" :key="`summary_${talent.id}`">
                <v-layout>
                  <v-flex xs12>
                    <strong>{{ talentById(talent.id).name }}</strong>
                    <v-icon v-for="n in talent.rank" :key="talent.rank + n" small>star</v-icon>
                  </v-flex>
                </v-layout>
            </div>
          </v-flex> 
        </v-layout>
        <v-layout><v-flex xs12><hr></v-flex></v-layout>
        <v-layout>
          <v-flex xs12>
            <v-alert outline color="success" icon="check_circle" :value="selectionComplete">
              Talent Selection Complete
            </v-alert>
            <v-alert outline color="warning" icon="priority_high" :value="points.pointsMax > points.pointsCurrent">
              {{points.pointsMax  - points.pointsCurrent}} Talent Points remaining
            </v-alert>
            <v-alert outline color="warning" icon="priority_high" :value="points.selectedCurrent < points.selectedMin">
              Must select a minimum of {{points.selectedMin}} talents
            </v-alert>
            <v-btn v-if="!newPilot" block :disabled="!selectionComplete" @click="saveTalents">Save</v-btn>
            <v-btn block flat small :disabled="!talents.length" @click="resetTalents">Reset</v-btn>
          </v-flex>
        </v-layout>
        </div>
      </v-flex>


      <v-flex id="list-area">
  <v-expansion-panel expand focusable v-model="panels">
    <v-expansion-panel-content v-for="talent in talentData" :key="talent.id" >
      <v-toolbar-title slot="header">
      <span>{{talent.name}}</span>
      <span v-for="n in playerRank(talent.id)" :key="`${talentData.id}_prank_${n}`"><v-icon>star</v-icon></span>
      </v-toolbar-title>
      <talent-selector-item :talent="talent" :playerRank="playerRank(talent.id)" @add-talent="addTalent" @remove-talent="removeTalent" :pointLimit="pointLimit" :newPilot="newPilot"/>
    </v-expansion-panel-content>
  </v-expansion-panel>
      </v-flex></v-layout>
  </v-container>
</template>

<script>
  import TalentSelectorItem from './TalentSelectorItem'

  function talentSort (talents) {
    return talents.sort(function (a, b) {
      return a.rank === b.rank ? 0 : a.rank > b.rank ? -1 : 1
    })
  }

  export default {
    name: 'talent-selector',
    props: {
      pilotTalents: {
        type: Array
      },
      pilotLevel: {
        type: Number
      },
      newPilot: {
        type: Boolean
      }
    },
    components: { TalentSelectorItem },
    data: () => ({
      talents: [],
      pointLimit: false,
      pLevel: 0,
      panels: [],
      scrollPosition: null
    }),
    computed: {
      talentData: function () {
        return this.$store.getters.getItemCollection('Talents')
      },
      points: function () {
        return {
          pointsCurrent: (this.talents.reduce((a, b) => +a + +b.rank, 0)),
          pointsMax: 3 + this.pLevel,
          selectedCurrent: this.talents.length,
          selectedMin: 3
        }
      },
      selectionComplete: function () {
        return this.points.pointsCurrent === this.points.pointsMax &&
          this.points.selectedCurrent >= this.points.selectedMin
      }
    },
    methods: {
      playerRank: function (id) {
        var t = this.talents.find(x => x.id === id)
        return t ? t.rank : 0
      },
      addTalent: function (id) {
        var idx = this.talents.findIndex(x => x.id === id)
        if (idx === -1) {
          this.talents.push({
            id: id,
            rank: 1
          })
        } else {
          this.talents[idx].rank++
        }
        this.pointLimit = this.points.pointsCurrent >= this.points.pointsMax
        this.talents = talentSort(this.talents)

        if (this.newPilot) this.panels = []

        if (this.newPilot && this.pointLimit) {
          window.scrollTo(0, document.body.scrollHeight)
        }
      },
      removeTalent: function (id) {
        var idx = this.talents.findIndex(x => x.id === id)
        if (idx !== -1) {
          this.talents[idx].rank--
          if (this.talents[idx].rank === 0) this.talents.splice(idx, 1)
        }
        this.pointLimit = false
        this.talents = talentSort(this.talents)
      },
      saveTalents () {
        this.$emit('set-talents', this.talents)
      },
      resetTalents () {
        this.talents.splice(0, this.talents.length)
        this.$forceUpdate()
        this.pointLimit = false
        this.panels = []
      },
      talentById: function (id) {
        return this.$store.getters.getItemById('Talents', id)
      },
      initialize () {
        this.talents = talentSort(JSON.parse(JSON.stringify(this.pilotTalents)))
      }
    },
    mounted () {
      if (this.newPilot) this.pLevel = 0
      else this.pLevel = this.pilotLevel
      this.talents = this.pLevel === 0 ? talentSort(this.pilotTalents) : talentSort(JSON.parse(JSON.stringify(this.pilotTalents)))

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

<style>
  .scroll-fix{
    margin: -25vh 0px;
    position: fixed;
    width: 20vw;
  }

  #list-area {
    width: 80vw!important;
  }
</style>


