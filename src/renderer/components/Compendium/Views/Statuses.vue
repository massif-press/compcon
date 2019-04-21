<template>
  <v-container>
    <span class="display-1 text-uppercase font-weight-thin">STATUSES</span>
    <v-layout v-for="s in statuses" :key="s.name">
      <v-flex class="text-xs-center pa-3">
        <v-hover>
          <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 8 : 3}`">
            <v-card-title primary-title class="title">{{s.name}}</v-card-title>
            <v-card-text class="text-xs-left pt-0"><ul><li v-for="e in s.effects" :key="e" class="blockquote ma-0 pa-0">{{e}}</li></ul></v-card-text>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
    <v-divider class="ma-3 mb-4" />

    <v-layout justify-center>
      <v-flex xs11>
         <v-toolbar color="red darken-3" dark>
        <v-toolbar-title>STRUCTURE DAMAGE</v-toolbar-title>
      </v-toolbar>
    <v-card>
      <v-card-text>
      <v-layout>
        <v-flex xs2><span class="subheading font-weight-bold text-uppercase">Roll</span></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Result</span></v-flex>
        <v-flex xs7><span class="subheading font-weight-bold text-uppercase">Effect</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-5</v-icon><v-icon large>mdi-minus</v-icon><v-icon large>mdi-dice-6</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Glancing Blow</span></v-flex>
        <v-flex xs7><span class="subheading">Emergency systems kick in and stabilize your mech. However, your mech is <b>impaired</b> until the end of your next turn.</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-2</v-icon><v-icon large>mdi-minus</v-icon><v-icon large>mdi-dice-4</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">System Trauma</span></v-flex>
        <v-flex xs7><span class="subheading">Parts of your mech are torn off by the damage. All the weapons on one mount or a system are destroyed. Roll a d6, on a 4+, you get to choose, on a 1-3, the attacker gets to choose. If a system is used up (it has the limited tag and no charges left) it’s not a valid target. If there’s nothing left to destroy, this result becomes DIRECT HIT instead.</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-1</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Direct Hit</span></v-flex>
        <v-flex xs7><span class="subheading">This result has different outcomes depending on how much structure damage your mech has remaining.<br>
        3+ - Your mech is <b>stunned</b> until the end of your next turn.<br>
        2 - Your mech must pass a <b>hull</b> save or be <b>destroyed</b>.<br>
        1 or lower - Your mech is <b>destroyed</b>.</span></v-flex>
      </v-layout>   
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-1</v-icon><v-icon large>mdi-dice-1</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Crushing Hit</span></v-flex>
        <v-flex xs7><span class="subheading">Your mech is damaged beyond repair and is <b>destroyed</b>. You can still exit it as normal.</span></v-flex>
      </v-layout>                  
      </v-card-text>
    </v-card>
    </v-flex>
    </v-layout>

    <v-layout justify-center class="mt-4">
      <v-flex xs11>
         <v-toolbar color="orange darken-4" dark>
        <v-toolbar-title>OVERHEATING</v-toolbar-title>
      </v-toolbar>
    <v-card>
      <v-card-text>
      <v-layout>
        <v-flex xs2><span class="subheading font-weight-bold text-uppercase">Roll</span></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Result</span></v-flex>
        <v-flex xs7><span class="subheading font-weight-bold text-uppercase">Effect</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-5</v-icon><v-icon large>mdi-minus</v-icon><v-icon large>mdi-dice-6</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Emergency Shunt</span></v-flex>
        <v-flex xs7><span class="subheading">Cooling systems recover and manage to contain the peaking heat levels. However, your mech is <b>impaired</b> until the end of your next turn.</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-2</v-icon><v-icon large>mdi-minus</v-icon><v-icon large>mdi-dice-4</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Power Plant Destabilize</span></v-flex>
        <v-flex xs7><span class="subheading">Your mech’s power plant becomes unstable, ejecting jets of plasma. Your mech is <b>Jammed</b> until the end of your next turn</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-1</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Meltdown</span></v-flex>
        <v-flex xs7><span class="subheading">This result has different outcomes depending on how much reactor stress your mech has remaining.<br>
        3+ - Your mech is immediately <b>shut down</b><br>
        2 - Your mech must pass a engineering save or suffer a reactor meltdown at the end of 1d6 turns after this one (rolled by the GM). You can reverse it by taking a full action and repeating this save..<br>
        1 or lower - Your mech suffers a reactor meltdown at the end of your next turn.</span></v-flex>
      </v-layout>   
      <v-divider class="ma-2"/>
      <v-layout>
        <v-flex xs2><v-icon large>mdi-dice-1</v-icon><v-icon large>mdi-dice-1</v-icon></v-flex>
        <v-flex xs3><span class="subheading font-weight-bold text-uppercase">Irreversible Meltdown</span></v-flex>
        <v-flex xs7><span class="subheading">Your reactor goes critical. Your mech will suffer a reactor meltdown at the end of your next turn..</span></v-flex>
      </v-layout>
      <v-divider class="ma-2"/>
      <p class="ma-3"><i>When a mech suffers a reactor meltdown, any pilot inside immediately dies, the mech is immediately vaporized in a catastrophic eruption, annihilating the wreck, and any characters inside a burst 2 area centered on the mech must pass an agility save or take 4d6 explosive damage, and half on a successful save.</i></p>           
      </v-card-text>
    </v-card>
    </v-flex>
    </v-layout>    

  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'statuses',
    data: () => ({
      statuses: [],
    }),
    created() {
      this.statuses = this.$store.getters.getItemCollection('Statuses')
    },
  })
</script>