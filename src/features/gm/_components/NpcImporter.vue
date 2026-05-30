<template>
  <v-card-text>
    <v-row align="center"
      justify="center">
      <v-col cols="6">
        <v-file-input v-model="fileValue"
          accept="text/json"
          variant="outlined"
          label="Select Data File"
          prepend-icon="mdi-paperclip"
          density="compact"
          @change="stageImport"
          @click:clear="reset" />
      </v-col>
    </v-row>
    <v-container>
      <div class="text-caption">STAGED ITEMS</div>
      <v-table>
        <thead class="heading">
          <tr>
            <th width="1px">
              <v-btn icon
                flat
                size="small"
                :value="selected.length === stagedItems.length"
                hide-details
                @click="
                  selected.length
                    ? (selected = [])
                    : (selected = stagedItems
                      .map((x: any) => x.id))
                  ">
                <v-icon size="x-large"
                  :icon="selected.length === stagedItems.length
                    ? 'mdi-checkbox-outline'
                    : selected.length > 0
                      ? 'mdi-minus-box-outline'
                      : 'mdi-checkbox-blank-outline'
                    " />
              </v-btn>
            </th>
            <th>Item</th>
            <th>Collection</th>
            <th>Item Type</th>
            <th>Content Packs</th>
            <th class="text-center">Status</th>
          </tr>
        </thead>
        <tbody v-for="item in stagedItems"
          :key="item.id">
          <tr>
            <td>
              <v-checkbox v-model="selected"
                :value="item.id"
                multiple
                hide-details />
            </td>
            <td>
              {{ item.name }}
            </td>
            <td>
              {{ item.collection }}
            </td>
            <td>
              {{ item.type }}
            </td>
            <td>{{ item.content_packs }}</td>
            <td class="text-center">
              <v-tooltip location="top"
                max-width="300px">
                <template #activator="{ props }">
                  <v-icon v-bind="props"
                    :icon="item.status === 'ok' ? 'mdi-check' : 'mdi-alert'"
                    :color="item.status === 'ok' ? 'success' : 'warning'" />
                </template>
                <span v-if="item.status === 'ok'">Item is ready for import</span>
                <span v-else-if="item.status === 'missing_content'">
                  Item is missing required content packs. This item will be saved to the v2 Imports
                  collection in
                  the Content Manager, and can be imported once the required content packs are
                  installed and
                  activated.
                </span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <cc-alert v-if="missingContent.length"
        class="mx-12 mt-4"
        icon="mdi-alert"
        title="Missing Content Packs">
        <p>
          Some data to be imported was created using an older version of
          COMP/CON and does not include nested content pack information. This data will be saved to
          the v2 Imports collection in the Content Manager, but cannot be imported until the
          required
          content packs are installed
          and activated. These items can be imported once the required content packs are installed
          and activated,
          or
          force-imported in the Content Manager.
        </p>
        <v-card-text>
          <p class="heading h4 text-accent">
            Missing content packs:
          </p>
          <p v-html-safe="missingContent"
            class="effect-text text-center bg-background pa-1 ma-1" />
          <p>

          </p>
        </v-card-text>
      </cc-alert>
    </v-container>

    <v-row justify="end"
      class="mt-2 mr-4">
      <v-col cols="auto">
        <v-btn variant="tonal"
          color="accent"
          prepend-icon="mdi-plus"
          @click="importFile()">
          Complete Import ({{ selected.length }} Items)
        </v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { notify } from '@/util/notify'
import { ImportData } from '@/io/Data';
import {
NpcStore,
NarrativeStore,
EncounterStore,
} from '@/stores';
import { v4 as uuid } from 'uuid';
import { Unit } from '@/classes/npc/unit/Unit';
import { Doodad } from '@/classes/npc/doodad/Doodad';
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import { Character } from '@/classes/narrative/Character';
import { Location } from '@/classes/narrative/Location';
import { Faction } from '@/classes/narrative/Faction';
import { Encounter } from '@/classes/encounter/Encounter';
import {
isV2Npc,
isV2Encounter,
getV2NpcMissingLcps,
getV2EncounterMissingNpcs,
preprocessNpcImport,
preprocessEncounterImport,
} from '@/io/V2Importer';
import { ImportNpcData, ImportEncounter } from '@/io/Importer';

defineOptions({ name: 'FileImport' })

const emit = defineEmits<{
  'complete': []
}>()

const selected = ref([] as any[])
const fileValue = ref(null)
const oldBrewsWarning = ref(false)
const stagedData = ref([] as any[])
const stagedItems = ref([] as any[])
const alreadyPresent = ref('')

const missingContent = computed(() => {
      const missing = new Set<string>();
      stagedItems.value.forEach((item) => {
        if (item.status === 'missing_content') {
          (item.missingInfo as string[]).forEach((m) => missing.add(m));
        }
      });
      return Array.from(missing).join('<br>');
    })

