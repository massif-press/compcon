<template>
  <div class="py-3">
    <v-data-table
      v-model="selected"
      :items="pilots"
      :headers="headers"
      :items-per-page="-1"
      show-select
      hide-default-footer
      item-key="ID"
    />
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
import { Pilot } from '@/classes/pilot/Pilot'
import Vue from 'vue'
export default Vue.extend({
  name: 'mass-delete',
  props: {
    pilots: { type: Array, required: true },
  },
  data: () => ({
    selected: [],
    headers: [
      {
        text: 'Callsign',
        align: 'start',
        value: 'Callsign',
      },
      { text: 'LL', value: 'Level' },
      { text: 'Name', value: 'Name' },
      { text: 'Active Mech', value: 'State.ActiveMech.Name' },
      { text: 'Group', value: 'GroupController.Group' },
    ],
  }),
  methods: {
    commit() {
      this.selected.forEach((p: Pilot) => {
        p.SaveController.delete()
      })
      this.$set(this, 'selected', [])
    },
  },
})
</script>
