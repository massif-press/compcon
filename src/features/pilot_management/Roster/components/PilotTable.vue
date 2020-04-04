<template>
  <v-simple-table fixed-header class="mb-4 flavor-text" style="background-color: transparent">
    <thead>
      <tr>
        <th class="text-left">Callsign</th>
        <th class="text-left">Name</th>
        <th class="text-left">Status</th>
        <th class="text-center">License Level</th>
        <th class="text-left">Active Mech</th>
        <th class="text-left">Campaign</th>
        <th class="text-left">Player</th>
        <th class="text-right">Options</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in pilots" :key="p.ID">
        <td>
          <v-btn small text color="primary" @click="toPilotSheet(p)">{{ p.Callsign }}</v-btn>
        </td>
        <td>{{ p.Name }}</td>
        <td>
          <span :class="`${statusColor(p.Status)}--text`">{{ p.Status }}</span>
        </td>
        <td class="text-center">{{ p.Level }}</td>
        <td v-if="p.ActiveMech">
          {{ p.ActiveMech.Name }}
          <span class="subtle--text">
            {{ p.ActiveMech.Frame.Source }} {{ p.ActiveMech.Frame.Name }}
          </span>
        </td>
        <td v-else>
          <span class="subtle--text">NONE</span>
        </td>
        <td>
          <span class="subtle--text">NONE</span>
        </td>
        <td>
          <span class="subtle--text">{{ p.PlayerName }}</span>
        </td>
        <td class="text-right">
          <edit-menu style="display: inline-block; padding-right: 10px;" :pilot="p" />
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script lang="ts">
import Vue from 'vue'
import { Pilot } from '@/class'
import EditMenu from '../../PilotSheet/components/PilotEditMenu.vue'

export default Vue.extend({
  name: 'pilot-table',
  components: { EditMenu },
  props: {
    pilots: {
      type: Array as () => Pilot[],
      required: true,
    },
  },
  methods: {
    toPilotSheet(pilot: Pilot) {
      this.$router.push(`pilot/${pilot.ID}`)
    },
    statusColor(status: string): string {
      switch (status.toLowerCase()) {
        case 'active':
          return 'success'
          break
        case 'mia':
        case 'kia':
          return 'error'
        default:
          return 'text'
          break
      }
    },
  },
})
</script>
