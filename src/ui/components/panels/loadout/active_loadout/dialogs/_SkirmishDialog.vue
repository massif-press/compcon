<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <cc-titlebar large color="action--quick">
        <v-icon x-large>mdi-hexagon-slice-3</v-icon>
        Skirmish
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-card-text class="pt-3">
        <action-detail-expander :action="action" />
        <v-divider class="my-3" />
        <v-container style="max-width: 800px">
          <div v-for="(m, i) in mech.ActiveLoadout.Mounts" :key="`bar_${i}`">
            <item-selector-row
              v-for="(w, j) in m.Weapons.filter(x => x.Size !== 'Superheavy' && !x.Destroyed)"
              :key="`weap_${j}`"
              :item="w"
              color="action--quick"
              @click="skirmish(w, m)"
            />
          </div>
        </v-container>
      </v-card-text>

      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" tile @click="dialog = false">DISMISS</v-btn>
      </v-card-actions>
    </v-card>

    <w-skirmish-dialog
      ref="s_dialog"
      :mech="mech"
      :item="selected"
      :mount="selectedMount"
      @close="completeSkirmish()"
    />
  </v-dialog>
</template>

<script lang="ts">
import ActionDetailExpander from '../components/_ActionDetailExpander.vue'
import ItemSelectorRow from '../components/_ItemSelectorRow.vue'
import WSkirmishDialog from './_SelSkirmishDialog.vue'

import Vue from 'vue'
import { ActivationType } from '@/classes/enums'

export default Vue.extend({
  name: 'skirmish-dialog',
  components: { ActionDetailExpander, ItemSelectorRow, WSkirmishDialog },
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
    completeSkirmish() {
      this.state.CommitAction(this.action, ActivationType.Quick)
      this.hide()
    },
    skirmish(item, mount) {
      this.selected = item
      this.selectedMount = mount
      this.$refs.s_dialog.show()
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
