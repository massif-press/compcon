<template>
  <v-card-text>
    <v-row align="center" justify="center">
      <v-col cols="6">
        <v-file-input
          v-model="fileValue"
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
              <v-btn
                icon
                flat
                size="small"
                :value="selected.length === stagedItems.length"
                hide-details
                @click="
                  selected.length
                    ? (selected = [])
                    : (selected = stagedItems.filter((x) => x.status).map((x: any) => x.id))
                ">
                <v-icon
                  size="x-large"
                  :icon="
                    selected.length === stagedItems.length
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
        <tbody v-for="item in stagedItems">
          <tr>
            <td>
              <v-checkbox
                v-model="selected"
                :value="item.id"
                multiple
                hide-details
                :disabled="!item.status" />
            </td>
            <td :class="item.status ? '' : 'text-disabled text-decoration-line-through'">
              {{ item.name }}
            </td>
            <td :class="item.status ? '' : 'text-disabled text-decoration-line-through'">
              {{ item.collection }}
            </td>
            <td :class="item.status ? '' : 'text-disabled text-decoration-line-through'">
              {{ item.type }}
            </td>
            <td>{{ item.content_packs }}</td>
            <td class="text-center">
              <v-tooltip location="top" max-width="300px">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    :icon="item.status ? 'mdi-check' : 'mdi-cancel'"
                    :color="item.status ? 'success' : 'error'" />
                </template>
                <span v-if="item.status">Item is ready for import</span>
                <span v-else>
                  Item is missing one or more content packs and cannot be imported. Items without
                  LCP support may only be imported as <b>instances</b></span
                >
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-card v-if="missingContent.length" variant="tonal" class="mx-12">
        <p v-if="oldBrewsWarning" class="heading h3 text-accent">
          WARNING: The data to be imported was created using an older version of COMP/CON. Lancer
          Content Pack analysis may not be comprehensive and there is a chance COMP/CON will be
          unable to correctly load this data. Export the original file in the latest version of
          COMP/CON to guarantee LCP validation.
        </p>
        <v-card-text class="text-center">
          <p class="heading h4 text-accent">
            The data to be imported requires the following content packs that are not currently
            installed/active, or have mismatching versions:
          </p>
          <p class="effect-text text-center" v-html="missingContent" />
          <p class="text-text">
            This data cannot be imported until the missing content packs are installed and
            activated, or the content pack versions are synchronized.
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn variant="tonal" color="error" @click="reset">Abort Import</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>

    <v-row justify="end" class="mt-2 mr-4">
      <v-col cols="auto">
        <v-btn
          variant="tonal"
          color="accent"
          prepend-icon="mdi-plus"
          :disabled="missingContent.length > 0"
          @click="importFile()">
          Complete Import ({{ selected.length }} Items)
        </v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</template>

<script lang="ts">
import _ from 'lodash';
import { ImportData } from '@/io/Data';
import { CompendiumStore, NpcStore, NarrativeStore } from '@/stores';
import { v4 as uuid } from 'uuid';
import { Unit } from '@/classes/npc/unit/Unit';
import { Doodad } from '@/classes/npc/doodad/Doodad';
import { Eidolon } from '@/classes/npc/eidolon/Eidolon';
import { Character } from '@/classes/narrative/Character';
import { Location } from '@/classes/narrative/Location';
import { Faction } from '@/classes/narrative/Faction';

