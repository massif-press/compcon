<template>
  <v-footer fixed style="padding-bottom: 2px; border-top: 2px solid var(--v-primary-base)">
    <v-slide-y-transition group leave-absolute>
      <div v-if="state.Stage === 'Narrative'" :key="'a-ftr-narrative'">
        <span>Narrative</span>
        <v-btn small @click="state.StartCombat()">start mission</v-btn>
      </div>
      <div v-if="state.Stage === 'Combat'" :key="'a-ftr-combat'">
        <span>Combat</span>
        <v-btn small @click="state.StartDowntime()">end mission</v-btn>
        <v-btn small @click="state.StartRest()">start rest</v-btn>
      </div>
      <div v-if="state.Stage === 'Rest'" :key="'a-ftr-rest'">
        <span>Rest</span>
        <v-btn small @click="state.StartCombat()">start combat</v-btn>
        <v-btn small @click="state.StartDowntime()">end mission</v-btn>
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
import ActionMenuButton from '../components/ActionMenuButton.vue'
import activePilot from '@/features/pilot_management/mixins/activePilot'
import vueMixins from '@/util/vueMixins'

export default vueMixins(activePilot).extend({
  name: 'turn-footer',
  components: { ActionMenuButton },
  computed: {
    state() {
      return this.pilot.State
    },
  },
})
</script>
