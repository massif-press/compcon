<template>
  <v-container>
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

<script>
  import _ from 'lodash'

  export default {
    name: 'licenses',
    data: () => ({
      licenses: {}
    }),
    methods: {
      tooltip: function (item) {
        if (item.data_type === 'frame') {
          return `<b>FRAME</b><br>${item.mechtype}`
        } else if (item.data_type === 'weapon') {
          return `<b>MECH WEAPON</b><br>${item.mount} ${item.type}`
        } else {
          return `<b>MECH SYSTEM</b><br>${item.type}`
        }
      },
      itemColor: function (t) {
        if (t === 'frame') return 'deep-purple'
        else if (t === 'weapon') return 'primary'
        return 'teal'
      },
      openItem: function (t) {
        console.error('not yet implemented')
      },
      manufacturer: function (id) {
        return this.$store.getters.getItemById('Manufacturers', id.toUpperCase())
      }
    },
    mounted: function () {
      this.licenses = _.groupBy(this.$store.getters.getItemCollection('Licenses'), 'source')
    }
  }
</script>