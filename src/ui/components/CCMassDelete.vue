<template>
  <div class="py-3">
    <v-data-table
      v-if="items.length"
      v-model="selected"
      :items="items"
      :headers="headers"
      :items-per-page="-1"
      show-select
      hide-default-footer
      item-key="ID"
    >
      <template v-slot:[`item.NpcTemplateController.Templates`]="{ item }">
        {{ item.NpcTemplateController.Templates.map((x) => x.Name).join(', ') }}
      </template>
    </v-data-table>
    <v-divider class="my-4" />
    <v-row justify="end" align="center">
      <v-col cols="auto">{{ selected.length }} items selected</v-col>
      <v-col cols="auto">
        <v-btn small color="error" @click="commit()">Delete</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { ISaveable } from '@/classes/components';

const pilotHeaders = [
  {
    title: 'Callsign',
    align: 'start',
    value: 'Callsign',
  },
  { title: 'LL', value: 'Level' },
  { title: 'Name', value: 'Name' },
  { title: 'Active Mech', value: 'State.ActiveMech.Name' },
  { title: 'Group', value: 'GroupController.Group' },
];

const npcHeaders = [
  {
    title: 'Name',
    align: 'start',
    value: 'Name',
  },
  { title: 'Tier', value: 'NpcClassController.Tier' },
  { title: 'Class', value: 'NpcClassController.Class.Name' },
  { title: 'Templates', value: 'NpcTemplateController.Templates' },
  { title: 'Campaign', value: 'Campaign' },
];

export default {
  name: 'mass-delete',
  props: {
    items: { type: Array, required: true },
  },
  data: () => ({
    selected: [],
    headers: [],
  }),
  mounted() {
    if (!this.items) return;
    if (this.items[0].Callsign) this.headers = pilotHeaders;
    else this.headers = npcHeaders;
  },
  methods: {
    commit() {
      this.selected.forEach((i: ISaveable) => {
        i.SaveController.delete();
      });
      this.$set(this, 'selected', []);
    },
  },
};
</script>
