<template>
    <v-card>
        <v-card-text>
          <blockquote class="blockquote m-0 pb-0 pt-0" v-html="talent.description" />
          <v-card>
            <v-card-title class="pb-0 pt-2 mb-0 mt-1">
              <v-layout justify-space-between fill-height>
                <v-flex xs10>
                  <span class="title"><v-icon>star</v-icon>&nbsp;{{talent.r1_name}}</span>
                  <sub class="ml-2 grey--text"> (RANK I) </sub>
                  <v-card-text><span v-html="talent.r1_desc" /></v-card-text>
                  <v-card-actions v-if="playerRank === 1"><v-btn @click="removeTalent" color="warning" small flat>Unlearn</v-btn></v-card-actions>
                </v-flex>
                <v-flex xs1>
                  <v-btn disabled v-if="playerRank" fab right><v-icon>check</v-icon></v-btn>
                  <v-btn v-else :disabled="pointLimit" fab right @click="addTalent"><v-icon>add</v-icon></v-btn>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>

          <v-card :color="!playerRank || newPilot ? 'grey lighten-5' : ''">
            <v-card-title class="pb-0 pt-2 mb-0 mt-1">
              <v-layout justify-space-between fill-height>
                <v-flex xs10>
                  <span class="title"><v-icon>star</v-icon><v-icon>star</v-icon>&nbsp;{{talent.r2_name}}</span>
                  <sub class="ml-2 grey--text"> (RANK II) </sub>
                  <v-card-text><span v-html="talent.r2_desc" /></v-card-text>
                  <v-card-actions v-if="playerRank === 2"><v-btn @click="removeTalent" color="warning" small flat>Downgrade</v-btn></v-card-actions>
                </v-flex>
                <v-flex xs1>
                  <v-btn disabled v-if="!playerRank || newPilot" fab right><v-icon>lock</v-icon></v-btn>
                  <v-btn :disabled="pointLimit" v-else-if="playerRank == 1"  fab right @click="addTalent"><v-icon>arrow_upward</v-icon></v-btn>
                  <v-btn disabled v-else fab right><v-icon>check</v-icon></v-btn>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>

          <v-card :color="playerRank < 2 ? 'grey lighten-5' : ''">
            <v-card-title class="pb-0 pt-2 mb-0 mt-1">
              <v-layout justify-space-between fill-height>
                <v-flex xs10>
                  <span class="title"><v-icon>star</v-icon><v-icon>star</v-icon><v-icon>star</v-icon>&nbsp;{{talent.r3_name}}</span>
                  <sub class="ml-2 grey--text"> (RANK III) </sub>
                  <v-card-text><span v-html="talent.r3_desc" /></v-card-text>
                  <v-card-actions v-if="playerRank === 3"><v-btn @click="removeTalent" color="warning" small flat>Downgrade</v-btn></v-card-actions>
                </v-flex>
                <v-flex xs1>
                  <v-btn disabled v-if="!playerRank || playerRank === 1" fab right><v-icon>lock</v-icon></v-btn>
                  <v-btn disabled v-else-if="playerRank > 2" fab right><v-icon>check</v-icon></v-btn>
                  <v-btn :disabled="pointLimit" v-else fab right @click="addTalent"><v-icon>arrow_upward</v-icon></v-btn>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>

        </v-card-text>
      </v-card>
</template>

<script>
  export default {
    name: 'talent-selector-item',
    props: {
      talent: Object,
      playerRank: Number,
      pointLimit: Boolean,
      newPilot: Boolean
    },
    methods: {
      addTalent: function () {
        this.$emit('add-talent', this.talent.id)
      },
      removeTalent: function () {
        this.$emit('remove-talent', this.talent.id)
      }
    }
  }
</script>
