<template>
  <v-layout fill-height>
    <v-flex xs2>
      <v-tooltip top>
        <v-btn
          slot="activator"
          color="blue-grey darken-2"
          v-if="empty || system.err"
          block
          @click="systemSelectorModal = true"
          class="ma-0 pa-0"
          style="height:100%"
        >
          Add System
        </v-btn>
        <v-btn
          slot="activator"
          color="blue-grey darken-2"
          v-else
          block
          :disabled="integrated"
          @click="systemSelectorModal = true"
          class="ma-0 pa-0"
          style="height:100%"
        >
          {{ system.Type }}
        </v-btn>
        <span v-if="empty">Install System</span>
        <span v-else>Change or Remove Installed System</span>
      </v-tooltip>
    </v-flex>
    <v-flex xs10>
      <div v-if="empty">
        <v-expansion-panel class="ma-0">
          <v-expansion-panel-content disabled>
            <span slot="header" class="subheading">EMPTY</span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <div v-else-if="system.err">
        <v-expansion-panel class="ma-0">
          <v-expansion-panel-content disabled>
            <span slot="header" class="subheading grey--text">
              // MISSING SYSTEM DATA //&emsp;
            </span>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <div v-else>
        <v-expansion-panel class="m-0">
          <v-expansion-panel-content>
            <v-layout slot="header">
              <span class="subheading font-weight-bold">{{ system.Name }}</span>
              <v-spacer />
              <span class="mr-5" style="display: inline-flex;">
                {{ system.SP }} SP
              </span>
            </v-layout>
            <system-card :itemData="system" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
    </v-flex>

    <!-- System Selector Modal -->
    <v-dialog
      v-model="systemSelectorModal"
      lazy
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-toolbar fixed dense flat dark>
        <v-toolbar-title>
          <span class="text-capitalize">Select System</span>
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon large @click="systemSelectorModal = false">
            <v-icon large>close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <system-table
        :loadout="loadout"
        :maxSP="maxSP"
        :current-equip="system"
        @close="systemSelectorModal = false"
        :index="index"
      />
    </v-dialog>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { SystemCard } from '../../components/UI'
import SystemTable from './SystemTable.vue'
import { MechSystem, MechLoadout } from '@/class'

export default Vue.extend({
  name: 'mech-system-item',
  components: { SystemCard, SystemTable },
  data: () => ({
    systemSelectorModal: false,
  }),
  props: {
    loadout: MechLoadout,
    system: MechSystem,
    index: Number,
    empty: Boolean,
    integrated: Boolean,
    maxSP: Number,
  },
})
</script>
