<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs3>
        <div id="talents-area">
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
            <v-btn v-if="this.pilotLevel > 0" block :disabled="!selectionComplete" @click="saveTalents">Save</v-btn>
            <v-btn block flat small :disabled="!talents.length" @click="resetTalents">Reset</v-btn>
          </v-flex>
        </v-layout>
        </div>
      </v-flex>


      <v-flex id="list-area">
  <v-expansion-panel expand focusable>
    <v-expansion-panel-content v-for="talent in talentData" :key="talent.id" >
      <v-toolbar-title slot="header">
      <span>{{talent.name}}</span>
      <span v-for="n in playerRank(talent.id)" :key="`${talentData.id}_prank_${n}`"><v-icon>star</v-icon></span>
      </v-toolbar-title>
      <talent-selector-item :talent="talent" :playerRank="playerRank(talent.id)" @add-talent="addTalent" @remove-talent="removeTalent" :pointLimit="pointLimit" :newPilot="pilotLevel === 0"/>
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
    props: ['pilotTalents', 'pilotLevel'],
    components: { TalentSelectorItem },
    data: () => ({
      talents: [],
      pointLimit: false
    }),
    computed: {
      talentData: function () {
        return this.$store.getters.getItemCollection('Talents')
      },
      points: function () {
        return {
          pointsCurrent: (this.talents.reduce((a, b) => +a + +b.rank, 0)),
          pointsMax: 3 + this.pilotLevel,
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
      },
      talentById: function (id) {
        return this.$store.getters.getItemById('Talents', id)
      }
    },
    mounted () {
      this.talents = this.pilotLevel === 0 ? talentSort(this.pilotTalents) : talentSort(JSON.parse(JSON.stringify(this.pilotTalents)))
    }
  }
</script>

<style>
  #talents-area {
    width: 18vw!important;
    margin: -20px auto 0;
    position: fixed;
  }

  #list-area {
    width: 80vw!important;
  }
</style>


