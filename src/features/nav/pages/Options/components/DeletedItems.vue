<template>
  <div>
    <v-alert v-if="!items.length"
      variant="outlined"
      class="text-center"
      color="subtle"
      density="compact">
      <span>{{ di.noItemsFound }}</span>
    </v-alert>
    <v-table v-if="items.length"
      class="text-left pa-2">
      <thead>
        <tr>
          <th>{{ di.itemType }}</th>
          <th>{{ di.itemName }}</th>
          <th>{{ di.deletedOn }}</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items"
          :key="item.ID">
          <td>{{ item.ItemType.toUpperCase() }}</td>
          <td>{{ item.Name }} {{ (item as any).Callsign ? ` (${(item as any).Callsign})` : '' }}
          </td>
          <td>{{ item.SaveController.DeleteTimeFormatted }}</td>
          <td class="text-right">
            <v-btn color="accent"
              variant="plain"
              size="small"
              @click="item.SaveController.Restore()">
              {{ di.restore }}
            </v-btn>
          </td>
          <td class="text-right">
            <v-btn color="error"
              variant="plain"
              size="small"
              @click="permanentlyDelete(item)">
              {{ di.permanentlyDelete }}
            </v-btn>
          </td>
        </tr>
      </tbody>

      <tfoot class="text-right">
        <tr>
          <td colspan="3" />
          <td>
            <v-btn size="small"
              variant="tonal"
              :loading="loading"
              color="accent"
              @click="restoreAll()">
              {{ di.restoreAll }}
            </v-btn>
          </td>
          <td>
            <v-btn size="small"
              variant="tonal"
              :loading="loading"
              color="error"
              @click="deleteAll()">
              {{ di.permanentlyDeleteAll }}
            </v-btn>
          </td>
        </tr>
      </tfoot>
    </v-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { CampaignStore, EncounterStore, NpcStore, PilotStore, PilotGroupStore, PilotSheetStore } from '@/stores'
import { Pilot } from '@/classes/pilot/Pilot'
import { PilotGroup } from '@/features/pilot_management/store/PilotGroup'
import { NAV_STRINGS } from '@/features/nav/strings'

const di = NAV_STRINGS.deletedItems
const loading = ref(false)

const items = computed(() => [
  ...NpcStore().Npcs.filter(x => x.SaveController.IsDeleted),
  ...PilotStore().Pilots.filter(x => x.SaveController.IsDeleted),
  ...PilotGroupStore().PilotGroups.filter(x => x.SaveController.IsDeleted),
  ...EncounterStore().Encounters.filter(x => x.SaveController.IsDeleted),
  ...EncounterStore().ArchivedEncounters.filter(x => x.SaveController.IsDeleted),
  ...EncounterStore().ActiveEncounters.filter(x => x.SaveController.IsDeleted),
  ...PilotSheetStore().PilotSheets.filter(x => x.SaveController.IsDeleted),
  ...CampaignStore().Campaigns.filter(x => x.SaveController.IsDeleted),
])

async function permanentlyDelete(item: any) {
  switch (item.ItemType.toLowerCase()) {
    case 'npc':
    case 'unit':
    case 'doodad':
    case 'eidolon':
      await NpcStore().DeleteNpcPermanent(item)
      break
    case 'pilot':
      await PilotStore().DeletePilotPermanent(item)
      break
    case 'pilot_group':
    case 'pilotgroup': {
      const group = PilotGroupStore().PilotGroups.find(x => x.ID === item.ID) as PilotGroup
      await PilotGroupStore().DeleteGroupPermanent(group)
      break
    }
    case 'encounter':
      await EncounterStore().DeleteEncounterPermanent(item)
      break
    case 'encounterarchive':
      await EncounterStore().RemoveEncounterArchive(item)
      break
    case 'activeencounter':
    case 'encounterinstance':
      await EncounterStore().RemoveEncounterInstance(item)
      break
    case 'pilotsheet':
      await PilotSheetStore().RemovePilotSheet(item)
      break
    case 'campaign':
      await CampaignStore().DeleteCampaign(item)
      break
  }
}

function restoreAll() {
  items.value.forEach(item => item.SaveController.Restore())
}

async function deleteAll() {
  loading.value = true
  for (const item of items.value) {
    await permanentlyDelete(item)
  }
  loading.value = false
}
</script>
