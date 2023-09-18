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
      <template #[`item.NpcTemplateController.Templates`]="{ item }">
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
  { title: 'Name', value: 'Name' },
  {
    title: 'Alias',
    value: 'Alias',
  },
  { title: 'Title', value: 'Title' },
  { title: 'Campaign', value: 'Campaign' },
];

const pilotHeaders = [
  {
    title: 'Callsign',
    align: 'start',
    value: 'Callsign',
  },
  { title: 'LL', value: 'Level' },
  { title: 'Name', value: 'Name' },
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
