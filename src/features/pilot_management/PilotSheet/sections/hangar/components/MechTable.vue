<template>
  <v-simple-table
    density="compact"
    fixed-header
    class="mb-4 mt-4 flavor-text panel px-0"
  >
    <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Frame</th>
        <th class="text-left">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="m in mechs">
        <td>
          <v-btn
            text
            color="accent"
            class="heading h3"
            @click="$emit('go', m)"
            >{{ m.Name }}</v-btn
          >
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
import { Mech } from '@/class';
export default {
  name: 'mech-table',
  props: {
    mechs: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getMechStatus(m: Mech) {
      // if (m.Destroyed) return ['DESTROYED', 'text-red text--darken-2']
      // if (m.ReactorDestroyed) return ['REACTOR DESTROYED', 'text-error']
      // if (m.IsActive) return ['ACTIVE', 'text-success']
      return ['STANDBY', 'text-subtle text--darken-2'];
    },
  },
};
</script>
