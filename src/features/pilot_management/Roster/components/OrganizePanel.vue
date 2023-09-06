<template>
  <div class="py-3">
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items-per-page="-1"
      show-select
      hide-default-footer
      item-key="ID"
    >
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
  name: 'organize',
  data: () => ({
    selected: [],
    headers: [],
  }),
  methods: {
    commit() {
      console.log('commit');
    },
  },
};
</script>
