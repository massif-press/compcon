<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar large color="action--full">
        <v-icon x-large>mdi-hexagon-slice-6</v-icon>
        Fight
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-card-text class="pt-3">
        <action-detail-expander :action="action" />
        <v-divider class="my-3" />
        <v-container style="max-width: 800px">
          <item-selector-row
            v-for="(w, j) in mech.Pilot.Loadout.Weapons"
            :key="`weap_${j}`"
            :item="w"
            color="action--full"
            @click="fight(w)"
          />
        </v-container>
      </v-card-text>

      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" tile @click="dialog = false">DISMISS</v-btn>
      </v-card-actions>
    </v-card>

    <sel-fight-dialog
      ref="f_dialog"
      :pilot="mech.Pilot"
      :item="selected"
      @close="completeFight()"
    />
  </v-dialog>
</template>

<script lang="ts">
import ActionDetailExpander from '../components/_ActionDetailExpander.vue'
import ItemSelectorRow from '../components/_ItemSelectorRow.vue'
import SelFightDialog from './_SelFightDialog.vue'

import Vue from 'vue'
import { ActivationType } from '@/classes/enums'

export default Vue.extend({
  name: 'fight-dialog',
  components: { ActionDetailExpander, ItemSelectorRow, SelFightDialog },
  props: {
    mech: {
      type: Object,
      required: true,
    },
    action: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    selected: null,
    selectedMount: null,
  }),
  computed: {
    state() {
      return this.mech.Pilot.State
    },
  },
  methods: {
    completeFight() {
      this.state.CommitAction(this.action, ActivationType.Full)
      this.hide()
    },
    fight(item) {
      this.selected = item
      this.$refs.f_dialog.show()
    },
    show(): void {
      this.dialog = true
    },
    hide(): void {
      this.dialog = false
    },
  },
})
</script>
