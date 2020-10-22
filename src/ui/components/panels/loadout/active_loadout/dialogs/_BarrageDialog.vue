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
        Barrage
        <v-btn slot="items" dark icon @click="hide">
          <v-icon large left>close</v-icon>
        </v-btn>
      </cc-titlebar>

      <v-card-text class="pt-3">
        <action-detail-expander :action="action" />
        <v-divider class="my-3" />
        <v-container style="max-width: 800px">
          <div class="text-center heading h3 text--text my-3">
            Select two weapons or one Superheavy weapon
          </div>
          <div v-for="(m, i) in mech.ActiveLoadout.Mounts" :key="`bar_${i}`">
            <item-selector-row
              v-for="(w, j) in m.Weapons.filter(x => x.Size !== 'Superheavy' && !x.Destroyed)"
              :key="`weap_${j}`"
              :item="w"
              :selected="barrageToggle(w)"
              @click="setBarrage(w, m)"
            />
            <v-divider
              v-if="m.Weapons.some(x => x.Size === 'Superheavy' && !x.Destroyed)"
              class="my-2"
            />
            <item-selector-row
              v-for="(w, j) in m.Weapons.filter(x => x.Size === 'Superheavy' && !x.Destroyed)"
              :key="`weap_${j}`"
              :item="w"
              :selected="barrageToggle(w)"
              @click="setBarrage(w, m)"
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

    <w-barrage-dialog ref="b_dialog" :mech="mech" @close="hide()" />
    <sh-barrage-dialog ref="sh_b_dialog" :mech="mech" @close="hide()" />
  </v-dialog>
</template>

<script lang="ts">
import ActionDetailExpander from '../components/_ActionDetailExpander.vue'
import ItemSelectorRow from '../components/_ItemSelectorRow.vue'
import WBarrageDialog from './_SelBarrageDialog.vue'
import ShBarrageDialog from './_SelSHBarrageDialog.vue'

import Vue from 'vue'
import { WeaponSize } from '@/class'

export default Vue.extend({
  name: 'barrage-dialog',
  components: { ActionDetailExpander, WBarrageDialog, ShBarrageDialog, ItemSelectorRow },
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
  }),
  computed: {
    state() {
      return this.mech.Pilot.State
    },
  },
  methods: {
    barrageToggle(w) {
      return this.state.BarrageSelections.some(x => x === w)
    },
    setBarrage(item, mount) {
      if (item.Size === WeaponSize.Superheavy) {
        this.$refs.sh_b_dialog.show()
      }
      if (this.state.BarrageSelections.some(x => x === item)) this.state.ClearBarrageSelections()
      else if (this.state.BarrageSelections.length < 2) {
        this.state.SelectBarrage(item, mount)
        if (this.state.BarrageSelections.length === 2) {
          this.$refs.b_dialog.show()
        }
      }
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
