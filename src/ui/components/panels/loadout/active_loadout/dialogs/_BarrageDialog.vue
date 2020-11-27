<template>
  <div>
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
          :disabled="disableBarrage(w)"
          color="action--quick"
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
          color="action--full"
          :disabled="disableShBarrage(w)"
          :selected="barrageToggle(w)"
          @click="setSHBarrage(w, m)"
        />
      </div>
    </v-container>

    <w-barrage-dialog ref="b_dialog" :mech="mech" @close="completeBarrage()" />
    <sh-barrage-dialog ref="sh_b_dialog" :mech="mech" @close="completeBarrage()" />
  </div>
</template>

<script lang="ts">
import ActionDetailExpander from '../components/_ActionDetailExpander.vue'
import ItemSelectorRow from '../components/_ItemSelectorRow.vue'
import WBarrageDialog from './_SelBarrageDialog.vue'
import ShBarrageDialog from './_SelSHBarrageDialog.vue'

import Vue from 'vue'

export default Vue.extend({
  name: 'barrage-dialog',
  components: {
    ActionDetailExpander,
    WBarrageDialog,
    ShBarrageDialog,
    ItemSelectorRow,
  },
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
  computed: {
    state() {
      return this.mech.Pilot.State
    },
  },
  methods: {
    disableShBarrage(w) {
      if (w.IsLoading && !w.Loaded) return true
      if (w.IsOrdnance && !this.state.IsProtocolAvailable) return true
      return w.Used || this.state.BarrageSelections.length > 0 || this.state.Actions < 2
    },
    disableBarrage(w) {
      if (w.IsLoading && !w.Loaded) return true
      if (w.IsOrdnance && !this.state.IsProtocolAvailable) return true
      return w.Used || this.state.Actions < 2
    },
    barrageToggle(w) {
      return this.state.BarrageSelections.some(x => x === w)
    },
    setBarrage(item, mount) {
      if (this.state.BarrageSelections.some(x => x === item)) this.state.ClearBarrageSelections()
      else if (this.state.BarrageSelections.length < 2) {
        this.state.SelectBarrage(item, mount)
        if (this.state.BarrageSelections.length === 2) {
          this.$refs.b_dialog.show()
        }
      }
    },
    setSHBarrage(item, mount) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this
      Vue.nextTick()
        .then(() => self.state.SelectShBarrage(item, mount))
        .then(() => Vue.nextTick().then(() => self.$refs.sh_b_dialog.show()))
    },
    completeBarrage() {
      this.$emit('use')
    },
    undoBarrage() {
      this.$emit('undo')
    },
  },
})
</script>
