<template>
  <v-row no-gutters>
    <v-col class="heading h2 text-accent">
      {{ combatant.actor.Callsign }}
      <span class="text-cc-overline text-text">
        <cc-slashes />
        {{ combatant.actor.Name }}
      </span>
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

  <v-window v-model="view">
    <v-window-item value="mech">
      <mech-panel :encounter-instance="encounterInstance" v-if="mech" :combatant="combatant" />
    </v-window-item>
    <v-window-item value="pilot">
      <pilot-panel :encounter-instance="encounterInstance" :combatant="combatant" />
    </v-window-item>
  </v-window>

  <v-card flat tile>
    <div class="pa-2 mt-2">
      <v-row dense align="center" class="mb-2">
        <v-col>
          <div class="text-cc-overline text-disabled">reserves</div>
        </v-col>
        <v-col cols="auto" class="ml-auto">
          <cc-switch
            v-model="unusedOnly"
            :label="!unusedOnly ? 'Unused Only' : 'All'"
            inset
            dense />
        </v-col>
      </v-row>
      <div v-if="!orderedReserves.length" class="mt-n4 mb-4">
        <i class="text-disabled text-caption">No reserves available</i>
      </div>
      <v-row v-for="r in orderedReserves" dense>
        <v-col>
          <cc-reserve-item :reserve="r" small />
        </v-col>
        <v-col cols="auto">
          <cc-checkbox v-model="r.Used" color="primary" inset dense />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import { ReserveType } from '@/class';
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
    unusedOnly: false,
  }),
  computed: {
    mech() {
      return this.combatant.actor.ActiveMech;
    },
    mounted() {
      if (!this.mech) return false;
      return this.mech.CombatController.Mounted;
    },
    orderedReserves() {
      const r = this.combatant.actor.ReservesController.Reserves.filter(
        (x) => x.Type !== ReserveType.Organization && x.Type !== ReserveType.Project
      );
      if (!this.unusedOnly) {
        return r.filter((x) => !x.Used).sort((a, b) => a.ResourceLabel.localeCompare(b.Name));
      }
      return r.sort((a, b) => {
        if (a.Used && !b.Used) return 1;
        if (!a.Used && b.Used) return -1;
        return a.Name.localeCompare(b.Name);
      });
    },
  },
};
</script>