function reset() {
      fileValue.value = null;
      oldBrewsWarning.value = false;
      stagedData.value = [];
      stagedItems.value = [];
      selected.value = [];
      alreadyPresent.value = '';
    }
async function stageImport(file) {
      if (!file) return;
      let content = [] as any[];
      const data = await ImportData<any>(file.target.files[0]);
      if (data.type && data.type.includes('collection')) content = data.data;
      else content.push(data);

      stagedData.value = content;
      stagedItems.value = [...content];

      stagedItems.value.forEach((item) => {
        if (isV2Npc(item)) {
          const { missingIds, missingNames } = getV2NpcMissingLcps(item);
          item.collection = 'v2 NPC';
          item.type = 'NPC';
          item.content_packs = item.brews
            ? item.brews.map((x) => `${x.LcpName} @ ${x.LcpVersion}`).join(', ')
            : 'N/A';
          item.status = missingIds.length === 0 ? 'ok' : 'missing_content';
          item.missingInfo = missingNames;
        } else if (isV2Encounter(item)) {
          const missing = getV2EncounterMissingNpcs(item);
          item.collection = 'v2 Encounter';
          item.type = 'Encounter';
          item.content_packs = 'N/A';
          item.status = missing.length === 0 ? 'ok' : 'missing_content';
          item.missingInfo = missing.map((id) => `NPC: ${id}`);
        } else if (item.npcType) {
          item.collection = 'NPC';
          item.type =
            item.npcType.charAt(0).toUpperCase() + item.npcType.slice(1);
          item.content_packs = item.brews
            ? item.brews.map((x) => `${x.LcpName} @ ${x.LcpVersion}`).join(', ')
            : 'N/A';
          item.status = 'ok';
          item.missingInfo = [];
        } else if (item.collectionItemType) {
          item.collection = 'Narrative Item';
          item.type =
            item.collectionItemType.charAt(0).toUpperCase() +
            item.collectionItemType.slice(1);
          item.content_packs = 'N/A';
          item.status = 'ok';
          item.missingInfo = [];
        } else if (item.itemType === 'Encounter' || item.itemType === 'encounter') {
          item.collection = 'Encounter';
          item.type = 'Encounter';
          item.content_packs = 'N/A';
          item.status = 'ok';
          item.missingInfo = [];
        }
      });

      selected.value = stagedItems.value.map((x) => x.id);
    }
async function importFile() {
      const staged = stagedData.value.filter((x) =>
        selected.value.includes(x.id)
      );

      let backedUp = 0;

      for (const item of staged) {
        try {
          if (isV2Npc(item)) {
            const result = await preprocessNpcImport(item);
            if (result.action === 'import' && result.transformed) {
              await ImportNpcData(result.transformed);
            } else if (result.action === 'backup') {
              backedUp++;
            }
          } else if (isV2Encounter(item)) {
            const result = await preprocessEncounterImport(item);
            if (result.action === 'import' && result.transformed) {
              const encs = Array.isArray(result.transformed)
                ? result.transformed
                : [result.transformed];
              for (const enc of encs) await ImportEncounter(enc);
            } else if (result.action === 'backup') {
              backedUp++;
            }
          } else {
            item.id = uuid();
            if (item.npcType) {
              if (item.npcType === 'unit') {
                await NpcStore().AddNpc(Unit.Deserialize(item));
              } else if (item.npcType === 'doodad') {
                await NpcStore().AddNpc(Doodad.Deserialize(item));
              } else if (item.npcType === 'eidolon') {
                await NpcStore().AddNpc(Eidolon.Deserialize(item));
              }
            } else if (item.collectionItemType) {
              if (item.collectionItemType === 'character')
                await NarrativeStore().AddItem(Character.Deserialize(item));
              else if (item.collectionItemType === 'location')
                await NarrativeStore().AddItem(Location.Deserialize(item));
              else if (item.collectionItemType === 'faction')
                await NarrativeStore().AddItem(Faction.Deserialize(item));
            } else if (item.itemType === 'Encounter' || item.itemType === 'encounter') {
              await EncounterStore().AddEncounter(Encounter.Deserialize(item));
            }
          }
        } catch (error) {
          console.error(error);
          notify({
            title: 'Import Error',
            text: `Unable to import GM Data: ${error}`,
            data: { icon: 'cc:compendium', color: 'error' },
          });
        }
      }

      if (backedUp > 0) {
        notify({
          title: 'v2 Import Backup',
          text: `${backedUp} item(s) saved to pending v2 imports in the Content Manager/`,
          data: { icon: 'mdi-information-box-outline', color: 'info' },
        });
      }

      reset();
      emit('complete');
    }
function cancelImport() {
      reset();
    }
</script>
