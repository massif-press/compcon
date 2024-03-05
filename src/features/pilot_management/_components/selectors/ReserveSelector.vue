<template>
  <v-tabs v-model="tab" color="accent" grow>
    <v-tab>
      <b>Pilot Bonuses</b>
    </v-tab>
    <v-tab>
      <b>Resource Reserves</b>
    </v-tab>
    <v-tab>
      <b>Tactical Reserves</b>
    </v-tab>
    <v-tab>
      <b>Mech Reserves</b>
    </v-tab>
    <v-tab>
      <b>Custom Reserve</b>
    </v-tab>
    <v-tab>
      <b>Project</b>
    </v-tab>
    <v-tab>
      <b>Organization</b>
    </v-tab>
  </v-tabs>
  <v-container>
    <v-window v-model="tab">
      <v-window-item :value="0">
        <v-row density="compact">
          <v-col v-for="r in reserves['Bonus']" cols="12" md="6">
            <reserve-item :reserve="r" icon="cc:pilot" color="pilot" @click="add(r)" />
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item :value="1">
        <v-row density="compact">
          <v-col v-for="r in reserves['Resource']" cols="12" md="6">
            <reserve-item
              :reserve="r"
              icon="cc:reserve_resource"
              color="reserve--resource"
              @click="add(r)" />
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item :value="2">
        <v-row density="compact">
          <v-col v-for="r in reserves['Tactical']" cols="12" md="6">
            <reserve-item
              :reserve="r"
              icon="cc:reserve_tactical"
              color="reserve--tactical"
              @click="add(r)" />
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item :value="3">
        <v-row density="compact">
          <v-col v-for="r in reserves['Mech']" cols="12" md="6">
            <reserve-item
              :reserve="r"
              icon="cc:reserve_mech"
              color="reserve--mech"
              @click="add(r)" />
          </v-col>
        </v-row>
      </v-window-item>
      <v-window-item :value="4">
        <custom-reserve-panel @add="add($event)" />
      </v-window-item>
      <v-window-item :value="5">
        <downtime-project-panel @add="add($event)" />
      </v-window-item>
      <v-window-item :value="6">
        <organization-panel @add="addOrg($event)" />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script lang="ts">
import ReserveItem from './components/_ReserveItem.vue';
import CustomReservePanel from './components/_CustomReservePanel.vue';
import DowntimeProjectPanel from './components/_DowntimeProjectPanel.vue';
import OrganizationPanel from './components/_OrganizationPanel.vue';
import { Reserve, Organization, Pilot, CompendiumItem } from '@/class';
import _, { Dictionary } from 'lodash';
import { CompendiumStore } from '@/stores';

export default {
  name: 'CCReserveSelector',
  components: {
    ReserveItem,
    CustomReservePanel,
    DowntimeProjectPanel,
    OrganizationPanel,
  },
  props: {
    pilot: {
      type: Object,
      required: true,
    },
  },
  emits: ['close'],
  data: () => ({
    tab: 0,
  }),
  computed: {
    reserves(): Dictionary<Reserve[]> {
      return _.groupBy(CompendiumStore().Reserves, 'Type');
    },
  },
  methods: {
    add(reserve: Reserve): void {
      this.pilot.ReservesController.AddReserve(CompendiumItem.Clone(reserve));
      this.$emit('close');
    },
    addOrg(org: Organization): void {
      this.pilot.ReservesController.AddOrganization(Organization.Clone(org));
      this.$emit('close');
    },
  },
};
</script>
