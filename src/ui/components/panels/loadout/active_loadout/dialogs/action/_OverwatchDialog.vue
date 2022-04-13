<template>
  <div>
    <v-card-text v-if="mech.Pilot.State.IsMounted" class="pt-3">
      <cc-active-synergy :locations="['overwatch']" :mech="mech" />
      <action-detail-expander :action="action" />
      <v-divider class="my-3" />
      <v-container style="max-width: 800px">
        <div v-for="(m, i) in mech.MechLoadoutController.ActiveLoadout.Mounts" :key="`bar_${i}`">
          <item-selector-row
            v-for="(w, j) in m.Weapons.filter(
              x => x.Size !== 'Superheavy' && !x.Destroyed && !x.NoAttack
            )"
            :key="`weap_${j}`"
            :item="w"
            overwatch
            color="action--reaction"
            @click="overwatch(w, m)"
          />
        </div>
      </v-container>
    </v-card-text>
    <v-card-text v-else class="pt-3">
      <action-detail-expander :action="action" />
      <v-divider class="my-3" />
      <v-container style="max-width: 800px">
        <item-selector-row
          v-for="(w, j) in mech.Pilot.Loadout.Weapons"
          :key="`weap_${j}`"
          :item="w"
          color="action--reaction"
          @click="pilotOverwatch(w)"
        />
      </v-container>
    </v-card-text>

    <w-skirmish-dialog
      ref="s_dialog"
      :mech="mech"
      :item="selected"
      :mount="selectedMount"
      overwatch
      @confirm="completeOverwatch($event)"
    />

    <sel-fight-dialog
      ref="f_dialog"
      :pilot="mech.Pilot"
      :item="selected"
      overwatch
      @confirm="completeOverwatch($event)"
    />
  </div>
</template>

<script lang="ts">
import ActionDetailExpander from '../../components/_ActionDetailExpander.vue'
import ItemSelectorRow from '../../components/_ItemSelectorRow.vue'
import WSkirmishDialog from './_SelSkirmishDialog.vue'
import SelFightDialog from './_SelFightDialog.vue'

import Vue from 'vue'

export default Vue.extend({
  name: 'overwatch-dialog',
  components: {
    ActionDetailExpander,
    ItemSelectorRow,
    WSkirmishDialog,
    SelFightDialog,
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
    completeOverwatch(free) {
      this.state.CommitAction(this.action, free)
    },
    pilotOverwatch(item) {
      this.selected = item
      this.$refs.f_dialog.show()
    },
    overwatch(item, mount) {
      this.selected = item
      this.selectedMount = mount
      this.$refs.s_dialog.show()
    },
  },
})
</script>
