<template>
  <v-container fluid>
    <span class="display-1 text-uppercase font-weight-thin">CORE BONUSES</span>
    <div v-for="m in Object.keys(bonuses)" :key="`summary_block_m${m}`">
      <v-layout>
        <v-flex class="text-xs-center pa-3">
          <span class="major-title text-uppercase font-weight-regular">{{getManufacturer(m).name}}</span>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex>
          <v-expansion-panel expand focusable>
            <v-expansion-panel-content v-for="cb in bonuses[m]" :key="`${cb.id}_data'`" >
              <v-toolbar-title slot="header" dense flat>
                <span class="title text-uppercase font-weight-light">{{cb.name.toUpperCase()}}</span>
              </v-toolbar-title>
                <v-card>
                  <div class="mb-2" v-if="!cb.err">
                    <v-card-title class="pb-0 mb-0 mt-0 pt-2">
                      <p class="fluff-text" v-html="cb.description" />
                    </v-card-title>
                    <v-card-text class="pb-1 mt-0 pt-0">
                      <p class="effect-text pb-0" v-html="cb.effect" />
                    </v-card-text>
                  </div>
                </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>
      <br>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'

export default Vue.extend({
  name:'core-bonuses',
  data: () => ({
    bonuses: []
  }),
  created () {
    var vm = this as any
    vm.bonuses = _.groupBy(vm.$store.getters['getItemCollection']('CoreBonuses'), 'source')
  }
})
</script>
