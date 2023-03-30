<template>
  <v-simple-table class="mb-2 text-left">
    <thead>
      <th class="pl-3">Encounter</th>
      <th class="pl-3" v-if="active">Campaign</th>
      <th class="pl-3" v-else>Index</th>
      <th class="pl-3">SITREP</th>
      <th class="pl-3">NPCs</th>
      <th class="pl-3" v-if="active">Pilots</th>
      <th class="pl-3" v-if="active">Turn</th>
      <th class="pl-3" v-else></th>
    </thead>
    <tbody>
      <encounter-row-item
        v-for="(e, i) in encounters"
        :encounter="e"
        :active="active"
      />
    </tbody>
  </v-simple-table>
</template>

<script lang="ts">
import EncounterRowItem from './EncounterRowItem.vue';

export default {
  name: 'encounter-table',
  components: { EncounterRowItem },
  // props: {encounters: {type: Array, required: true}}
  props: { active: { type: Boolean } },
  data: () => ({
    encounters: [1, 2, 3],
  }),
};
</script>
