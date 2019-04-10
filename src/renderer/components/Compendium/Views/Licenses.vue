<template>
  <v-container fluid>
    <span class="display-1 text-uppercase font-weight-thin">LICENSES</span>
    <v-layout v-for="m in Object.keys(licenses)" :key="m">
      <v-flex class="text-xs-center pa-3">
        <span class="display-2 text-uppercase font-weight-light">{{manufacturer(m).name}}</span>
     <v-expansion-panel class="mt-2">      
       <v-expansion-panel-content v-for="l in licenses[m]" :key="l.license">
        <template v-slot:header>
          <div class="text-uppercase title">{{l.license}}</div>
        </template>
        <v-card color="grey lighten-5">
          <v-card-text>
            <v-layout row>
              <v-flex xs4>
                <p class="text-xs-center pt-2 subheading font-weight-bold">RANK I</p>
                <div v-for="i in l.unlocks[0]" :key="i.id" class="mr-4 ml-4">
                  <v-tooltip top>
                    <v-btn outline large flat block :color="itemColor(i.data_type)" slot="activator" @click="openItem(i)">{{i.name}}</v-btn>
                    <span v-html="tooltip(i)" />
                  </v-tooltip>
                </div>
              </v-flex>
              <v-flex xs4>
                <p class="text-xs-center pt-2 subheading font-weight-bold">RANK II</p>
                <div v-for="i in l.unlocks[1]" :key="i.id" class="mr-4 ml-4">
                  <v-tooltip top>
                    <v-btn outline large flat block :color="itemColor(i.data_type)" slot="activator" @click="openItem(i)">{{i.name}}</v-btn>
                    <span v-html="tooltip(i)" />
                  </v-tooltip>                
                </div>              
              </v-flex>
              <v-flex xs4>
                <p class="text-xs-center pt-2 subheading font-weight-bold">RANK III</p>
                <div v-for="i in l.unlocks[2]" :key="i.id" class="mr-4 ml-4">
                  <v-tooltip top>
                    <v-btn outline large flat block :color="itemColor(i.data_type)" slot="activator" @click="openItem(i)">{{i.name}}</v-btn>
                    <span v-html="tooltip(i)" />
                  </v-tooltip>                
                </div>              
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
       </v-expansion-panel-content>
     </v-expansion-panel>
      <v-divider class="mt-5 mb-0" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { thisItem } from '@/data_interfaces/type_guards'

export default Vue.extend({
    name: 'licenses',
    data: () => ({
      licenses: {},
    }),
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
      manufacturer(id: string) {
        return this.$store.getters.getItemById('Manufacturers', id.toUpperCase())
      },
    },
    created() {
      this.licenses = _.groupBy(this.$store.getters.getItemCollection('Licenses'), 'source')
    },
  })
</script>