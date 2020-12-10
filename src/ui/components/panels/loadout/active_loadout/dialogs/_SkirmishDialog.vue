<template>
  <div>
    <action-detail-expander :action="action" />
    <v-divider class="my-3" />
    <v-container style="max-width: 800px">
      {{ state.IsSkirmishAvailable }}
      <div v-for="(m, i) in mech.ActiveLoadout.Mounts" :key="`bar_${i}`">
        <item-selector-row
          v-for="(w, j) in m.Weapons.filter(x => x.Size !== 'Superheavy' && !x.Destroyed)"
          :key="`weap_${j}`"
          :item="w"
          color="action--quick"
          :disabled="disableSkirmish(w)"
          @click="skirmish(w, m)"
        />
      </div>
    </v-container>

    <w-skirmish-dialog
      ref="s_dialog"
      :mech="mech"
      :item="selected"
      :mount="selectedMount"
      @confirm="confirmSkirmish($event)"
    />
  </div>
</template>

<script lang="ts">
import ActionDetailExpander from '../components/_ActionDetailExpander.vue'
import ItemSelectorRow from '../components/_ItemSelectorRow.vue'
import WSkirmishDialog from './_SelSkirmishDialog.vue'

import Vue from 'vue'

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
    selected: null,
    selectedMount: null,
  }),
  computed: {
    state() {
      return this.mech.Pilot.State
    },
  },
  methods: {
    disableSkirmish(w) {
      console.log(w.Name)
      if (w.IsLoading && !w.Loaded) return true
      if (w.IsOrdnance && !this.state.IsProtocolAvailable) return true
      if (!w.CanSkirmish) return false
      console.log('should be okay')
      console.log(this.state.IsSkirmishAvailable)
      return !this.state.IsSkirmishAvailable
    },
    skirmish(item, mount) {
      Vue.nextTick().then(() => {
        this.$refs.s_dialog.init()
      })
      Vue.nextTick().then(() => {
        this.selected = item
        this.selectedMount = mount
      })
      Vue.nextTick().then(() => {
        this.$refs.s_dialog.show()
      })
    },
    confirmSkirmish(free) {
      this.state.RegisterSkirmish(free)
    },
  },
})
</script>
