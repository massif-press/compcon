<template>
  <v-layout fill-height>
    <v-flex xs2>
      <v-tooltip top>
        <v-btn slot="activator" color="blue-grey darken-2" v-if="empty || itemData.err" block 
          @click="clicked" class="ma-0 pa-0" style="height:100%">Add System</v-btn>
        <v-btn slot="activator" color="blue-grey darken-2" v-else block @click="clicked" 
          class="ma-0 pa-0" style="height:100%">{{ itemData.type }}</v-btn>
        <span v-if="empty">Install System</span>
        <span v-else>Change or Remove Installed System</span>
      </v-tooltip>
    </v-flex>
    <v-flex xs10>
      <div v-if="empty">
        <v-expansion-panel class="ma-0">
          <v-expansion-panel-content disabled>
            <span slot="header" class="subheading"> EMPTY </span> 
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <div v-else-if="itemData.err">
        <v-expansion-panel class="ma-0">
          <v-expansion-panel-content disabled>
            <span slot="header" class="subheading grey--text">
              // MISSING SYSTEM DATA //&emsp;
              <span v-if="system.brew" class="caption grey--text">({{system.brew}})</span>
            </span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <div v-else>
        <v-expansion-panel class="m-0">
          <v-expansion-panel-content>
            <v-layout slot="header"> 
              <span class="subheading font-weight-bold">{{itemData.name}}</span> 
              <v-spacer />
              <span class="mr-5" style="display: inline-flex;"> 
                {{itemData.sp}} SP
              </span>
            </v-layout>
            <system-card :itemData="itemData"/>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {SystemCard} from '../../components/UI'

  export default Vue.extend({
    name: 'mech-system-item',
    components: { SystemCard },
    props: {
      system: Object,
      empty: Boolean,
      itemType: String
    },
    computed: {
      itemData (): System {
        if (this.empty) return {} as System
        return this.$store.getters['getItemById']('MechSystems', this.system.id)
      }
    },
    methods: {
      clicked () {
        this.$emit('clicked')
      }
    }
  })
</script>
