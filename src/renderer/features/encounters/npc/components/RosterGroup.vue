<template>
  <v-menu offset-y open-on-hover>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-select-group</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-subheader>GROUP NPCS BY</v-subheader>
      <v-list-item v-for="g in groups" :key="g.name" @click="$emit('set', g.val)">
        <v-list-item-title>{{ g.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'roster-group',
  data: () => ({
    groups: [
      { name: 'None', val: null },
      { name: 'Role', val: 'Role' },
      { name: 'Class', val: 'Class' },
      { name: 'Labels', val: 'Labels' },
      { name: 'Campaign', val: 'Campaign' },
      { name: 'Tier', val: 'Tier' },
    ],
  }),
})
</script>
