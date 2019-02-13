<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs3>
        sidebar with: <br>
        skills list w/ ranks <br>
        remaining skill points <br>
        save/reset buttons
      </v-flex>
      <v-flex xs1>&emsp;</v-flex>
      <v-flex>
  <v-expansion-panel expand focusable>
    <v-expansion-panel-content v-for="talent in talentData" :key="talent.id" >
      <v-toolbar-title slot="header">
      <span>{{talent.name}}</span>
      <span v-for="n in playerRank(talent.id)" :key="`${talentData.id}_prank_${n}`"><v-icon>star</v-icon></span>
      </v-toolbar-title>
       <v-card>
        <v-card-text>
          <blockquote class="blockquote m-0" v-html="talent.description" />
          <v-card hover>
            <v-card-title>
              <v-layout justify-space-between fill-height>
                <v-flex xs10>
                  <span class="title"><v-icon>star</v-icon>&nbsp;{{talent.r1_name}}</span>
                  <sub class="ml-2 grey--text"> (RANK I) </sub>
                  <v-card-text><span v-html="talent.r1_desc" /></v-card-text>
                </v-flex>
                <v-flex xs1>
                  <v-btn disabled v-if="playerRank(talent.id)" fab right><v-icon>check</v-icon></v-btn>
                  <v-btn v-else fab right @click="addTalent(talent.id)"><v-icon>add</v-icon></v-btn>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>

          <v-card hover :color="!playerRank(talent.id) ? 'grey lighten-5' : ''">
            <v-card-title>
              <v-layout justify-space-between fill-height>
                <v-flex xs10>
                  <span class="title"><v-icon>star</v-icon><v-icon>star</v-icon>&nbsp;{{talent.r2_name}}</span>
                  <sub class="ml-2 grey--text"> (RANK II) </sub>
                  <v-card-text><span v-html="talent.r2_desc" /></v-card-text>
                </v-flex>
                <v-flex xs1>
                  <v-btn disabled v-if="!playerRank(talent.id)" fab right><v-icon>lock</v-icon></v-btn>
                  <v-btn disabled v-else-if="playerRank(talent.id) > 1" fab right><v-icon>check</v-icon></v-btn>
                  <v-btn v-else fab right @click="addTalent(talent.id)"><v-icon>arrow_upward</v-icon></v-btn>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>

          <v-card hover :color="playerRank(talent.id) < 2 ? 'grey lighten-5' : ''">
            <v-card-title>
              <v-layout justify-space-between fill-height>
                <v-flex xs10>
                  <span class="title"><v-icon>star</v-icon><v-icon>star</v-icon><v-icon>star</v-icon>&nbsp;{{talent.r3_name}}</span>
                  <sub class="ml-2 grey--text"> (RANK III) </sub>
                  <v-card-text><span v-html="talent.r3_desc" /></v-card-text>
                </v-flex>
                <v-flex xs1>
                  <v-btn disabled v-if="!playerRank(talent.id) || playerRank(talent.id) === 1" fab right><v-icon>lock</v-icon></v-btn>
                  <v-btn disabled v-else-if="playerRank(talent.id) > 2" fab right><v-icon>check</v-icon></v-btn>
                  <v-btn v-else fab right @click="addTalent(talent.id)"><v-icon>arrow_upward</v-icon></v-btn>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>

        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
      </v-flex></v-layout>
  </v-container>
</template>

<script>
  function talentSort (talents) {
    return talents.sort(function (a, b) {
      return a.rank === b.rank ? 0 : a.rank > b.rank ? 1 : -1
    })
  }

  export default {
    name: 'talent-selector',
    props: ['pilotTalents', 'pilotLevel'],
    data: () => ({
      talents: [],
      pointLimit: false
    }),
    computed: {
      talentData: function () {
        return this.$store.getters.getItemCollection('Talents')
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
      }
    },
    mounted () {
      this.talents = talentSort(JSON.parse(JSON.stringify(this.pilotTalents)))
    }
  }
</script>

