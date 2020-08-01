<template>
  <v-footer fixed>
    <v-btn small @click="clicked = !clicked">ttt</v-btn>
    <v-slide-y-transition leave-absolute>
      <div v-if="!clicked">
        <v-btn small>start combat</v-btn>
        <v-btn small>complete mission</v-btn>
      </div>
      <div v-else>
        ROUND X >>
        <v-btn small>start turn</v-btn>
        <v-btn small>end turn</v-btn>
        <v-btn small>next round</v-btn>
        <v-btn small>end combat</v-btn>
      </div>
    </v-slide-y-transition>
    <v-spacer />

    <action-menu-button :actions="state.Protocols" color="action--protocol" title="PROTOCOLS">
      <v-icon slot="icon" size="40">cci-protocol</v-icon>
    </action-menu-button>

    <v-divider vertical class="mx-3" />
    <action-menu-button :actions="state.MoveActions" color="action--move" title="MOVEMENT">
      <v-icon slot="icon" size="30">mdi-arrow-right-bold-hexagon-outline</v-icon>
    </action-menu-button>

    <action-menu-button :actions="state.FullActions" color="action--full" title="FULL ACTIONS">
      <v-icon slot="icon" size="30">mdi-hexagon-slice-6</v-icon>
    </action-menu-button>

    <action-menu-button :actions="state.QuickActions" color="action--quick" title="QUICK ACTIONS">
      <v-icon slot="icon" size="30">mdi-hexagon-slice-3</v-icon>
    </action-menu-button>

    <action-menu-button :actions="state.Reactions" color="action--reaction" title="REACTIONS">
      <v-icon slot="icon" size="35">cci-reaction</v-icon>
    </action-menu-button>

    <action-menu-button :actions="state.FreeActions" color="action--free" title="FREE ACTIONS">
      <v-icon slot="icon" size="35">cci-free-action</v-icon>
    </action-menu-button>

    <v-divider vertical class="mx-3" />

    <action-menu-button :actions="state.Protocols" color="primary" title="DATA">
      <v-icon slot="icon" size="25">mdi-notebook</v-icon>
    </action-menu-button>

    <action-menu-button :actions="state.Protocols" color="primary" title="ACTIONS">
      <v-icon slot="icon" size="30">mdi-dots-vertical</v-icon>
    </action-menu-button>
  </v-footer>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionMenuButton from '../components/ActionMenuButton.vue'

export default Vue.extend({
  name: 'turn-footer',
  components: { ActionMenuButton },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    clicked: false,
  }),
  computed: {
    state() {
      return this.pilot.ActiveMech.State
    },
  },
})
</script>
