<template>
  <div>
    <v-layout row align-center justify-center>
      <span class="title">{{pilot.callsign}}</span>
    </v-layout>
    <v-divider />
    <v-container grid-list-xl text-xs-center class="mt-0 pt-0 mb-0 pb-0">
      <v-layout row justify-space-between>
        <v-flex>
          <b>Selected Advancements for License Level {{pilot.level}}:</b>
        </v-flex>
      </v-layout>

      <v-layout class="headline">Skills</v-layout>
      <v-layout row wrap justify-space-between>
        <v-flex v-for="diff in arrDiff('id', 'skills', 'bonus')" :key="diff.id">
          <v-card color="grey lighten-3" elevation=10>
            <v-card-text class="bigtext">
              <b>{{getSkill(diff.id).trigger}} <span class="primary--text">+{{diff.bonus}}</span></b>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout class="headline">Talents</v-layout>
      <v-layout row wrap justify-space-between>
        <v-flex v-for="diff in arrDiff('id','talents', 'rank')" :key="diff.id">
          <v-card color="grey lighten-3" elevation=10>
            <v-card-text class="bigtext">
              <b>{{getTalent(diff.id).name}} <span class="primary--text"> Rank {{diff.rank}}</span></b>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout class="headline">Mech Skills</v-layout>
      <v-layout row wrap justify-space-between v-if="changes.mechSkills && pilot.mechSkills">
        <v-flex v-if="pilot.mechSkills.hull !== changes.mechSkills.hull">
          <v-card color="grey lighten-3" elevation=10>
            <v-card-text class="bigtext">
              <b>Hull:</b>&nbsp;<em>{{pilot.mechSkills.hull}}</em> <v-icon>arrow_forward</v-icon> <b class="primary--text">{{changes.mechSkills.hull}}</b>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex v-if="pilot.mechSkills.agi !== changes.mechSkills.agi">
          <v-card color="grey lighten-3" elevation=10>
            <v-card-text class="bigtext">
              <b>Agility:</b>&nbsp;<em>{{pilot.mechSkills.agi}}</em> <v-icon>arrow_forward</v-icon> <b class="primary--text">{{changes.mechSkills.agi}}</b>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex v-if="pilot.mechSkills.sys !== changes.mechSkills.sys">
          <v-card color="grey lighten-3" elevation=10>
            <v-card-text  class="bigtext">
              <b>Systems:</b>&nbsp;<em>{{pilot.mechSkills.sys}}</em> <v-icon>arrow_forward</v-icon> <b class="primary--text">{{changes.mechSkills.sys}}</b>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex v-if="pilot.mechSkills.eng !== changes.mechSkills.eng">
          <v-card color="grey lighten-3" elevation=10>
            <v-card-text  class="bigtext">
              <b>Engineering:</b>&nbsp;<em>{{pilot.mechSkills.eng}}</em> <v-icon>arrow_forward</v-icon> <b class="primary--text">{{changes.mechSkills.eng}}</b>
            </v-card-text>
          </v-card>
        </v-flex>                  
      </v-layout>

      <v-layout class="headline">Licenses</v-layout>
      <v-layout row wrap justify-space-between>
        <v-flex v-for="diff in arrDiff('name', 'licenses', 'level')" :key="diff.id">
          <v-card color="grey lighten-3" elevation=10>
            <v-card-text class="bigtext">
              <b>{{diff.source}} {{diff.name}} <span class="primary--text">Rank {{diff.level}}</span></b>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

      <div v-if="pilot.level % 3 === 0">
        <v-layout class="headline">Core Bonuses</v-layout>
        <v-layout row wrap justify-space-between>
          <v-flex v-for="diff in differences('core_bonuses')" :key="diff">
            <v-card color="grey lighten-3" elevation=10>
              <v-card-text class="bigtext">
                <b>{{getCoreBonus(diff).name}}</b>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>      
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import _ from 'lodash'

  export default Vue.extend({
    name: 'confirmation-block',
    props: {
      pilot: Object,
      changes: Object
    },
    methods: {
      arrDiff (id: string, attr: string, rank: number) {
        var diff = []
        for (var i = 0; i < this.changes[attr].length; i++) {
          var e = this.changes[attr][i]
          for (let j = 0; j < this.pilot[attr].length; j++) {
            var old = this.pilot[attr][j]
            if (e[id] === old[id]) {
              if (e[rank] !== old[rank]) {
                // ignore
              } else {
                continue
              }
            } else {
              continue
            }
            diff.push(e)
          }
          if (this.pilot[attr].findIndex((x: any) => x[id] === e[id]) === -1) {
            diff.push(e)
          }
        }
        return diff
      },
      differences (field: string) {
        return _.difference(this.changes[field], this.pilot[field])
      }
    }
  })
</script>

<style scoped>
  .bigtext {
    font-size: 20px;
  }
</style>
