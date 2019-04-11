<template>
  <v-card color="grey lighten-5">
    <v-card-text>
      <v-layout row>
        <v-flex xs4 :class="{locked : (rank && rank < 1)}">
          <p class="text-xs-center pt-2 subheading font-weight-bold">
            <span v-if="rank && rank < 1" class="grey-text">RANK I &nbsp; <v-icon>mdi-lock-outline</v-icon></span>
            <span v-else-if="rank && rank >= 1">RANK I &nbsp; <v-icon>mdi-lock-open-outline</v-icon></span>
            <span v-else>RANK I</span>
          </p>
          <div v-for="i in license.unlocks[0]" :key="i.id" class="mr-4 ml-4">
            <v-tooltip top>
              <v-btn outline large flat block :color="itemColor(i.data_type)" slot="activator" @click="openItem(i)">{{i.name}}</v-btn>
              <span v-html="tooltip(i)" />
            </v-tooltip>
          </div>
        </v-flex>
        <v-flex xs4 :class="{locked : (rank && rank < 2)}">
          <p class="text-xs-center pt-2 subheading font-weight-bold">
            <span v-if="rank && rank < 2" class="grey-text">RANK II &nbsp; <v-icon>mdi-lock-outline</v-icon></span>
            <span v-else-if="rank && rank >= 2">RANK II &nbsp; <v-icon>mdi-lock-open-outline</v-icon></span>
            <span v-else>RANK II</span>
          </p>
          <div v-for="i in license.unlocks[1]" :key="i.id" class="mr-4 ml-4">
            <v-tooltip top>
              <v-btn outline large flat block :color="itemColor(i.data_type)" slot="activator" @click="openItem(i)">{{i.name}}</v-btn>
              <span v-html="tooltip(i)" />
            </v-tooltip>                
          </div>              
        </v-flex>
        <v-flex xs4 :class="{locked : (rank && rank < 3)}">
          <p class="text-xs-center pt-2 subheading font-weight-bold">
            <span v-if="rank && rank < 3" class="grey-text">RANK III &nbsp; <v-icon>mdi-lock-outline</v-icon></span>
            <span v-else-if="rank && rank >= 3">RANK III &nbsp; <v-icon>mdi-lock-open-outline</v-icon></span>
            <span v-else>RANK III</span>            
          </p>
          <div v-for="i in license.unlocks[2]" :key="i.id" class="mr-4 ml-4">
            <v-tooltip top>
              <v-btn outline large flat block :color="itemColor(i.data_type)" slot="activator" @click="openItem(i)">{{i.name}}</v-btn>
              <span v-html="tooltip(i)" />
            </v-tooltip>                
          </div>              
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { thisItem } from '@/data_interfaces/type_guards'

  export default Vue.extend({
    name: 'license-card',
    props: {
      license: Object,
      rank: Number
    },
    methods: {
      tooltip(item: CCItem) {
        if (thisItem.isFrame(item)) {
          return `<b>FRAME</b><br>${item.mechtype}`
        } else if (thisItem.isWeapon(item)) {
          return `<b>MECH WEAPON</b><br>${item.mount} ${item.type}`
        } else {
          return `<b>MECH SYSTEM</b><br>${item.type}`
        }
      },
      itemColor(t: string) {
        if (t === 'frame') { return 'deep-purple' }
        else if (t === 'weapon') { return 'primary' }
        return 'teal'
      },
      openItem(t: CCItem) {
        this.$store.dispatch('setPresearch', t.name)
        if (t.data_type === 'frame') { this.$router.push('frames') }
        else if (t.data_type === 'weapon') { this.$router.push('weapons') }
        else { this.$router.push('systems') }
      },
    }
  })
</script>

<style scoped>
  .locked {
    background-color: #E0E0E0;
  }
</style>
