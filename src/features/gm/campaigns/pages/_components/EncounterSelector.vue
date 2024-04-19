<template>
  <v-card>
    <v-toolbar density="compact">
      <v-toolbar-title>Select Encounter</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
    </v-toolbar>
    <v-text-field
      v-model="search"
      clearable
      density="compact"
      prepend-inner-icon="mdi-magnify"
      hide-details />
    <v-card-text>
      <div v-for="(encounter, i) in encounters" @click="$emit('select', encounter)">
        <gm-encounter-list-item :odd="i % 2 === 0" :item="encounter" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { EncounterStore } from '@/stores';
import GmEncounterListItem from '@/features/gm/_views/_components/gmItemCards/GMEncounterListItem.vue';

export default {
  name: 'campaign-encounter-selector',
  components: { GmEncounterListItem },
  data: () => ({
    search: '',
  }),
  emits: ['select', 'close'],
  computed: {
    encounters() {
      return EncounterStore()
        .Encounters.filter((x) => !x.SaveController.IsDeleted)
        .filter((x) => x.Name.toLowerCase().includes(this.search.toLowerCase()));
    },
  },
  methods: {},
};
</script>
