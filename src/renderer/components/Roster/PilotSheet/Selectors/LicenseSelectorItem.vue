<template>
  <v-card>
    <v-container fluid grid-list-xs>
      <v-card :hover="playerRank === 0" :class="`pb-2 ${ playerRank === 0 ?'elevation-10' : ''}`">
        <v-card-title class="pb-0"><span :class="`headline ${playerRank === 0 ? 'grey--text' : 'font-weight-bold'}`">Rank I</span>&emsp;
          <span v-if="playerRank === 0">
            <v-tooltip top>
              <v-btn :disabled="pointLimit" slot="activator" fab small color="primary" @click="addLicense"><v-icon>lock_open</v-icon></v-btn>
              <span> Unlock <span class="text-uppercase">{{license.source}} {{license.license}}</span> Rank I </span>
            </v-tooltip>
          </span>
          <span v-else class="grey--text"><v-icon color="success">lock_open</v-icon></span>
        </v-card-title>
        <hr>
        <v-layout row>
          <v-flex shrink v-for="item in license.unlocks[0]" :key="item.id">
            <item-badge :item="item" :locked="playerRank < 1"/>
          </v-flex>
        </v-layout>
        <v-card-actions>
          <v-spacer /><v-btn v-if="playerRank === 1" small flat color="warning" @click="removeLicense">remove license</v-btn>
        </v-card-actions>
      </v-card>
      <v-card :hover="playerRank === 1" :color="playerRank === 0 ? 'grey lighten-2' : playerRank === 1 ? 'grey lighten-5' : ''" :class="`pb-2 ${ playerRank === 1 ?'elevation-10' : 0}`">
        <v-card-title class="pb-0"><span :class="`headline ${playerRank === 0 ? 'grey--text' : 'font-weight-bold'}`">Rank II</span>&emsp;
          <span v-if="playerRank === 0"><v-icon color="grey">lock</v-icon></span>
          <span v-else-if="playerRank === 1">
            <v-tooltip top>
              <v-btn :disabled="pointLimit" slot="activator" fab small color="primary" @click="addLicense"><v-icon>lock_open</v-icon></v-btn>
              <span> Unlock <span class="text-uppercase">{{license.source}} {{license.license}}</span> Rank II </span>
            </v-tooltip>
          </span>
          <span v-else class="grey--text"><v-icon color="success">lock_open</v-icon></span>
        </v-card-title>
        <hr>
        <v-layout row>
          <v-flex shrink v-for="item in license.unlocks[1]" :key="item.id">
            <item-badge :item="item" :locked="playerRank < 1"/>
          </v-flex>
        </v-layout>
        <v-card-actions>
          <v-spacer /><v-btn v-if="playerRank === 2" small flat color="warning" @click="removeLicense">remove license</v-btn>
        </v-card-actions>
      </v-card>
      <v-card :hover="playerRank === 2" :color="playerRank <= 1 ? 'grey lighten-2' : playerRank === 2 ? 'grey lighten-5' : ''" :class="`pb-2 ${ playerRank === 2 ?'elevation-10' : 0}`">
        <v-card-title class="pb-0"><span :class="`headline ${playerRank <= 2 ? 'grey--text' : 'font-weight-bold'}`">Rank III</span>&emsp;
          <span v-if="playerRank <= 1"><v-icon color="grey">lock</v-icon></span>
          <span v-else-if="playerRank === 2">
            <v-tooltip top>
              <v-btn :disabled="pointLimit" slot="activator" fab small color="primary" @click="addLicense"><v-icon>lock_open</v-icon></v-btn>
              <span> Unlock <span class="text-uppercase">{{license.source}} {{license.license}}</span> Rank III </span>
            </v-tooltip>
          </span>
          <span v-else class="grey--text"><v-icon color="success">lock_open</v-icon></span>
        </v-card-title>
        <hr>
        <v-layout row>
          <v-flex shrink v-for="item in license.unlocks[2]" :key="item.id">
            <item-badge :item="item" :locked="playerRank < 2"/>
          </v-flex>
        </v-layout>
        <v-card-actions>
          <v-spacer /><v-btn v-if="playerRank === 3" small flat color="warning" @click="removeLicense">remove license</v-btn>
        </v-card-actions>        
      </v-card>                                
    </v-container>
  </v-card>           
</template>

<script>
  import ItemBadge from '../../UI/ItemBadge'

  export default {
    name: 'license-selector-item',
    props: {
      license: Object,
      playerRank: Number,
      pointLimit: Boolean
    },
    components: { ItemBadge },
    methods: {
      addLicense: function () {
        this.$emit('add-license', {name: this.license.license, source: this.license.source})
      },
      removeLicense: function () {
        this.$emit('remove-license', this.license.license)
      },
      isLocked: function (val) {
        return this.playerRank + 1 < val
      }
    }
  }
</script>
