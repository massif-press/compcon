<template>
  <v-row no-gutters>
    <v-col class="heading h2 text-accent">
      <cc-short-string-editor large @set="combatant.actor.Name = $event">
        {{ combatant.actor.Name }}
      </cc-short-string-editor>
    </v-col>
    <v-col v-if="combatant.actor.Player" cols="auto">
      <span class="text-cc-overline pr-1">Played by</span>
      <b class="text-accent">{{ combatant.actor.Player }}</b>
    </v-col>
  </v-row>

  <v-row dense class="mt-n1">
    <v-col :order="mounted ? 0 : 1" v-if="mech" :cols="view === 'mech' ? '' : 'auto'">
      <cc-button
        size="small"
        :color="view === 'mech' ? 'primary' : 'panel'"
        block
        @click="view = 'mech'">
        {{ mech.Name }}
        <template #subtitle>
          <span v-if="mounted" class="text-disabled">
            <cc-slashes />
            PILOT MOUNTED
          </span>
        </template>
      </cc-button>
    </v-col>
    <v-col :cols="view === 'pilot' ? '' : 'auto'">
      <cc-button
        size="small"
        :color="view === 'pilot' ? 'primary' : 'panel'"
        block
        @click="view = 'pilot'">
        {{ combatant.actor.Callsign }}
        <template #subtitle>
          <span v-if="!mounted" class="text-disabled">
            <cc-slashes />
            PILOT UNMOUNTED
          </span>
        </template>
      </cc-button>
    </v-col>
  </v-row>

  <!-- <v-window v-model="view">
    <v-window-item value="mech">
      <mech-panel :encounter-instance="encounterInstance" v-if="mech" :combatant="combatant" />
    </v-window-item>
    <v-window-item value="pilot">
      <pilot-panel :encounter-instance="encounterInstance" :combatant="combatant" />
    </v-window-item>
  </v-window> -->
</template>

<script>
import MechPanel from './MechPanel.vue';
import PilotPanel from './PilotPanel.vue';

export default {
  name: 'PcPanel',
  components: {
    MechPanel,
    PilotPanel,
  },
  props: {
    combatant: {
      type: Object,
      required: true,
    },
    encounterInstance: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    view: 'mech', // default view
  }),
  computed: {
    mech() {
      return this.combatant.actor.ActiveMech;
    },
    mounted() {
      if (!this.mech) return false;
      return this.mech.CombatController.Mounted;
    },
  },
};
</script>
