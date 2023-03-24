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
        <v-btn small color="accent" @click="commit()">Print</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
const characterHeaders = [
  { text: 'Name', value: 'Name' },
  {
    text: 'Alias',
    value: 'Alias',
  },
  { text: 'Title', value: 'Title' },
  { text: 'Campaign', value: 'Campaign' },
];

const pilotHeaders = [
  {
    text: 'Callsign',
    align: 'start',
    value: 'Callsign',
  },
  { text: 'LL', value: 'Level' },
  { text: 'Name', value: 'Name' },
  { text: 'Group', value: 'GroupController.Group' },
];

const npcHeaders = [
  {
    text: 'Name',
    align: 'start',
    value: 'Name',
  },
  { text: 'Tier', value: 'NpcClassController.Tier' },
  { text: 'Class', value: 'NpcClassController.Class.Name' },
  { text: 'Templates', value: 'NpcTemplateController.Templates' },
  { text: 'Campaign', value: 'Campaign' },
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
    const type = this.items[0].ItemType.toLowerCase();
    switch (type) {
      case 'pilot':
        this.headers = pilotHeaders;
        break;
      case 'npc':
        this.headers = npcHeaders;
        break;
      case 'character':
        this.headers = characterHeaders;
        break;
      default:
        console.error('no headers for', type);
        break;
    }
  },
  methods: {
    commit() {
      const type = this.items[0].ItemType.toLowerCase();
      console.log(type);
      const ids = this.selected.map((x) => x.ID).join(',');
      this.$router.push(`mass-print/${type}/${ids}`);
    },
  },
};
</script>
