<template>
  <cc-compendium-browser
    :items="reserves"
    item-type="Reserve"
    :table-headers="headers"
    :options="options"
    equippable
    @equip="add($event)">
    <template #header>
      <cc-button size="x-small" color="secondary" class="mb-1" block @click="CustomDialog = true">
        Add Custom Reserve
      </cc-button>
      <cc-button size="x-small" color="secondary" class="mb-1" block @click="ProjectDialog = true">
        Add Downtime Project
      </cc-button>
      <cc-button size="x-small" color="secondary" class="mb-1" block @click="OrgDialog = true">
        Add Organization
      </cc-button>
    </template>
  </cc-compendium-browser>

  <cc-solo-modal
    v-model="CustomDialog"
    max-width="60vw"
    shrink
    title="Add Custom Reserve"
    icon="cc:orbital">
    <custom-reserve-panel @add="add($event)" />
  </cc-solo-modal>
  <cc-solo-modal
    v-model="ProjectDialog"
    max-width="60vw"
    shrink
    title="Add Project"
    icon="cc:orbital">
    >
    <downtime-project-panel @add="add($event)" />
  </cc-solo-modal>
  <cc-solo-modal
    v-model="OrgDialog"
    max-width="60vw"
    shrink
    title="Add Organization"
    icon="cc:orbital">
    <organization-panel @add="addOrg($event)" />
  </cc-solo-modal>
</template>

<script lang="ts">
import ReserveItem from './components/_ReserveItem.vue';
import CustomReservePanel from './components/_CustomReservePanel.vue';
import DowntimeProjectPanel from './components/_DowntimeProjectPanel.vue';
import OrganizationPanel from './components/_OrganizationPanel.vue';
import { Reserve, Organization, Pilot, CompendiumItem } from '@/class';
import _ from 'lodash';
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
