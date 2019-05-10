<template>
  <v-container fluid px-5>
    <span class="display-1 text-uppercase font-weight-thin">LICENSES</span>
    <v-layout v-for="m in Object.keys(licenses)" :key="m">
      <v-flex class="text-xs-center pa-3">
        <span class="display-2 text-uppercase font-weight-light">{{manufacturer(m).name}}</span>
     <v-expansion-panel class="mt-2">      
       <v-expansion-panel-content v-for="l in licenses[m]" :key="l.license">
        <template v-slot:header>
          <div class="text-uppercase title">{{l.license}}</div>
        </template>
        <license-card :license="l" />
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
import { LicenseCard } from '@/features/pilot_management/components/UI'

export default Vue.extend({
    name: 'licenses',
    components: {LicenseCard},
    data: () => ({
      licenses: {},
    }),
    methods: {
      manufacturer(id: string) {
        return this.$store.getters['getItemById']('Manufacturers', id.toUpperCase())
      },
    },
    created() {
      this.licenses = _.groupBy(this.$store.getters['getItemCollection']('Licenses'), 'source')
    },
  })
</script>