<template>
  <div id="hangar-view">
    <v-container fluid class="pa-0 pt-3">
      <v-layout>
        <v-flex><hr style="border-color: grey" dark class="mt-2 ml-5 mr-4"/></v-flex>
        <v-flex shrink class="text-xs-center active-pilot-title">
          <span>{{pilot.callsign}}</span>
        </v-flex>
        <v-flex><hr style="border-color: grey" dark class="mt-2 ml-4 mr-5"/></v-flex>
        <v-tooltip left>
          <v-menu offset-y slot="activator">
            <template v-slot:activator="{ on }">
              <v-btn icon dark absolute top right style="margin-top: 80px;" v-on="on"><v-icon>mdi-sort</v-icon></v-btn>
            </template>
            <v-list dark dense>
              <v-list-tile v-for="s in sorts" :key="s.name">
                <v-list-tile-title>{{s.name}}</v-list-tile-title>
                <v-spacer class="ml-3"/>
                <v-btn icon class="pa-0 ma-0" @click="sortBy(s, true)"><v-icon color="grey lighten-1">mdi-sort-ascending</v-icon></v-btn>
                <v-btn icon class="pa-0 ma-0" @click="sortBy(s, false)"><v-icon color="grey lighten-1">mdi-sort-descending</v-icon></v-btn>
              </v-list-tile>
            </v-list>
          </v-menu>
        <span>Sort Configurations</span>
      </v-tooltip>
      </v-layout>
      <v-layout><v-flex class="text-xs-center hangar-title"><span>mech hangar</span></v-flex></v-layout>
    </v-container>
    <v-container grid-list-xl fluid>
      <v-layout row wrap class="ml-2 mr-2 mb-5" fill-height>
        <v-flex v-for="(c, i) in configs" :key="c.id + i" class="mb-4" xs3>
          <config-card :config="c" :c-idx="i" :card-height="cardHeight" @activate="activateConfig" />
        </v-flex>
        <v-flex xs3>
          <add-config-card @added="update" :card-height="cardHeight" />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import _ from 'lodash'
  import ConfigCard from './ConfigCard.vue'
  import AddConfigCard from './AddConfigCard.vue'

  export default Vue.extend({
    name: 'hangar-view',
    components: { ConfigCard, AddConfigCard },
    data: () => ({
      sorts: [
        { name: 'Created', field: '' },
        { name: 'Designation', field: 'name' },
        { name: 'Frame', field: 'frame_id' }
      ],
      currentSort: { name: 'Created', field: '' },
      ascending: false,
      cardHeight: 300
    }),
    computed: {
      pilot(): Pilot {
        return this.$store.getters['getPilot']
      },
      configs(): MechConfig[] {
        var allConfigs = this.pilot.configs as any
        if (this.currentSort && this.currentSort.field !== '') {
          allConfigs = this.currentSort.field === 'level'
            ? _.sortBy(allConfigs, this.currentSort.field)
            : _.sortBy(allConfigs, p => (p as any)[this.currentSort.field].toUpperCase())
        }
        if (!this.ascending) {
          return _.reverse(_.clone(allConfigs))
        }
        return allConfigs
      }
    },
    methods: {
      update() {
        this.$forceUpdate()
        this.$router.push('/hangar')
      },
      sortBy(sort: {name: string, field: string}, isAscending: boolean) {
        this.currentSort = sort
        this.ascending = isAscending
      },
      activateConfig(payload: {id: string, toggle: boolean}) {
        for (let i = 0; i < this.configs.length; i++) {
          if (this.configs[i].active) {
              this.$store.dispatch('editConfig', {
              id: this.configs[i].id,
              attr: `active`,
              val: false
            })
          }
        }
        this.$store.dispatch('editConfig', {
          id: payload.id,
          attr: `active`,
          val: payload.toggle
        })
        this.$store.dispatch('editPilot', {
          attr: 'active_config',
          val: payload.id
        })
      }
    }
  })
</script>

<style scoped>
  #hangar-view {
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: #424242;
  }

  .hangar-title {
    font-size: 35px;
    letter-spacing: 25px;
    font-weight: 100;
    text-transform: uppercase;
    color: #fff;
  }

  .active-pilot-title {
    font-size: 15px;
    letter-spacing: 20px;
    font-weight: 500;
    text-transform: uppercase;
    color: #fff;
  }  
</style>