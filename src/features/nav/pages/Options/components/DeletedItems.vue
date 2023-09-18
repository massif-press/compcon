<template>
  <div>
    <v-alert
      v-if="!items.length"
      variant="outlined"
      class="text-center"
      color="subtle"
      density="compact"
    >
      <span>No items found</span>
    </v-alert>
    <v-table v-if="items.length" class="text-left pa-2">
      <thead>
        <th>Item Type</th>
        <th>Item Name</th>
        <th>Deleted On</th>
        <th />
        <th />
      </thead>
      <tbody>
        <tr v-for="item in items">
          <td>{{ item.ItemType.toUpperCase() }}</td>
          <td>{{ item.Name }}{{ (item as any).Callsign ? ` (${(item as any).Callsign})` : '' }}</td>
          <td>{{ item.SaveController.DeleteTimeFormatted }}</td>
          <td class="text-right">
            <v-btn
              color="accent"
              variant="plain"
              size="small"
              @click="item.SaveController.Restore()"
              >Restore</v-btn
            >
          </td>
          <td class="text-right">
            <v-btn color="error" variant="plain" size="small" @click="permanentlyDelete(item)"
              >Permanently Delete</v-btn
            >
          </td>
        </tr>
      </tbody>

      <tfoot class="text-right">
        <tr>
          <td colspan="3" />
          <td>
            <v-btn size="small" variant="tonal" color="accent" @click="restoreAll()"
              >Restore All</v-btn
            >
          </td>
          <td>
            <v-btn size="small" variant="tonal" color="error" @click="deleteAll()"
              >Permanently Delete All</v-btn
            >
          </td>
        </tr>
      </tfoot>
    </v-table>
  </div>
</template>

<script lang="ts">
import { NpcStore, PilotStore } from '@/stores';
import { Pilot, PilotGroup } from '@/class';

export default {
  name: 'deleted-items',
  computed: {
    items() {
      return [
        // ...NpcStore().AllNpcs.filter((x) => x.SaveController.IsDeleted),
        ...PilotStore().Pilots.filter((x) => x.SaveController.IsDeleted),
        ...PilotStore().PilotGroups.filter((x) => x.SaveController.IsDeleted),
      ];
    },
  },
  methods: {
    permanentlyDelete(item) {
      const ps = PilotStore();

      switch (item.ItemType) {
        // case 'npc':
        //   const ns = NpcStore();
        //   ns.deleteNpcPermanent(ns.AllNpcs.find((x) => x.ID === item.ID));
        //   break;
        case 'pilot':
          const pilot = ps.Pilots.find((x) => x.ID === item.ID) as Pilot;
          ps.DeletePilotPermanent(pilot);
          break;
        case 'pilot_group':
          const group = ps.PilotGroups.find((x) => x.ID === item.ID) as PilotGroup;
          ps.DeleteGroupPermanent(group);
          break;
        default:
          break;
      }
    },
    restoreAll() {
      this.items.forEach((item) => {
        item.SaveController.Restore();
      });
    },
    deleteAll() {
      this.items.forEach((item) => {
        this.permanentlyDelete(item);
      });
    },
  },
};
</script>
