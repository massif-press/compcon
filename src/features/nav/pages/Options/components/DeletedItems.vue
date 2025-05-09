<template>
  <div>
    <v-alert
      v-if="!items.length"
      variant="outlined"
      class="text-center"
      color="subtle"
      density="compact">
      <span>No items found</span>
    </v-alert>
    <v-table v-if="items.length" class="text-left pa-2">
      <thead>
        <tr>
          <th>Item Type</th>
          <th>Item Name</th>
          <th>Deleted On</th>
          <th />
          <th />
        </tr>
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
              @click="item.SaveController.Restore()">
              Restore
            </v-btn>
          </td>
          <td class="text-right">
            <v-btn color="error" variant="plain" size="small" @click="permanentlyDelete(item)">
              Permanently Delete
            </v-btn>
          </td>
        </tr>
      </tbody>

      <tfoot class="text-right">
        <tr>
          <td colspan="3" />
          <td>
            <v-btn
              size="small"
              variant="tonal"
              :loading="loading"
              color="accent"
              @click="restoreAll()">
              Restore All
            </v-btn>
          </td>
          <td>
            <v-btn
              size="small"
              variant="tonal"
              :loading="loading"
              color="error"
              @click="deleteAll()">
              Permanently Delete All
            </v-btn>
          </td>
        </tr>
      </tfoot>
    </v-table>
  </div>
</template>

<script lang="ts">
import { CampaignStore, EncounterStore, NpcStore, PilotStore } from '@/stores';
import { Pilot, PilotGroup } from '@/class';

export default {
  name: 'deleted-items',
  data: () => ({
    loading: false,
  }),
  computed: {
    items() {
      return [
        ...NpcStore().Npcs.filter((x) => x.SaveController.IsDeleted),
        ...PilotStore().Pilots.filter((x) => x.SaveController.IsDeleted),
        ...PilotStore().PilotGroups.filter((x) => x.SaveController.IsDeleted),
        ...EncounterStore().Encounters.filter((x) => x.SaveController.IsDeleted),
        ...CampaignStore().Campaigns.filter((x) => x.SaveController.IsDeleted),
      ];
    },
  },
  methods: {
    async permanentlyDelete(item) {
      switch (item.ItemType.toLowerCase()) {
        case 'npc':
        case 'unit':
        case 'doodad':
        case 'eidolon':
          await NpcStore().DeleteNpcPermanent(item);
          break;
        case 'pilot':
          await PilotStore().DeletePilotPermanent(item);
          break;
        case 'pilot_group':
          const group = PilotStore().PilotGroups.find((x) => x.ID === item.ID) as PilotGroup;
          await PilotStore().DeleteGroupPermanent(group);
          break;
        case 'encounter':
          await EncounterStore().DeleteEncounterPermanent(item);
          break;
        case 'campaign':
          await CampaignStore().DeleteCampaign(item);
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
    async deleteAll() {
      console.log('delete all', this.items);
      this.loading = true;
      for (const item of this.items) {
        await this.permanentlyDelete(item);
      }
      this.loading = false;
    },
  },
};
</script>
