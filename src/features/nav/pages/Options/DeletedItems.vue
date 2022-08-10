<template>
  <div>
    <v-alert outlined class="text-center" color="subtle" dense>
      <span v-if="items.length">
        Deleted items are preserved for 30 days, after which they are automatically removed
      </span>
      <span v-else>No items found</span>
    </v-alert>
    <v-simple-table v-if="items.length" class="text-left pa-2">
      <thead>
        <th>Item Type</th>
        <th>Item Name</th>
        <th>Deleted On</th>
        <th>Expires On</th>
        <th />
        <th />
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.ID">
          <td>{{ item.ItemType.toUpperCase() }}</td>
          <td>{{ item.Name }}{{ item.Callsign ? ` (${item.Callsign})` : '' }}</td>
          <td>{{ item.SaveController.DeleteTime }}</td>
          <td>{{ item.SaveController.ExpireTime }}</td>
          <td class="text-right">
            <v-btn small color="primary" @click="item.SaveController.restore()">Restore</v-btn>
          </td>
          <td class="text-right">
            <v-btn small color="primary" @click="permanentlyDelete(item)">Permanently Delete</v-btn>
          </td>
        </tr>
      </tbody>

      <tfoot class="light-panel">
        <tr>
          <td colspan="4" />
          <td><v-btn small color="error" @click="restoreAll()">Restore All</v-btn></td>
          <td>
            <v-btn small color="error" @click="deleteAll()">Permanently Delete All</v-btn>
          </td>
        </tr>
      </tfoot>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getModule } from 'vuex-module-decorators'
import { NpcStore, PilotManagementStore } from '@/store'

export default Vue.extend({
  name: 'deleted-items',
  computed: {
    items() {
      return [
        ...getModule(NpcStore, this.$store).AllNpcs.filter(x => x.SaveController.IsDeleted),
        ...getModule(PilotManagementStore, this.$store).AllPilots.filter(
          x => x.SaveController.IsDeleted
        ),
      ]
    },
  },
  methods: {
    permanentlyDelete(item) {
      switch (item.ItemType) {
        case 'npc':
          const ns = getModule(NpcStore, this.$store)
          ns.deleteNpcPermanent(ns.AllNpcs.find(x => x.ID === item.ID))
          break
        case 'pilot':
          const ps = getModule(PilotManagementStore, this.$store)
          ps.deletePilotPermanent(ps.AllPilots.find(x => x.ID === item.ID))
          break
        default:
          break
      }
    },
    restoreAll() {
      this.items.forEach(item => {
        item.SaveController.restore()
      })
    },
    deleteAll() {
      this.items.forEach(item => {
        this.permanentlyDelete(item)
      })
    },
  },
})
</script>
