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
          <v-btn small text color="primary" @click="$emit('go', m)">{{ m.Name }}</v-btn>
        </td>
        <td>{{ m.Frame.Source }} {{ m.Frame.Name }}</td>
        <td>{{ m.Status || 'Active' }}</td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'mech-table',
  props: {
    mechs: {
      type: Array,
      required: true,
    },
  },
})
</script>