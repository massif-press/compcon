<template>
  <div>
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

    <sel-fight-dialog
      ref="f_dialog"
      :pilot="mech.Pilot"
      :item="selected"
      @close="completeFight()"
    />
  </div>
</template>

<script lang="ts">
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue'
import ItemSelectorRow from '../../components/_ItemSelectorRow.vue'
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
  },
})
</script>
