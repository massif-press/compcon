<template>
  <div>
    <v-layout v-if="licenseData.err">
      <v-toolbar dense>
        <v-toolbar-title>
          <span class="subheading grey--text">// MISSING LICENSE DATA //</span>&emsp;
          <span v-if="license.brew" class="caption grey--text">({{license.brew}})</span>
        </v-toolbar-title>
      </v-toolbar>
    </v-layout>

    <v-layout v-else>
      <v-toolbar dense>
        <v-toolbar-title>
          <span class="caption">{{license.source}}</span> &emsp; {{license.name}}
          <v-rating class="d-inline" :value="license.level" :length="3" readonly dense></v-rating>
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-dialog lazy v-model="modal" transition="dialog-bottom-transition">
            <v-btn slot="activator" icon>
              <v-icon>search</v-icon>
            </v-btn>
            <v-toolbar>
              <v-toolbar-title> {{license.source}} &mdash; {{license.name}} </v-toolbar-title>
              <v-spacer />
              <v-toolbar-items>
                <v-btn icon large @click="modal = false"> <v-icon large>close</v-icon> </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <license-card :license="licenseData" :rank="license.level"/>
          </v-dialog>
        </v-toolbar-items>
      </v-toolbar>
    </v-layout>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {ItemBadge} from '../../UI'
  import {LicenseCard} from '@/components/UI'

  export default Vue.extend({
    name: 'license-item',
    components: { ItemBadge, LicenseCard },
    props: {
      license: Object,
      licenseData: Object
    },
    data: () => ({
      modal: false
    })  
  })
</script>