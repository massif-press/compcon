<template>
  <cc-compendium-browser
    :items="reserves"
    item-type="Reserve"
    :table-headers="headers"
    :options="options"
    equippable
    @equip="add($event)">
    <template #header>
      <v-btn
        size="small"
        height="20"
        color="secondary"
        class="mb-1"
        block
        @click="CustomDialog = true">
        Add Custom Reserve
      </v-btn>
      <v-btn
        size="small"
        height="20"
        color="secondary"
        class="mb-1"
        block
        @click="ProjectDialog = true">
        Add Downtime Project
      </v-btn>
      <v-btn
        size="small"
        height="20"
        color="secondary"
        class="mb-1"
        block
        @click="OrgDialog = true">
        Add Organization
      </v-btn>
    </template>
  </cc-compendium-browser>

  <v-dialog v-model="CustomDialog" width="60vw">
    <custom-reserve-panel @add="add($event)" />
  </v-dialog>
  <v-dialog v-model="ProjectDialog" width="60vw">
    <downtime-project-panel @add="add($event)" />
  </v-dialog>
  <v-dialog v-model="OrgDialog" width="60vw"><organization-panel @add="addOrg($event)" /></v-dialog>

  <!-- <v-window v-model="tab">
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

      </v-window-item>
    </v-window> -->
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
    headers: [
      { title: 'Content Pack', key: 'LcpName' },
      { title: 'Name', key: 'Name' },
      { title: 'Type', key: 'Type' },
    ],
    options: {
      views: ['list', 'cards', 'table'],
      initialView: 'cards',
      groups: ['lcp', 'type'],
      initialGroup: 'type',
      noSource: true,
    },
    CustomDialog: false,
    ProjectDialog: false,
    OrgDialog: false,
  }),
  computed: {
    reserves() {
      return _.orderBy(
        CompendiumStore().Reserves.filter((x) => !x.IsHidden),
        'Name'
      );
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
