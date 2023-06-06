<template>
  <div>
    <v-card-text v-if="mech.Pilot.State.IsMounted" class="pt-3">
      <cc-active-synergy :locations="['returnFire']" :mech="mech" />
      <action-detail-expander :action="action" />
      <v-divider class="my-3" />
      <v-container style="max-width: 800px">
        <div v-for="(m, i) in mech.MechLoadoutController.ActiveLoadout.Mounts" :key="`bar_${i}`">
          <item-selector-row
            v-for="(w, j) in m.Weapons.filter(
              x => x.Size === 'Auxiliary' && !x.Destroyed && !x.NoAttack
            )"
            :key="`weap_${j}`"
            :item="w"
            color="action--reaction"
            @click="returnFire(w, m)"
          />
        </div>
      </v-container>
    </v-card-text>

    <w-skirmish-dialog
      ref="s_dialog"
      :mech="mech"
      :item="selected"
      :mount="selectedMount"
      returnFire
      @confirm="completeReturnFire($event)"
    />
  </div>
</template>

<script lang="ts">
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue'
import ItemSelectorRow from '../../components/_ItemSelectorRow.vue'
import WSkirmishDialog from './_SelSkirmishDialog.vue'

import Vue from 'vue'

export default Vue.extend({
  name: 'return-fire-dialog',
  components: {
    ActionDetailExpander,
    ItemSelectorRow,
    WSkirmishDialog,
  },
  props: {
    used: { type: Boolean },
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
    completeReturnFire(free) {
      this.state.CommitAction(this.action, free)
    },
    returnFire(item, mount) {
      this.selected = item
      this.selectedMount = mount
      this.$refs.s_dialog.show()
    },
  },
})
</script>