export default {
  name: 'file-import',
  data: () => ({
    selected: [] as any[],
    // fileValue is just used to clear the file input
    fileValue: null,
    oldBrewsWarning: false,
    missingContent: '',
    stagedData: [] as any[],
    stagedItems: [] as any[],
    alreadyPresent: '',
  }),
  emits: ['complete'],
  methods: {
    reset() {
      this.fileValue = null;
      this.oldBrewsWarning = false;
      this.missingContent = '';
      this.stagedData = [];
      this.stagedItems = [];
      this.selected = [];
      this.alreadyPresent = '';
    },
    async stageImport(file) {
      if (!file) return;
      let content = [] as any[];
      const data = await ImportData<any>(file.target.files[0]);
      if (data.type && data.type === 'collection') content = data.data;
      else content.push(data);

      this.stagedItems = [...content];
      // this.selected = new Array(content.length).fill(null);
      this.stagedData = content;

      this.stagedItems.forEach((item) => {
        if (item.npcType) {
          item.collection = 'NPC';
          item.type = item.npcType.charAt(0).toUpperCase() + item.npcType.slice(1);
          item.content_packs = 'TODO';
          item.status = this.findContent(item);
        } else if (item.collectionItemType) {
          item.collection = 'Narrative Item';
          item.type =
            item.collectionItemType.charAt(0).toUpperCase() + item.collectionItemType.slice(1);
          item.content_packs = 'N/A';
          item.status = true;
        }
      });

      this.selected = this.stagedItems.filter((x) => x.status).map((x) => x.id);

      // if (!pilotData.brews) pilotData.brews = [];
      // // catch old style brews
      // if (pilotData.brews.length && !pilotData.brews[0].LcpId) {
      //   this.oldBrewsWarning = true;

      //   const installedPacks = CompendiumStore()
      //     .ContentPacks.filter((x) => x.Active)
      //     .map((x) => `${x.Name} @ ${x.Version}`);
      //   const missingPacks = _.pullAll(pilotData.brews, installedPacks as any);
      //   if (missingPacks.length) this.missingContent = missingPacks.join('<br />');
      // } else {
      //   const installedPacks = CompendiumStore()
      //     .ContentPacks.filter((x) => x.Active)
      //     .map((x) => x.ID);
      //   let missing = [] as string[];
      //   pilotData.brews.forEach((b) => {
      //     if (!installedPacks.includes(b.LcpId)) {
      //       missing.push(`${b.LcpName} @ ${b.LcpVersion}`);
      //     }
      //   });
      //   if (missing.length) this.missingContent = missing.join('<br />');
      // }

      // const exists = PilotStore().Pilots.find((x) => x.ID === pilotData.id);
      // if (exists && !exists.SaveController.IsDeleted) {
      //   this.alreadyPresent =
      //     'A Pilot with this ID already exists in the roster. Importing will create a unique copy of this pilot.';
      //   const num = PilotStore().Pilots.filter((x) => x.Name === pilotData.name).length;
      //   pilotData.name += ` (${num})`;
      // }
      // this.stagedData = pilotData;
    },
    findContent(item) {
      if (item.npcType === 'unit') {
        if (!CompendiumStore().NpcClasses.some((x) => x.ID === item.class)) return false;
        if (item.templates.some((x) => !CompendiumStore().NpcTemplates.some((y) => y.ID === x)))
          return false;
        if (item.features.some((x) => !CompendiumStore().NpcFeatures.some((y) => y.ID === x)))
          return false;

        return true;
      } else if (item.npcType === 'doodad') {
        return true;
      } else if (item.npcType === 'eidolon') {
        if (
          item.layer_data.some((x) => !CompendiumStore().EidolonLayers.some((y) => y.ID === x.id))
        )
          return false;
        return true;
      }
      return false;
    },
    importFile() {
      const staged = this.stagedData.filter((x) => this.selected.includes(x.id));

      staged.forEach((item) => {
        item.id = uuid();
        try {
          if (item.npcType) {
            if (item.npcType === 'unit') {
              NpcStore().AddNpc(Unit.Deserialize(item));
            } else if (item.npcType === 'doodad') {
              NpcStore().AddNpc(Doodad.Deserialize(item));
            } else if (item.npcType === 'eidolon') {
              NpcStore().AddNpc(Eidolon.Deserialize(item));
            }
          } else if (item.collectionItemType) {
            if (item.collectionItemType === 'character')
              NarrativeStore().AddItem(Character.Deserialize(item));
            else if (item.collectionItemType === 'location')
              NarrativeStore().AddItem(Location.Deserialize(item));
            else if (item.collectionItemType === 'faction')
              NarrativeStore().AddItem(Faction.Deserialize(item));
          }

          this.reset();
          this.$emit('complete');
        } catch (error) {
          this.$notify({
            title: 'Import Error',
            text: `Unable to import GM Data: ${error}`,
            data: { icon: 'cc:compendium', color: 'error' },
          });
        }
      });
    },
    cancelImport() {
      this.reset();
    },
  },
};
</script>
