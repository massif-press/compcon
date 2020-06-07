<template>
  <v-menu offset-y open-on-hover>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-sort</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item v-for="s in sorts" :key="s.name">
        <v-list-item-title>{{ s.name }}</v-list-item-title>
        <v-spacer class="ml-3" />
        <v-btn icon class="pa-0 ma-0" @click="sortBy(s.field, 'asc')">
          <v-icon color="primary">mdi-sort-ascending</v-icon>
        </v-btn>
        <v-btn icon class="pa-0 ma-0" @click="sortBy(s.field, 'desc')">
          <v-icon color="primary">mdi-sort-descending</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'roster-sort',
  props: {
    pilots: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    sorts: [
      { name: 'Created', field: '' },
      { name: 'Callsign', field: 'Callsign' },
      { name: 'Name', field: 'Name' },
      { name: 'License Level', field: 'Level' },
    ],
  }),
  methods: {
    sortBy(field: string, direction: string) {
      const vm = this as any
      vm.$emit('sort', [field, direction])
    },
  },
})
</script>
