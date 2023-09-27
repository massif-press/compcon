<template>
  <v-table class="my-4 flavor-text">
    <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Manufacturer</th>
        <th class="text-left">Frame</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="m in mechs">
        <td>
          <v-btn
            text
            color="accent"
            variant="outlined"
            class="heading h3"
            @click="$emit('go', m)"
            >{{ (m as Mech).Name }}</v-btn
          >
        </td>
        <td>{{ (m as Mech).Frame.Source }}</td>
        <td>{{ (m as Mech).Frame.Name }}</td>
      </tr>
    </tbody>
  </v-table>
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
};
</script>
