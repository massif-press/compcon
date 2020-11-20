<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.mdAndDown"
    :style="$vuetify.breakpoint.mdAndDown ? `x-overflow: hidden` : ''"
    width="90vw"
  >
    <v-card tile class="background">
      <action-titlebar :action="action" :mech="mech" @hide="hide()" />

      <v-card-text class="pt-3">
        <action-detail-expander :action="action" />
        <v-divider class="my-3" />
        <v-container v-if="Object.keys(actions).length" style="max-width: 800px">
          <div v-for="(k, i) in Object.keys(actions)" :key="`sys_act_${i}`">
            <div class="flavor-text mb-n2 mt-1">{{ k }}</div>
            <item-selector-row
              v-for="(a, j) in actions[k]"
              :key="`action_${j}`"
              :item="a"
              @click="activate(a)"
            />
          </div>
        </v-container>
        <v-card v-else flat tile class="panel clipped">
          <v-row justify="center" align="center">
            <v-col class="heading h3" style="opacity: 0.3" cols="auto">
              / / NO ACTIONS AVAILABLE / /
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>

      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" tile @click="dialog = false">DISMISS</v-btn>
      </v-card-actions>
    </v-card>
    <item-dialog ref="i_dialog" :mech="mech" :action="selected" @close="hide()" />
  </v-dialog>
</template>

<script lang="ts">
import _ from 'lodash'
import ActionDetailExpander from '../components/_ActionDetailExpander.vue'
import ItemSelectorRow from '../components/_ItemSelectorRow.vue'
import ItemDialog from './_ItemActionDialog.vue'
import ActionTitlebar from '../components/_ActionTitlebar.vue'

import Vue from 'vue'

export default Vue.extend({
  name: 'quick-activation-dialog',
  components: { ActionDetailExpander, ItemDialog, ItemSelectorRow, ActionTitlebar },
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
  }),
  computed: {
    state() {
      return this.mech.Pilot.State
    },
    actions() {
      return _.groupBy(this.state.ItemActions('Quick'), 'Origin')
    },
  },
  created() {
    this.selected = this.action
  },
  methods: {
    activate(action) {
      this.selected = action
      this.$refs.i_dialog.show()
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
