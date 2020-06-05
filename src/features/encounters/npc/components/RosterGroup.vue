<template>
  <v-menu offset-y open-on-hover>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon>mdi-select-group</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-subheader class="heading h2 white--text primary py-0 px-2 mt-n3">
        Group NPCs By
      </v-subheader>
      <v-list-item
        v-for="g in groups"
        :key="g.name"
        class="flavor-text"
        @click="$emit('set', g.val)"
      >
        <v-list-item-icon class="ma-0 mr-2 mt-3">
          <v-icon>{{ g.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ g.name }}</v-list-item-title>
        </v-list-item-content>
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
      { name: 'None', val: null, icon: 'mdi-close' },
      { name: 'Role', val: 'Class.Role', icon: 'cci-role-striker' },
      { name: 'Class', val: 'Class.Name', icon: 'mdi-rhombus-outline' },
      { name: 'Labels', val: 'Labels', icon: 'mdi-label-outline' },
      { name: 'Campaign', val: 'Campaign', icon: 'mdi-map' },
      { name: 'Tier', val: 'Tier', icon: 'cci-rank-3' },
      { name: 'Power Rating', val: 'PowerTier', icon: 'mdi-battery-80' },
    ],
  }),
  methods: {
    flatten(val) {
      if (!val.length) return ''
      if (Array.isArray(val)) return val.join(' ,')
      return val
    },
  },
})
</script>
