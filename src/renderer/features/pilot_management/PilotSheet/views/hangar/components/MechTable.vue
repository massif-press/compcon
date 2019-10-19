<template>
  <v-simple-table fixed-header class="mb-4">
    <thead>
      <tr>
        <!-- <th class="text-left">Callsign</th> -->
        <th class="text-left">Name</th>
        <!-- <th class="text-center">License Level</th>
        <th class="text-left">Active Mech</th>
        <th class="text-left">Campaign</th>-->
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>mech</td>
      </tr>
      <tr>
        <td>mech</td>
      </tr>
      <tr>
        <td>mech</td>
      </tr>
      <tr>
        <td>mech</td>
      </tr>
      <!-- <tr v-for="p in pilots" :key="p.ID">
        <td>
          <v-btn small text color="primary" @click="toPilotSheet(p)">{{ p.Callsign }}</v-btn>
        </td>
        <td>{{ p.Name }}</td>
        <td class="text-center">{{ p.Level }}</td>
        <td v-if="p.ActiveMech">
          {{ p.ActiveMech.Name }}
          <span
            class="grey--text"
          >{{ p.ActiveMech.Frame.Source }} {{ p.ActiveMech.Frame.Name }}</span>
        </td>
        <td v-else>
          <span class="grey--text">NONE</span>
        </td>
        <td>
          <span class="grey--text">NONE</span>
        </td>
      </tr>-->
    </tbody>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'mech-table',
})
</script>