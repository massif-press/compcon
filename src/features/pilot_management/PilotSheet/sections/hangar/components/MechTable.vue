<template>
  <v-simple-table fixed-header class="mb-4 mt-4 flavor-text panel">
    <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Frame</th>
        <th class="text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="m in mechs" :key="m.ID">
        <td>
          <v-btn small text color="accent" @click="$emit('go', m)">{{ m.Name }}</v-btn>
        </td>
        <td>{{ m.Frame.Source }} {{ m.Frame.Name }}</td>
        <td>
          <b :class="getMechStatus(m)[1]">{{ getMechStatus(m)[0] }}</b>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from 'vue'
import { Mech } from '@/class'
export default Vue.extend({
  name: 'mech-table',
  props: {
    mechs: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getMechStatus(m: Mech) {
      if (m.Destroyed) return ['DESTROYED', 'red--text text--darken-2']
      if (m.ReactorDestroyed) return ['REACTOR DESTROYED', 'error--text']
      if (m.IsActive) return ['ACTIVE', 'success--text']
      return ['STANDBY', 'subtle--text text--darken-2']
    },
  },
})
</script>
